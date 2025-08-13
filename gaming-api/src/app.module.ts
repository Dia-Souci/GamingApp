import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module'; // Add this
import { UsersModule } from './users/users.module'; // Add this
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { WebsiteSettingsModule } from './website-settings/website-settings.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/gaming-api'),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    AuthModule, // Add this
    UsersModule, // Add this
    GamesModule, CartModule, OrdersModule, PaymentModule, WebsiteSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}