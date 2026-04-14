// Get detailed transaction info for Nigeria and Côte d'Ivoire
const testNigeriaCoteDetails = async () => {
  try {
    console.log('Getting detailed transaction info for Nigeria and Côte d\'Ivoire...');
    
    const apiUrl = 'https://api.kyshi.co/v1';
    const secretKey = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
    
    // Test Nigeria subscription
    console.log('\n=== NIGERIA SUBSCRIPTION ===');
    const nigeriaCode = 'SUB_0GhbYxCbsUDpUOb';
    const nigeriaResponse = await fetch(`${apiUrl}/subscriptions/${nigeriaCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
    });
    
    if (nigeriaResponse.ok) {
      const nigeriaData = await nigeriaResponse.json();
      console.log('Nigeria Subscription:', nigeriaData.data.code);
      console.log('Status:', nigeriaData.data.isActive ? 'ACTIVE' : 'INACTIVE');
      
      if (nigeriaData.data.transactions && nigeriaData.data.transactions.length > 0) {
        const transaction = nigeriaData.data.transactions[0];
        console.log('Transaction Reference:', transaction.reference);
        console.log('Transaction Status:', transaction.status);
        console.log('Amount:', transaction.amount, transaction.currency);
        console.log('Webhook Status:', transaction.webhookStatus);
      }
    }
    
    // Test Côte d'Ivoire subscription
    console.log('\n=== CÔTE D\'IVOIRE SUBSCRIPTION ===');
    const coteCode = 'SUB_noywmX8zU_VBs_2';
    const coteResponse = await fetch(`${apiUrl}/subscriptions/${coteCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': secretKey,
      },
    });
    
    if (coteResponse.ok) {
      const coteData = await coteResponse.json();
      console.log('Côte d\'Ivoire Subscription:', coteData.data.code);
      console.log('Status:', coteData.data.isActive ? 'ACTIVE' : 'INACTIVE');
      
      if (coteData.data.transactions && coteData.data.transactions.length > 0) {
        const transaction = coteData.data.transactions[0];
        console.log('Transaction Reference:', transaction.reference);
        console.log('Transaction Status:', transaction.status);
        console.log('Amount:', transaction.amount, transaction.currency);
        console.log('Webhook Status:', transaction.webhookStatus);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testNigeriaCoteDetails();
