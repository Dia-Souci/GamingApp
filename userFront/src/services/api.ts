import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { getBaseUrl, ENDPOINTS } from './apiConfig';
import { Game } from '../store/gameStore';
import { 
  OrderFormData, 
  Order, 
  CartItem, 
  CreateOrderRequest,
  PaymentInfo,
  CheckoutSession,
  RefundInfo
} from '../types/order';

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

export interface GameFilters {
  platform?: string;
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'title' | 'releaseDate' | 'reviewScore';
  sortOrder?: 'asc' | 'desc';
}

// Create axios instance with configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookie-based sessions
  });

  // Request interceptor for adding auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log requests in development
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
      // Log responses in development
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
        // Server responded with error status
        apiError.status = error.response.status;
        apiError.message = (error.response.data as any)?.message || error.message;
        apiError.errors = (error.response.data as any)?.errors;
      } else if (error.request) {
        // Request was made but no response received
        apiError.message = 'Network error - please check your connection';
        apiError.status = 0;
      } else {
        // Something else happened
        apiError.message = error.message;
      }

      console.error('❌ API Error:', apiError);
      return Promise.reject(apiError);
    }
  );

  return instance;
};

const api = createApiInstance();

// Game Service
export const gameService = {
  /**
   * Get all games with optional filtering
   */
  getAll: async (filters?: GameFilters): Promise<PaginatedResponse<Game>> => {
    const response = await api.get<PaginatedResponse<Game>>(ENDPOINTS.GAMES, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a single game by ID
   */
  getById: async (id: string): Promise<Game> => {
    const response = await api.get<ApiResponse<Game>>(ENDPOINTS.GAME_BY_ID(id));
    return response.data.data || response.data;
  },

  /**
   * Get a single game by slug
   */
  getBySlug: async (slug: string): Promise<Game> => {
    const response = await api.get<ApiResponse<Game>>(ENDPOINTS.GAME_BY_SLUG(slug));
    return response.data.data || response.data;
  },

  /**
   * Get games by category/platform
   */
  getByPlatform: async (platform: string, filters?: Omit<GameFilters, 'platform'>): Promise<PaginatedResponse<Game>> => {
    const response = await api.get<PaginatedResponse<Game>>(ENDPOINTS.GAMES, {
      params: { ...filters, platform },
    });
    return response.data;
  },

  /**
   * Search games by query
   */
  search: async (query: string, filters?: Omit<GameFilters, 'q'>): Promise<PaginatedResponse<Game>> => {
    const response = await api.get<PaginatedResponse<Game>>(ENDPOINTS.SEARCH_GAMES, {
      params: { ...filters, q: query },
    });
    return response.data;
  },

  /**
   * Get featured games
   */
  getFeatured: async (limit: number = 12): Promise<Game[]> => {
    const response = await api.get<ApiResponse<Game[]>>(ENDPOINTS.FEATURED_GAMES, {
      params: { limit },
    });
    return response.data.data || response.data;
  },
};

// Order Service
export const orderService = {
  /**
   * Create a new guest order
   */
  createGuestOrder: async (orderData: CreateOrderRequest, sessionId: string): Promise<{
    order: Order;
    guestToken: string;
    message: string;
    trackingInfo: {
      orderNumber: string;
      guestToken: string;
      trackingUrl: string;
    };
  }> => {
    const response = await api.post<ApiResponse<{
      order: Order;
      guestToken: string;
      message: string;
      trackingInfo: {
        orderNumber: string;
        guestToken: string;
        trackingUrl: string;
      };
    }>>(ENDPOINTS.GUEST_ORDER, orderData, {
      headers: {
        'X-Session-ID': sessionId,
      },
    });
    return response.data.data || response.data;
  },

  /**
   * Get guest order by order number and token
   */
  getGuestOrder: async (orderNumber: string, guestToken: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(ENDPOINTS.GUEST_ORDER_BY_NUMBER(orderNumber), {
      params: { token: guestToken },
    });
    return response.data.data || response.data;
  },

  /**
   * Get orders by email
   */
  getOrdersByEmail: async (email: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>(ENDPOINTS.GUEST_ORDER_LOOKUP, {
      params: { email, page, limit },
    });
    return response.data;
  },

  /**
   * Cancel guest order
   */
  cancelGuestOrder: async (orderNumber: string, guestToken: string, reason?: string): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(ENDPOINTS.GUEST_ORDER_CANCEL(orderNumber), {
      guestToken,
      reason,
    });
    return response.data.data || response.data;
  },

  /**
   * Get order by ID (for authenticated users)
   */
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(ENDPOINTS.ORDER_BY_ID(id));
    return response.data.data || response.data;
  },

  /**
   * Get all orders (admin only)
   */
  getAll: async (filters?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>(ENDPOINTS.ORDERS, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Update order status (admin only)
   */
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order>>(ENDPOINTS.ORDER_STATUS(id), { status });
    return response.data.data || response.data;
  },
};

// Cart Service
export const cartService = {
  /**
   * Get cart for session
   */
  getCart: async (sessionId: string): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(ENDPOINTS.CART, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data.data || response.data;
  },

  /**
   * Add item to cart
   */
  addToCart: async (sessionId: string, gameId: string, platform: string, quantity: number = 1): Promise<any> => {
    const response = await api.post<ApiResponse<any>>(ENDPOINTS.CART_ADD, {
      gameId,
      platform,
      quantity
    }, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data.data || response.data;
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (sessionId: string, gameId: string, platform: string, quantity: number): Promise<any> => {
    const response = await api.put<ApiResponse<any>>(ENDPOINTS.CART_UPDATE(gameId, platform), {
      quantity
    }, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data.data || response.data;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (sessionId: string, gameId: string, platform: string): Promise<any> => {
    const response = await api.delete<ApiResponse<any>>(ENDPOINTS.CART_REMOVE(gameId, platform), {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data.data || response.data;
  },

  /**
   * Clear cart
   */
  clearCart: async (sessionId: string): Promise<any> => {
    const response = await api.delete<ApiResponse<any>>(ENDPOINTS.CART, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data.data || response.data;
  },
};

// Payment Service
export const paymentService = {
  /**
   * Initiate payment for an order
   */
  initiatePayment: async (
    orderData: CreateOrderRequest,
    sessionId: string,
    successUrl: string,
    failureUrl: string
  ): Promise<{
    order: {
      orderNumber: string;
      totalAmount: number;
      currency: string;
    };
    guestToken: string;
    checkout: {
      id: string;
      url: string;
      expiresAt: string;
    };
    customer: {
      id: string;
      name: string;
      email: string;
    };
  }> => {
    const response = await api.post<ApiResponse<{
      order: {
        orderNumber: string;
        totalAmount: number;
        currency: string;
      };
      guestToken: string;
      checkout: {
        id: string;
        url: string;
        expiresAt: string;
      };
      customer: {
        id: string;
        name: string;
        email: string;
      };
    }>>(ENDPOINTS.PAYMENT_INITIATE, orderData, {
      params: {
        sessionId,
        successUrl,
        failureUrl,
      },
    });
    return response.data.data || response.data;
  },

  /**
   * Get checkout session details
   */
  getCheckoutSession: async (checkoutId: string): Promise<CheckoutSession> => {
    const response = await api.get<ApiResponse<CheckoutSession>>(ENDPOINTS.PAYMENT_CHECKOUT(checkoutId));
    return response.data.data || response.data;
  },

  /**
   * Process refund
   */
  processRefund: async (checkoutId: string, amount?: number): Promise<RefundInfo> => {
    const response = await api.post<ApiResponse<RefundInfo>>(ENDPOINTS.PAYMENT_REFUND(checkoutId), {
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
    });
    return response.data.data || response.data;
  },

  /**
   * Get payment information for an order
   */
  getPaymentInfo: async (orderNumber: string): Promise<PaymentInfo | null> => {
    try {
      const response = await api.get<ApiResponse<PaymentInfo>>(`/payment/order/${orderNumber}/info`);
      return response.data.data || response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null; // No payment info found
      }
      throw error;
    }
  },
};

// Utility functions
export const apiUtils = {
  /**
   * Handle API errors consistently
   */
  handleError: (error: ApiError): string => {
    if (error.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      return 'Please log in to continue';
    }
    
    if (error.status === 403) {
      return 'You do not have permission to perform this action';
    }
    
    if (error.status === 404) {
      return 'The requested resource was not found';
    }
    
    if (error.status === 422 && error.errors) {
      // Validation errors
      const firstError = Object.values(error.errors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
    
    return error.message || 'An unexpected error occurred';
  },

  /**
   * Format date consistently
   */
  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Format currency consistently
   */
  formatCurrency: (amount: number, currency: string = 'DZD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  },

  /**
   * Generate session ID for cart
   */
  generateSessionId: (): string => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },
};

// Export the configured axios instance for custom requests
export { api };

// Default export
export default {
  gameService,
  orderService,
  paymentService,
  apiUtils,
};

