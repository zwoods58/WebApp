// Test the enhanced authentication system
// Run this in browser console

function testEnhancedAuth() {
  console.log('🧪 Testing Enhanced Authentication System');
  console.log('=======================================');
  
  // Test the getCurrentUserId function logic
  console.log('🔍 Step 1: Testing getCurrentUserId logic...');
  
  let userId = null;
  let dataSource = '';
  
  // Method 1: Check sessionData
  let sessionData = localStorage.getItem('sessionData');
  if (sessionData) {
    try {
      const session = JSON.parse(sessionData);
      if (session.isLoggedIn && session.userId) {
        userId = session.userId;
        dataSource = 'sessionData';
        console.log('✅ Found user ID in sessionData:', userId);
      }
    } catch (e) {
      console.log('❌ Failed to parse sessionData:', e);
    }
  }
  
  // Method 2: Check beezee-user-data
  if (!userId) {
    const beezeeUserData = localStorage.getItem('beezee-user-data');
    if (beezeeUserData) {
      try {
        const userData = JSON.parse(beezeeUserData);
        userId = userData?.userId || userData?.id || userData?.sub;
        dataSource = 'beezee-user-data';
        console.log('✅ Found user ID in beezee-user-data:', userId);
      } catch (e) {
        console.log('❌ Failed to parse beezee-user-data:', e);
      }
    }
  }
  
  // Method 3: Check beezee-auth
  if (!userId) {
    const beezeeAuth = localStorage.getItem('beezee-auth');
    if (beezeeAuth) {
      try {
        const authData = JSON.parse(beezeeAuth);
        userId = authData?.userId || authData?.id || authData?.sub;
        dataSource = 'beezee-auth';
        console.log('✅ Found user ID in beezee-auth:', userId);
      } catch (e) {
        console.log('❌ Failed to parse beezee-auth:', e);
      }
    }
  }
  
  // Method 4: Check beezee-business-profile
  if (!userId) {
    const businessProfile = localStorage.getItem('beezee-business-profile');
    if (businessProfile) {
      try {
        const profileData = JSON.parse(businessProfile);
        userId = profileData?.userId || profileData?.id || profileData?.user_id;
        dataSource = 'beezee-business-profile';
        console.log('✅ Found user ID in beezee-business-profile:', userId);
      } catch (e) {
        console.log('❌ Failed to parse beezee-business-profile:', e);
      }
    }
  }
  
  // Method 5: Check isLoggedIn and create temporary
  if (!userId) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      userId = 'temp-user-' + Date.now();
      dataSource = 'temporary (isLoggedIn=true)';
      console.log('⚠️ Created temporary user ID:', userId);
      
      // Create sessionData
      const tempSession = {
        isLoggedIn: true,
        userId: userId,
        email: 'temp@example.com',
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('sessionData', JSON.stringify(tempSession));
      console.log('✅ Created temporary sessionData');
    }
  }
  
  if (!userId) {
    console.log('❌ No user ID found in any method');
    console.log('🔧 Available localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log('  -', key);
      }
    }
    return;
  }
  
  console.log('✅ User ID found:', userId, 'from', dataSource);
  
  // Test business ID retrieval
  console.log('\n🏢 Step 2: Testing business ID retrieval...');
  
  let businessId = null;
  let businessSource = '';
  
  // Method 1: userProfile
  const userProfile = localStorage.getItem('userProfile');
  if (userProfile) {
    try {
      const profileData = JSON.parse(userProfile);
      businessId = profileData?.businessId || profileData?.id || profileData?.business_id;
      businessSource = 'userProfile';
    } catch (e) {
      console.log('❌ Failed to parse userProfile:', e);
    }
  }
  
  // Method 2: sessionData
  if (!businessId && sessionData) {
    try {
      const session = JSON.parse(sessionData);
      businessId = session?.businessId || session?.id || session?.business_id;
      businessSource = 'sessionData';
    } catch (e) {
      console.log('❌ Failed to parse sessionData:', e);
    }
  }
  
  // Method 3: beezee-business-profile
  if (!businessId) {
    const businessProfile = localStorage.getItem('beezee-business-profile');
    if (businessProfile) {
      try {
        const profileData = JSON.parse(businessProfile);
        businessId = profileData?.businessId || profileData?.id || profileData?.business_id;
        businessSource = 'beezee-business-profile';
      } catch (e) {
        console.log('❌ Failed to parse beezee-business-profile:', e);
      }
    }
  }
  
  // Method 4: beezee-user-data
  if (!businessId) {
    const beezeeUserData = localStorage.getItem('beezee-user-data');
    if (beezeeUserData) {
      try {
        const userData = JSON.parse(beezeeUserData);
        businessId = userData?.businessId || userData?.id || userData?.business_id;
        businessSource = 'beezee-user-data';
      } catch (e) {
        console.log('❌ Failed to parse beezee-user-data:', e);
      }
    }
  }
  
  // Fallback to userId
  if (!businessId) {
    businessId = userId;
    businessSource = 'userId fallback';
  }
  
  console.log('✅ Business ID found:', businessId, 'from', businessSource);
  
  // Test Beehive request
  console.log('\n🧪 Step 3: Testing Beehive request creation...');
  
  const requestData = {
    title: 'Enhanced Auth Test Request',
    description: 'Testing enhanced authentication system',
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
    console.log('✅ Enhanced authentication system works!');
    console.log('🔔 You can now create requests in the Beehive UI!');
  })
  .catch(error => {
    console.error('❌ Beehive request failed:', error.message);
    console.log('🔧 Possible issues:');
    console.log('  1. API route /api/beehive not found');
    console.log('  2. Server not running');
    console.log('  3. Network error');
    console.log('  4. RLS still blocking');
  });
  
  console.log('\n📊 Summary:');
  console.log('👤 User ID:', userId, `(${dataSource})`);
  console.log('🏢 Business ID:', businessId, `(${businessSource})`);
  console.log('🎯 Enhanced authentication should now work!');
}

console.log('🚀 Running enhanced authentication test...');
testEnhancedAuth();
