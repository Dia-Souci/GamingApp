export interface OrderFormData {
  customer: {
    fullName: string;
    email: string;
    phoneNumber?: string;
    wilaya: string;
    wilayaName: string;
    address?: string;
    extraInfo?: string;
  };
}

export interface OrderItem {
  gameId: string;
  title: string;
  platform: string;
  quantity: number;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  imageUrl?: string;
  activationKey?: string;
  keyDelivered: boolean;
  keyDeliveredAt?: Date;
}

export interface Order extends OrderFormData {
  _id: string;
  orderNumber: string;
  sessionId: string;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  payment?: {
    method: string;
    transactionId: string;
    paymentGateway: string;
    paidAt: Date;
  };
  timeline: Array<{
    status: string;
    timestamp: Date;
    note?: string;
    updatedBy?: string;
    updatedBySystem?: string;
  }>;
  adminNotes?: string;
  source?: string;
  referrer?: string;
  guestToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  // Customer fields at root level (matching backend CreateOrderDto)
  email: string;
  fullName: string;
  phoneNumber?: string;
  wilaya: string;
  wilayaName: string;
  address?: string;
  extraInfo?: string;
  // Note: items, totalAmount, currency come from session cart
}

export interface CartItem {
  id: string;
  title: string;
  platform: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  imageUrl: string;
  quantity: number;
}

export interface PaymentInfo {
  method: string;
  transactionId: string;
  paymentGateway: string;
  paidAt: Date;
}

export interface CheckoutSession {
  id: string;
  url: string;
  expires_at: string;
  status: string;
  metadata?: {
    orderNumber: string;
    orderId: string;
    guestToken: string;
    customerId: string;
  };
}

export interface RefundInfo {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}