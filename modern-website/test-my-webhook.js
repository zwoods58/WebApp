// Test Your Specific Webhook Configuration
const crypto = require('crypto');

const webhookUrl = 'https://atarwebb.com/api/webhooks/kyshi';
const webhookSecret = 'c4accdbb6b2f49608ef729cd9afed411';

const testWebhook = async (eventType, testData) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${eventType}`);
  console.log(`${'='.repeat(60)}`);

  try {
    // Create webhook payload
    const payload = {
      event: eventType,
      data: testData
    };

    const body = JSON.stringify(payload);
    
    // Create signature exactly like Kyshi does
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body, 'utf8')
      .digest('hex');

    console.log('URL:', webhookUrl);
    console.log('Secret:', webhookSecret);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Signature:', `sha256=${signature}`);

    // Send webhook
    console.log('\nSending webhook...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kyshi-signature': `sha256=${signature}`,
        'User-Agent': 'Kyshi-Webhook/1.0'
      },
      body: body
    });

    const result = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('SUCCESS: Webhook processed correctly');
      return true;
    } else {
      console.error('FAILED: Webhook returned error');
      return false;
    }

  } catch (error) {
    console.error('ERROR:', error.message);
    return false;
  }
};

// Test all important webhook events
const runAllTests = async () => {
  console.log('Testing Your Kyshi Webhook Configuration');
  console.log('URL: https://atarwebb.com/api/webhooks/kyshi');
  console.log('Secret: c4accdbb6b2f49608ef729cd9afed411');

  const testSubscriptionId = 'sub_test_' + Date.now();
  const testTransactionId = 'txn_test_' + Date.now();

  const tests = [
    {
      event: 'subscription.created',
      data: {
        id: testSubscriptionId,
        code: 'CODE_' + Date.now(),
        status: 'pending',
        amount: 200,
        currency: 'KES',
        paymentMethod: 'mobile_money',
        customer: {
          email: 'test@example.com',
          phone: '+254712345678'
        },
        plan: {
          name: 'Weekly Kenya Plan',
          amount: 200,
          currency: 'KES'
        }
      }
    },
    {
      event: 'subscription.activated',
      data: {
        id: testSubscriptionId,
        code: 'CODE_' + Date.now(),
        status: 'active',
        startDate: new Date().toISOString(),
        nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        customer: {
          email: 'test@example.com'
        }
      }
    },
    {
      event: 'subscription.payment.succeeded',
      data: {
        id: testTransactionId,
        reference: 'REF_' + Date.now(),
        subscriptionId: testSubscriptionId,
        amount: 200,
        currency: 'KES',
        paymentMethod: 'mobile_money',
        status: 'success',
        processedAt: new Date().toISOString(),
        customer: {
          email: 'test@example.com'
        }
      }
    },
    {
      event: 'subscription.payment.failed',
      data: {
        id: testTransactionId + '_failed',
        reference: 'REF_FAILED_' + Date.now(),
        subscriptionId: testSubscriptionId,
        amount: 200,
        currency: 'KES',
        paymentMethod: 'mobile_money',
        status: 'failed',
        processedAt: new Date().toISOString(),
        customer: {
          email: 'test@example.com'
        }
      }
    }
  ];

  const results = [];

  for (const test of tests) {
    const success = await testWebhook(test.event, test.data);
    results.push({ event: test.event, success });
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('TEST RESULTS SUMMARY');
  console.log(`${'='.repeat(60)}`);
  
  results.forEach(result => {
    console.log(`${result.event}: ${result.success ? 'PASS' : 'FAIL'}`);
  });

  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\nOverall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('SUCCESS: Your webhook is working perfectly!');
  } else {
    console.log('ISSUE: Some webhook events failed. Check the errors above.');
  }
};

// Run the tests
runAllTests().catch(console.error);
