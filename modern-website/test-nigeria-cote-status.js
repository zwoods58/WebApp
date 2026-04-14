// Test Nigeria and Côte d'Ivoire subscription status
const testNigeriaCoteStatus = async () => {
  try {
    console.log('Testing Nigeria and Côte d\'Ivoire subscription status...');
    
    const response = await fetch('http://localhost:3000/api/kyshi/subscription-status?email=test.kyshi@example.com', {
      method: 'GET'
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Subscription Summary:', JSON.stringify(data.subscriptionSummary, null, 2));
    console.log('Current Subscription Status:', data.currentSubscription?.status);
    console.log('Total Active Subscriptions:', data.subscriptionSummary?.activeSubscriptions);
    console.log('Total Pending Subscriptions:', data.subscriptionSummary?.pendingSubscriptions);
    
    // Show breakdown by country
    console.log('\n=== SUBSCRIPTIONS BY COUNTRY ===');
    const subscriptionsByCountry = {};
    
    data.subscriptions?.forEach(sub => {
      const country = sub.country_code;
      if (!subscriptionsByCountry[country]) {
        subscriptionsByCountry[country] = [];
      }
      subscriptionsByCountry[country].push(sub);
    });
    
    Object.keys(subscriptionsByCountry).forEach(country => {
      const subs = subscriptionsByCountry[country];
      const activeCount = subs.filter(s => s.status === 'active').length;
      const totalCount = subs.length;
      console.log(`${country}: ${activeCount}/${totalCount} active`);
    });
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testNigeriaCoteStatus();
