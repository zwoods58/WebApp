// Test Nigeria and Côte d'Ivoire subscriptions
const testNigeriaCoteSubscriptions = async () => {
  try {
    console.log('Testing Nigeria and Côte d\'Ivoire subscriptions...');
    
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
      
      // Filter for test.kyshi@example.com subscriptions
      const testSubs = subscriptions.filter(sub => 
        sub.customer.email === 'test.kyshi@example.com'
      );
      
      console.log(`Found ${testSubs.length} subscriptions for test.kyshi@example.com:`);
      
      testSubs.forEach(sub => {
        console.log(`\nSubscription: ${sub.code}`);
        console.log(`Status: ${sub.isActive ? 'ACTIVE' : 'INACTIVE'}`);
        console.log(`Plan: ${sub.plan.name} (${sub.plan.amount} ${sub.plan.currency || sub.plan.currencyCode})`);
        console.log(`Created: ${sub.createdAt}`);
        
        // Check transaction details
        if (sub.transactions && sub.transactions.length > 0) {
          const transaction = sub.transactions[0];
          console.log(`Transaction: ${transaction.reference}`);
          console.log(`Transaction Status: ${transaction.status}`);
          console.log(`Webhook Status: ${transaction.webhookStatus}`);
          console.log(`Amount: ${transaction.amount} ${transaction.currency}`);
        }
      });
      
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testNigeriaCoteSubscriptions();
