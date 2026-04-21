#!/usr/bin/env node

/**
 * Test Expense API
 * Verifies that the expense API is working correctly after fixes
 */

const testExpense = {
  business_id: 'test-business-id', // Replace with actual business ID
  industry: 'retail',
  amount: 150.00,
  category: 'supplies',
  description: 'Test expense - API verification',
  vendor_name: 'Test Vendor',
  payment_method: 'cash',
  expense_date: new Date().toISOString().split('T')[0],
  metadata: { test: true }
};

async function testExpenseAPI() {
  try {
    console.log('🧪 Testing Expense API...');
    console.log('Request payload:', JSON.stringify(testExpense, null, 2));
    
    const response = await fetch('http://localhost:3000/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testExpense)
    });
    
    const responseText = await response.text();
    
    console.log('📡 Response Status:', response.status);
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('📡 Response Body:', JSON.stringify(jsonResponse, null, 2));
      
      if (response.ok && !jsonResponse.error) {
        console.log('✅ Expense API working correctly!');
        console.log('✅ Expense created successfully with ID:', jsonResponse.data?.id);
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

console.log('🚀 Starting Expense API Test...');
console.log('Make sure your development server is running on http://localhost:3000');
console.log('');

testExpenseAPI();
