import { Order, OrderFormData } from '../types/order';
import { Game } from '../store/gameStore';

// Mock API base URL - in production this would be your actual API
const API_BASE_URL = 'http://localhost:3001';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock products data (this would normally come from your backend)
const mockProducts: Game[] = [
  // Your existing game data from gameStore.ts would be here
  // For now, we'll use the data from the store
];

// Mock orders storage (in production this would be a database)
let mockOrders: Order[] = [];

export const api = {
  // Fetch all products
  async getProducts(): Promise<Game[]> {
    await mockDelay(500);
    
    // In a real app, this would be:
    // const response = await fetch(`${API_BASE_URL}/products`);
    // return response.json();
    
    // For now, return mock data
    return mockProducts;
  },

  // Fetch single product by ID
  async getProductById(id: string): Promise<Game | null> {
    await mockDelay(300);
    
    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/products/${id}`);
    // return response.json();
    
    return mockProducts.find(product => product.id === id) || null;
  },

  // Submit order
  async submitOrder(orderData: OrderFormData, cartItems: any[], totalAmount: number): Promise<Order> {
    await mockDelay(1500); // Simulate processing time
    
    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      items: cartItems,
      totalAmount,
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    // In a real app, this would be:
    // const response = await fetch(`${API_BASE_URL}/orders`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(order)
    // });
    // return response.json();

    // Mock storage
    mockOrders.push(order);
    
    // Simulate potential API errors (uncomment to test error handling)
    // if (Math.random() < 0.1) {
    //   throw new Error('Order submission failed. Please try again.');
    // }

    return order;
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    await mockDelay(300);
    
    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    // return response.json();
    
    return mockOrders.find(order => order.id === id) || null;
  }
};