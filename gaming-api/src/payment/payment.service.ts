import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import { GamesService } from '../games/games.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { ChargilyClient } from '@chargily/chargily-pay';

@Injectable()
export class PaymentService {
  private readonly apiKey: string;
  private readonly client: ChargilyClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly gamesService: GamesService,
  ) {
    const apiKey = this.configService.get<string>('CHARGILY_API_KEY');
    if (!apiKey) {
      throw new Error('CHARGILY_API_KEY is required');
    }
    this.apiKey = apiKey;
    const mode = this.configService.get<string>('NODE_ENV') === 'production' ? 'live' : 'test';
    
    // Initialize the official Chargily client
    this.client = new ChargilyClient({
      api_key: this.apiKey,
      mode: mode as 'test' | 'live',
    });
    
    console.log(`Payment service initialized with mode: ${mode}`);
  }

  /**
   * Create a customer in Chargily
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
    try {
      console.log('Creating customer with Chargily API...');
      console.log('Customer data:', customerData);
      
      // Format phone number with Algeria country code if provided
      let formattedPhone = customerData.phone;
      if (formattedPhone && !formattedPhone.startsWith('+')) {
        // Remove leading 0 and add +213
        formattedPhone = formattedPhone.replace(/^0+/, '');
        formattedPhone = `+213${formattedPhone}`;
      }
      
      const customer = await this.client.createCustomer({
        name: customerData.name,
        email: customerData.email,
        phone: formattedPhone,
        address: customerData.address,
        metadata: {
          source: 'gaming-app',
          type: 'customer',
        },
      });

      console.log('Customer created successfully:', customer);
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  /**
   * Create a product in Chargily for a game
   */
  async createProduct(gameData: {
    name: string;
    description: string;
    gameId: string;
    platform: string;
  }) {
    try {
      const response = await this.client.createProduct({
        name: gameData.name,
        description: gameData.description || 'Digital game key',
        metadata: {
          gameId: gameData.gameId,
          platform: gameData.platform,
          category: 'gaming',
          source: 'gaming-app',
        },
      });

      return response;
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  /**
   * Create a price for a product
   */
  async createPrice(productId: string, amount: number, currency: string = 'dzd') {
    try {
      const response = await this.client.createPrice({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        product_id: productId,
      });

      return response;
    } catch (error) {
      throw new Error(`Failed to create price: ${error.message}`);
    }
  }

  /**
   * Create a checkout session for an order
   */
  async createCheckout(
    orderNumber: string,
    priceId: string,
    successUrl: string,
    failureUrl: string,
    metadata?: Record<string, any>
  ) {
    try {
      const response = await this.client.createCheckout({
        items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        failure_url: failureUrl,
        metadata: {
          orderNumber,
          source: 'gaming-app',
          ...metadata,
        },
      });

      return response;
    } catch (error) {
      throw new Error(`Failed to create checkout: ${error.message}`);
    }
  }

  /**
   * Process a complete order payment flow
   */
  async processOrderPayment(
    sessionId: string,
    createOrderDto: CreateOrderDto,
    successUrl: string,
    failureUrl: string
  ) {
    try {
      // 1. Create the order first
      const { order, guestToken } = await this.ordersService.createGuestOrder(
        sessionId,
        createOrderDto
      );

      // 2. Create customer in Chargily
      const customer = await this.createCustomer({
        name: createOrderDto.fullName,
        email: createOrderDto.email,
        phone: createOrderDto.phoneNumber,
        address: {
          country: 'DZ',
          state: createOrderDto.wilayaName,
          address: createOrderDto.address || `${createOrderDto.wilayaName}, Algeria`, // Provide default address if empty
        },
      });

      // 3. Create product for the order (using first item as representative)
      const firstItem = order.items[0];
      const game = await this.gamesService.findOne(firstItem.gameId.toString());
      
      const product = await this.createProduct({
        name: firstItem.title,
        description: game?.description || `Digital game key for ${firstItem.title}`,
        gameId: firstItem.gameId.toString(),
        platform: firstItem.platform,
      });

      // 4. Create price
      const price = await this.createPrice(product.id, order.totalAmount);

      // 5. Create checkout session
      const checkout = await this.createCheckout(
        order.orderNumber,
        price.id,
        successUrl,
        failureUrl,
        {
          orderNumber: order.orderNumber, // Ensure orderNumber is always included
          orderId: (order as any)._id?.toString() || order.orderNumber,
          guestToken,
          customerId: customer.id,
        }
      );

      // 6. Update order with payment information
      await this.ordersService.updateOrderStatus(order.orderNumber, {
        status: 'pending',
        note: 'Payment initiated via Chargily',
        paymentStatus: 'pending',
      });

      return {
        order,
        guestToken,
        checkout,
        customer,
        product,
        price,
      };
    } catch (error) {
      throw new Error(`Failed to process order payment: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(signature: string, rawBody: Buffer): boolean {
    try {
      const computedSignature = require('crypto')
        .createHmac('sha256', this.configService.get<string>('CHARGILY_API_KEY'))
        .update(rawBody)
        .digest('hex');

      return computedSignature === signature;
    } catch (error) {
      return false;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhookEvent(eventData: any) {
    try {
      switch (eventData.type) {
        case 'checkout.paid':
          await this.handlePaymentSuccess(eventData.data);
          break;
        case 'checkout.failed':
          await this.handlePaymentFailure(eventData.data);
          break;
        case 'checkout.expired':
          await this.handlePaymentExpired(eventData.data);
          break;
        default:
          console.log(`Unhandled webhook event type: ${eventData.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSuccess(checkoutData: any) {
    try {
      console.log('Processing payment success for checkout:', checkoutData.id);
      console.log('Checkout metadata:', checkoutData.metadata);
      
      const orderNumber = checkoutData.metadata?.orderNumber;
      if (!orderNumber) {
        throw new Error('Order number not found in checkout metadata');
      }

      console.log(`Found order number: ${orderNumber}`);

      // Check if order exists in database
      try {
        const existingOrder = await this.ordersService.findOne(orderNumber);
        console.log(`Order found in database: ${existingOrder.orderNumber}, status: ${existingOrder.status}`);
      } catch (orderError) {
        console.error(`Order lookup failed for ${orderNumber}:`, orderError.message);
        throw new Error(`Order number not found: ${orderNumber}`);
      }

      // Update order status
      await this.ordersService.updateOrderStatus(orderNumber, {
        status: 'confirmed',
        note: 'Payment confirmed via Chargily',
        paymentStatus: 'paid',
      });

      console.log(`Order status updated for: ${orderNumber}`);

      // TODO: Temporarily comment out activation key assignment to isolate the issue
      // Generate and assign activation keys
      /*
      try {
        await this.assignActivationKeys(orderNumber);
        console.log(`Activation keys assigned for order: ${orderNumber}`);
      } catch (activationError) {
        console.error(`Failed to assign activation keys for order ${orderNumber}:`, activationError.message);
        // Don't throw the error, just log it - the payment was successful
      }
      */

      console.log(`Payment successful for order: ${orderNumber}`);
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailure(checkoutData: any) {
    try {
      const orderNumber = checkoutData.metadata?.orderNumber;
      if (!orderNumber) {
        throw new Error('Order number not found in checkout metadata');
      }

      // Update order status
      await this.ordersService.updateOrderStatus(orderNumber, {
        status: 'cancelled',
        note: 'Payment failed via Chargily',
        paymentStatus: 'failed',
      });

      console.log(`Payment failed for order: ${orderNumber}`);
    } catch (error) {
      console.error('Error handling payment failure:', error);
      throw error;
    }
  }

  /**
   * Handle expired payment
   */
  private async handlePaymentExpired(checkoutData: any) {
    try {
      const orderNumber = checkoutData.metadata?.orderNumber;
      if (!orderNumber) {
        throw new Error('Order number not found in checkout metadata');
      }

      // Update order status
      await this.ordersService.updateOrderStatus(orderNumber, {
        status: 'cancelled',
        note: 'Payment expired via Chargily',
        paymentStatus: 'failed',
      });

      console.log(`Payment expired for order: ${orderNumber}`);
    } catch (error) {
      console.error('Error handling payment expiration:', error);
      throw error;
    }
  }

  /**
   * Assign activation keys to order items
   */
  private async assignActivationKeys(orderNumber: string) {
    try {
      const order = await this.ordersService.findOne(orderNumber);
      
      for (const item of order.items) {
        const game = await this.gamesService.findOne(item.gameId.toString());
        
        if (game && game.activationKeys && game.activationKeys.length > 0) {
          // Get available activation key
          const availableKey = game.activationKeys.find(key => !key.isUsed);
          
          if (availableKey) {
            // Update the key as used
            await this.gamesService.markActivationKeyAsUsed(
              item.gameId.toString(),
              availableKey.key
            );

            // Update order item with activation key
            item.activationKey = availableKey.key;
            item.keyDelivered = true;
            item.keyDeliveredAt = new Date();
          }
        }
      }

      await order.save();
    } catch (error) {
      console.error('Error assigning activation keys:', error);
      throw error;
    }
  }

  /**
   * Get checkout session details
   */
  async getCheckoutSession(checkoutId: string) {
    try {
      const response = await this.client.getCheckout(checkoutId);
      return response;
    } catch (error) {
      throw new Error(`Failed to retrieve checkout: ${error.message}`);
    }
  }

  async refundPayment(checkoutId: string, amount?: number) {
    try {
      // Note: Chargily client might not have a direct refund method
      // This would need to be implemented based on their API
      throw new Error('Refund functionality not yet implemented with Chargily client');
    } catch (error) {
      throw new Error(`Failed to create refund: ${error.message}`);
    }
  }
}
