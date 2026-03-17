// Simple test to create notifications using the hooks directly
// Run this in browser console on the dashboard page

async function testNotificationsWithHooks() {
  console.log('Testing notifications with hooks...');
  
  // Get business info from localStorage
  const sessionData = localStorage.getItem('sessionData');
  const userProfile = localStorage.getItem('userProfile');
  
  if (!sessionData || !userProfile) {
    console.error('No user session found. Please sign in first.');
    return;
  }
  
  const session = JSON.parse(sessionData);
  const profile = JSON.parse(userProfile);
  const businessId = profile.businessId || session.userId;
  
  console.log('Business ID:', businessId);
  
  try {
    // Import the hooks (they should be available globally)
    const { useTransactions } = window.React?.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED || {};
    
    // Test 1: Create a transaction directly via Supabase
    console.log('Creating test transaction...');
    
    const transactionData = {
      business_id: businessId,
      industry: profile.industry || 'retail',
      amount: 1500,
      category: 'sale',
      description: 'Test sale for notification',
      customer_name: 'Test Customer',
      payment_method: 'cash',
      transaction_date: new Date().toISOString().split('T')[0]
    };
    
    // Direct Supabase call
    const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/transactions', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(transactionData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Transaction created:', data);
      console.log('📱 Check the notification bell - you should see a new notification!');
    } else {
      console.error('❌ Failed to create transaction:', await response.text());
    }
    
    // Test 2: Create an expense
    console.log('Creating test expense...');
    
    const expenseData = {
      business_id: businessId,
      industry: profile.industry || 'retail',
      amount: 300,
      category: 'supplies',
      description: 'Test expense for notification',
      supplier: 'Test Supplier',
      expense_date: new Date().toISOString().split('T')[0]
    };
    
    const expenseResponse = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/expenses', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(expenseData)
    });
    
    if (expenseResponse.ok) {
      const data = await expenseResponse.json();
      console.log('✅ Expense created:', data);
      console.log('📱 Another notification should appear!');
    } else {
      console.error('❌ Failed to create expense:', await expenseResponse.text());
    }
    
    console.log('🎉 Test completed! Check your notification bell.');
    console.log('🔄 Refreshing page in 3 seconds...');
    
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Alternative: Create a notification directly
async function createDirectNotification() {
  console.log('Creating notification directly...');
  
  const sessionData = localStorage.getItem('sessionData');
  const userProfile = localStorage.getItem('userProfile');
  
  if (!sessionData || !userProfile) {
    console.error('No user session found.');
    return;
  }
  
  const businessId = JSON.parse(userProfile).businessId || JSON.parse(sessionData).userId;
  
  const notificationData = {
    business_id: businessId,
    type: 'money_in',
    title: 'Test Sale',
    message: 'Test transaction of KSh 1,500 completed successfully!',
    is_read: false,
    metadata: { amount: 1500, customer_name: 'Test Customer' }
  };
  
  const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/notifications', {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(notificationData)
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('✅ Direct notification created:', data);
    console.log('📱 Check notification bell!');
    setTimeout(() => window.location.reload(), 1000);
  } else {
    console.error('❌ Failed to create notification:', await response.text());
  }
}

console.log('🧪 Running notification tests...');
console.log('Option 1: testNotificationsWithHooks() - Creates transactions/expenses');
console.log('Option 2: createDirectNotification() - Creates notification directly');

// Run the direct notification test (more likely to work)
createDirectNotification();
