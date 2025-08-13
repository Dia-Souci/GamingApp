import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { cartService } from '../services/api';

const CartDebug: React.FC = () => {
  const { items, getSessionId } = useCartStore();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testCartSync = async () => {
    setLoading(true);
    setDebugInfo('');
    
    try {
      const sessionId = getSessionId();
      setDebugInfo(`Session ID: ${sessionId}\n`);
      setDebugInfo(prev => prev + `Local cart items: ${items.length}\n`);
      
      // Test getting cart
      try {
        const backendCart = await cartService.getCart(sessionId);
        setDebugInfo(prev => prev + `Backend cart items: ${backendCart.items?.length || 0}\n`);
        setDebugInfo(prev => prev + `Backend cart: ${JSON.stringify(backendCart, null, 2)}\n`);
      } catch (error: any) {
        setDebugInfo(prev => prev + `Error getting cart: ${error.message}\n`);
      }
      
      // Test adding an item
      if (items.length > 0) {
        const firstItem = items[0];
        try {
          setDebugInfo(prev => prev + `\nTesting add item: ${firstItem.title}\n`);
          const result = await cartService.addToCart(sessionId, firstItem.id, firstItem.platform, firstItem.quantity);
          setDebugInfo(prev => prev + `Add result: ${JSON.stringify(result, null, 2)}\n`);
        } catch (error: any) {
          setDebugInfo(prev => prev + `Error adding item: ${error.message}\n`);
        }
      }
      
    } catch (error: any) {
      setDebugInfo(prev => prev + `General error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h3 className="text-white font-bold mb-2">Cart Debug</h3>
      <button
        onClick={testCartSync}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-2"
      >
        {loading ? 'Testing...' : 'Test Cart Sync'}
      </button>
      <pre className="text-green-400 text-xs bg-black p-2 rounded overflow-auto max-h-40">
        {debugInfo || 'Click "Test Cart Sync" to debug cart functionality'}
      </pre>
    </div>
  );
};

export default CartDebug;
