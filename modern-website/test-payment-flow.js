// Payment Flow Test Script
// Tests the complete flow: Frontend -> Database -> Kyshi API -> Webhook

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Configuration
const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key',
  kyshiSecretKey: process.env.KYSHI_SECRET_KEY || 'sk_test_3dd6532c95634d1da5888520b9bf96c8',
  kyshiWebhookSecret: process.env.KYSHI_WEBHOOK_SECRET || 'your-webhook-secret',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
};

// Initialize Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

// Test data
const testUser = {
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phone: '+254712345678',
  country: 'Kenya'
};

const testPlans = {
  Kenya: {
    planCode: 'PLN_MVyWThBVJ1Np0IB',
    amount: 200,
    currency: 'KES',
    paymentMethod: 'mobile_money',
    mobileMoneyProvider: 'm-pesa'
  },
  Nigeria: {
    planCode: 'PLN_iiRmmGJcnQy5paj',
    amount: 500,
    currency: 'NGN',
    paymentMethod: 'bank_transfer'
  },
  Ghana: {
    planCode: 'PLN_WQN3ZhV2AX-knWQ',
    amount: 20,
    currency: 'GHS',
    paymentMethod: 'mobile_money',
    mobileMoneyProvider: 'mtn'
  }
};

console.log('🚀 Starting Payment Flow Test...\n');

// Test 1: Database Connection
async function testDatabaseConnection() {
  console.log('📊 Test 1: Database Connection');
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    return false;
  }
}

// Test 2: Create Test Subscription in Database
async function createTestSubscription() {
  console.log('\n💾 Test 2: Create Test Subscription in Database');
  try {
    const plan = testPlans[testUser.country];
    const subscriptionData = {
      user_id: 'test-user-' + Date.now(),
      user_email: testUser.email,
      user_phone: testUser.phone,
      user_name: `${testUser.firstName} ${testUser.lastName}`,
      country: testUser.country,
      amount: plan.amount,
      currency: plan.currency,
      payment_method: plan.paymentMethod,
      kyshi_subscription_id: null,
      kyshi_subscription_code: null,
      kyshi_plan_code: plan.planCode,
      status: 'pending',
      is_active: false,
      next_charge_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to create subscription:', error.message);
      return null;
    }

    console.log('✅ Test subscription created:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Error creating subscription:', error.message);
    return null;
  }
}

// Test 3: Call Kyshi API Directly
async function testKyshiAPI(subscription) {
  console.log('\n🔗 Test 3: Call Kyshi API Directly');
  try {
    const plan = testPlans[testUser.country];
    
    const payload = {
      planCode: plan.planCode,
      customer: testUser.email,
      paymentMethod: plan.paymentMethod,
      redirectUrl: `${config.appUrl}/subscription/callback?user_id=${subscription.user_id}&country=${testUser.country}`
    };

    // Add mobile money provider if required
    if (plan.mobileMoneyProvider) {
      payload.mobileMoneyProvider = plan.mobileMoneyProvider;
    }

    console.log('📤 Sending to Kyshi:', payload);

    const response = await fetch('https://api.kyshi.co/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.kyshiSecretKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Kyshi API error:', data);
      return null;
    }

    if (!data.status) {
      console.error('❌ Kyshi subscription creation failed:', data.message);
      return null;
    }

    console.log('✅ Kyshi subscription created:', data.data.id);
    console.log('🔗 Payment URL:', data.data.authorizationUrl || data.data.checkoutUrl);
    
    return data.data;
  } catch (error) {
    console.error('❌ Kyshi API error:', error.message);
    return null;
  }
}

// Test 4: Update Database with Kyshi Response
async function updateDatabaseWithKyshiData(subscription, kyshiData) {
  console.log('\n🔄 Test 4: Update Database with Kyshi Response');
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        kyshi_subscription_id: kyshiData.id,
        kyshi_subscription_code: kyshiData.code,
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    if (error) {
      console.error('❌ Failed to update database:', error.message);
      return false;
    }

    console.log('✅ Database updated with Kyshi data');
    return true;
  } catch (error) {
    console.error('❌ Error updating database:', error.message);
    return false;
  }
}

// Test 5: Simulate Webhook
async function testWebhook(kyshiData) {
  console.log('\n🪝 Test 5: Simulate Webhook');
  try {
    // Simulate subscription.activated webhook
    const webhookEvent = {
      event: 'subscription.activated',
      data: {
        id: kyshiData.id,
        code: kyshiData.code,
        status: 'active',
        startDate: new Date().toISOString(),
        nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }
    };

    // Create webhook signature
    const body = JSON.stringify(webhookEvent);
    const signature = crypto
      .createHmac('sha256', config.kyshiWebhookSecret)
      .update(body, 'utf8')
      .digest('hex');

    console.log('📤 Sending webhook event:', webhookEvent.event);

    const response = await fetch(`${config.appUrl}/api/webhooks/kyshi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kyshi-signature': `sha256=${signature}`
      },
      body: body
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Webhook failed:', result);
      return false;
    }

    console.log('✅ Webhook processed successfully');
    console.log('📊 Webhook response:', result);
    return true;
  } catch (error) {
    console.error('❌ Webhook error:', error.message);
    return false;
  }
}

// Test 6: Verify Final State
async function verifyFinalState(subscriptionId) {
  console.log('\n🔍 Test 6: Verify Final State');
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (error) {
      console.error('❌ Failed to verify final state:', error.message);
      return false;
    }

    console.log('✅ Final subscription state:');
    console.log('   Status:', data.status);
    console.log('   Is Active:', data.is_active);
    console.log('   Kyshi ID:', data.kyshi_subscription_id);
    console.log('   Updated At:', data.updated_at);

    // Check if transaction was created
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .eq('subscription_id', data.kyshi_subscription_id);

    if (!transError && transactions.length > 0) {
      console.log('✅ Transaction records found:', transactions.length);
    } else {
      console.log('ℹ️  No transaction records found (expected for activation webhook)');
    }

    return true;
  } catch (error) {
    console.error('❌ Error verifying final state:', error.message);
    return false;
  }
}

// Main test function
async function runPaymentFlowTest() {
  console.log('🎯 Testing Payment Flow for:', testUser.country);
  console.log('👤 Test User:', testUser.email);
  
  const results = [];
  
  // Run all tests
  results.push(await testDatabaseConnection());
  
  const subscription = await createTestSubscription();
  results.push(subscription !== null);
  
  if (subscription) {
    const kyshiData = await testKyshiAPI(subscription);
    results.push(kyshiData !== null);
    
    if (kyshiData) {
      results.push(await updateDatabaseWithKyshiData(subscription, kyshiData));
      results.push(await testWebhook(kyshiData));
      results.push(await verifyFinalState(subscription.id));
    } else {
      results.push(false);
      results.push(false);
      results.push(false);
    }
  } else {
    results.push(false);
    results.push(false);
    results.push(false);
    results.push(false);
  }
  
  // Summary
  console.log('\n📋 Test Results Summary:');
  console.log('1. Database Connection:', results[0] ? '✅' : '❌');
  console.log('2. Create Subscription:', results[1] ? '✅' : '❌');
  console.log('3. Kyshi API Call:', results[2] ? '✅' : '❌');
  console.log('4. Database Update:', results[3] ? '✅' : '❌');
  console.log('5. Webhook Processing:', results[4] ? '✅' : '❌');
  console.log('6. Final Verification:', results[5] ? '✅' : '❌');
  
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Payment flow is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }
}

// Check environment variables
function checkEnvironment() {
  console.log('🔧 Checking Environment Variables:');
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'KYSHI_SECRET_KEY',
    'KYSHI_WEBHOOK_SECRET'
  ];
  
  let allSet = true;
  
  required.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${varName.includes('SECRET') || varName.includes('KEY') ? '***SET***' : value}`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
      allSet = false;
    }
  });
  
  if (!allSet) {
    console.log('\n⚠️  Some environment variables are missing. Please set them before running the test.');
    console.log('You can set them in your .env.local file or as environment variables.');
    return false;
  }
  
  return true;
}

// Run the test
if (checkEnvironment()) {
  runPaymentFlowTest().catch(console.error);
} else {
  console.log('\n❌ Cannot run test due to missing environment variables.');
}
