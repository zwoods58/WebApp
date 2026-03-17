// Test script to verify auto-refresh functionality
// Run this in browser console

async function testAutoRefresh() {
  console.log('🧪 Testing notification auto-refresh...');
  console.log('📱 This test will create notifications every 2 seconds to verify auto-refresh works');
  console.log('⏱️  You should see the notification counter update automatically without manual refresh');
  
  const businessId = '39f03a1f-1d84-4ab1-9b5c-e6e238bf26e2';
  let notificationCount = 1;
  
  // Create notifications with delays to test auto-refresh
  const createNotificationWithDelay = async delay => {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const notificationData = {
      business_id: businessId,
      type: 'money_in',
      title: `Auto-Test Notification ${notificationCount}`,
      message: `This is test notification #${notificationCount} - should appear automatically!`,
      is_read: false
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
        console.log(`✅ Notification #${notificationCount} created at ${new Date().toLocaleTimeString()}`);
        console.log('📱 Watch the notification bell - counter should update within 5 seconds!');
        notificationCount++;
      } else {
        console.error(`❌ Failed to create notification #${notificationCount}:`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Error creating notification #${notificationCount}:`, error);
    }
  };
  
  // Create notifications at different intervals
  console.log('🚀 Starting auto-refresh test...');
  console.log('⏰ Timeline:');
  console.log('   0s: Test starts');
  console.log('   2s: First notification created');
  console.log('   4s: Second notification created');
  console.log('   6s: Third notification created');
  console.log('   8s: Fourth notification created');
  console.log('   10s: Test complete');
  
  // Create notifications with 2-second intervals
  await createNotificationWithDelay(2000); // 2 seconds
  await createNotificationWithDelay(2000); // 4 seconds
  await createNotificationWithDelay(2000); // 6 seconds
  await createNotificationWithDelay(2000); // 8 seconds
  
  console.log('🎉 Auto-refresh test completed!');
  console.log('📊 Final notification count should be 4');
  console.log('💡 If the counter updated automatically, auto-refresh is working!');
}

// Test marking as read to see counter decrease
async function testMarkAsReadAutoRefresh() {
  console.log('🧪 Testing mark-as-read auto-refresh...');
  
  const businessId = '39f03a1f-1d84-4ab1-9b5c-e6e238bf26e2';
  
  // Get unread notifications
  const response = await fetch(`https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/notifications?business_id=eq.${businessId}&is_read=eq.false&limit=1`);
  
  if (response.ok) {
    const notifications = await response.json();
    
    if (notifications.length > 0) {
      const notification = notifications[0];
      console.log(`Marking "${notification.title}" as read...`);
      
      const markResponse = await fetch(`https://zruprmhkcqhgzydjfhrk.supabase.co/rest/v1/notifications?id=eq.${notification.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydXBybWhrY3FoZ3p5ZGpmaHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MzI4NTAsImV4cCI6MjA4NzMwODg1MH0.joFWtiQohkWTYXoJufiEt_WCE0WE86uo1yNKhDLG0IQ',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_read: true })
      });
      
      if (markResponse.ok) {
        console.log('✅ Notification marked as read');
        console.log('📱 Watch the notification bell - counter should decrease within 5 seconds!');
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

console.log('🔄 Auto-Refresh Test Suite');
console.log('Option 1: testAutoRefresh() - Tests automatic notification updates');
console.log('Option 2: testMarkAsReadAutoRefresh() - Tests automatic counter decrease');

// Run the auto-refresh test
testAutoRefresh();
