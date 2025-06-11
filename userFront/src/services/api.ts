// Updated API service with proper game terminology
import { OrderFormData, Order, CartItem } from '../types/order';

// Mock delay to simulate network requests
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock orders storage (in production this would be a database)
let mockOrders: Order[] = [];

export const api = {
  // Submit order
  submitOrder: async (orderData: OrderFormData, cartItems: CartItem[], totalAmount: number): Promise<Order> => {
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
  getOrderById: async (id: string): Promise<Order | null> => {
    await mockDelay(300);
    
    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    // return response.json();
    
    return mockOrders.find(order => order.id === id) || null;
  }
};