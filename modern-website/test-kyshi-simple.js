// Simple test for Kyshi API using environment variables
const testKyshiAPI = async () => {
  try {
    console.log('Testing Kyshi API connection...');
    
    // Hardcode values from .env.local for testing
    const KYSHI_API_URL = 'https://api.kyshi.co/v1';
    const KYSHI_SECRET_KEY = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
    
    if (!KYSHI_SECRET_KEY) {
      console.error('KYSHI_SECRET_KEY not found in environment');
      return;
    }
    
    console.log('API URL:', KYSHI_API);
    console.log('Secret key found:', KYSHI_SECRET_KEY.substring(0, 8) + '...');
    
    // Test connection by trying to verify a transaction
    const reference = 'ad8e6b57-278c-4848-a3e9-9fe444542eff';
    console.log('Testing transaction verification for:', reference);
    
    const response = await fetch(`${KYSHI_API_URL}/payments/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KYSHI_SECRET_KEY,
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Transaction data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Kyshi API test failed:', error);
  }
};

testKyshiAPI();
