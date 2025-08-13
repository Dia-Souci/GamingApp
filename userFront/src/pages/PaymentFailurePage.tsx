import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailurePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const checkoutId = searchParams.get('checkout_id');
  const error = searchParams.get('error') || 'Payment was not completed successfully';

  return (
    <>
      <Helmet>
        <title>Payment Failed - InstantGaming</title>
      </Helmet>

      <div className="min-h-screen bg-[#1E1E1E] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Failure Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Payment Failed</h1>
            <p className="text-[#DDDDDD] text-lg">
              We're sorry, but your payment could not be processed.
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-[#2C2C2C] rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">What Happened?</h2>
            
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
              
              <div className="text-[#DDDDDD]">
                <h3 className="text-lg font-semibold text-white mb-3">Possible Reasons:</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Insufficient funds in your account</li>
                  <li>Card was declined by your bank</li>
                  <li>Payment method is not supported</li>
                  <li>Technical issues with the payment processor</li>
                  <li>Session expired during payment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/checkout"
              className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Link>
            
            <Link
              to="/cart"
              className="bg-[#2C2C2C] hover:bg-[#3C3C3C] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 border border-[#3a3a3a] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Cart
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-12 bg-[#2C2C2C] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#DDDDDD]">
              <div>
                <h4 className="font-medium text-white mb-2">Payment Issues</h4>
                <p className="text-sm">
                  If you continue to experience payment issues, please contact your bank or try a different payment method.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Customer Support</h4>
                <p className="text-sm">
                  Our support team is here to help. Contact us if you need assistance with your order.
                </p>
              </div>
            </div>
          </div>

          {/* Alternative Payment Methods */}
          <div className="mt-8 bg-[#2C2C2C] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Alternative Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#1E1E1E] rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">CC</span>
                </div>
                <p className="text-white text-sm font-medium">Credit Card</p>
              </div>
              <div className="text-center p-4 bg-[#1E1E1E] rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">DC</span>
                </div>
                <p className="text-white text-sm font-medium">Debit Card</p>
              </div>
              <div className="text-center p-4 bg-[#1E1E1E] rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">EW</span>
                </div>
                <p className="text-white text-sm font-medium">E-Wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentFailurePage;
