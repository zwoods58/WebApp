// Test the foreign key constraint fix
// Run this in browser console

function testForeignKeyFix() {
  console.log('🧪 Testing Foreign Key Constraint Fix');
  console.log('=====================================');
  
  // Test the enhanced authentication first
  let userId = null;
  let businessId = null;
  
  // Get user ID using enhanced logic
  const sessionData = localStorage.getItem('sessionData');
  if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      userId = session.userId;
    } catch (e) {
      console.log('❌ Failed to parse sessionData:', e);
    }
  }
  
  // Fallback to other methods
  if (!userId) {
    const beezeeUserData = localStorage.getItem('beezee-user-data');
    if (beezeeUserData) {
      try {
        const userData = JSON.parse(beezeeUserData);
        userId = userData?.userId || userData?.id || userData?.sub;
      } catch (e) {
        console.log('❌ Failed to parse beezee-user-data:', e);
      }
    }
  }
  
  if (!userId) {
    console.log('❌ No user ID found. Please run the enhanced auth test first.');
    return;
  }
  
  console.log('✅ User ID:', userId);
  
  // Get business ID
  const userProfile = localStorage.getItem('userProfile');
  if (userProfile) {
    try {
      const profileData = JSON.parse(userProfile);
      businessId = profileData?.businessId || profileData?.id;
    } catch (e) {
      console.log('❌ Failed to parse userProfile:', e);
    }
  }
  
  console.log('🏢 Business ID:', businessId);
  
  // Test Beehive request with foreign key handling
  console.log('\n🧪 Testing Beehive request with foreign key validation...');
  
  const requestData = {
    title: 'Foreign Key Test Request',
    description: 'Testing if foreign key constraint is handled properly',
    category: 'feature',
    priority: 'low'
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
        business_id: businessId, // This might be invalid - API should handle it
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
    console.log('🎉 SUCCESS! Beehive request created!');
    console.log('📋 Request ID:', result.data?.id);
    console.log('📝 Title:', result.data?.title);
    console.log('🏢 Business ID in response:', result.data?.business_id);
    
    if (result.data?.business_id === null) {
      console.log('✅ Foreign key constraint handled - business_id set to null');
    } else {
      console.log('✅ Business ID was valid and preserved');
    }
    
    console.log('🎉 Foreign key constraint fix works!');
    console.log('🔔 Beehive system is now fully functional!');
  })
  .catch(error => {
    console.error('❌ Beehive request failed:', error.message);
    
    if (error.message.includes('foreign key constraint')) {
      console.log('❌ Foreign key constraint still not fixed');
      console.log('🔧 Check if the API route was updated correctly');
    } else if (error.message.includes('500')) {
      console.log('❌ Server error - check server logs');
      console.log('🔧 The API route might have an issue');
    } else {
      console.log('❌ Other error:', error.message);
    }
  });
  
  // Test with explicitly null business_id
  console.log('\n🧪 Testing with explicitly null business_id...');
  
  setTimeout(() => {
    fetch('/api/beehive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addRequest',
        userId: userId,
        data: {
          title: 'Null Business ID Test',
          description: 'Testing with explicitly null business_id',
          category: 'feature',
          priority: 'low',
          industry: 'retail',
          country: 'KE',
          user_id: userId,
          business_id: null, // Explicitly null
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
      console.log('✅ SUCCESS! Request with null business_id created');
      console.log('📋 Request ID:', result.data?.id);
      console.log('🎉 Null business_id test passed!');
    })
    .catch(error => {
      console.error('❌ Null business_id test failed:', error.message);
    });
  }, 2000);
}

console.log('🚀 Running foreign key constraint test...');
testForeignKeyFix();
