import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { GamesService } from '../games/games.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private gamesService: GamesService,
  ) {}

  // MAIN CHANGE: Use sessionId instead of userId
  async getCart(sessionId: string): Promise<CartDocument> {
    let cart = await this.cartModel.findOne({ sessionId });
    
    if (!cart) {
      cart = await this.cartModel.create({
        sessionId,
        items: [],
        totalItems: 0,
        subtotal: 0,
        totalDiscount: 0,
        totalAmount: 0,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    }

    return cart;
  }

  async addToCart(sessionId: string, addToCartDto: AddToCartDto): Promise<CartDocument> {
    const { gameId, platform, quantity } = addToCartDto;

    // Verify game exists and has stock
    const game = await this.gamesService.findOne(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    if (game.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    if (game.status !== 'active') {
      throw new BadRequestException('Game is not available for purchase');
    }

    let cart = await this.getCart(sessionId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.gameId.toString() === gameId && item.platform === platform
    );

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > game.stock) {
        throw new BadRequestException('Cannot add more items than available stock');
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      const cartItem = {
        gameId: new Types.ObjectId(gameId),
        title: game.title,
        platform,
        quantity,
        originalPrice: game.originalPrice,
        discountedPrice: game.discountedPrice || game.originalPrice,
        discount: game.discount || 0,
        imageUrl: game.imageUrl,
        iconUrl: game.iconUrl,
        coverImageUrl: game.coverImageUrl,
        addedAt: new Date(),
      };

      cart.items.push(cartItem);
    }

    // Recalculate totals and extend expiration
    cart = this.calculateCartTotals(cart);
    cart.lastUpdated = new Date();
    cart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Reset expiration

    return await cart.save();
  }

  async updateCartItem(sessionId: string, gameId: string, platform: string, updateDto: UpdateCartItemDto): Promise<CartDocument> {
    const cart = await this.getCart(sessionId);
    const { quantity } = updateDto;

    const itemIndex = cart.items.findIndex(
      item => item.gameId.toString() === gameId && item.platform === platform
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    // Verify stock availability
    const game = await this.gamesService.findOne(gameId);
    if (quantity > game.stock) {
      throw new BadRequestException('Insufficient stock');
    }

    cart.items[itemIndex].quantity = quantity;
    
    // Recalculate totals
    const updatedCart = this.calculateCartTotals(cart);
    updatedCart.lastUpdated = new Date();
    updatedCart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return await updatedCart.save();
  }

  async removeFromCart(sessionId: string, gameId: string, platform: string): Promise<CartDocument> {
    const cart = await this.getCart(sessionId);

    cart.items = cart.items.filter(
      item => !(item.gameId.toString() === gameId && item.platform === platform)
    );

    // Recalculate totals
    const updatedCart = this.calculateCartTotals(cart);
    updatedCart.lastUpdated = new Date();

    return await updatedCart.save();
  }

  async clearCart(sessionId: string): Promise<CartDocument> {
    const cart = await this.getCart(sessionId);
    
    cart.items = [];
    cart.totalItems = 0;
    cart.subtotal = 0;
    cart.totalDiscount = 0;
    cart.totalAmount = 0;
    cart.lastUpdated = new Date();

    return await cart.save();
  }

  // UPDATED: Validate cart for guest checkout
  async validateCartForCheckout(sessionId: string): Promise<CartDocument> {
    const cart = await this.getCart(sessionId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate each item's stock and availability
    for (const item of cart.items) {
      const game = await this.gamesService.findOne(item.gameId.toString());
      
      if (!game) {
        throw new BadRequestException(`Game "${item.title}" is no longer available`);
      }

      if (game.status !== 'active') {
        throw new BadRequestException(`Game "${item.title}" is not available for purchase`);
      }

      if (game.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for "${item.title}". Available: ${game.stock}, Requested: ${item.quantity}`);
      }
    }

    return cart;
  }

  private calculateCartTotals(cart: CartDocument): CartDocument {
    let totalItems = 0;
    let subtotal = 0;
    let totalDiscount = 0;

    cart.items.forEach(item => {
      totalItems += item.quantity;
      const itemSubtotal = item.originalPrice * item.quantity;
      const itemDiscountedTotal = item.discountedPrice * item.quantity;
      
      subtotal += itemSubtotal;
      totalDiscount += (itemSubtotal - itemDiscountedTotal);
    });

    cart.totalItems = totalItems;
    cart.subtotal = subtotal;
    cart.totalDiscount = totalDiscount;
    cart.totalAmount = subtotal - totalDiscount;

    return cart;
  }

  // ADDED: Generate session ID helper
  generateSessionId(): string {
    return uuidv4();
  }

  // KEEP EXISTING: For future authenticated cart features
  async getUserCart(userId: string): Promise<CartDocument | null> {
    return this.cartModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  // KEEP EXISTING: For future cart migration when user logs in
  async migrateAnonymousCartToUser(sessionId: string, userId: string): Promise<CartDocument> {
    const anonymousCart = await this.getCart(sessionId);
    
    if (anonymousCart.items.length > 0) {
      anonymousCart.userId = new Types.ObjectId(userId);
      anonymousCart.sessionId = sessionId; // Keep sessionId for reference
      return await anonymousCart.save();
    }
    
    return anonymousCart;
  }
}