// API Configuration and Environment Setup
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URLS: {
    development: 'http://localhost:3000',
    staging: 'https://api-staging.yourdomain.com',
    production: 'https://api.yourdomain.com',
  },
  
  // Request timeouts
  TIMEOUTS: {
    default: 5000,
    upload: 30000,
    download: 60000,
  },
  
  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000,
  },
  
  // Cache configuration
  CACHE: {
    products: 5 * 60 * 1000, // 5 minutes
    user: 10 * 60 * 1000,    // 10 minutes
  },
};

// Environment detection
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const env = import.meta.env.VITE_ENVIRONMENT || 'development';
  return env as 'development' | 'staging' | 'production';
};

// Get base URL for current environment
export const getBaseUrl = (): string => {
  const env = getEnvironment();
  return import.meta.env.VITE_API_BASE_URL || API_CONFIG.BASE_URLS[env];
};

// Feature flags
export const FEATURES = {
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
};

// API endpoints
export const ENDPOINTS = {
  // Product endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  FEATURED_PRODUCTS: '/products/featured',
  
  // Order endpoints
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  ORDER_STATUS: (id: string) => `/orders/${id}/status`,
  
  // Auth endpoints
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  REFRESH: '/auth/refresh',
  
  // Admin endpoints
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PRODUCT_BY_ID: (id: string) => `/admin/products/${id}`,
};

export default {
  API_CONFIG,
  getEnvironment,
  getBaseUrl,
  FEATURES,
  ENDPOINTS,
};