// Test script to verify redirectUrl parameter is now available in all subscription/charge endpoints
const baseUrl = 'http://localhost:3000';

const endpoints = [
  {
    name: 'Create Subscription',
    path: '/api/kyshi/create-subscription',
    method: 'POST',
    body: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: '+254712345678',
      countryCode: 'KE',
      planId: 'test-plan-id',
      redirectUrl: 'https://example.com/custom-success'
    }
  },
  {
    name: 'Charge Manual',
    path: '/api/kyshi/charge-manual',
    method: 'POST',
    body: {
      subscriptionId: 'test-subscription-id',
      redirectUrl: 'https://example.com/custom-charge-success'
    }
  },
  {
    name: 'Payment Link',
    path: '/api/kyshi/payment-link',
    method: 'POST',
    body: {
      paymentLinkCode: 'test-code',
      customerEmail: 'test@example.com',
      customerFirstName: 'Test',
      customerLastName: 'User',
      countryCode: 'KE',
      redirectUrl: 'https://example.com/custom-payment-success'
    }
  },
  {
    name: 'Subscriptions',
    path: '/api/kyshi/subscriptions',
    method: 'POST',
    body: {
      customerEmail: 'test@example.com',
      planId: 'test-plan-id',
      redirectUrl: 'https://example.com/custom-subscription-success'
    }
  }
];

async function testEndpoint(endpoint) {
  console.log(`\n=== Testing ${endpoint.name} ===`);
  console.log(`Method: ${endpoint.method}`);
  console.log(`Path: ${endpoint.path}`);
  console.log(`Body includes redirectUrl: ${endpoint.body.redirectUrl ? 'YES' : 'NO'}`);
  
  try {
    const response = await fetch(`${baseUrl}${endpoint.path}`, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(endpoint.body)
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.status === 200 || response.status === 201) {
      console.log('Response: SUCCESS');
    } else if (response.status === 400) {
      console.log('Response: BAD REQUEST (expected for test data)');
      const errorText = await response.text();
      console.log('Error details:', errorText.substring(0, 100) + '...');
    } else {
      console.log(`Response: ${response.status}`);
      const responseText = await response.text();
      console.log('Response body:', responseText.substring(0, 100) + '...');
    }
    
    // Check if the endpoint accepts the redirectUrl parameter
    if (response.status === 400) {
      const errorText = await response.text();
      if (errorText.includes('redirectUrl')) {
        console.log('ERROR: Endpoint does not accept redirectUrl parameter');
        return false;
      } else {
        console.log('SUCCESS: Endpoint accepts redirectUrl (error is from other validation)');
        return true;
      }
    }
    
    return true;
  } catch (error) {
    console.log('ERROR: Network error -', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('Testing redirectUrl parameter availability in all endpoints...');
  console.log('Expected: All endpoints should accept redirectUrl in request body');
  
  let results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ name: endpoint.name, success: result });
  }
  
  console.log('\n=== FINAL RESULTS ===');
  const successCount = results.filter(r => r.success).length;
  console.log(`Endpoints tested: ${results.length}`);
  console.log(`Accept redirectUrl: ${successCount}`);
  console.log(`Don't accept redirectUrl: ${results.length - successCount}`);
  
  if (successCount === results.length) {
    console.log('\nSUCCESS: All endpoints now accept redirectUrl parameter!');
  } else {
    console.log('\nISSUE: Some endpoints still don\'t accept redirectUrl');
  }
  
  console.log('\nEndpoint Status:');
  results.forEach(result => {
    console.log(`- ${result.name}: ${result.success ? 'PASS' : 'FAIL'}`);
  });
}

// Run the tests
runAllTests().catch(console.error);
