// Test script to verify the beezee authentication fix
// Run this in browser console

function testBeezeeAuth() {
  console.log('🧪 Testing Beezee Authentication Fix');
  console.log('==================================');
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  console.log('🔐 Login Status:', isLoggedIn);
  
  if (isLoggedIn !== 'true') {
    console.log('❌ User not logged in. Please log in first.');
    return;
  }
  
  console.log('✅ User is logged in');
  
  // Test user data retrieval from beezee storage
  let userData = null;
  let dataSource = '';
  
  // Try beezee-user-data first
  const beezeeUserData = localStorage.getItem('beezee-user-data');
  if (beezeeUserData) {
    try {
      userData = JSON.parse(beezeeUserData);
      dataSource = 'beezee-user-data';
      console.log('✅ Found user data in beezee-user-data');
    } catch (e) {
      console.log('❌ Failed to parse beezee-user-data:', e);
    }
  }
  
  // Try beezee-auth
  if (!userData) {
    const beezeeAuth = localStorage.getItem('beezee-auth');
    if (beezeeAuth) {
      try {
        userData = JSON.parse(beezeeAuth);
        dataSource = 'beezee-auth';
        console.log('✅ Found user data in beezee-auth');
      } catch (e) {
        console.log('❌ Failed to parse beezee-auth:', e);
      }
    }
  }
  
  // Try beezee-business-profile
  if (!userData) {
    const businessProfile = localStorage.getItem('beezee-business-profile');
    if (businessProfile) {
      try {
        userData = JSON.parse(businessProfile);
        dataSource = 'beezee-business-profile';
        console.log('✅ Found user data in beezee-business-profile');
      } catch (e) {
        console.log('❌ Failed to parse beezee-business-profile:', e);
      }
    }
  }
  
  if (!userData) {
    console.log('❌ No user data found in any beezee storage');
    return;
  }
  
  console.log('📋 User data keys:', Object.keys(userData));
  console.log('📱 Data source:', dataSource);
  
  // Extract user ID
  const userId = userData?.userId || 
                userData?.id || 
                userData?.user_id || 
                userData?.sub ||
                userData?.email;
  
  if (!userId) {
    console.log('❌ No user ID found');
    console.log('🔍 Available fields:', Object.keys(userData));
    return;
  }
  
  console.log('👤 User ID:', userId);
  
  // Extract business ID
  let businessId = userData?.businessId || 
                   userData?.id || 
                   userData?.business_id;
  
  console.log('🏢 Business ID:', businessId);
  
  // Test beehive request creation
  console.log('\n🧪 Testing Beehive request creation...');
  
  const requestData = {
    title: 'Beezee Auth Test Request',
    description: 'Testing authentication fix with beezee storage',
    category: 'feature',
    priority: 'medium'
  };
  
  fetch('/api/beehive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'addRequest',
      userId: userId,
      data: {
        ...requestData,
        industry: 'retail', // Default industry
        country: 'KE', // Default country
        user_id: userId,
        business_id: businessId,
        status: 'active',
        upvotes_count: 0,
        downvotes_count: 0,
        comments_count: 0,
        is_featured: false,
        metadata: {}
      }
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  })
  .then(result => {
    console.log('✅ Beehive request created successfully!');
    console.log('📋 Request ID:', result.data?.id);
    console.log('📝 Title:', result.data?.title);
    console.log('🎉 Beezee authentication fix works!');
    console.log('🔔 You can now create requests in the Beehive system!');
  })
  .catch(error => {
    console.error('❌ Failed to create request:', error.message);
    console.log('🔧 Possible issues:');
    console.log('  1. API route not found (check if /api/beehive exists)');
    console.log('  2. Server-side error (check server logs)');
    console.log('  3. Network issue');
    console.log('  4. RLS still blocking (check if service role key works)');
  });
}

console.log('🚀 Starting Beezee authentication test...');
testBeezeeAuth();
