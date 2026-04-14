#!/usr/bin/env node

/**
 * Test script to verify Kyshi data transmission
 * Tests the new endpoints and data flow to Kyshi dashboard
 */

const http = require('http');
const https = require('https');

// Configuration
const BASE_URL = process.env.NGROK_URL || 'https://jonathon-precognizable-contestably.ngrok-free.dev';

console.log('=== KYSHI DATA TRANSMISSION TEST ===');
console.log('Base URL:', BASE_URL);

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.url.startsWith('https') ? https : http;
    const url = new URL(options.url);
    
    const requestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = protocol.request(requestOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(result);
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test 1: Check if payment-success endpoint exists
async function testPaymentSuccessEndpoint() {
  console.log('\n--- Test 1: Payment Success Endpoint ---');
  
  try {
    const response = await makeRequest({
      url: `${BASE_URL}/api/kyshi/payment-success`,
      method: 'GET'
    });

    console.log('Status:', response.status);
    console.log('Response:', response.body);
    
    if (response.status === 200) {
      console.log('SUCCESS: Payment success endpoint is active');
      return true;
    } else {
      console.log('FAILED: Payment success endpoint not working');
      return false;
    }
  } catch (error) {
    console.log('ERROR: Payment success endpoint test failed:', error.message);
    return false;
  }
}

// Test 2: Check if update-customer endpoint exists
async function testUpdateCustomerEndpoint() {
  console.log('\n--- Test 2: Update Customer Endpoint ---');
  
  try {
    const response = await makeRequest({
      url: `${BASE_URL}/api/kyshi/update-customer`,
      method: 'GET'
    });

    console.log('Status:', response.status);
    console.log('Response:', response.body);
    
    if (response.status === 200) {
      console.log('SUCCESS: Update customer endpoint is active');
      return true;
    } else {
      console.log('FAILED: Update customer endpoint not working');
      return false;
    }
  } catch (error) {
    console.log('ERROR: Update customer endpoint test failed:', error.message);
    return false;
  }
}

// Test 3: Test customer data update
async function testCustomerDataUpdate() {
  console.log('\n--- Test 3: Customer Data Update ---');
  
  const testData = {
    email: 'test@example.com',
    businessData: {
      business_type: 'small_business',
      industry: 'retail',
      customer_name: 'Test Customer',
      customer_phone: '+254123456789',
      source: 'test_script'
    },
    industry: 'retail',
    businessType: 'small_business',
    additionalMetadata: {
      test_source: 'kyshi_data_transmission_test'
    }
  };

  try {
    const response = await makeRequest({
      url: `${BASE_URL}/api/kyshi/update-customer`,
      method: 'POST'
    }, testData);

    console.log('Status:', response.status);
    console.log('Response:', response.body);
    
    if (response.status === 200 && response.body?.success) {
      console.log('SUCCESS: Customer data update works');
      return true;
    } else {
      console.log('FAILED: Customer data update not working');
      return false;
    }
  } catch (error) {
    console.log('ERROR: Customer data update test failed:', error.message);
    return false;
  }
}

// Test 4: Test webhook simulation
async function testWebhookSimulation() {
  console.log('\n--- Test 4: Webhook Simulation ---');
  
  const webhookData = {
    event: 'successful',
    data: {
      reference: 'test_ref_' + Date.now(),
      amount: 20000,
      customer: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'Customer',
        currencyCode: 'KES'
      },
      meta: {
        localCurrency: 'KES',
        localAmount: 20000
      }
    }
  };

  try {
    const response = await makeRequest({
      url: `${BASE_URL}/api/webhooks/kyshi`,
      method: 'POST',
      headers: {
        'x-kyshi-signature': 'test_signature'
      }
    }, webhookData);

    console.log('Status:', response.status);
    console.log('Response:', response.body);
    
    if (response.status === 200) {
      console.log('SUCCESS: Webhook processing works');
      return true;
    } else {
      console.log('FAILED: Webhook processing not working');
      return false;
    }
  } catch (error) {
    console.log('ERROR: Webhook test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    paymentSuccess: await testPaymentSuccessEndpoint(),
    updateCustomer: await testUpdateCustomerEndpoint(),
    customerDataUpdate: await testCustomerDataUpdate(),
    webhookSimulation: await testWebhookSimulation()
  };

  console.log('\n=== TEST RESULTS SUMMARY ===');
  console.log('Payment Success Endpoint:', results.paymentSuccess ? 'PASS' : 'FAIL');
  console.log('Update Customer Endpoint:', results.updateCustomer ? 'PASS' : 'FAIL');
  console.log('Customer Data Update:', results.customerDataUpdate ? 'PASS' : 'FAIL');
  console.log('Webhook Simulation:', results.webhookSimulation ? 'PASS' : 'FAIL');

  const passedTests = Object.values(results).filter(result => result).length;
  const totalTests = Object.keys(results).length;

  console.log(`\nOverall: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('SUCCESS: All data transmission tests passed!');
    console.log('Your Kyshi data transmission should now be working correctly.');
  } else {
    console.log('ISSUE: Some tests failed. Check the logs above for details.');
  }
}

// Run the tests
runAllTests().catch(console.error);
