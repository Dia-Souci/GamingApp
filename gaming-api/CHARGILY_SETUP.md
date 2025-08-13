# Chargily API Setup Guide

## 🔑 Your Credentials
- **Secret Key**: `test_sk_5lTxCqaS8jaG1Bo7OR6m2cXA8PufyVNfJmyuBkFQ`
- **Public Key**: `test_pk_gW1BNU3s2mecjLy3hBLKPUoD2WRqNgeKKekYMaz6`

## 📝 Setup Steps

### 1. Create Environment File
Create a `.env` file in the `gaming-api` directory with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/gaming-api

# Server Configuration
PORT=3000
NODE_ENV=development

# Chargily Payment Gateway Configuration
CHARGILY_API_KEY=test_sk_5lTxCqaS8jaG1Bo7OR6m2cXA8PufyVNfJmyuBkFQ
CHARGILY_PUBLIC_KEY=test_pk_gW1BNU3s2mecjLy3hBLKPUoD2WRqNgeKKekYMaz6
CHARGILY_WEBHOOK_SECRET=your_webhook_secret_here

# JWT Configuration (for future auth features)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Optional: CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 2. Test API Connection
Run the test script to verify your credentials work:

```bash
cd gaming-api
node test-chargily-connection.js
```

### 3. Start the Backend
```bash
cd gaming-api
npm run start:dev
```

### 4. Test the Complete Flow
1. Add items to cart in the frontend
2. Go to checkout
3. Fill out the order form
4. Submit payment
5. Check the backend logs for Chargily API calls

## 🔍 What's Changed

### ✅ Real PaymentService Activated
- Switched from MockPaymentService to real PaymentService
- Updated payment controller to use real service
- Added proper error handling and logging

### ✅ API Configuration
- Using correct Chargily API domain: `https://pay.chargily.com/api/v1`
- Test mode enabled for development
- Proper authentication headers

### ✅ Error Handling
- Network connectivity checks
- API response validation
- Detailed error messages

## 🚀 Expected Behavior

When you submit an order:
1. ✅ Order is created in database
2. ✅ Customer is created in Chargily
3. ✅ Product is created in Chargily
4. ✅ Price is created in Chargily
5. ✅ Checkout session is created
6. ✅ User is redirected to Chargily payment page

## 🐛 Troubleshooting

### If you get "ENOTFOUND" errors:
- Check your internet connection
- Verify the API domain is accessible
- Try the test script first

### If you get authentication errors:
- Verify your API key is correct
- Check that the key starts with `test_sk_`
- Ensure the key is properly set in `.env`

### If you get validation errors:
- Check the order data structure
- Verify all required fields are present
- Check the Chargily API documentation

## 📞 Support

If you encounter issues:
1. Check the backend console logs
2. Run the test script: `node test-chargily-connection.js`
3. Verify your `.env` file is created correctly
4. Check that MongoDB is running

## 🔄 Switching Between Mock and Real

### To use Mock Service (for testing without API):
```typescript
// In payment.module.ts
providers: [
  MockPaymentService,
  // PaymentService, // Comment out
],
exports: [MockPaymentService],
```

### To use Real Service (for production):
```typescript
// In payment.module.ts
providers: [
  PaymentService,
  // MockPaymentService, // Comment out
],
exports: [PaymentService],
```
