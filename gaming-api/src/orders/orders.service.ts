import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CartService } from '../cart/cart.service';
import { GamesService } from '../games/games.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private gamesService: GamesService,
  ) {}

  // MAIN CHANGE: Create order from session cart instead of user cart
  async createGuestOrder(sessionId: string, createOrderDto: CreateOrderDto): Promise<{ order: OrderDocument; guestToken: string }> {
    // Validate cart and get items
    const cart = await this.cartService.validateCartForCheckout(sessionId);

    // Generate unique order number and guest token
    const orderNumber = await this.generateOrderNumber();
    const guestToken = this.generateGuestToken();

    // Create order items from cart
    const orderItems = cart.items.map(item => ({
      gameId: item.gameId,
      title: item.title,
      platform: item.platform,
      quantity: item.quantity,
      originalPrice: item.originalPrice,
      discountedPrice: item.discountedPrice,
      discount: item.discount,
      imageUrl: item.imageUrl,
      activationKey: '', // Will be set after payment
      keyDelivered: false,
      keyDeliveredAt: null,
    }));

    // Create customer info (guest)
    const customerInfo = {
      userId: null, // No user account
      email: createOrderDto.email,
      fullName: createOrderDto.fullName,
      phoneNumber: createOrderDto.phoneNumber,
      wilaya: createOrderDto.wilaya,
      wilayaName: createOrderDto.wilayaName,
      address: createOrderDto.address,
      extraInfo: createOrderDto.extraInfo,
      isGuest: true,
    };

    // Create initial timeline entry
    const timeline = [{
      status: 'pending',
      timestamp: new Date(),
      note: 'Guest order created',
      updatedBySystem: 'system',
    }];

    // Create order
    const order = await this.orderModel.create({
      orderNumber,
      sessionId,
      customer: customerInfo,
      items: orderItems,
      subtotal: cart.subtotal,
      totalDiscount: cart.totalDiscount,
      totalAmount: cart.totalAmount,
      currency: 'DZD',
      status: 'pending',
      paymentStatus: 'pending',
      timeline,
      source: 'web',
      guestToken,
    });

    // Update game stock (reserve items)
    await this.updateGameStock(cart.items, 'reserve');

    // Clear session cart
    await this.cartService.clearCart(sessionId);

    return { order, guestToken };
  }

  // CHANGED: Find order by order number and guest token (for guest tracking)
  async findGuestOrder(orderNumber: string, guestToken: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ 
      orderNumber, 
      guestToken 
    });
    
    if (!order) {
      throw new NotFoundException('Order not found or invalid tracking token');
    }

    return order;
  }

  // CHANGED: Find order by email (for guest lookup)
  async findOrdersByEmail(email: string, page: number = 1, limit: number = 10): Promise<{ orders: OrderDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const query = { 'customer.email': email };

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-guestToken') // Don't expose guest tokens in list
        .exec(),
      this.orderModel.countDocuments(query),
    ]);

    return { orders, total };
  }

  // KEEP EXISTING: Admin methods remain unchanged
  async findAll(page: number = 1, limit: number = 10, filters: any = {}): Promise<{ orders: OrderDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const query = {};
    
    // Add filters
    if (filters.status) {
      query['status'] = filters.status;
    }
    
    if (filters.paymentStatus) {
      query['paymentStatus'] = filters.paymentStatus;
    }

    if (filters.userId) {
      query['customer.userId'] = new Types.ObjectId(filters.userId);
    }

    if (filters.email) {
      query['customer.email'] = { $regex: filters.email, $options: 'i' };
    }

    // Add guest filter
    if (filters.isGuest !== undefined) {
      query['customer.isGuest'] = filters.isGuest;
    }

    const [orders, total] = await Promise.all([
      this.orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(query),
    ]);

    return { orders, total };
  }

  async findOne(orderNumber: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ orderNumber });
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // KEEP EXISTING: For future authenticated features
  async findUserOrders(userId: string, page: number = 1, limit: number = 10): Promise<{ orders: OrderDocument[]; total: number }> {
    return this.findAll(page, limit, { userId });
  }

  // CHANGED: Update order status (works for both guest and auth orders)
  async updateOrderStatus(orderNumber: string, updateDto: UpdateOrderStatusDto, updatedBy?: string): Promise<OrderDocument> {
    const order = await this.findOne(orderNumber);

    const oldStatus = order.status;
    order.status = updateDto.status;

    if (updateDto.paymentStatus) {
      order.paymentStatus = updateDto.paymentStatus;
    }

    // Add timeline entry
    const timelineEntry = {
      status: updateDto.status,
      timestamp: new Date(),
      note: updateDto.note || `Status changed from ${oldStatus} to ${updateDto.status}`,
      updatedBySystem: updatedBy ? 'user' : 'admin',
      updatedBy: updatedBy ? new Types.ObjectId(updatedBy) : undefined,
    };

    order.timeline.push(timelineEntry);

    // Handle stock changes based on status
    if (updateDto.status === 'cancelled') {
      await this.updateGameStock(order.items, 'restore');
    }

    return await order.save();
  }

  // CHANGED: Guest order cancellation (using guest token)
  async cancelGuestOrder(orderNumber: string, guestToken: string, reason: string = 'Cancelled by customer'): Promise<OrderDocument> {
    const order = await this.findGuestOrder(orderNumber, guestToken);

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    return this.updateOrderStatus(orderNumber, {
      status: 'cancelled',
      note: reason,
      paymentStatus: 'refunded',
    });
  }

  // KEEP EXISTING: For future authenticated features
  async cancelOrder(orderNumber: string, userId: string, reason: string = 'Cancelled by user'): Promise<OrderDocument> {
    const order = await this.findOne(orderNumber);

    // Check if user owns this order
    if (order.customer.userId?.toString() !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    return this.updateOrderStatus(orderNumber, {
      status: 'cancelled',
      note: reason,
      paymentStatus: 'refunded',
    }, userId);
  }

  private generateGuestToken(): string {
    return uuidv4();
  }

  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    
    // Count orders for this month
    const startOfMonth = new Date(year, new Date().getMonth(), 1);
    const endOfMonth = new Date(year, new Date().getMonth() + 1, 0);
    
    const count = await this.orderModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const orderSequence = String(count + 1).padStart(6, '0');
    return `ORD-${year}${month}-${orderSequence}`;
  }

  private async updateGameStock(items: any[], action: 'reserve' | 'restore'): Promise<void> {
    for (const item of items) {
      const game = await this.gamesService.findOne(item.gameId.toString());
      
      if (game) {
        let newStock: number;
        
        if (action === 'reserve') {
          newStock = game.stock - item.quantity;
        } else {
          newStock = game.stock + item.quantity;
        }

        await this.gamesService.updateStock(item.gameId.toString(), newStock);
      }
    }
  }

  // KEEP EXISTING: Admin methods remain unchanged
  async getOrderStats(): Promise<any> {
    const totalOrders = await this.orderModel.countDocuments();
    const pendingOrders = await this.orderModel.countDocuments({ status: 'pending' });
    const completedOrders = await this.orderModel.countDocuments({ status: 'delivered' });
    const cancelledOrders = await this.orderModel.countDocuments({ status: 'cancelled' });
    const guestOrders = await this.orderModel.countDocuments({ 'customer.isGuest': true });

    const totalRevenue = await this.orderModel.aggregate([
      { $match: { status: { $in: ['delivered', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      guestOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    };
  }
}