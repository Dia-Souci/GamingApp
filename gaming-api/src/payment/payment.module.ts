import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { MockPaymentService } from './payment.service.mock';
import { PaymentController } from './payment.controller';
import { OrdersModule } from '../orders/orders.module';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => OrdersModule),
    forwardRef(() => GamesModule),
  ],
  controllers: [PaymentController],
  providers: [
    // Use real PaymentService with Chargily API
    PaymentService,
    // MockPaymentService, // Comment out for production
  ],
  exports: [PaymentService], // Export PaymentService
})
export class PaymentModule {}
