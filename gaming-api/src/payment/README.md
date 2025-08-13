# Payment Service

This payment service integrates Chargily API for processing payments in the gaming application.

## Features

- **Payment Processing**: Complete payment flow from order creation to payment confirmation
- **Webhook Handling**: Secure webhook processing for payment status updates
- **Activation Key Management**: Automatic assignment of game activation keys after successful payment
- **Refund Processing**: Support for payment refunds
- **Guest Order Support**: Handles both authenticated and guest user orders

## API Endpoints

### Payment Initiation
```
POST /payment/initiate
```
Initiates a payment for an order. Creates the order, customer, product, and checkout session.

**Query Parameters:**
- `sessionId`: Cart session ID
- `successUrl`: URL to redirect after successful payment
- `failureUrl`: URL to redirect after failed payment

**Body:** `CreateOrderDto`

### Get Checkout Session
```
GET /payment/checkout/:checkoutId
```
Retrieves details of a specific checkout session.

### Process Refund
```
POST /payment/refund/:checkoutId
```
Processes a refund for a payment.

**Body:**
```json
{
  "amount": 1000 // Optional: specific amount to refund
}
```

### Webhook Endpoint
```
POST /payment/webhook/chargily
```
Handles Chargily webhook events for payment status updates.

### Payment Callbacks
```
GET /payment/success?checkout_id=xxx
GET /payment/failure?checkout_id=xxx
```
Callback endpoints for frontend redirects after payment completion.

### Health Check
```
GET /payment/health
```
Health check endpoint for the payment service.

## Environment Variables

Add these to your `.env` file:

```env
# Chargily Configuration
CHARGILY_API_KEY=your_chargily_api_key_here
CHARGILY_WEBHOOK_SECRET=your_webhook_secret_here

# Environment
NODE_ENV=development # or production
```

## Payment Flow

1. **Order Creation**: Creates a guest order with pending status
2. **Customer Creation**: Creates customer in Chargily
3. **Product Creation**: Creates product in Chargily for the game
4. **Price Creation**: Creates price for the product
5. **Checkout Creation**: Creates checkout session with success/failure URLs
6. **Payment Processing**: User completes payment on Chargily
7. **Webhook Processing**: Chargily sends webhook with payment status
8. **Order Update**: Updates order status and assigns activation keys
9. **Completion**: User receives activation keys

## Webhook Events

The service handles these Chargily webhook events:

- `checkout.paid`: Payment successful - updates order to confirmed and assigns activation keys
- `checkout.failed`: Payment failed - updates order to cancelled
- `checkout.expired`: Payment expired - updates order to cancelled

## Security

- Webhook signature verification using HMAC SHA256
- Environment-based API key configuration
- Proper error handling and logging

## Integration

The payment service integrates with:

- **Orders Service**: For order creation and status updates
- **Games Service**: For game details and activation key management
- **Cart Service**: For cart validation and clearing

## Error Handling

The service includes comprehensive error handling for:

- Invalid webhook signatures
- Missing or invalid data
- Payment processing failures
- Activation key assignment issues
- Network and API errors

## Testing

To test the payment service:

1. Set up test environment variables
2. Use Chargily test mode
3. Test webhook endpoints with valid signatures
4. Verify order status updates
5. Check activation key assignment

## Production Considerations

- Use production Chargily API keys
- Set up proper webhook URLs in Chargily dashboard
- Monitor webhook delivery and processing
- Implement proper logging and monitoring
- Set up error alerting for failed payments
