// Mock API implementation for development/testing
import { Product, Order, CreateOrderRequest, PaginatedResponse } from '../types/api';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock error simulation
const shouldSimulateError = () => Math.random() < 0.05; // 5% chance of error

// Mock products data (using existing game store data)
const mockProducts: Product[] = [
  // This would be populated with your existing game data
  // For now, we'll import from the game store
];

// Mock orders storage
let mockOrders: Order[] = [];
let orderIdCounter = 1;

export const mockApi = {
  // Product endpoints
  products: {
    getAll: async (filters?: any): Promise<PaginatedResponse<Product>> => {
      await mockDelay();
      
      if (shouldSimulateError()) {
        throw new Error('Failed to fetch products');
      }

      // Simulate filtering and pagination
      let filteredProducts = [...mockProducts];
      
      if (filters?.platform) {
        filteredProducts = filteredProducts.filter(p => p.platform === filters.platform);
      }
      
      if (filters?.q) {
        const query = filters.q.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.developer.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 30;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return {
        data: paginatedProducts,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit),
        },
      };
    },

    getById: async (id: string): Promise<Product> => {
      await mockDelay(300);
      
      if (shouldSimulateError()) {
        throw new Error('Failed to fetch product');
      }

      const product = mockProducts.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    },

    getFeatured: async (limit: number = 12): Promise<Product[]> => {
      await mockDelay(400);
      
      if (shouldSimulateError()) {
        throw new Error('Failed to fetch featured products');
      }

      // Return random featured products
      const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    },
  },

  // Order endpoints
  orders: {
    create: async (orderData: CreateOrderRequest): Promise<Order> => {
      await mockDelay(1000); // Longer delay for order creation
      
      if (shouldSimulateError()) {
        throw new Error('Failed to create order');
      }

      const order: Order = {
        id: `ORD-${Date.now()}-${orderIdCounter++}`,
        ...orderData,
        orderDate: new Date().toISOString(),
        status: 'pending',
      };

      mockOrders.push(order);
      return order;
    },

    getById: async (id: string): Promise<Order> => {
      await mockDelay(300);
      
      if (shouldSimulateError()) {
        throw new Error('Failed to fetch order');
      }

      const order = mockOrders.find(o => o.id === id);
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    },

    getAll: async (filters?: any): Promise<PaginatedResponse<Order>> => {
      await mockDelay(500);
      
      if (shouldSimulateError()) {
        throw new Error('Failed to fetch orders');
      }

      let filteredOrders = [...mockOrders];
      
      if (filters?.status) {
        filteredOrders = filteredOrders.filter(o => o.status === filters.status);
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
      
      return {
        data: paginatedOrders,
        pagination: {
          page,
          limit,
          total: filteredOrders.length,
          totalPages: Math.ceil(filteredOrders.length / limit),
        },
      };
    },
  },

  // Auth endpoints (mock)
  auth: {
    login: async (credentials: any) => {
      await mockDelay(800);
      
      if (shouldSimulateError()) {
        throw new Error('Login failed');
      }

      // Mock successful login
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          role: 'user' as const,
        },
      };
    },

    logout: async () => {
      await mockDelay(200);
      // Mock logout - just resolve
    },

    getProfile: async () => {
      await mockDelay(300);
      
      if (shouldSimulateError()) {
        throw new Error('Failed to fetch profile');
      }

      return {
        id: '1',
        email: 'user@example.com',
        role: 'user' as const,
        createdAt: new Date().toISOString(),
      };
    },
  },
};

// Function to populate mock products from game store
export const initializeMockProducts = (products: Product[]) => {
  mockProducts.length = 0; // Clear existing
  mockProducts.push(...products);
};

export default mockApi;