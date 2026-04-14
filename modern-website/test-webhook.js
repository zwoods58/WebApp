// Test script to verify Kyshi webhook endpoint
const webhookUrl = 'https://jonathon-precognizable-contestably.ngrok-free.dev/api/webhooks/kyshi';
const webhookSecret = 'c4accdbb6b2f49608ef729cd9afed411';

// Sample webhook payload (similar to what Kyshi would send)
const samplePayload = {
  event: 'successful',
  data: {
    reference: 'test_ref_' + Date.now(),
    amount: 20000, // 200.00 in cents
    customer: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    },
    meta: {
      localCurrency: 'KES',
      localAmount: 20000,
      feeBreakdown: {
        totalFees: 500
      }
    },
    paidAt: new Date().toISOString()
  }
};

// Generate signature like Kyshi would
const crypto = require('crypto');

function generateSignature(payload, secret) {
  const body = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return `sha256=${signature}`;
}

async function testWebhook() {
  console.log('Testing Kyshi webhook endpoint...');
  console.log('URL:', webhookUrl);
  
  try {
    const body = JSON.stringify(samplePayload);
    const signature = generateSignature(samplePayload, webhookSecret);
    
    console.log('Generated signature:', signature.substring(0, 20) + '...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kyshi-signature': signature
      },
      body: body
    });
    
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);
    
    if (response.ok) {
      console.log('Webhook test successful! The endpoint is working correctly.');
    } else {
      console.log('Webhook test failed. Check the response above.');
    }
    
  } catch (error) {
    console.error('Error testing webhook:', error.message);
  }
}

// Test GET endpoint as well
async function testWebhookGet() {
  console.log('\nTesting webhook GET endpoint...');
  
  try {
    const response = await fetch(webhookUrl);
    const data = await response.json();
    
    console.log('GET Response:', data);
    
  } catch (error) {
    console.error('Error testing GET webhook:', error.message);
  }
}

// Run tests
if (require.main === module) {
  testWebhook().then(() => {
    return testWebhookGet();
  });
}

module.exports = { testWebhook, testWebhookGet, generateSignature };
