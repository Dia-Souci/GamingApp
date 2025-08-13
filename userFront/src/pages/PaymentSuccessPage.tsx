import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Download, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { orderService } from '../services/api';
import { getBaseUrl, ENDPOINTS } from '../services/apiConfig';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkoutId = searchParams.get('checkout_id');

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!checkoutId) {
        setError('Checkout ID not found');
        setLoading(false);
        return;
      }

      try {
        // Call the backend payment success endpoint to get order details
        const apiUrl = getBaseUrl();
        const response = await fetch(`${apiUrl}${ENDPOINTS.PAYMENT_SUCCESS}?checkout_id=${checkoutId}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to process payment success');
        }

        const data = await response.json();
        
        if (data.success && data.data.orderNumber) {
          // Set order details from the response
          setOrder({
            orderNumber: data.data.orderNumber,
            status: 'confirmed',
            paymentStatus: 'paid'
          });
        } else {
          throw new Error('Order details not found');
        }
      } catch (err: any) {
        console.error('Error loading order details:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [checkoutId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF6600] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-4">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <Link
              to="/"
              className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-2 rounded transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - InstantGaming</title>
      </Helmet>

      <div className="min-h-screen bg-[#1E1E1E] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-[#DDDDDD] text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-[#2C2C2C] rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Order Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#DDDDDD]">Order Number:</span>
                    <span className="text-white font-mono">{order?.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#DDDDDD]">Status:</span>
                    <span className="text-green-400 font-medium capitalize">{order?.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#DDDDDD]">Payment Status:</span>
                    <span className="text-green-400 font-medium capitalize">{order?.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-[#DDDDDD]">
                    <Download className="w-5 h-5 mr-3 text-[#FF6600]" />
                    <span>You'll receive your activation keys via email</span>
                  </div>
                  <div className="flex items-center text-[#DDDDDD]">
                    <Mail className="w-5 h-5 mr-3 text-[#FF6600]" />
                    <span>Check your email for order confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <button
              onClick={() => window.print()}
              className="bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 border border-[#3a3a3a]"
            >
              Print Receipt
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-[#2C2C2C] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#DDDDDD]">
              <div>
                <h4 className="font-medium text-white mb-2">Customer Support</h4>
                <p className="text-sm">
                  If you have any questions about your order, please contact our support team.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Order Tracking</h4>
                <p className="text-sm">
                  You can track your order status using your order number and email address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
