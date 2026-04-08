// Check webhook endpoint status and available plans
const checkWebhookStatus = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/webhook/kyshi');
    const status = await response.json();
    
    console.log('=== Kyshi Webhook Status ===');
    console.log('Status:', status.status);
    console.log('Message:', status.message);
    console.log('');
    console.log('Available Subscription Plans:');
    status.subscriptionPlans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name}`);
      console.log(`   ID: ${plan.id}`);
      console.log(`   Amount: ${plan.amount} ${plan.currency}`);
      console.log(`   Interval: ${plan.interval}`);
      console.log('');
    });
    
    console.log('Supported Events:');
    status.supportedEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event}`);
    });
    
  } catch (error) {
    console.error('Failed to check webhook status:', error);
  }
};

// Run the check
checkWebhookStatus();
