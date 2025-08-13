import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, FileText, Loader2, AlertCircle } from 'lucide-react';
import { WILAYAS } from '../data/wilayas';
import { OrderFormData, CreateOrderRequest } from '../types/order';
import { useCartStore } from '../store/cartStore';
import { orderService, paymentService, cartService, apiUtils } from '../services/api';

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  wilaya?: string;
}

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, getSessionId } = useCartStore();
  
  const [formData, setFormData] = useState<OrderFormData>({
    customer: {
      fullName: '',
      email: '',
      phoneNumber: '',
      wilaya: '',
      wilayaName: '',
      extraInfo: ''
    }
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 2) return 'Full name must be at least 2 characters';
    return undefined;
  };

  const validatePhoneNumber = (phone: string): string | undefined => {
    if (!phone.trim()) return 'Phone number is required';
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    const digitsOnly = phone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 9) return 'Phone number must be at least 9 digits';
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validateWilaya = (wilaya: string): string | undefined => {
    if (!wilaya) return 'Please select a wilaya';
    return undefined;
  };

  // Handle input changes
  const handleInputChange = (field: keyof OrderFormData['customer'], value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      customer: { 
        ...prev.customer, 
        [field]: value 
      } 
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    setSubmitError('');
  };

  // Handle wilaya change
  const handleWilayaChange = (wilayaCode: string) => {
    const wilaya = WILAYAS.find(w => w.code === wilayaCode);
    setFormData(prev => ({ 
      ...prev, 
      customer: { 
        ...prev.customer, 
        wilaya: wilayaCode,
        wilayaName: wilaya?.name || ''
      } 
    }));
    
    if (errors.wilaya) {
      setErrors(prev => ({ ...prev, wilaya: undefined }));
    }
    setSubmitError('');
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.fullName = validateFullName(formData.customer.fullName);
    newErrors.phoneNumber = validatePhoneNumber(formData.customer.phoneNumber);
    newErrors.email = validateEmail(formData.customer.email);
    newErrors.wilaya = validateWilaya(formData.customer.wilaya);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (items.length === 0) {
      setSubmitError('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const sessionId = getSessionId();
      
      // First, sync cart items with backend session cart
      console.log('Syncing cart items to backend:', items);
      for (const item of items) {
        try {
          console.log('Adding item to backend cart:', { gameId: item.id, platform: item.platform, quantity: item.quantity });
          await cartService.addToCart(sessionId, item.id, item.platform, item.quantity);
          console.log('Successfully added item to backend cart');
        } catch (error) {
          console.error('Failed to sync cart item:', error);
          // Show error to user but continue
          setSubmitError(`Failed to sync cart item: ${error.message}`);
          return; // Stop the process if cart sync fails
        }
      }
      
      // Verify cart was synced by fetching it
      try {
        const backendCart = await cartService.getCart(sessionId);
        console.log('Backend cart after sync:', backendCart);
        if (!backendCart.items || backendCart.items.length === 0) {
          setSubmitError('Cart sync failed - no items found in backend cart');
          return;
        }
      } catch (error) {
        console.error('Failed to verify cart sync:', error);
        setSubmitError('Failed to verify cart sync');
        return;
      }
      
      // Create order request - backend expects customer fields at root level
      // Items come from session cart, not request body
      const orderRequest = {
        // Customer fields at root level (not nested)
        email: formData.customer.email,
        fullName: formData.customer.fullName,
        phoneNumber: formData.customer.phoneNumber,
        wilaya: formData.customer.wilaya,
        wilayaName: formData.customer.wilayaName,
        address: formData.customer.address || '',
        extraInfo: formData.customer.extraInfo || ''
        // Note: items, totalAmount, currency come from session cart
      };

      // Initiate payment
      const successUrl = `${window.location.origin}/payment/success`;
      const failureUrl = `${window.location.origin}/payment/failure`;
      
      const paymentResult = await paymentService.initiatePayment(
        orderRequest,
        sessionId,
        successUrl,
        failureUrl
      );

      // Clear cart after successful payment initiation
      clearCart();
      
      // Redirect to payment page
      window.location.href = paymentResult.checkout.url;
      
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      setSubmitError(error.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#2C2C2C] rounded-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Order Information</h2>
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#DDDDDD] mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#DDDDDD]" />
              <input
                type="text"
                id="fullName"
                value={formData.customer.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[#1E1E1E] border rounded-lg text-white placeholder-[#DDDDDD]/60 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.fullName 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-[#3a3a3a] focus:border-[#FF6600] focus:ring-[#FF6600]/20'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#DDDDDD] mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#DDDDDD]" />
              <input
                type="tel"
                id="phoneNumber"
                value={formData.customer.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[#1E1E1E] border rounded-lg text-white placeholder-[#DDDDDD]/60 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.phoneNumber 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-[#3a3a3a] focus:border-[#FF6600] focus:ring-[#FF6600]/20'
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#DDDDDD] mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#DDDDDD]" />
              <input
                type="email"
                id="email"
                value={formData.customer.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[#1E1E1E] border rounded-lg text-white placeholder-[#DDDDDD]/60 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-[#3a3a3a] focus:border-[#FF6600] focus:ring-[#FF6600]/20'
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Wilaya */}
          <div>
            <label htmlFor="wilaya" className="block text-sm font-medium text-[#DDDDDD] mb-2">
              Wilaya *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#DDDDDD]" />
              <select
                id="wilaya"
                value={formData.customer.wilaya}
                onChange={(e) => handleWilayaChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[#1E1E1E] border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.wilaya 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-[#3a3a3a] focus:border-[#FF6600] focus:ring-[#FF6600]/20'
                }`}
              >
                <option value="">Select your wilaya</option>
                {WILAYAS.map((wilaya) => (
                  <option key={wilaya.code} value={wilaya.code} className="bg-[#1E1E1E]">
                    {wilaya.code} - {wilaya.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.wilaya && (
              <p className="mt-1 text-sm text-red-400">{errors.wilaya}</p>
            )}
          </div>

          {/* Extra Info */}
          <div>
            <label htmlFor="extraInfo" className="block text-sm font-medium text-[#DDDDDD] mb-2">
              Additional Information <span className="text-[#DDDDDD]/60">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-[#DDDDDD]" />
              <textarea
                id="extraInfo"
                value={formData.customer.extraInfo}
                onChange={(e) => handleInputChange('extraInfo', e.target.value)}
                rows={4}
                className="w-full pl-10 pr-4 py-3 bg-[#1E1E1E] border border-[#3a3a3a] rounded-lg text-white placeholder-[#DDDDDD]/60 focus:outline-none focus:ring-2 focus:border-[#FF6600] focus:ring-[#FF6600]/20 transition-all duration-200 resize-none"
                placeholder="Delivery instructions, preferred time, or any other notes..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#FF6600] to-[#ff3300] hover:from-[#e55a00] hover:to-[#e52e00] disabled:from-[#666] disabled:to-[#666] text-white py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting to Payment...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-[#1E1E1E] rounded-lg border border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="text-green-400 font-medium text-sm">Secure Payment Processing</p>
              <p className="text-[#DDDDDD] text-xs">Your payment is processed securely by Chargily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;