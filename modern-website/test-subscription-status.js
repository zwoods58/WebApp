// Test the subscription status endpoint
const testSubscriptionStatus = async () => {
  try {
    console.log('Testing subscription status endpoint...');
    
    const response = await fetch('http://localhost:3000/api/kyshi/subscription-status?email=ferb@gmail.com', {
      method: 'GET'
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testSubscriptionStatus();
