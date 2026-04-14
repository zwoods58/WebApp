const testRecentSubscriptions = async () => {
  try {
    console.log('Testing recent Kyshi subscriptions...');
    
    const apiUrl = 'https://api.kyshi.co/v1';
    const secretKey = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
    
    const response = await fetch(`${apiUrl}/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      
      const subscriptions = data.data?.data || [];
      console.log(`Total subscriptions found: ${subscriptions.length}`);
      
      // Filter for recent subscriptions (created in last 24 hours)
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentSubs = subscriptions.filter(sub => {
        const createdAt = new Date(sub.createdAt);
        return createdAt >= yesterday;
      });
      
      console.log(`Found ${recentSubs.length} recent subscriptions:`);
      
      recentSubs.forEach(sub => {
        console.log(`\nSubscription: ${sub.code}`);
        console.log(`Email: ${sub.customer.email}`);
        console.log(`Status: ${sub.isActive ? 'ACTIVE' : 'INACTIVE'}`);
        console.log(`Plan: ${sub.plan.name} (${sub.plan.amount} ${sub.plan.interval})`);
        console.log(`Created: ${sub.createdAt}`);
        console.log(`Next Payment: ${sub.nextPaymentDate}`);
      });
      
      // Look specifically for ferb@gmail.com subscriptions
      const ferbSubs = subscriptions.filter(sub => 
        sub.customer.email === 'ferb@gmail.com'
      );
      
      console.log(`\n\nFound ${ferbSubs.length} subscriptions for ferb@gmail.com:`);
      ferbSubs.forEach(sub => {
        console.log(`\nSubscription: ${sub.code}`);
        console.log(`Status: ${sub.isActive ? 'ACTIVE' : 'INACTIVE'}`);
        console.log(`Plan: ${sub.plan.name}`);
        console.log(`Created: ${sub.createdAt}`);
        console.log(`Next Payment: ${sub.nextPaymentDate}`);
      });
      
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testRecentSubscriptions();
