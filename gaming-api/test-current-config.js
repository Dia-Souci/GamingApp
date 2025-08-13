const { PaymentService } = require('./dist/payment/payment.service');
const { ConfigService } = require('@nestjs/config');

// Mock the dependencies
const mockConfigService = {
  get: (key) => {
    if (key === 'CHARGILY_API_KEY') {
      return 'test_sk_5lTxCqaS8jaG1Bo7OR6m2cXA8PufyVNfJmyuBkFQ';
    }
    if (key === 'NODE_ENV') {
      return 'development';
    }
    return null;
  }
};

const mockOrdersService = {};
const mockGamesService = {};

// Create payment service instance
const paymentService = new PaymentService(mockConfigService, mockOrdersService, mockGamesService);

console.log('Payment Service Configuration:');
console.log('API Key:', paymentService.apiKey ? 'Set' : 'Not set');
console.log('Base URL:', paymentService.baseUrl);
console.log('Mode:', process.env.NODE_ENV || 'development');

// Test the createCustomer method
async function testCreateCustomer() {
  try {
    console.log('\nTesting customer creation...');
    const result = await paymentService.createCustomer({
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '123456789'
    });
    console.log('Customer created successfully:', result);
  } catch (error) {
    console.error('Error creating customer:', error.message);
    console.error('Full error:', error);
  }
}

testCreateCustomer();
