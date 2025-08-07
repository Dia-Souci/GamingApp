import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './schemas/cart.schema';
import { GamesModule } from '../games/games.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    GamesModule, // For stock validation
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], // Export for Orders module
})
export class CartModule {}