// Test script to verify the authentication fix
// Run this in browser console

function testAuthFix() {
  console.log('🧪 Testing Authentication Fix');
  console.log('============================');
  
  // Test the fixed getCurrentUserId function
  console.log('🔍 Testing getCurrentUserId() function...');
  
  // Simulate the getCurrentUserId function logic
  let sessionData = null;
  
  // First try localStorageManager (with TTL)
  try {
    const managerData = localStorage.getItem('sessionData');
    if (managerData) {
      const parsed = JSON.parse(managerData);
      // Check if it's in the localStorageManager format (has timestamp, ttl, data)
      if (parsed.timestamp && parsed.ttl && parsed.data) {
        const now = Date.now();
        if (now - parsed.timestamp <= parsed.ttl) {
          sessionData = parsed.data;
          console.log('✅ Retrieved session data from localStorageManager (valid TTL)');
        } else {
          console.log('⏰ Session data expired in localStorageManager, trying direct...');
        }
      } else {
        // Direct format (no wrapper)
        sessionData = parsed;
        console.log('✅ Retrieved session data directly (no TTL wrapper)');
      }
    }
  } catch (e) {
    console.log('❌ Error parsing localStorageManager data:', e);
  }
  
  // If still no sessionData, try direct localStorage
  if (!sessionData) {
    try {
      const directData = localStorage.getItem('sessionData');
      if (directData) {
        sessionData = JSON.parse(directData);
        console.log('✅ Retrieved session data directly from localStorage');
      }
    } catch (e) {
      console.log('❌ Error parsing direct localStorage data:', e);
    }
  }
  
  if (!sessionData) {
    console.log('❌ No session data found anywhere');
    console.log('🔍 Available localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`  - ${key}`);
      }
    }
    return;
  }
  
  const userId = sessionData?.userId;
  if (!userId) {
    console.log('❌ No userId found in session data');
    console.log('📋 Available keys in session data:', Object.keys(sessionData));
    return;
  }
  
  console.log('✅ Authentication test passed!');
  console.log('👤 User ID:', userId);
  console.log('📧 Email:', sessionData.email);
  console.log('📱 Phone:', sessionData.phone);
  
  // Test beehive request creation
  console.log('\n🧪 Testing Beehive request creation...');
  
  // Get user profile for business info
  let userProfile = null;
  try {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const parsed = JSON.parse(profileData);
      // Check if it's in localStorageManager format
      if (parsed.timestamp && parsed.ttl && parsed.data) {
        userProfile = parsed.data;
      } else {
        userProfile = parsed;
      }
    }
  } catch (e) {
    console.log('❌ Error parsing user profile:', e);
  }
  
  if (!userProfile) {
    console.log('❌ No user profile found');
    return;
  }
  
  const requestData = {
    title: 'Auth Fix Test Request',
    description: 'Testing if authentication fix works',
    category: 'feature',
    priority: 'low'
  };
  
  console.log('📝 Creating test request...');
  
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
        industry: userProfile.industry || 'retail',
        country: userProfile.country || 'KE',
        user_id: userId,
        business_id: userProfile.businessId || null,
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
    console.log('🎉 Authentication fix works!');
  })
  .catch(error => {
    console.error('❌ Failed to create request:', error.message);
    console.log('🔧 Possible issues:');
    console.log('  1. API route not found');
    console.log('  2. Server-side error');
    console.log('  3. Network issue');
  });
}

console.log('🚀 Starting authentication fix test...');
testAuthFix();
