// Test script for Kyshi API integration
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testDebugEndpoint() {
  console.log('Testing debug endpoint...');
  try {
    const response = await fetch(`${BASE_URL}/api/debug/env`);
    const data = await response.json();
    console.log('Debug endpoint response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Debug endpoint error:', error.message);
    return null;
  }
}

async function testSubscriptionPlans() {
  console.log('\nTesting subscription plans...');
  try {
    // Test getting plans for Kenya
    const response = await fetch(`${BASE_URL}/api/subscription/plans?country=KE`);
    const data = await response.json();
    console.log('Plans response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Plans endpoint error:', error.message);
    return null;
  }
}

async function testSubscriptionCreation() {
  console.log('\nTesting subscription creation...');
  try {
    const subscriptionData = {
      user_id: 'test-user-id',
      user_email: 'test@example.com',
      user_phone: '+254712345678',
      country: 'Kenya',
      full_name: 'Test User'
    };

    const response = await fetch(`${BASE_URL}/api/subscription/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionData)
    });

    const data = await response.json();
    console.log('Subscription creation response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Subscription creation error:', error.message);
    return null;
  }
}

async function testPaymentStatus() {
  console.log('\nTesting payment status...');
  try {
    const response = await fetch(`${BASE_URL}/api/payment/status?reference=test-ref-123`);
    const data = await response.json();
    console.log('Payment status response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Payment status error:', error.message);
    return null;
  }
}

async function testWebhookEndpoint() {
  console.log('\nTesting webhook endpoint...');
  try {
    const webhookData = {
      event: 'subscription.created',
      data: {
        id: 'test-subscription-id',
        email: 'test@example.com',
        status: 'active'
      }
    };

    const response = await fetch(`${BASE_URL}/api/webhooks/kyshi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-kyshi-signature': 'test-signature'
      },
      body: JSON.stringify(webhookData)
    });

    const data = await response.json();
    console.log('Webhook response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Webhook endpoint error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('=== Kyshi API Integration Tests ===\n');
  
  // Test 1: Debug endpoint
  await testDebugEndpoint();
  
  // Test 2: Subscription plans
  await testSubscriptionPlans();
  
  // Test 3: Subscription creation
  await testSubscriptionCreation();
  
  // Test 4: Payment status
  await testPaymentStatus();
  
  // Test 5: Webhook endpoint
  await testWebhookEndpoint();
  
  console.log('\n=== Tests Complete ===');
}

runTests();
