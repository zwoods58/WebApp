/**
 * Test script to verify transactions API authentication is working correctly
 * This tests both success and failure scenarios
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const apiUrl = 'https://www.atarwebb.com/api/transactions';

async function testTransactionsAPI() {
  console.log('=== Testing Transactions API Authentication ===\n');

  // Test 1: Try without authorization header
  console.log('Test 1: Call API without Authorization header');
  try {
    const testTransaction = {
      business_id: 'test-business-id',
      type: 'sale',
      industry: 'retail',
      amount: 700,
      currency: 'KES',
      category: 'sales',
      description: 'Test transaction',
      customer_name: 'Test Customer',
      payment_method: 'cash',
      transaction_date: '2024-01-01'
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTransaction)
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (response.status === 401) {
      console.log('Correctly rejected without auth token');
    } else {
      console.log('Unexpected - should have been 401 Unauthorized');
    }
  } catch (err) {
    console.log('Network error:', err.message);
  }

  // Test 2: Try with invalid token
  console.log('\nTest 2: Call API with invalid token');
  try {
    const testTransaction = {
      business_id: 'test-business-id',
      type: 'sale',
      industry: 'retail',
      amount: 700,
      currency: 'KES',
      category: 'sales',
      description: 'Test transaction',
      customer_name: 'Test Customer',
      payment_method: 'cash',
      transaction_date: '2024-01-01'
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token-here'
      },
      body: JSON.stringify(testTransaction)
    });

    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', result);
    
    if (response.status === 401) {
      console.log('Correctly rejected invalid token');
    } else {
      console.log('Unexpected - should have been 401 Unauthorized');
    }
  } catch (err) {
    console.log('Network error:', err.message);
  }

  // Test 3: Try with valid token but wrong business
  console.log('\nTest 3: Call API with valid token but wrong business');
  console.log('Note: This requires a real JWT token from your app');
  console.log('To test this scenario:');
  console.log('1. Get a valid JWT from your app after signing in');
  console.log('2. Use a business_id that belongs to a different user');
  console.log('3. Should return 403 Access denied');

  console.log('\n=== Transactions API Tests Complete ===');
}

testTransactionsAPI().catch(console.error);
