// Test Kenya subscription status endpoint
const testKenyaStatus = async () => {
  try {
    console.log('Testing Kenya subscription status endpoint...');
    
    const response = await fetch('http://localhost:3000/api/kyshi/subscription-status?email=jsmith@gmail.com', {
      method: 'GET'
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Subscription Summary:', JSON.stringify(data.subscriptionSummary, null, 2));
    console.log('Current Subscription Status:', data.currentSubscription?.status);
    console.log('Total Active Subscriptions:', data.subscriptionSummary?.activeSubscriptions);
    console.log('Total Pending Subscriptions:', data.subscriptionSummary?.pendingSubscriptions);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testKenyaStatus();
