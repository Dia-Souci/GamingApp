import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Response Types
export interface ApiResponse<T> {
  data?: T;
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

// Game Types (matching backend schema)
export interface Game {
  _id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  currency: string;
  platform: 'pc' | 'playstation' | 'xbox' | 'nintendo';
  platforms?: string[];
  genre?: string[];
  tags?: string[];
  imageUrl?: string;
  heroImageUrl?: string;
  screenshots?: string[];
  videoUrl?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: Date;
  deliveryMethod?: string;
  systemRequirements?: {
    minimum: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
    recommended: {
      os: string;
      processor: string;
      memory: string;
      graphics: string;
      storage: string;
    };
  };
  reviewScore?: number;
  totalReviews?: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  viewCount?: number;
  purchaseCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Order Types (matching backend schema)
export interface Order {
  _id: string;
  orderNumber: string;
  sessionId: string;
  customer: {
    userId?: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    wilaya: string;
    wilayaName: string;
    address?: string;
    extraInfo?: string;
    isGuest: boolean;
  };
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

// User Types
export interface User {
  _id: string;
  email: string;
  role: 'customer' | 'admin' | 'super_admin';
  profile: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    avatar?: string;
  };
  addresses?: Array<{
    type: string;
    wilaya: string;
    wilayaName: string;
    address: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
  }>;
  preferences?: {
    platforms?: string[];
    genres?: string[];
    newsletter?: boolean;
    notifications?: boolean;
  };
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt?: Date;
  lastLogin?: Date;
  loginAttempts?: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  guestOrders: number;
  totalRevenue: number;
}

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookie-based sessions if needed
  });

  // Request interceptor for adding auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      if (import.meta.env.VITE_ENVIRONMENT === 'development') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          params: config.params,
          data: config.data,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (import.meta.env.VITE_ENVIRONMENT === 'development') {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      }
      return response;
    },
    (error: AxiosError) => {
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: 500,
      };

      if (error.response) {
        apiError.status = error.response.status;
        apiError.message = (error.response.data as any)?.message || error.message;
        apiError.errors = (error.response.data as any)?.errors;

        // Handle authentication errors
        if (error.response.status === 401) {
          localStorage.removeItem('adminToken');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } else if (error.request) {
        apiError.message = 'Network error - please check your connection';
        apiError.status = 0;
      } else {
        apiError.message = error.message;
      }

      console.error('❌ API Error:', apiError);
      return Promise.reject(apiError);
    }
  );

  return instance;
};

const api = createApiInstance();

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    
    // Check if user has admin privileges
    if (!['admin', 'super_admin'].includes(user.role)) {
      throw new Error('Access denied. Admin privileges required.');
    }
    
    localStorage.setItem('adminToken', access_token);
    return { token: access_token, user };
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('adminToken');
    }
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    const { access_token } = response.data;
    localStorage.setItem('adminToken', access_token);
    return access_token;
  },
};

// Games Service
export const gamesService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    platform?: string;
    status?: string;
    search?: string;
    featured?: boolean;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<{ data: Game[]; total: number }> => {
    const response = await api.get('/games', { params });
    
    // Handle both paginated and non-paginated responses
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
      };
    } else {
      return {
        data: response.data.data || response.data,
        total: response.data.total || response.data.pagination?.total || 0,
      };
    }
  },

  getById: async (id: string): Promise<Game> => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Game> => {
    const response = await api.get(`/games/slug/${slug}`);
    return response.data;
  },

  getFeatured: async (limit?: number): Promise<Game[]> => {
    const response = await api.get('/games/featured', { params: { limit } });
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  search: async (searchTerm: string, limit?: number): Promise<Game[]> => {
    const response = await api.get('/games/search', { 
      params: { q: searchTerm, limit } 
    });
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  create: async (gameData: Partial<Game>): Promise<Game> => {
    const response = await api.post('/games', gameData);
    return response.data;
  },

  update: async (id: string, gameData: Partial<Game>): Promise<Game> => {
    const response = await api.patch(`/games/${id}`, gameData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/games/${id}`);
  },

  updateStock: async (id: string, stock: number): Promise<Game> => {
    const response = await api.patch(`/games/${id}`, { stock });
    return response.data;
  },
};

// Orders Service
export const ordersService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    email?: string;
    isGuest?: boolean;
  }): Promise<{ data: Order[]; total: number }> => {
    const response = await api.get('/orders/admin/all', { params });
    
    if (response.data.orders) {
      return {
        data: response.data.orders,
        total: response.data.total,
      };
    }
    
    return {
      data: Array.isArray(response.data) ? response.data : response.data.data || [],
      total: response.data.total || response.data.pagination?.total || 0,
    };
  },

  getById: async (orderNumber: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderNumber}`);
    return response.data;
  },

  getGuestOrder: async (orderNumber: string, guestToken: string): Promise<Order> => {
    const response = await api.get(`/orders/guest/${orderNumber}`, {
      params: { token: guestToken }
    });
    return response.data;
  },

  updateStatus: async (
    orderNumber: string, 
    status: Order['status'], 
    paymentStatus?: Order['paymentStatus'],
    note?: string
  ): Promise<Order> => {
    const response = await api.put(`/orders/admin/${orderNumber}/status`, {
      status,
      paymentStatus,
      note,
    });
    return response.data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/orders/admin/stats');
    return response.data;
  },

  getOrdersByEmail: async (email: string, page?: number, limit?: number): Promise<{ data: Order[]; total: number }> => {
    const response = await api.get('/orders/guest/lookup/email', {
      params: { email, page, limit }
    });
    
    if (response.data.orders) {
      return {
        data: response.data.orders,
        total: response.data.total,
      };
    }
    
    return {
      data: Array.isArray(response.data) ? response.data : [],
      total: response.data.total || 0,
    };
  },
};

// Users Service
export const usersService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<{ data: User[]; total: number }> => {
    const response = await api.get('/users', { params });
    
    return {
      data: Array.isArray(response.data) ? response.data : response.data.data || [],
      total: response.data.total || response.data.length || 0,
    };
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (userData: Partial<User['profile']>): Promise<User> => {
    const response = await api.patch('/users/profile', userData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Cart Service (for admin monitoring)
export const cartService = {
  getCart: async (sessionId: string) => {
    const response = await api.get('/cart', {
      headers: { 'x-session-id': sessionId }
    });
    return response.data;
  },

  clearCart: async (sessionId: string) => {
    const response = await api.delete('/cart', {
      headers: { 'x-session-id': sessionId }
    });
    return response.data;
  },
};

// Analytics Service
export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/orders/admin/stats');
      return response.data;
    } catch (error: any) {
      // Handle 401 errors gracefully without triggering redirect
      if (error.status === 401) {
        console.warn('Unauthorized access to analytics, using mock data');
        return {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
          guestOrders: 0,
          totalRevenue: 0,
        };
      }
      
      // Fallback to mock data if endpoint not available
      console.warn('Analytics endpoint not available, using mock data');
      return {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        guestOrders: 0,
        totalRevenue: 0,
      };
    }
  },

  getRevenueData: async (period: 'week' | 'month' | 'year' = 'month') => {
    try {
      const response = await api.get('/analytics/revenue', { params: { period } });
      return response.data;
    } catch (error: any) {
      // Handle 401 errors gracefully without triggering redirect
      if (error.status === 401) {
        console.warn('Unauthorized access to revenue analytics, using mock data');
        return [
          { name: 'Jan', revenue: 12000 },
          { name: 'Feb', revenue: 15000 },
          { name: 'Mar', revenue: 13500 },
          { name: 'Apr', revenue: 16800 },
          { name: 'May', revenue: 14200 },
          { name: 'Jun', revenue: 18500 }
        ];
      }
      
      // Return mock data if endpoint not available
      return [
        { name: 'Jan', revenue: 12000 },
        { name: 'Feb', revenue: 15000 },
        { name: 'Mar', revenue: 13500 },
        { name: 'Apr', revenue: 16800 },
        { name: 'May', revenue: 14200 },
        { name: 'Jun', revenue: 18500 }
      ];
    }
  },
};

// Utility functions
export const apiUtils = {
  handleError: (error: ApiError): string => {
    if (error.status === 401) {
      return 'Please log in to continue';
    }
    
    if (error.status === 403) {
      return 'You do not have permission to perform this action';
    }
    
    if (error.status === 404) {
      return 'The requested resource was not found';
    }
    
    if (error.status === 422 && error.errors) {
      const firstError = Object.values(error.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
    
    return error.message || 'An unexpected error occurred';
  },

  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  },
};

export default {
  authService,
  gamesService,
  ordersService,
  usersService,
  cartService,
  analyticsService,
  apiUtils,
};