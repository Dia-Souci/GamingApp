import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private getSessionId(req: Request): string {
    const sessionId = req.cookies?.['cart-session'] || req.headers['x-session-id'] as string;
    if (!sessionId) {
      throw new Error('Session not found. Please add items to cart first.');
    }
    return sessionId;
  }

  // MAIN CHANGE: Guest order creation
  @Post('guest')
  async createGuestOrder(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    const sessionId = this.getSessionId(req);
    const result = await this.ordersService.createGuestOrder(sessionId, createOrderDto);
    
    return {
      order: result.order,
      guestToken: result.guestToken,
      message: 'Order created successfully. Save the guest token for order tracking.',
      trackingInfo: {
        orderNumber: result.order.orderNumber,
        guestToken: result.guestToken,
        trackingUrl: `/api/orders/guest/${result.order.orderNumber}?token=${result.guestToken}`
      }
    };
  }

  // Guest order lookup by order number and token
  @Get('guest/:orderNumber')
  async getGuestOrder(
    @Param('orderNumber') orderNumber: string,
    @Query('token') guestToken: string,
  ) {
    if (!guestToken) {
      throw new Error('Guest token is required for order lookup');
    }
    
    return this.ordersService.findGuestOrder(orderNumber, guestToken);
  }

  // Guest order lookup by email
  @Get('guest/lookup/email')
  async getOrdersByEmail(
    @Query('email') email: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!email) {
      throw new Error('Email is required for order lookup');
    }
    
    return this.ordersService.findOrdersByEmail(email, page, limit);
  }

  // Guest order cancellation
  @Put('guest/:orderNumber/cancel')
  async cancelGuestOrder(
    @Param('orderNumber') orderNumber: string,
    @Body('guestToken') guestToken: string,
    @Body('reason') reason?: string,
  ) {
    if (!guestToken) {
      throw new Error('Guest token is required for order cancellation');
    }
    
    return this.ordersService.cancelGuestOrder(orderNumber, guestToken, reason);
  }

  // KEEP EXISTING: Authenticated user routes for future features
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    // This will be implemented later for authenticated users
    throw new Error('Authenticated orders not yet implemented. Use /guest endpoint.');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserOrders(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.ordersService.findUserOrders(user.userId, page, limit);
  }

  @Get(':orderNumber')
  @UseGuards(JwtAuthGuard)
  async getOrder(@Param('orderNumber') orderNumber: string, @CurrentUser() user: any) {
    const order = await this.ordersService.findOne(orderNumber);
    
    // Check if user owns this order or is admin
    if (order.customer.userId?.toString() !== user.userId && user.role !== 'admin') {
      throw new Error('Access denied');
    }

    return order;
  }

  @Put(':orderNumber/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Param('orderNumber') orderNumber: string,
    @CurrentUser() user: any,
    @Body('reason') reason?: string,
  ) {
    return this.ordersService.cancelOrder(orderNumber, user.userId, reason);
  }

  // KEEP EXISTING: Admin routes remain unchanged
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllOrders(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('email') email?: string,
    @Query('isGuest') isGuest?: boolean,
  ) {
    const filters = { status, paymentStatus, email, isGuest };
    return this.ordersService.findAll(page, limit, filters);
  }

  @Put('admin/:orderNumber/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateOrderStatus(
    @Param('orderNumber') orderNumber: string,
    @Body() updateDto: UpdateOrderStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.updateOrderStatus(orderNumber, updateDto, user.userId);
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  // Debug endpoint to check authentication
  @Get('debug/auth')
  @UseGuards(JwtAuthGuard)
  async debugAuth(@CurrentUser() user: any, @Req() req: any) {
    return {
      message: 'Authentication debug info',
      user: {
        id: user?._id,
        email: user?.email,
        role: user?.role,
        isActive: user?.isActive
      },
      requestUser: req.user,
      headers: {
        authorization: req.headers.authorization ? 'Bearer [HIDDEN]' : 'None',
        'x-session-id': req.headers['x-session-id']
      }
    };
  }

  // Simple test endpoint without guards
  @Get('debug/public')
  async debugPublic(@Req() req: any) {
    return {
      message: 'Public endpoint - no authentication required',
      headers: {
        authorization: req.headers.authorization ? 'Bearer [HIDDEN]' : 'None',
        'x-session-id': req.headers['x-session-id']
      },
      timestamp: new Date().toISOString()
    };
  }

  // Test endpoint with only JWT guard (no role check)
  @Get('debug/jwt-only')
  @UseGuards(JwtAuthGuard)
  async debugJwtOnly(@CurrentUser() user: any, @Req() req: any) {
    return {
      message: 'JWT-only endpoint - authentication successful',
      user: {
        id: user?._id,
        email: user?.email,
        role: user?.role,
        isActive: user?.isActive
      },
      requestUser: req.user,
      timestamp: new Date().toISOString()
    };
  }
}