// Test Kenya subscriptions to see which ones need fixing
const testKenyaSubscriptions = async () => {
  try {
    console.log('Testing Kenya subscriptions...');
    
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
      
      // Filter for jsmith@gmail.com subscriptions
      const kenyaSubs = subscriptions.filter(sub => 
        sub.customer.email === 'jsmith@gmail.com'
      );
      
      console.log(`Found ${kenyaSubs.length} subscriptions for jsmith@gmail.com:`);
      
      kenyaSubs.forEach(sub => {
        console.log(`\nSubscription: ${sub.code}`);
        console.log(`Status: ${sub.isActive ? 'ACTIVE' : 'INACTIVE'}`);
        console.log(`Plan: ${sub.plan.name} (${sub.plan.amount} ${sub.plan.currency})`);
        console.log(`Created: ${sub.createdAt}`);
        
        // Check transaction status
        if (sub.transactions && sub.transactions.length > 0) {
          const transaction = sub.transactions[0];
          console.log(`Transaction: ${transaction.reference}`);
          console.log(`Transaction Status: ${transaction.status}`);
          console.log(`Webhook Status: ${transaction.webhookStatus}`);
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

testKenyaSubscriptions();
