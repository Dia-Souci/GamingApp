import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  Product, 
  ProductFilters, 
  CreateOrderRequest, 
  Order, 
  ApiResponse, 
  PaginatedResponse, 
  ApiError,
  LoginRequest,
  AuthResponse,
  User
} from '../types/api';

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

// Product Service
export const productService = {
  /**
   * Get all products with optional filtering
   */
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  /**
   * Get products by category/platform
   */
  getByCategory: async (platform: string, filters?: Omit<ProductFilters, 'platform'>): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: { ...filters, platform },
    });
    return response.data;
  },

  /**
   * Search products by query
   */
  search: async (query: string, filters?: Omit<ProductFilters, 'q'>): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params: { ...filters, q: query },
    });
    return response.data;
  },

  /**
   * Get featured products
   */
  getFeatured: async (limit: number = 12): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products/featured', {
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

// Authentication Service (for future implementation)
export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    const authData = response.data.data;
    
    // Store token in localStorage
    localStorage.setItem('authToken', authData.token);
    
    return authData;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Always remove token from localStorage
      localStorage.removeItem('authToken');
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh');
    const authData = response.data.data;
    
    // Update token in localStorage
    localStorage.setItem('authToken', authData.token);
    
    return authData;
  },
};

// Admin Service
export const adminService = {
  /**
   * Get admin dashboard stats
   */
  getDashboardStats: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>('/admin/dashboard');
    return response.data.data;
  },

  /**
   * Get all users (admin only)
   */
  getUsers: async (filters?: { page?: number; limit?: number }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/admin/users', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Create new product (admin only)
   */
  createProduct: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/admin/products', productData);
    return response.data.data;
  },

  /**
   * Update product (admin only)
   */
  updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.patch<ApiResponse<Product>>(`/admin/products/${id}`, productData);
    return response.data.data;
  },

  /**
   * Delete product (admin only)
   */
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },
};

// Utility functions
export const apiUtils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Get stored auth token
   */
  getAuthToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  /**
   * Handle API errors consistently
   */
  handleError: (error: ApiError): string => {
    if (error.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
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
  productService,
  orderService,
  authService,
  adminService,
  apiUtils,
};