const { ChargilyClient } = require('@chargily/chargily-pay');

async function testCheckoutProperties() {
  const apiKey = 'test_sk_5lTxCqaS8jaG1Bo7OR6m2cXA8PufyVNfJmyuBkFQ';
  
  try {
    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'test',
    });
    
    // First create a customer
    const customer = await client.createCustomer({
      name: 'Test Customer',
      email: 'test@example.com',
    });
    
    // Create a product
    const product = await client.createProduct({
      name: 'Test Game',
      description: 'Test game for checkout properties',
    });
    
    // Create a price
    const price = await client.createPrice({
      amount: 1000, // 10 DZD in cents
      currency: 'dzd',
      product_id: product.id,
    });
    
    // Create a checkout
    const checkout = await client.createCheckout({
      items: [{ price: price.id, quantity: 1 }],
      success_url: 'https://example.com/success',
      failure_url: 'https://example.com/failure',
    });
    
    console.log('✅ Checkout created successfully!');
    console.log('Checkout object properties:');
    console.log(JSON.stringify(checkout, null, 2));
    
    // List all properties
    console.log('\nAvailable properties:');
    Object.keys(checkout).forEach(key => {
      console.log(`- ${key}: ${typeof checkout[key]} = ${JSON.stringify(checkout[key])}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCheckoutProperties();
