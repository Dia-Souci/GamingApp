# UserFront Integration with Backend API

This document outlines the complete integration of the userFront app with the backend API, including payment processing with Chargily.

## 🚀 Integration Overview

The userFront app has been fully integrated with the backend API, replacing all mock data with real API calls. The integration includes:

- **Game Management**: Fetching games from the backend API
- **Cart Management**: Session-based cart with backend integration
- **Order Processing**: Complete order creation and management
- **Payment Processing**: Integration with Chargily payment gateway
- **User Experience**: Seamless payment flow with success/failure handling

## 📁 Key Files Updated

### API Configuration
- `src/services/apiConfig.ts` - Updated endpoints to match backend
- `src/services/api.ts` - Complete rewrite with real API integration
- `src/types/order.ts` - Updated types to match backend schema

### Store Management
- `src/store/gameStore.ts` - Updated to use real API instead of mock data
- `src/store/cartStore.ts` - Added session management for backend integration

### Components & Pages
- `src/pages/HomePage.tsx` - Updated to fetch data from API
- `src/pages/GameDetailPage.tsx` - Updated to use real game data
- `src/components/OrderForm.tsx` - Integrated with payment system
- `src/components/GameCard.tsx` - Updated to use correct game ID field
- `src/components/GameGrid.tsx` - Updated to pass correct props

### New Payment Pages
- `src/pages/PaymentSuccessPage.tsx` - Handles successful payments
- `src/pages/PaymentFailurePage.tsx` - Handles failed payments

### Routing
- `src/App.tsx` - Added payment success/failure routes

## 🔧 Environment Configuration

Create a `.env` file in the userFront directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Environment
VITE_ENVIRONMENT=development

# Feature Flags
VITE_USE_MOCK_API=false
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false

# Payment Configuration
VITE_CHARGILY_PUBLIC_KEY=test_pk_7gOlZ5UKDR41XIkHLcMkHcoLh5y7KGyxW6k2hk0h
```

## 🔄 API Endpoints Used

### Games
- `GET /api/games` - Get all games with filtering
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/slug/:slug` - Get game by slug
- `GET /api/games/featured` - Get featured games
- `GET /api/games/search` - Search games

### Orders
- `POST /api/orders/guest` - Create guest order
- `GET /api/orders/guest/:orderNumber` - Get guest order
- `GET /api/orders/guest/lookup/email` - Get orders by email
- `PUT /api/orders/guest/:orderNumber/cancel` - Cancel guest order

### Payments
- `POST /api/payment/initiate` - Initiate payment
- `GET /api/payment/checkout/:checkoutId` - Get checkout session
- `POST /api/payment/refund/:checkoutId` - Process refund

## 💳 Payment Flow

1. **Cart Management**: Users add games to cart (stored in localStorage with session ID)
2. **Checkout**: User fills order form and proceeds to payment
3. **Payment Initiation**: Order is created and payment is initiated via Chargily
4. **Payment Processing**: User is redirected to Chargily payment page
5. **Success/Failure**: User is redirected back to success or failure page
6. **Order Completion**: Order is updated with payment status

## 🛠️ Key Features

### Session Management
- Cart sessions are managed with unique session IDs
- Sessions persist across browser sessions
- Session ID is used for order creation and payment processing

### Error Handling
- Comprehensive error handling for API calls
- User-friendly error messages
- Retry mechanisms for failed requests

### Loading States
- Loading skeletons for better UX
- Proper loading states for all async operations
- Error states with retry options

### Payment Integration
- Seamless integration with Chargily payment gateway
- Support for multiple payment methods
- Proper success/failure handling
- Order status tracking

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd userFront
   npm install
   ```

2. **Configure Environment**:
   - Copy `.env.example` to `.env`
   - Update the API base URL to match your backend

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Ensure Backend is Running**:
   - Make sure the backend API is running on `http://localhost:3000`
   - Verify all endpoints are accessible

## 🔍 Testing the Integration

1. **Browse Games**: Visit the homepage to see games loaded from the API
2. **Add to Cart**: Add games to cart and verify session management
3. **Checkout Process**: Go through the complete checkout flow
4. **Payment Testing**: Test payment with Chargily test credentials
5. **Order Tracking**: Verify order creation and status updates

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Verify backend is running on correct port
   - Check CORS configuration in backend
   - Ensure API base URL is correct

2. **Payment Issues**:
   - Verify Chargily API key is correct
   - Check webhook configuration
   - Ensure success/failure URLs are accessible

3. **Cart Issues**:
   - Clear localStorage if cart gets corrupted
   - Check session ID generation
   - Verify cart persistence

### Debug Mode

Enable debug mode by setting:
```env
VITE_ENVIRONMENT=development
```

This will log all API requests and responses to the console.

## 📝 Notes

- The integration removes all mock data dependencies
- All API calls are now real and require a running backend
- Payment processing requires valid Chargily credentials
- Session management ensures cart persistence across browser sessions
- Error handling provides fallbacks for network issues

## 🔮 Future Enhancements

- User authentication and account management
- Order history and tracking
- Email notifications
- Advanced filtering and search
- Wishlist functionality
- Review and rating system
