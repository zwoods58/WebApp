#!/usr/bin/env node

/**
 * Test Transaction API (Money In)
 * Verifies that transaction API is working correctly after RLS bypass fix
 */

const testTransaction = {
  business_id: 'test-business-id', // Replace with actual business ID
  industry: 'retail',
  type: 'money_in',
  amount: 250.00,
  category: 'sales',
  description: 'Test money-in transaction - API verification',
  customer_name: 'Test Customer',
  payment_method: 'cash',
  transaction_date: new Date().toISOString().split('T')[0],
  metadata: { test: true, direction: 'money_in' }
};

async function testTransactionAPI() {
  try {
    console.log('🧪 Testing Transaction API (Money In)...');
    console.log('Request payload:', JSON.stringify(testTransaction, null, 2));
    
    const response = await fetch('http://localhost:3000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTransaction)
    });
    
    const responseText = await response.text();
    
    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('📡 Response Body:', JSON.stringify(jsonResponse, null, 2));
      
      if (response.ok && !jsonResponse.error) {
        console.log('✅ Transaction API working correctly!');
        console.log('✅ Money-in transaction created successfully with ID:', jsonResponse.data?.id);
      } else {
        console.log('❌ API returned error:', jsonResponse.error);
        if (jsonResponse.code === 'SCHEMA_ERROR') {
          console.log('🔧 Suggestion:', jsonResponse.suggestion);
        }
      }
    } catch (parseError) {
      console.log('📡 Raw Response (invalid JSON):', responseText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

console.log('🚀 Starting Transaction API Test (Money In)...');
console.log('Make sure your development server is running on http://localhost:3000');
console.log('');

testTransactionAPI();
