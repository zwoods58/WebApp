// Webhook Test Script
// Tests the Kyshi webhook endpoint

const crypto = require('crypto');

const testWebhook = async (eventType, eventData) => {
  console.log(`🪝 Testing Webhook: ${eventType}\n`);

  try {
    // Webhook configuration
    const webhookSecret = process.env.KYSHI_WEBHOOK_SECRET || 'c4accdbb6b2f49608ef729cd9afed411';
    const appUrl = 'https://atarwebb.com';

    if (!webhookSecret) {
      throw new Error('KYSHI_WEBHOOK_SECRET not set');
    }

    // Create webhook payload
    const payload = {
      event: eventType,
      data: eventData
    };

    const body = JSON.stringify(payload);
    
    // Create webhook signature (Kyshi sends it as: sha256=<signature>)
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body, 'utf8')
      .digest('hex');

    console.log('📤 Webhook payload:', JSON.stringify(payload, null, 2));
    console.log('🔐 Signature:', `sha256=${signature}`);

    // Send webhook
    const response = await fetch('https://atarwebb.com/api/webhooks/kyshi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kyshi-signature': `sha256=${signature}`
      },
      body: body
    });

    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response body:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error('❌ Webhook failed:', result.error);
      return false;
    }

    console.log('✅ Webhook processed successfully');
    return true;

  } catch (error) {
    console.error('❌ Webhook test error:', error.message);
    return false;
  }
};

// Test different webhook events
const testAllWebhooks = async () => {
  console.log('🚀 Starting Webhook Tests\n');

  // Test data
  const testSubscriptionId = 'sub_test_' + Date.now();
  const testTransactionId = 'txn_test_' + Date.now();

  const testCases = [
    {
      eventType: 'subscription.created',
      eventData: {
        id: testSubscriptionId,
        code: 'CODE_' + Date.now(),
        status: 'pending',
        amount: 200,
        currency: 'KES',
        paymentMethod: 'mobile_money'
      }
    },
    {
      eventType: 'subscription.activated',
      eventData: {
        id: testSubscriptionId,
        code: 'CODE_' + Date.now(),
        status: 'active',
        startDate: new Date().toISOString(),
        nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      eventType: 'subscription.payment.succeeded',
      eventData: {
        id: testTransactionId,
        reference: 'REF_' + Date.now(),
        subscriptionId: testSubscriptionId,
        amount: 200,
        currency: 'KES',
        paymentMethod: 'mobile_money',
        processedAt: new Date().toISOString(),
        nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      eventType: 'subscription.payment.failed',
      eventData: {
        id: testTransactionId + '_failed',
        reference: 'REF_FAILED_' + Date.now(),
        subscriptionId: testSubscriptionId,
        amount: 200,
        currency: 'KES',
        paymentMethod: 'mobile_money',
        processedAt: new Date().toISOString()
      }
    },
    {
      eventType: 'subscription.cancelled',
      eventData: {
        id: testSubscriptionId,
        code: 'CODE_' + Date.now(),
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      }
    }
  ];

  const results = [];

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(50)}`);
    const success = await testWebhook(testCase.eventType, testCase.eventData);
    results.push({ event: testCase.eventType, success });
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📋 Webhook Test Results Summary:');
  
  results.forEach(result => {
    console.log(`${result.event}: ${result.success ? '✅' : '❌'}`);
  });

  const passedTests = results.filter(r => r.success).length;
  const totalTests = results.length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} webhooks processed successfully`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All webhook tests passed!');
  } else {
    console.log('⚠️  Some webhook tests failed. Please check the errors above.');
  }
};

// Check environment
const checkEnvironment = () => {
  console.log('🔧 Checking Environment Variables:');
  
  const required = [
    'NEXT_PUBLIC_APP_URL'
  ];
  
  let allSet = true;
  
  required.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${varName.includes('SECRET') ? '***SET***' : value}`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
      allSet = false;
    }
  });
  
  return allSet;
};

// Run tests
if (checkEnvironment()) {
  testAllWebhooks().catch(console.error);
} else {
  console.log('\n❌ Cannot run webhook tests due to missing environment variables.');
}
