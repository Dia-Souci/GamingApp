export interface OrderFormData {
  fullName: string;
  phoneNumber: string;
  email?: string;
  wilaya: string;
  extraInfo?: string;
}

export interface Order extends OrderFormData {
  id: string;
  items: CartItem[];
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
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