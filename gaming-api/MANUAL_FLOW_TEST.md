# Manual Payment Flow Testing Guide

This guide explains how to test the payment flow manually without webhooks.

## Prerequisites

1. Backend API running on `http://localhost:3000`
2. Admin dashboard running on `http://localhost:5173`
3. User frontend running on `http://localhost:5174`
4. At least one game with activation keys in the database

## Testing Steps

### 1. Create an Order (User Frontend)

1. Go to `http://localhost:5174`
2. Add games to cart
3. Proceed to checkout
4. Fill in customer information
5. Click "Proceed to Payment"
6. You'll be redirected to Chargily checkout page

### 2. Simulate Payment Completion

Since we're not using webhooks, you can:
- Complete the payment on Chargily (if using real credentials)
- Or just close the Chargily page and proceed to manual confirmation

### 3. Manual Payment Confirmation (Admin Dashboard)

1. Go to `http://localhost:5173`
2. Navigate to Orders page
3. Find the order you just created
4. Click the "View" button to open order details
5. In the "Manual Flow Completion" section:
   - Click "Confirm Payment (Manual)" to mark the order as paid
   - Click "Assign Keys & Deliver" to assign activation keys and mark as delivered

### 4. Verify Order Status

After completing the manual steps:
- Order status should be "delivered"
- Payment status should be "paid"
- Order items should show "✓ Key Delivered"
- Activation keys should be assigned to each item

## API Endpoints for Manual Flow

### Confirm Payment
```
POST /api/orders/admin/{orderNumber}/confirm-payment
Authorization: Bearer {admin_token}
```

### Assign Keys and Deliver
```
POST /api/orders/admin/{orderNumber}/assign-keys-and-deliver
Authorization: Bearer {admin_token}
```

## Troubleshooting

### "No activation keys available"
- Make sure the game has activation keys in the database
- Use the Inventory page in admin dashboard to add activation keys

### "Order is already paid/delivered"
- Check the current order status before attempting manual actions
- Each action can only be performed once

### Authentication errors
- Make sure you're logged in as an admin user
- Check that the JWT token is valid

## Notes

- This manual flow is for development/testing purposes only
- In production, webhooks should be configured for automatic payment processing
- The manual buttons are clearly marked in the admin dashboard
- All manual actions are logged in the order timeline
