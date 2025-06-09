import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import OrderForm from '../components/OrderForm';

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, getOriginalTotal, getTotalDiscount } = useCartStore();

  const totalPrice = getTotalPrice();
  const originalTotal = getOriginalTotal();
  const totalDiscount = getTotalDiscount();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Checkout - InstantGaming</title>
        </Helmet>
        
        <div className="min-h-screen bg-[#1E1E1E] pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-16">
              <ShoppingCart className="w-24 h-24 text-[#2C2C2C] mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
              <p className="text-[#DDDDDD] mb-8">Add some games to proceed with checkout!</p>
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
        <title>Checkout - InstantGaming</title>
      </Helmet>
      
      <div className="min-h-screen bg-[#1E1E1E] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-green-400 font-medium">Shopping cart</span>
              </div>
              <div className="w-16 h-0.5 bg-[#FF6600]"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#FF6600] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="ml-2 text-white font-medium">Payment</span>
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
            {/* Order Form */}
            <div className="lg:col-span-2">
              <OrderForm />
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#2C2C2C] rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-16 bg-[#1E1E1E] rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium truncate">{item.title}</h4>
                        <p className="text-[#DDDDDD] text-xs">{item.platform}</p>
                        <p className="text-[#DDDDDD] text-xs">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium text-sm">
                          ${(item.discountedPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pricing */}
                <div className="space-y-3 mb-6 pt-4 border-t border-[#1E1E1E]">
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
                  
                  <div className="border-t border-[#1E1E1E] pt-3">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/cart"
                  className="block text-center text-[#DDDDDD] hover:text-white py-2 transition-colors duration-200"
                >
                  ← Back to cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;