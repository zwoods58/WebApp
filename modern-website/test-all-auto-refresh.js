// Comprehensive test for all auto-refresh functionality
// Run this in browser console

async function testAllAutoRefresh() {
  console.log('🔄 Testing Auto-Refresh for All Data Types');
  console.log('=====================================');
  
  const businessId = '39f03a1f-1d84-4ab1-9b5c-e6e238bf26e2';
  
  // Test 1: Create a transaction
  console.log('🧪 Test 1: Creating transaction...');
  const transactionData = {
    business_id: businessId,
    industry: 'retail',
    amount: 2500,
    category: 'sale',
    description: 'Auto-refresh test transaction',
    customer_name: 'Test Customer',
    payment_method: 'cash',
    transaction_date: new Date().toISOString().split('T')[0]
  };
  
  try {
    const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/transactions', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(transactionData)
    });
    
    if (response.ok) {
      console.log('✅ Transaction created - should auto-refresh in 10 seconds');
    } else {
      console.error('❌ Failed to create transaction:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error creating transaction:', error);
  }
  
  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 2: Create an expense
  console.log('🧪 Test 2: Creating expense...');
  const expenseData = {
    business_id: businessId,
    industry: 'retail',
    amount: 750,
    category: 'supplies',
    description: 'Auto-refresh test expense',
    supplier: 'Test Supplier',
    expense_date: new Date().toISOString().split('T')[0]
  };
  
  try {
    const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/expenses', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(expenseData)
    });
    
    if (response.ok) {
      console.log('✅ Expense created - should auto-refresh in 12 seconds');
    } else {
      console.error('❌ Failed to create expense:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error creating expense:', error);
  }
  
  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 3: Create inventory item
  console.log('🧪 Test 3: Creating inventory item...');
  const inventoryData = {
    business_id: businessId,
    industry: 'retail',
    item_name: 'Auto-Refresh Test Product',
    category: 'test',
    cost_price: 100,
    selling_price: 150,
    quantity: 3,
    threshold: 5,
    unit: 'pieces',
    supplier: 'Test Supplier'
  };
  
  try {
    const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/inventory', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(inventoryData)
    });
    
    if (response.ok) {
      console.log('✅ Inventory item created - should auto-refresh in 15 seconds');
    } else {
      console.error('❌ Failed to create inventory item:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error creating inventory item:', error);
  }
  
  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Test 4: Create credit record
  console.log('🧪 Test 4: Creating credit record...');
  const creditData = {
    business_id: businessId,
    industry: 'retail',
    customer_name: 'Auto-Refresh Test Customer',
    amount: 3000,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_given: new Date().toISOString().split('T')[0],
    status: 'outstanding'
  };
  
  try {
    const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/credit', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(creditData)
    });
    
    if (response.ok) {
      console.log('✅ Credit record created - should auto-refresh in 20 seconds');
    } else {
      console.error('❌ Failed to create credit record:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error creating credit record:', error);
  }
  
  console.log('🎉 All auto-refresh tests completed!');
  console.log('📊 Expected Auto-Refresh Times:');
  console.log('   • Transactions: Every 10 seconds');
  console.log('   • Expenses: Every 12 seconds');
  console.log('   • Inventory: Every 15 seconds');
  console.log('   • Credit: Every 20 seconds');
  console.log('   • Targets: Every 30 seconds');
  console.log('   • Notifications: Every 5 seconds');
  console.log('📱 Watch the dashboard - all data should update automatically!');
}

console.log('🚀 Starting comprehensive auto-refresh test...');
testAllAutoRefresh();
