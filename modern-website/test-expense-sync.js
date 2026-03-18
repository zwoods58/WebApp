/**
 * Test script to verify expense sync fix
 */

const testExpenseSync = async () => {
  console.log('🧪 Testing expense sync fix...');
  
  try {
    // Test the API route directly
    const testData = {
      business_id: 'test-business-id',
      industry: 'retail',
      amount: 50.00,
      category: 'supplies',
      description: 'Test expense for sync fix',
      vendor_name: 'Test Vendor',
      expense_date: new Date().toISOString().split('T')[0],
      metadata: { test: true }
    };

    console.log('📤 Sending test expense data:', testData);

    const response = await fetch('http://localhost:3000/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test successful:', result);
    } else {
      const error = await response.json();
      console.error('❌ Test failed:', error);
    }
  } catch (error) {
    console.error('🔥 Test error:', error);
  }
};

// Run the test
testExpenseSync();
