// Test script to create a notification for the existing credit record
// Run this in browser console

async function testExistingCreditNotification() {
  console.log('Creating notification for existing credit record...');
  
  const businessId = '39f03a1f-1d84-4ab1-9b5c-e6e238bf26e2';
  
  // Calculate days overdue for the existing credit
  const dueDate = new Date('2026-03-12'); // From the database record
  const today = new Date();
  const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  
  console.log('Days overdue:', daysOverdue);
  
  const notificationData = {
    business_id: businessId,
    type: daysOverdue > 0 ? 'credit_overdue_1day' : 'credit_due',
    title: daysOverdue > 0 ? 'Payment Overdue' : 'Payment Due',
    message: `daevon owes KSh 12000.00 (${daysOverdue} days overdue)`,
    is_read: false,
    metadata: { 
      customerName: 'daevon', 
      amount: 12000, 
      daysOverdue: daysOverdue 
    }
  };
  
  try {
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
      console.log('✅ Notification created successfully:', data);
      console.log('📱 Check the notification bell - you should see the notification now!');
      console.log('🔄 Refreshing page in 2 seconds...');
      setTimeout(() => window.location.reload(), 2000);
    } else {
      console.error('❌ Failed to create notification:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Also test creating a new credit record to see if notifications work
async function testNewCreditWithNotification() {
  console.log('Creating new credit record with notification...');
  
  const businessId = '39f03a1f-1d84-4ab1-9b5c-e6e238bf26e2';
  
  const creditData = {
    business_id: businessId,
    industry: 'retail',
    customer_name: 'Test Customer',
    amount: 5000,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    date_given: new Date().toISOString().split('T')[0],
    status: 'outstanding'
  };
  
  try {
    const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/credit', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(creditData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ New credit record created:', data);
      console.log('📱 This should have triggered a notification. Check the bell!');
      setTimeout(() => window.location.reload(), 2000);
    } else {
      console.error('❌ Failed to create credit:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

console.log('🧪 Running notification tests...');
console.log('Option 1: testExistingCreditNotification() - Creates notification for existing overdue credit');
console.log('Option 2: testNewCreditWithNotification() - Creates new credit record (should trigger notification)');

// Run both tests
testExistingCreditNotification();
setTimeout(() => testNewCreditWithNotification(), 1000);
