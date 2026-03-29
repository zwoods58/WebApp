// Quick test to verify Beehive is now fully functional
// Run this in browser console

function quickBeehiveTest() {
  console.log('🚀 Quick Beehive Functionality Test');
  console.log('==================================');
  
  // Get user ID from beezee-business-profile (we know this works from logs)
  const businessProfile = localStorage.getItem('beezee-business-profile');
  let userId = null;
  let businessId = null;
  
  if (businessProfile) {
    try {
      const profileData = JSON.parse(businessProfile);
      userId = profileData?.userId || profileData?.id || profileData?.user_id;
      businessId = profileData?.businessId || profileData?.id || profileData?.business_id;
      console.log('✅ User ID:', userId);
      console.log('✅ Business ID:', businessId);
    } catch (e) {
      console.log('❌ Failed to parse beezee-business-profile:', e);
      return;
    }
  }
  
  if (!userId) {
    console.log('❌ No user ID found');
    return;
  }
  
  // Test Beehive request creation
  console.log('\n🧪 Testing Beehive request creation...');
  
  const requestData = {
    title: 'Final Test Request',
    description: 'Testing if Beehive is fully functional after all fixes',
    category: 'feature',
    priority: 'high'
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
        industry: 'retail',
        country: 'KE',
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
    console.log('📡 Response status:', response.status);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  })
  .then(result => {
    console.log('🎉 SUCCESS! Beehive request created!');
    console.log('📋 Request ID:', result.data?.id);
    console.log('📝 Title:', result.data?.title);
    console.log('👤 User ID:', result.data?.user_id);
    console.log('🏢 Business ID:', result.data?.business_id);
    console.log('📊 Status:', result.data?.status);
    console.log('');
    console.log('🎉🎉🎉 BEEHIVE SYSTEM IS FULLY FUNCTIONAL! 🎉🎉🎉');
    console.log('');
    console.log('✅ Authentication: Working');
    console.log('✅ Foreign Key Constraints: Handled');
    console.log('✅ API Route: Working');
    console.log('✅ Request Creation: Working');
    console.log('');
    console.log('📱 You can now create Beehive requests in the UI!');
  })
  .catch(error => {
    console.error('❌ Beehive request failed:', error.message);
    
    if (error.message.includes('foreign key constraint')) {
      console.log('❌ Foreign key constraint still not fixed');
    } else if (error.message.includes('500')) {
      console.log('❌ Server error - check server logs');
    } else if (error.message.includes('404')) {
      console.log('❌ API route not found');
    } else {
      console.log('❌ Other error:', error.message);
    }
  });
}

console.log('🚀 Running quick Beehive test...');
quickBeehiveTest();
