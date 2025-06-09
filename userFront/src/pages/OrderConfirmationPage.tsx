import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Download, Mail, Phone, MapPin, Package, Loader2 } from 'lucide-react';
import { Order } from '../types/order';
import { api } from '../services/api';
import { WILAYAS } from '../data/wilayas';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        const orderData = await api.getOrderById(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF6600] animate-spin mx-auto mb-4" />
          <p className="text-[#DDDDDD]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <>
        <Helmet>
          <title>Order Not Found - InstantGaming</title>
        </Helmet>
        
        <div className="min-h-screen bg-[#1E1E1E] pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
              <p className="text-[#DDDDDD] mb-8">{error}</p>
              <Link 
                to="/"
                className="inline-flex items-center bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const wilayaName = WILAYAS.find(w => w.code === order.wilaya)?.name || order.wilaya;

  return (
    <>
      <Helmet>
        <title>Order Confirmation - InstantGaming</title>
      </Helmet>
      
      <div className="min-h-screen bg-[#1E1E1E] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-[#DDDDDD] text-lg">Thank you for your purchase</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-green-400 font-medium">Shopping cart</span>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-green-400 font-medium">Payment</span>
              </div>
              <div className="w-16 h-0.5 bg-green-500"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-2 text-green-400 font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-[#2C2C2C] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#DDDDDD]">Order ID:</span>
                    <span className="text-white font-mono">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#DDDDDD]">Order Date:</span>
                    <span className="text-white">{new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#DDDDDD]">Status:</span>
                    <span className="text-green-400 capitalize">{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#DDDDDD]">Total Amount:</span>
                    <span className="text-white font-bold">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-[#2C2C2C] rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Customer Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#DDDDDD]" />
                    <span className="text-white">{order.fullName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#DDDDDD]" />
                    <span className="text-white">{order.phoneNumber}</span>
                  </div>
                  {order.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#DDDDDD]" />
                      <span className="text-white">{order.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#DDDDDD]" />
                    <span className="text-white">{wilayaName}</span>
                  </div>
                  {order.extraInfo && (
                    <div className="mt-4">
                      <p className="text-[#DDDDDD] text-sm mb-2">Additional Notes:</p>
                      <p className="text-white text-sm bg-[#1E1E1E] p-3 rounded">{order.extraInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-[#2C2C2C] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-[#1E1E1E] rounded-lg">
                    <div className="w-16 h-20 bg-[#2C2C2C] rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-1 truncate">{item.title}</h3>
                      <p className="text-[#DDDDDD] text-sm">{item.platform}</p>
                      <p className="text-[#DDDDDD] text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">
                        ${(item.discountedPrice * item.quantity).toFixed(2)}
                      </p>
                      {item.discount > 0 && (
                        <p className="text-[#DDDDDD] text-sm line-through">
                          ${(item.originalPrice * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Steps */}
              <div className="mt-8 p-4 bg-[#1E1E1E] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="w-5 h-5 text-[#FF6600]" />
                  <h3 className="text-white font-medium">What's Next?</h3>
                </div>
                <p className="text-[#DDDDDD] text-sm leading-relaxed">
                  Your order is being processed. You will receive game activation keys via email within 24 hours. 
                  Please check your email regularly and don't forget to check your spam folder.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link 
              to="/"
              className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
            >
              Continue Shopping
            </Link>
            <button 
              onClick={() => window.print()}
              className="bg-[#2C2C2C] hover:bg-[#3a3a3a] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 border border-[#3a3a3a]"
            >
              Print Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;