const testKyshiAPI = async () => {
  try {
    console.log('Testing Kyshi API connection...');
    
    // Hardcode values from .env.local for testing
    const apiUrl = 'https://api.kyshi.co/v1';
    const secretKey = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
    
    console.log('API URL:', apiUrl);
    console.log('Secret key found:', secretKey.substring(0, 8) + '...');
    
    // Test connection by trying to verify a transaction
    const reference = 'ad8e6b57-278c-4848-a3e9-9fe444542eff';
    console.log('Testing transaction verification for:', reference);
    
    const response = await fetch(`${apiUrl}/payments/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
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
