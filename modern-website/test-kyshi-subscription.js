const testKyshiSubscription = async () => {
  try {
    console.log('Testing Kyshi subscription API...');
    
    // Hardcode values from .env.local for testing
    const apiUrl = 'https://api.kyshi.co/v1';
    const secretKey = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
    
    // Test getting subscription by ID
    const subscriptionId = 'ad8e6b57-278c-4848-a3e9-9fe444542eff';
    console.log('Testing subscription lookup for:', subscriptionId);
    
    const response = await fetch(`${apiUrl}/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Subscription data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
    // Also test listing subscriptions
    console.log('\nTesting subscription list...');
    const listResponse = await fetch(`${apiUrl}/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
    });
    
    console.log('List response status:', listResponse.status);
    
    if (listResponse.ok) {
      const listData = await listResponse.json();
      console.log('Subscription list:', JSON.stringify(listData, null, 2));
    } else {
      const listErrorText = await listResponse.text();
      console.log('List error response:', listErrorText);
    }
    
  } catch (error) {
    console.error('Kyshi subscription test failed:', error);
  }
};

testKyshiSubscription();
