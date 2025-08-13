const { ChargilyClient } = require('@chargily/chargily-pay');

async function testCheckoutMetadata() {
  const apiKey = 'test_sk_5lTxCqaS8jaG1Bo7OR6m2cXA8PufyVNfJmyuBkFQ';
  
  try {
    const client = new ChargilyClient({
      api_key: apiKey,
      mode: 'test',
    });
    
    // Get the specific checkout that's failing
    const checkoutId = '01k2grq52bnjazf56rpmpmy00k';
    
    console.log(`Fetching checkout: ${checkoutId}`);
    
    const checkout = await client.getCheckout(checkoutId);
    
    console.log('✅ Checkout retrieved successfully!');
    console.log('Checkout metadata:', checkout.metadata);
    console.log('Order number from metadata:', checkout.metadata?.orderNumber);
    console.log('Full checkout object:');
    console.log(JSON.stringify(checkout, null, 2));
    
  } catch (error) {
    console.error('❌ Error fetching checkout:', error.message);
  }
}

testCheckoutMetadata();
