const { ChargilyClient } = require('@chargily/chargily-pay');

async function testCustomerValidation() {
  const apiKey = 'test_sk_5lTxCqaS8jaG1Bo7OR6m2cXA8PufyVNfJmyuBkFQ';
  
  try {
    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'test',
    });
    
    // Test with the exact data that's failing
    const customerData = {
      name: 'Test Case 1',
      email: 'MAILER@gmail.com',
      phone: '+213556389404', // Format with country code
      address: {
        country: 'DZ',
        state: 'Batna',
        address: 'Test Address', // Add a proper address
      },
      metadata: {
        source: 'gaming-app',
        type: 'customer',
      },
    };
    
    console.log('Testing customer creation with data:', customerData);
    
    const customer = await client.createCustomer(customerData);
    
    console.log('✅ Customer created successfully!');
    console.log('Customer ID:', customer.id);
    console.log('Customer Name:', customer.name);
    console.log('Customer Email:', customer.email);
    
  } catch (error) {
    console.error('❌ Error creating customer:');
    console.error('Error message:', error.message);
    
    // Try to get more details about the error
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // Test with minimal data
    console.log('\n--- Testing with minimal data ---');
    try {
      const minimalCustomer = await client.createCustomer({
        name: 'Test Customer',
        email: 'test@example.com',
      });
      console.log('✅ Minimal customer created successfully!');
    } catch (minimalError) {
      console.error('❌ Minimal customer also failed:', minimalError.message);
    }
  }
}

testCustomerValidation();
