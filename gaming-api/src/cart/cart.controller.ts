import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // MAIN CHANGE: Use session-based cart instead of user authentication
  private getOrCreateSessionId(req: Request, res: Response): string {
    let sessionId = req.cookies?.['cart-session'] || req.headers['x-session-id'] as string;
    
    if (!sessionId) {
      sessionId = this.cartService.generateSessionId();
      // Set session cookie (7 days expiry)
      res.cookie('cart-session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
    
    return sessionId;
  }

  @Get()
  async getCart(@Req() req: Request, @Res() res: Response) {
    const sessionId = this.getOrCreateSessionId(req, res);
    const cart = await this.cartService.getCart(sessionId);
    return res.json(cart);
  }

  @Post('items')
  async addToCart(@Req() req: Request, @Res() res: Response, @Body() addToCartDto: AddToCartDto) {
    const sessionId = this.getOrCreateSessionId(req, res);
    const cart = await this.cartService.addToCart(sessionId, addToCartDto);
    return res.json(cart);
  }

  @Put('items/:gameId/:platform')
  async updateCartItem(
    @Req() req: Request,
    @Res() res: Response,
    @Param('gameId') gameId: string,
    @Param('platform') platform: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    const sessionId = this.getOrCreateSessionId(req, res);
    const cart = await this.cartService.updateCartItem(sessionId, gameId, platform, updateDto);
    return res.json(cart);
  }

  @Delete('items/:gameId/:platform')
  async removeFromCart(
    @Req() req: Request,
    @Res() res: Response,
    @Param('gameId') gameId: string,
    @Param('platform') platform: string,
  ) {
    const sessionId = this.getOrCreateSessionId(req, res);
    const cart = await this.cartService.removeFromCart(sessionId, gameId, platform);
    return res.json(cart);
  }

  @Delete()
  async clearCart(@Req() req: Request, @Res() res: Response) {
    const sessionId = this.getOrCreateSessionId(req, res);
    const cart = await this.cartService.clearCart(sessionId);
    return res.json(cart);
  }

  // Optional: Manual session ID endpoint for frontend flexibility
  @Post('session')
  async createSession(@Res() res: Response) {
    const sessionId = this.cartService.generateSessionId();
    res.cookie('cart-session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ sessionId, message: 'Session created' });
  }
}