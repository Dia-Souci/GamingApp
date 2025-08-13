import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  RawBodyRequest,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Initiate payment for an order
   */
  @Post('initiate')
  async initiatePayment(
    @Body() createOrderDto: CreateOrderDto,
    @Query('sessionId') sessionId: string,
    @Query('successUrl') successUrl: string,
    @Query('failureUrl') failureUrl: string,
    @Res() res: Response,
  ) {
    try {
      if (!sessionId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Session ID is required',
        });
      }

      if (!successUrl || !failureUrl) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Success and failure URLs are required',
        });
      }

      const paymentData = await this.paymentService.processOrderPayment(
        sessionId,
        createOrderDto,
        successUrl,
        failureUrl,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: {
          order: {
            orderNumber: paymentData.order.orderNumber,
            totalAmount: paymentData.order.totalAmount,
            currency: paymentData.order.currency,
          },
          guestToken: paymentData.guestToken,
          checkout: {
            id: paymentData.checkout.id,
            url: paymentData.checkout.checkout_url,
            expiresAt: new Date(paymentData.checkout.created_at * 1000), // Convert timestamp to Date
          },
          customer: {
            id: paymentData.customer.id,
            name: paymentData.customer.name,
            email: paymentData.customer.email,
          },
        },
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to initiate payment',
        message: error.message,
      });
    }
  }

  /**
   * Get checkout session details
   */
  @Get('checkout/:checkoutId')
  async getCheckoutSession(
    @Param('checkoutId') checkoutId: string,
    @Res() res: Response,
  ) {
    try {
      const checkout = await this.paymentService.getCheckoutSession(checkoutId);
      
      return res.status(HttpStatus.OK).json({
        success: true,
        data: checkout,
      });
    } catch (error) {
      console.error('Get checkout error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to get checkout session',
        message: error.message,
      });
    }
  }

  /**
   * Process refund
   */
  @Post('refund/:checkoutId')
  async processRefund(
    @Param('checkoutId') checkoutId: string,
    @Body() body: { amount?: number },
    @Res() res: Response,
  ) {
    try {
      const refund = await this.paymentService.refundPayment(
        checkoutId,
        body.amount,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: refund,
      });
    } catch (error) {
      console.error('Refund error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to process refund',
        message: error.message,
      });
    }
  }

  /**
   * Chargily webhook endpoint
   */
  @Post('webhook/chargily')
  async chargilyWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    try {
      const body = req.body;
      const rawBody = req.rawBody;
      const signature = req.get('signature');

      // Validate webhook signature
      if (!signature) {
        console.error('Webhook: Missing signature');
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Missing signature',
        });
      }

      if (!rawBody) {
        console.error('Webhook: Missing raw body');
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Missing raw body',
        });
      }

      // Verify signature
      const isValidSignature = this.paymentService.verifyWebhookSignature(
        signature,
        rawBody,
      );

      if (!isValidSignature) {
        console.error('Webhook: Invalid signature');
        return res.status(HttpStatus.FORBIDDEN).json({
          error: 'Invalid signature',
        });
      }

      // Handle webhook event
      await this.paymentService.handleWebhookEvent(body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Webhook processed successfully',
      });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to process webhook',
        message: error.message,
      });
    }
  }

  /**
   * Payment success callback (for frontend redirects)
   */
  @Get('success')
  async paymentSuccess(
    @Query('checkout_id') checkoutId: string,
    @Res() res: Response,
  ) {
    try {
      console.log('=== PAYMENT SUCCESS CALLBACK STARTED ===');
      console.log('Checkout ID:', checkoutId);
      
      if (!checkoutId) {
        console.log('ERROR: No checkout ID provided');
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Checkout ID is required',
        });
      }

      console.log('Fetching checkout from Chargily...');
      const checkout = await this.paymentService.getCheckoutSession(checkoutId);
      console.log('Checkout retrieved:', {
        id: checkout.id,
        status: checkout.status,
        metadata: checkout.metadata,
      });
      
      // Process the payment success if checkout is paid
      if (checkout.status === 'paid') {
        console.log('Checkout is paid, processing payment success...');
        try {
          await this.paymentService.handleWebhookEvent({
            type: 'checkout.paid',
            data: checkout,
          });
          console.log('Payment success processed successfully');
        } catch (webhookError) {
          console.error('Error processing payment success:', webhookError);
          // Don't fail the request, just log the error
        }
      } else {
        console.log('Checkout is not paid, status:', checkout.status);
      }
      
      console.log('=== PAYMENT SUCCESS CALLBACK COMPLETED ===');
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Payment successful',
        data: {
          checkoutId,
          status: checkout.status,
          orderNumber: checkout.metadata?.orderNumber,
        },
      });
    } catch (error) {
      console.error('=== PAYMENT SUCCESS CALLBACK ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to process success callback',
        message: error.message,
      });
    }
  }

  /**
   * Payment failure callback (for frontend redirects)
   */
  @Get('failure')
  async paymentFailure(
    @Query('checkout_id') checkoutId: string,
    @Res() res: Response,
  ) {
    try {
      if (!checkoutId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Checkout ID is required',
        });
      }

      const checkout = await this.paymentService.getCheckoutSession(checkoutId);
      
      return res.status(HttpStatus.OK).json({
        success: false,
        message: 'Payment failed',
        data: {
          checkoutId,
          status: checkout.status,
          orderNumber: checkout.metadata?.orderNumber,
        },
      });
    } catch (error) {
      console.error('Payment failure callback error:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to process failure callback',
        message: error.message,
      });
    }
  }

  /**
   * Health check endpoint for payment service
   */
  @Get('health')
  async healthCheck(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Payment service is healthy',
      timestamp: new Date().toISOString(),
    });
  }
}
