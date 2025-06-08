export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'game' | 'merchandise';
}

export interface Product {
  id: string;
  title: string;
  category: string;
  platform?: string;
  price: number;
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  image?: string;
  type: 'game' | 'merchandise';
  description?: string;
}

export interface DashboardStats {
  ordersToday: number;
  totalRevenue: number;
  lowStockAlerts: number;
  totalProducts: number;
}

export interface CarouselItem {
  id: string;
  title: string;
  image: string;
  link: string;
  active: boolean;
}

export interface HomepageContent {
  heroBanner: string;
  categories: {
    xbox: boolean;
    playstation: boolean;
    pc: boolean;
    merchandise: boolean;
  };
  carousel: CarouselItem[];
}