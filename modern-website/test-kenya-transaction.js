// Get detailed transaction info for one Kenya subscription
const testKenyaTransaction = async () => {
  try {
    console.log('Testing Kenya subscription details...');
    
    const apiUrl = 'https://api.kyshi.co/v1';
    const secretKey = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
    
    // Get the most recent Kenya subscription
    const subscriptionCode = 'SUB_fPnLTKDhgWWRv2g';
    
    const response = await fetch(`${apiUrl}/subscriptions/${subscriptionCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
    });
    
    if (response.ok) {
      const subscriptionData = await response.json();
      console.log('Subscription details:', JSON.stringify(subscriptionData, null, 2));
      
      // Check transactions
      if (subscriptionData.transactions && subscriptionData.transactions.length > 0) {
        const transaction = subscriptionData.transactions[0];
        console.log('\nTransaction details:');
        console.log('Reference:', transaction.reference);
        console.log('Status:', transaction.status);
        console.log('Amount:', transaction.amount);
        console.log('Currency:', transaction.currency);
        console.log('Webhook Status:', transaction.webhookStatus);
        console.log('Meta:', transaction.meta);
      }
      
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testKenyaTransaction();
