import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  gameId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  originalPrice: number;

  @Prop({ default: 0 })
  discountedPrice: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop()
  imageUrl: string;

  @Prop()
  iconUrl: string; // Game icon/logo URL

  @Prop()
  coverImageUrl: string; // Game cover image URL

  @Prop({ default: Date.now })
  addedAt: Date;
}

const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  // CHANGED: Use sessionId instead of userId for anonymous carts
  @Prop({ required: true })
  sessionId: string;

  // OPTIONAL: Keep userId for future authenticated cart features
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ default: 0 })
  totalItems: number;

  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  totalDiscount: number;

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ default: Date.now })
  lastUpdated: Date;

  // Auto-expire anonymous carts after 7 days
  @Prop({ 
    type: Date, 
    default: Date.now, 
    expires: 7 * 24 * 60 * 60 // 7 days in seconds
  })
  expiresAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Indexes for anonymous carts
CartSchema.index({ sessionId: 1 });
CartSchema.index({ userId: 1 }); // Keep for future authenticated features
CartSchema.index({ expiresAt: 1 }); // For auto-cleanup