#!/usr/bin/env node

/**
 * Simple test to verify the new Kyshi endpoints are working locally
 */

const http = require('http');

// Test if the Next.js server is running and endpoints are accessible
function testEndpoint(path, description) {
  return new Promise((resolve) => {
    console.log(`\n--- Testing ${description} ---`);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(data);
          console.log('Response:', parsedData);
        } catch (e) {
          console.log('Response:', data);
        }
        
        if (res.statusCode === 200) {
          console.log(`SUCCESS: ${description} is working`);
          resolve(true);
        } else {
          console.log(`FAILED: ${description} returned ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`ERROR: Could not connect to ${description}`);
      console.log('Make sure your Next.js server is running on port 3000');
      resolve(false);
    });

    req.end();
  });
}

async function runTests() {
  console.log('=== LOCAL KYSHI ENDPOINT TEST ===');
  console.log('Testing if endpoints are accessible locally...');
  console.log('Make sure your Next.js server is running: npm run dev');

  const results = {
    paymentSuccess: await testEndpoint('/api/kyshi/payment-success', 'Payment Success Endpoint'),
    updateCustomer: await testEndpoint('/api/kyshi/update-customer', 'Update Customer Endpoint'),
    webhook: await testEndpoint('/api/webhooks/kyshi', 'Webhook Endpoint')
  };

  console.log('\n=== RESULTS ===');
  console.log('Payment Success:', results.paymentSuccess ? 'PASS' : 'FAIL');
  console.log('Update Customer:', results.updateCustomer ? 'PASS' : 'FAIL');
  console.log('Webhook:', results.webhook ? 'PASS' : 'FAIL');

  const passed = Object.values(results).filter(r => r).length;
  console.log(`\nOverall: ${passed}/3 endpoints working`);

  if (passed === 3) {
    console.log('\nSUCCESS: All endpoints are working!');
    console.log('Your Kyshi data transmission should now be functional.');
  } else {
    console.log('\nSome endpoints are not responding.');
    console.log('Start your server with: npm run dev');
  }
}

runTests().catch(console.error);
