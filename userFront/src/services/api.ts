import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { Game } from '../store/gameStore';
import { OrderFormData, Order, CartItem } from '../types/order';

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

export interface GameFilters {
  platform?: string;
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'title' | 'releaseDate' | 'reviewScore';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateOrderRequest extends OrderFormData {
  items: CartItem[];
  totalAmount: number;
}

// Create axios instance with configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '5000'),
    headers: {
      'Content-Type': 'application/json',
    },
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

// Game Service (adapted from your existing game store)
export const gameService = {
  /**
   * Get all games with optional filtering
   */
  getAll: async (filters?: GameFilters): Promise<PaginatedResponse<Game>> => {
    const response = await api.get<PaginatedResponse<Game>>('/games', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a single game by ID
   */
  getById: async (id: string): Promise<Game> => {
    const response = await api.get<ApiResponse<Game>>(`/games/${id}`);
    return response.data.data;
  },

  /**
   * Get games by category/platform
   */
  getByPlatform: async (platform: string, filters?: Omit<GameFilters, 'platform'>): Promise<PaginatedResponse<Game>> => {
    const response = await api.get<PaginatedResponse<Game>>('/games', {
      params: { ...filters, platform },
    });
    return response.data;
  },

  /**
   * Search games by query
   */
  search: async (query: string, filters?: Omit<GameFilters, 'q'>): Promise<PaginatedResponse<Game>> => {
    const response = await api.get<PaginatedResponse<Game>>('/games', {
      params: { ...filters, q: query },
    });
    return response.data;
  },

  /**
   * Get featured games
   */
  getFeatured: async (limit: number = 12): Promise<Game[]> => {
    const response = await api.get<ApiResponse<Game[]>>('/games/featured', {
      params: { limit },
    });
    return response.data.data;
  },
};

// Order Service
export const orderService = {
  /**
   * Create a new order
   */
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  },

  /**
   * Get order by ID
   */
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  /**
   * Get all orders (admin only)
   */
  getAll: async (filters?: { page?: number; limit?: number; status?: string }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Update order status (admin only)
   */
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return response.data.data;
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
};

// Export the configured axios instance for custom requests
export { api };

// Default export
export default {
  gameService,
  orderService,
  apiUtils,
};

export { apiUtils }

export { gameService }

export { orderService }