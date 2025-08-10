import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem {
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

  // Digital delivery fields
  @Prop()
  activationKey: string;

  @Prop({ default: false })
  keyDelivered: boolean;

  @Prop()
  keyDeliveredAt: Date;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema()
export class CustomerInfo {
  // CHANGED: userId is now optional for guest orders
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true })
  wilaya: string;

  @Prop({ required: true })
  wilayaName: string;

  @Prop()
  address: string;

  @Prop()
  extraInfo: string;

  // ADDED: Track if this is a guest order
  @Prop({ default: true })
  isGuest: boolean;
}

const CustomerInfoSchema = SchemaFactory.createForClass(CustomerInfo);

@Schema()
export class OrderTimeline {
  @Prop({ required: true })
  status: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop()
  note: string;

  // CHANGED: Optional for guest orders (admin updates only)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy?: Types.ObjectId;

  // ADDED: For guest order tracking
  @Prop()
  updatedBySystem: string;
}

const OrderTimelineSchema = SchemaFactory.createForClass(OrderTimeline);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  // ADDED: Session ID for linking anonymous cart to order
  @Prop({ required: true })
  sessionId: string;

  @Prop({ type: CustomerInfoSchema, required: true })
  customer: CustomerInfo;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  // Pricing
  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  totalDiscount: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'DZD' })
  currency: string;

  // Order Status
  @Prop({ 
    enum: ['pending', 'confirmed', 'processing', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  })
  status: string;

  @Prop({ 
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  })
  paymentStatus: string;

  // Payment Information
  @Prop({ type: Object })
  payment: {
    method: string;
    transactionId: string;
    paymentGateway: string;
    paidAt: Date;
  };

  // Order Timeline
  @Prop({ type: [OrderTimelineSchema], default: [] })
  timeline: OrderTimeline[];

  // Admin Notes
  @Prop()
  adminNotes: string;

  // Analytics
  @Prop({ default: 'web' })
  source: string;

  @Prop()
  referrer: string;

  // ADDED: Guest order lookup token for order tracking
  @Prop()
  guestToken: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes for guest orders
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ sessionId: 1 });
OrderSchema.index({ guestToken: 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ 'customer.userId': 1, createdAt: -1 }); // Keep for future auth features
OrderSchema.index({ status: 1, createdAt: -1 });