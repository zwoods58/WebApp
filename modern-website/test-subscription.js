// Test script for subscription webhook functionality
const testWebhook = async () => {
  console.log('Testing subscription webhook...');
  
  const webhookPayload = {
    event: 'subscription.created',
    data: {
      subscription: {
        id: `sub_test_${Date.now()}_plan_ke_weekly`,
        customer: {
          id: `cust_${Date.now()}`,
          email: 'test.kenya@example.com',
          currencyCode: 'KES'
        },
        plan: {
          id: 'plan_ke_weekly',
          name: 'Kenya Weekly Plan',
          amount: 200,
          currency: 'KES',
          interval: 'weekly',
          code: 'KE_WEEKLY_200'
        },
        startDate: new Date().toISOString(),
        nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        reference: `kyshi_ref_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/webhook/kyshi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    const result = await response.json();
    console.log('Webhook Response:', result);
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testWebhook();
