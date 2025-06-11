// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  platform: 'pc' | 'playstation' | 'xbox' | 'nintendo';
  imageUrl: string;
  heroImageUrl: string;
  description: string;
  developer: string;
  publisher: string;
  genre: string[];
  releaseDate: string;
  tags: string[];
  reviewScore: number;
  totalReviews: number;
  deliveryMethod: string;
  usersOnPage: number;
  activationInstructions: string;
}

export interface ProductFilters {
  platform?: string;
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'title' | 'releaseDate' | 'reviewScore';
  sortOrder?: 'asc' | 'desc';
}

// Order Types
export interface CreateOrderRequest {
  fullName: string;
  phoneNumber: string;
  email?: string;
  wilaya: string;
  extraInfo?: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface OrderItem {
  id: string;
  title: string;
  platform: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  wilaya: string;
  extraInfo?: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

// Authentication Types (for future implementation)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}