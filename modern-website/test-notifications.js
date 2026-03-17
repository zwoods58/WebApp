// Test script to create a test transaction and verify notifications
// Run this in browser console on the dashboard page

async function testNotifications() {
  console.log('Testing notification system...');
  
  // Get business info from localStorage
  const sessionData = localStorage.getItem('sessionData');
  const userProfile = localStorage.getItem('userProfile');
  
  if (!sessionData || !userProfile) {
    console.error('No user session found. Please sign in first.');
    return;
  }
  
  const session = JSON.parse(sessionData);
  const profile = JSON.parse(userProfile);
  
  console.log('User session:', session);
  console.log('User profile:', profile);
  
  // Test creating a money in notification
  try {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_id: profile.businessId || '408f7859-49fb-4cce-8ec3-8f85022ddfcf',
        industry: profile.industry || 'retail',
        amount: 1500,
        category: 'sale',
        description: 'Test sale for notifications',
        customer_name: 'Test Customer',
        payment_method: 'cash',
        transaction_date: new Date().toISOString().split('T')[0]
      })
    });
    
    if (response.ok) {
      console.log('✅ Test transaction created successfully!');
      console.log('Check the notification bell - you should see a new notification.');
      
      // Refresh notifications
      window.location.reload();
    } else {
      console.error('❌ Failed to create test transaction:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error creating test transaction:', error);
  }
}

// Run the test
testNotifications();
