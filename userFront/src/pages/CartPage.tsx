import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const CartPage: React.FC = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    getOriginalTotal, 
    getTotalDiscount 
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const originalTotal = getOriginalTotal();
  const totalDiscount = getTotalDiscount();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - InstantGaming</title>
        </Helmet>
        
        <div className="min-h-screen bg-[#1E1E1E] pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-12">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span className="ml-2 text-white font-medium">Shopping cart</span>
                </div>
                <div className="w-16 h-0.5 bg-[#2C2C2C]"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#2C2C2C] text-[#DDDDDD] rounded-full flex items-center justify-center text-sm">
                    2
                  </div>
                  <span className="ml-2 text-[#DDDDDD]">Payment</span>
                </div>
                <div className="w-16 h-0.5 bg-[#2C2C2C]"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#2C2C2C] text-[#DDDDDD] rounded-full flex items-center justify-center text-sm">
                    3
                  </div>
                  <span className="ml-2 text-[#DDDDDD]">Confirmation</span>
                </div>
              </div>
            </div>

            {/* Empty Cart */}
            <div className="text-center py-16">
              <ShoppingCart className="w-24 h-24 text-[#2C2C2C] mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-[#DDDDDD] mb-8">Add some games to get started!</p>
              <Link 
                to="/"
                className="inline-flex items-center bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - InstantGaming</title>
      </Helmet>
      
      <div className="min-h-screen bg-[#1E1E1E] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="ml-2 text-white font-medium">Shopping cart</span>
              </div>
              <div className="w-16 h-0.5 bg-[#2C2C2C]"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#2C2C2C] text-[#DDDDDD] rounded-full flex items-center justify-center text-sm">
                  2
                </div>
                <span className="ml-2 text-[#DDDDDD]">Payment</span>
              </div>
              <div className="w-16 h-0.5 bg-[#2C2C2C]"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#2C2C2C] text-[#DDDDDD] rounded-full flex items-center justify-center text-sm">
                  3
                </div>
                <span className="ml-2 text-[#DDDDDD]">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold text-white mb-6">Cart</h1>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-[#2C2C2C] rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      {/* Game Image */}
                      <div className="w-20 h-28 bg-[#1E1E1E] rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Game Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg mb-1 truncate">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-blue-600 rounded"></div>
                          <span className="text-[#DDDDDD] text-sm">{item.platform}</span>
                        </div>
                      </div>
                      
                      {/* Price and Controls */}
                      <div className="flex items-center space-x-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-[#1E1E1E] hover:bg-[#FF6600] text-[#DDDDDD] hover:text-white rounded flex items-center justify-center transition-colors duration-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-[#1E1E1E] hover:bg-[#FF6600] text-[#DDDDDD] hover:text-white rounded flex items-center justify-center transition-colors duration-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">
                            ${(item.discountedPrice * item.quantity).toFixed(2)}
                          </div>
                          {item.discount > 0 && (
                            <div className="text-sm text-[#DDDDDD] line-through">
                              ${(item.originalPrice * item.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-[#DDDDDD] hover:text-red-400 transition-colors duration-200"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#2C2C2C] rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#DDDDDD]">
                    <span>Official price</span>
                    <span>${originalTotal.toFixed(2)}</span>
                  </div>
                  
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-[#DDDDDD]">
                      <span>Discount</span>
                      <span className="text-green-400">-${totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-[#1E1E1E] pt-4">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/checkout"
                  className="block w-full bg-gradient-to-r from-[#FF6600] to-[#ff3300] hover:from-[#e55a00] hover:to-[#e52e00] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 mb-4 text-center"
                >
                  Go to payment →
                </Link>
                
                <div className="text-center">
                  <span className="text-[#DDDDDD] text-sm">or</span>
                </div>
                
                <Link 
                  to="/"
                  className="block text-center text-[#DDDDDD] hover:text-white py-2 transition-colors duration-200"
                >
                  ← Continue shopping
                </Link>
                
                {/* Security Badge */}
                <div className="flex items-center justify-center mt-6 pt-6 border-t border-[#1E1E1E]">
                  <div className="flex items-center space-x-2 text-green-400">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold">Secure payment</div>
                      <div className="text-xs text-[#DDDDDD]">256-bit SSL Secured</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;