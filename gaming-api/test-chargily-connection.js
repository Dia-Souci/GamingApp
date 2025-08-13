const axios = require('axios');

// Test Chargily API connection with actual credentials
async function testChargilyConnection() {
  const apiKey = 'test_sk_5lTxCqaS8jaG1Bo7OR6m2cXA8PufyVNfJmyuBkFQ';
  const publicKey = 'test_pk_gW1BNU3s2mecjLy3hBLKPUoD2WRqNgeKKekYMaz6';
  
  console.log('🔍 Testing Chargily API connection...');
  console.log('API Key:', apiKey.substring(0, 10) + '...');
  console.log('Public Key:', publicKey.substring(0, 10) + '...');
  
  const baseUrl = 'https://pay.chargily.com/api/v1';
  
  try {
    // Test 1: Check if we can reach the API
    console.log('\n📡 Testing API connectivity...');
    const response = await axios.get(`${baseUrl}/customers`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('✅ API is reachable');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
  } catch (error) {
    console.error('❌ API connection failed');
    
    if (error.code === 'ENOTFOUND') {
      console.error('Domain not found. Please check the API URL.');
    } else if (error.response) {
      console.error('API responded with error:', error.response.status);
      console.error('Error message:', error.response.data);
    } else {
      console.error('Network error:', error.message);
    }
  }
}

// Run the test
testChargilyConnection().catch(console.error);
