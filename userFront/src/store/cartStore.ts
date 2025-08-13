import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiUtils } from '../services/api';

export interface CartItem {
  id: string;
  title: string;
  platform: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  imageUrl: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  sessionId: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getOriginalTotal: () => number;
  getTotalDiscount: () => number;
  initializeSession: () => void;
  getSessionId: () => string;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: null,
      
      addToCart: (item) => {
        const { items } = get();
        const existingItem = items.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }]
          });
        }
      },
      
      removeFromCart: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
      },
      
      getOriginalTotal: () => {
        return get().items.reduce((total, item) => total + (item.originalPrice * item.quantity), 0);
      },
      
      getTotalDiscount: () => {
        const { getOriginalTotal, getTotalPrice } = get();
        return getOriginalTotal() - getTotalPrice();
      },

      initializeSession: () => {
        const { sessionId } = get();
        if (!sessionId) {
          const newSessionId = apiUtils.generateSessionId();
          set({ sessionId: newSessionId });
        }
      },

      getSessionId: () => {
        const { sessionId, initializeSession } = get();
        if (!sessionId) {
          initializeSession();
          return get().sessionId!;
        }
        return sessionId;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        sessionId: state.sessionId,
      }),
    }
  )
);