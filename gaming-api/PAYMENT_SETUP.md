# Payment Service Setup Guide

This guide explains how to set up and use the Chargily payment service for your gaming application.

## Prerequisites

1. **Chargily Account**: Sign up at [Chargily](https://chargily.com) and get your API keys
2. **Environment Setup**: Ensure your NestJS application is properly configured
3. **Database**: MongoDB should be running and accessible

## Installation

1. **Install Dependencies**:
   ```bash
   npm install axios
   ```

2. **Environment Variables**:
   Create a `.env` file in your project root with:
   ```env
   # Chargily Configuration
   CHARGILY_API_KEY=your_chargily_api_key_here
   CHARGILY_WEBHOOK_SECRET=your_webhook_secret_here
   
   # Environment
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/gaming-api
   
   # JWT
   JWT_SECRET=your-secret-key
   ```

## Configuration

### Chargily Dashboard Setup

1. **Webhook Configuration**:
   - Log into your Chargily dashboard
   - Go to Webhooks section
   - Add webhook URL: `https://your-domain.com/payment/webhook/chargily`
   - Set webhook secret (same as `CHARGILY_WEBHOOK_SECRET`)

2. **API Keys**:
   - Use test keys for development
   - Use live keys for production
   - Keep keys secure and never commit them to version control

## Usage

### Frontend Integration

1. **Initiate Payment**:
   ```javascript
   const response = await fetch('/payment/initiate', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       email: 'user@example.com',
       fullName: 'John Doe',
       phoneNumber: '+213123456789',
       wilaya: '16',
       wilayaName: 'Alger',
       address: '123 Main St',
       extraInfo: 'Additional info'
     }),
     params: {
       sessionId: 'cart-session-id',
       successUrl: 'https://your-domain.com/success',
       failureUrl: 'https://your-domain.com/failure'
     }
   });

   const data = await response.json();
   // Redirect user to data.data.checkout.url
   window.location.href = data.data.checkout.url;
   ```

2. **Handle Payment Success**:
   ```javascript
   // On your success page
   const urlParams = new URLSearchParams(window.location.search);
   const checkoutId = urlParams.get('checkout_id');
   
   if (checkoutId) {
     // Verify payment status
     const response = await fetch(`/payment/success?checkout_id=${checkoutId}`);
     const result = await response.json();
     
     if (result.success) {
       // Show success message and activation keys
       console.log('Payment successful!');
     }
   }
   ```

### Backend Integration

The payment service automatically:

1. **Creates Orders**: When payment is initiated
2. **Updates Order Status**: Based on webhook events
3. **Assigns Activation Keys**: After successful payment
4. **Handles Refunds**: When requested

## API Endpoints

### Payment Flow Endpoints

- `POST /payment/initiate` - Start payment process
- `GET /payment/checkout/:checkoutId` - Get checkout details
- `POST /payment/refund/:checkoutId` - Process refund

### Webhook Endpoints

- `POST /payment/webhook/chargily` - Chargily webhook handler
- `GET /payment/success` - Success callback
- `GET /payment/failure` - Failure callback

### Utility Endpoints

- `GET /payment/health` - Health check

## Testing

### Test Mode

1. **Use Test API Keys**: Chargily provides test keys for development
2. **Test Webhooks**: Use tools like ngrok to test webhooks locally
3. **Test Payment Flow**: Use test payment methods provided by Chargily

### Local Development

1. **Start ngrok**:
   ```bash
   ngrok http 3000
   ```

2. **Update Webhook URL**: Use ngrok URL in Chargily dashboard
3. **Test Complete Flow**: From order creation to payment completion

## Production Deployment

### Security Considerations

1. **Environment Variables**: Use production API keys
2. **HTTPS**: Ensure all endpoints use HTTPS
3. **Webhook Security**: Verify webhook signatures
4. **Error Handling**: Implement proper error logging

### Monitoring

1. **Webhook Delivery**: Monitor webhook success/failure rates
2. **Payment Success Rate**: Track payment completion rates
3. **Error Logging**: Log all payment-related errors
4. **Order Status**: Monitor order status transitions

## Troubleshooting

### Common Issues

1. **Webhook Not Received**:
   - Check webhook URL configuration
   - Verify webhook secret
   - Check server logs for errors

2. **Payment Not Processing**:
   - Verify API key configuration
   - Check order creation logs
   - Validate customer data

3. **Activation Keys Not Assigned**:
   - Check game inventory
   - Verify webhook processing
   - Check order status updates

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Support

For issues with:
- **Chargily API**: Contact Chargily support
- **Payment Service**: Check application logs
- **Integration**: Review this documentation

## Security Notes

- Never expose API keys in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
- Monitor for suspicious activity
