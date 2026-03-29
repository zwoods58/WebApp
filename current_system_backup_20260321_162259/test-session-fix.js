// Quick fix test - create a test session if user is logged in via other means
// Run this in browser console

function createTestSession() {
  console.log('🔧 Creating Test Session');
  console.log('====================');
  
  // Check if user is logged in via beezee system
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const beezeeAuth = localStorage.getItem('beezee-auth');
  const beezeeUserData = localStorage.getItem('beezee-user-data');
  
  console.log('🔐 Login Status Check:');
  console.log('  isLoggedIn:', isLoggedIn);
  console.log('  beezee-auth:', beezeeAuth ? 'EXISTS' : 'MISSING');
  console.log('  beezee-user-data:', beezeeUserData ? 'EXISTS' : 'MISSING');
  
  if (isLoggedIn !== 'true' && !beezeeAuth) {
    console.log('❌ User is not logged in via any method');
    console.log('🔑 Please log in first');
    return;
  }
  
  // Extract user info from beezee data
  let userId = null;
  let email = null;
  let businessId = null;
  let businessName = null;
  
  if (beezeeUserData) {
    try {
      const userData = JSON.parse(beezeeUserData);
      userId = userData.userId || userData.id || userData.sub;
      email = userData.email;
      businessId = userData.businessId || userData.id;
      businessName = userData.businessName;
      console.log('✅ Extracted from beezee-user-data');
    } catch (e) {
      console.log('❌ Failed to parse beezee-user-data:', e);
    }
  }
  
  if (beezeeAuth && !userId) {
    try {
      const authData = JSON.parse(beezeeAuth);
      userId = authData.userId || authData.id || authData.sub;
      email = authData.email;
      console.log('✅ Extracted from beezee-auth');
    } catch (e) {
      console.log('❌ Failed to parse beezee-auth:', e);
    }
  }
  
  if (!userId) {
    console.log('❌ Could not extract user ID from beezee data');
    return;
  }
  
  console.log('👤 User ID:', userId);
  console.log('📧 Email:', email);
  console.log('🏢 Business ID:', businessId);
  console.log('🏢 Business Name:', businessName);
  
  // Create sessionData
  const sessionData = {
    isLoggedIn: true,
    userId: userId,
    email: email,
    loginTime: new Date().toISOString(),
    businessId: businessId,
    businessName: businessName
  };
  
  console.log('📝 Creating sessionData:', sessionData);
  
  // Set sessionData
  localStorage.setItem('sessionData', JSON.stringify(sessionData));
  console.log('✅ sessionData created successfully!');
  
  // Create userProfile if it doesn't exist
  const existingProfile = localStorage.getItem('userProfile');
  if (!existingProfile) {
    const userProfile = {
      userId: userId,
      businessId: businessId,
      businessName: businessName,
      email: email,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    console.log('✅ userProfile created successfully!');
  } else {
    console.log('ℹ️ userProfile already exists');
  }
  
  console.log('🎉 Test session created!');
  console.log('📱 Now try creating a Beehive request');
  
  // Test Beehive request
  setTimeout(() => {
    console.log('\n🧪 Testing Beehive request...');
    
    const requestData = {
      title: 'Test Request After Fix',
      description: 'Testing if session fix works',
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
      console.log('✅ SUCCESS! Beehive request created!');
      console.log('📋 Request ID:', result.data?.id);
      console.log('🎉 Authentication fix works!');
    })
    .catch(error => {
      console.error('❌ Beehive request failed:', error.message);
      console.log('🔧 Check if API route exists and server is running');
    });
  }, 1000);
}

console.log('🚀 Running session fix...');
createTestSession();
