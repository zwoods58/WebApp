// Simple webhook test
const testSimpleWebhook = async () => {
  try {
    const webhookUrl = 'https://jonathon-precognizable-contestably.ngrok-free.dev/api/webhooks/kyshi/';
    
    const webhookPayload = {
      event: 'successful',
      data: {
        reference: 'SIMPLE-TEST-' + Date.now(),
        amount: 2000,
        currency: 'GHS',
        customer: {
          email: 'test.webhook@example.com',
          firstName: 'Test',
          lastName: 'Webhook'
        },
        meta: {
          localCurrency: 'GHS',
          localAmount: 2000
        }
      }
    };
    
    // Generate signature
    const crypto = require('crypto');
    const webhookSecret = 'c4accdbb6b2f49608ef729cd9afed411';
    const payloadString = JSON.stringify(webhookPayload);
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payloadString)
      .digest('hex');
    
    console.log('Sending webhook...');
    console.log('Reference:', webhookPayload.data.reference);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kyshi-signature': `sha256=${signature}`
      },
      body: payloadString
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Success:', result);
    } else {
      const error = await response.text();
      console.log('Error:', error.substring(0, 200));
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testSimpleWebhook();
