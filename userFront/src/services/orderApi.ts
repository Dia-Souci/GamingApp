// Order API Service - Integrates with existing order functionality
import { orderService, CreateOrderRequest } from './api';
import { OrderFormData, Order, CartItem } from '../types/order';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Use mock API flag from environment
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

// Mock orders storage
const mockOrders: Order[] = [];
let orderIdCounter = 1;

// Mock implementation
class MockOrderApi {
  async create(orderData: CreateOrderRequest): Promise<Order> {
    await mockDelay(1500); // Longer delay for order creation
    
    // Simulate potential errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Order submission failed. Please try again.');
    }

    const order: Order = {
      id: `ORD-${Date.now()}-${orderIdCounter++}`,
      ...orderData,
      orderDate: new Date().toISOString(),
      status: 'pending',
    };

    mockOrders.push(order);
    return order;
  }

  async getById(id: string): Promise<Order> {
    await mockDelay(300);
    
    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  }

  async getAll(): Promise<Order[]> {
    await mockDelay(500);
    return [...mockOrders];
  }
}

// Create mock instance
const mockOrderApi = new MockOrderApi();

// Order API wrapper that chooses between real API and mock
export const orderApi = {
  // Submit order
  submitOrder: async (orderData: OrderFormData, cartItems: CartItem[], totalAmount: number): Promise<Order> => {
    const createOrderRequest: CreateOrderRequest = {
      ...orderData,
      items: cartItems,
      totalAmount,
    };

    if (USE_MOCK_API) {
      return mockOrderApi.create(createOrderRequest);
    }
    return orderService.create(createOrderRequest);
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order> => {
    if (USE_MOCK_API) {
      return mockOrderApi.getById(id);
    }
    return orderService.getById(id);
  },

  // Get all orders (admin only)
  getAllOrders: async (): Promise<Order[]> => {
    if (USE_MOCK_API) {
      return mockOrderApi.getAll();
    }
    const response = await orderService.getAll();
    return response.data;
  },
};

export default orderApi;