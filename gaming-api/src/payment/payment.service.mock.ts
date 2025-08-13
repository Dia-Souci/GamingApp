import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import { GamesService } from '../games/games.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

@Injectable()
export class MockPaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly gamesService: GamesService,
  ) {}

  /**
   * Mock customer creation
   */
  async createCustomer(customerData: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      country: string;
      state: string;
      address: string;
    };
  }) {
    console.log('Mock: Creating customer:', customerData);
    return {
      id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: customerData.name,
      email: customerData.email,
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Mock product creation
   */
  async createProduct(gameData: {
    name: string;
    description: string;
    gameId: string;
    platform: string;
  }) {
    console.log('Mock: Creating product:', gameData);
    return {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: gameData.name,
      description: gameData.description,
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Mock price creation
   */
  async createPrice(productId: string, amount: number, currency: string = 'DZD') {
    console.log('Mock: Creating price:', { productId, amount, currency });
    return {
      id: `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      amount: amount * 100, // Convert to cents
      currency: currency,
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Mock checkout creation
   */
  async createCheckout(
    orderNumber: string,
    priceId: string,
    successUrl: string,
    failureUrl: string,
    metadata: any
  ) {
    console.log('Mock: Creating checkout:', { orderNumber, priceId, successUrl, failureUrl, metadata });
    return {
      id: `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      price_id: priceId,
      success_url: successUrl,
      failure_url: failureUrl,
      metadata: metadata,
      url: `${successUrl}?checkout_id=checkout_${Date.now()}&order_number=${orderNumber}`,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Mock checkout session retrieval
   */
  async getCheckoutSession(checkoutId: string) {
    console.log('Mock: Getting checkout session:', checkoutId);
    return {
      id: checkoutId,
      status: 'pending',
      amount: 1000,
      currency: 'DZD',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        orderId: 'mock_order_id',
        guestToken: 'mock_guest_token',
        customerId: 'mock_customer_id',
      },
    };
  }

  /**
   * Mock refund processing
   */
  async refundPayment(checkoutId: string, amount?: number) {
    console.log('Mock: Processing refund:', { checkoutId, amount });
    return {
      id: `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      checkout_id: checkoutId,
      amount: amount || 1000,
      status: 'succeeded',
      created_at: new Date().toISOString(),
    };
  }

  /**
   * Mock webhook verification
   */
  verifyWebhookSignature(payload: string | Buffer, signature: string): boolean {
    console.log('Mock: Verifying webhook signature');
    return true; // Always return true for testing
  }

  /**
   * Mock webhook event processing
   */
  async handleWebhookEvent(event: any) {
    console.log('Mock: Handling webhook event:', event);
    
    if (event.type === 'checkout.session.completed') {
      const { orderId, guestToken } = event.data.metadata;
      // Mock the status update - in real implementation this would update the order
      console.log('Mock: Updating order status to confirmed/paid');
      await this.assignActivationKeys(orderId);
    }
    
    return { received: true };
  }

  /**
   * Mock activation key assignment
   */
  async assignActivationKeys(orderId: string) {
    console.log('Mock: Assigning activation keys for order:', orderId);
    // This would normally assign activation keys to the order
    return true;
  }

  /**
   * Mock payment processing
   */
  async processOrderPayment(
    sessionId: string,
    createOrderDto: CreateOrderDto,
    successUrl: string,
    failureUrl: string
  ) {
    console.log('Mock: Processing order payment');
    
    try {
      // 1. Create the order first
      const { order, guestToken } = await this.ordersService.createGuestOrder(
        sessionId,
        createOrderDto
      );

      // 2. Create customer
      const customer = await this.createCustomer({
        name: createOrderDto.fullName,
        email: createOrderDto.email,
        phone: createOrderDto.phoneNumber,
        address: {
          country: 'Algeria',
          state: createOrderDto.wilayaName,
          address: createOrderDto.address || '',
        },
      });

      // 3. Create products and prices for each item
      const checkoutItems: Array<{ priceId: string; quantity: number }> = [];
      for (const item of order.items) {
        const product = await this.createProduct({
          name: item.title,
          description: `Digital game key for ${item.title} (${item.platform})`,
          gameId: item.gameId?.toString() || 'mock_game_id',
          platform: item.platform,
        });

        const price = await this.createPrice(product.id, item.discountedPrice, order.currency);
        checkoutItems.push({ priceId: price.id, quantity: item.quantity });
      }

      // 4. Create checkout session
      const checkout = await this.createCheckout(
        order.orderNumber,
        checkoutItems[0]?.priceId || 'mock_price_id', // Use first item for simplicity
        successUrl,
        failureUrl,
        {
          orderId: order.orderNumber, // Use orderNumber instead of _id
          guestToken,
          customerId: customer.id,
        }
      );

      return {
        order: {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          currency: order.currency,
        },
        guestToken,
        checkout: {
          id: checkout.id,
          url: checkout.url,
          expiresAt: checkout.expires_at,
        },
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
      };
    } catch (error) {
      console.error('Mock payment processing error:', error);
      throw error;
    }
  }
}
