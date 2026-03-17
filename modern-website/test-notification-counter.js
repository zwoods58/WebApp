// Test script to verify notification counter works
// Run this in browser console

async function testNotificationCounter() {
  console.log('🧪 Testing notification counter...');
  
  const businessId = '39f03a1f-1d84-4ab1-9b5c-e6e238bf26e2';
  
  // Check current unread count
  console.log('Current unread count should be: 0');
  
  // Create 3 test notifications to see the counter increment
  const notifications = [
    {
      business_id: businessId,
      type: 'money_in',
      title: 'Test Sale 1',
      message: 'Test transaction 1 completed',
      is_read: false
    },
    {
      business_id: businessId,
      type: 'money_out', 
      title: 'Test Expense 1',
      message: 'Test expense 1 recorded',
      is_read: false
    },
    {
      business_id: businessId,
      type: 'low_inventory',
      title: 'Low Stock Alert',
      message: 'Test product is low on stock',
      is_read: false
    }
  ];
  
  console.log('Creating 3 test notifications...');
  
  for (let i = 0; i < notifications.length; i++) {
    try {
      const response = await fetch('https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/notifications', {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(notifications[i])
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Notification ${i + 1} created:`, data.title);
      } else {
        console.error(`❌ Failed to create notification ${i + 1}:`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Error creating notification ${i + 1}:`, error);
    }
    
    // Small delay between notifications
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('🎉 All 3 notifications created!');
  console.log('📱 Check the notification bell - it should show badge with count "3"');
  console.log('🔄 Refreshing page in 2 seconds...');
  
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Test marking as read to see counter decrement
async function testMarkAsRead() {
  console.log('🧪 Testing mark as read functionality...');
  
  const businessId = '39f03a1f-1d84-4ab1-9b5c-e6e238bf26e2';
  
  // Get current notifications
  const response = await fetch(`https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/notifications?business_id=eq.${businessId}&is_read=eq.false`);
  
  if (response.ok) {
    const notifications = await response.json();
    console.log(`Found ${notifications.length} unread notifications`);
    
    if (notifications.length > 0) {
      // Mark the first notification as read
      const firstNotification = notifications[0];
      console.log('Marking first notification as read...');
      
      const markResponse = await fetch(`https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/notifications?id=eq.${firstNotification.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_read: true })
      });
      
      if (markResponse.ok) {
        console.log('✅ Notification marked as read');
        console.log('📱 Badge count should decrease by 1');
        console.log('🔄 Refreshing page...');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        console.error('❌ Failed to mark as read:', await markResponse.text());
      }
    } else {
      console.log('No unread notifications to mark as read');
    }
  } else {
    console.error('❌ Failed to fetch notifications:', await response.text());
  }
}

console.log('🧪 Notification Counter Tests');
console.log('Option 1: testNotificationCounter() - Creates 3 notifications to test counter increment');
console.log('Option 2: testMarkAsRead() - Marks notification as read to test counter decrement');

// Run the counter test
testNotificationCounter();
