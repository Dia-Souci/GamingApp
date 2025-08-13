const { ChargilyClient } = require('@chargily/chargily-pay');

// Test the Chargily API connection using the official client
async function testChargilyConnection() {
  const apiKey = 'test_sk_5lTxCqaS8jaG1Bo7OR6m2cXA8PufyVNfJmyuBkFQ';
  
  console.log('Testing Chargily API connection with official client...');
  console.log('API Key:', apiKey ? 'Set' : 'Not set');
  
  try {
    // Initialize the Chargily client
    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'test',
    });
    
    console.log('✅ Chargily client initialized successfully');
    
    // Test creating a customer
    console.log('\nTesting customer creation...');
    const customer = await client.createCustomer({
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '123456789',
      metadata: {
        source: 'gaming-app',
        type: 'customer',
      },
    });
    
    console.log('✅ Customer created successfully!');
    console.log('Customer ID:', customer.id);
    console.log('Customer Name:', customer.name);
    console.log('Customer Email:', customer.email);
    
    // Test listing customers
    console.log('\nTesting customer listing...');
    const customers = await client.listCustomers(10);
    
    console.log('✅ Customer listing successful!');
    console.log('Total customers:', customers.data?.length || 0);
    
  } catch (error) {
    console.error('❌ Error testing Chargily API:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testChargilyConnection();
