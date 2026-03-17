// Test script to check homepage authentication issues
// Run this in browser console

function testHomepageAuth() {
  console.log('🧪 Testing Homepage Authentication');
  console.log('===================================');
  
  // Check localStorage for authentication data
  console.log('\n📋 Checking localStorage...');
  
  const authKeys = [
    'beezee-business-profile',
    'beezee-user-data', 
    'beezee-auth',
    'sessionData',
    'userProfile',
    'isLoggedIn'
  ];
  
  let authFound = false;
  
  authKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`✅ ${key}:`, parsed);
        authFound = true;
        
        // Check for user ID in each auth source
        const userId = parsed?.userId || parsed?.id || parsed?.user_id || parsed?.sub;
        if (userId) {
          console.log(`  👤 User ID: ${userId}`);
        }
      } catch (e) {
        console.log(`❌ ${key}: Failed to parse - ${e.message}`);
      }
    } else {
      console.log(`⚪ ${key}: Not found`);
    }
  });
  
  if (!authFound) {
    console.log('\n❌ No authentication data found in localStorage');
    console.log('💡 This might explain the "User not authenticated" error');
  } else {
    console.log('\n✅ Authentication data found');
  }
  
  // Check if getCurrentUserId function works
  console.log('\n🧪 Testing getCurrentUserId function...');
  
  try {
    // Try beezee-business-profile first
    const businessProfile = localStorage.getItem('beezee-business-profile');
    let userId = null;
    
    if (businessProfile) {
      try {
        const profileData = JSON.parse(businessProfile);
        userId = profileData?.userId || profileData?.id || profileData?.user_id;
        if (userId) {
          console.log('✅ User ID from beezee-business-profile:', userId);
        }
      } catch (e) {
        console.log('❌ Failed to parse beezee-business-profile:', e);
      }
    }
    
    // Try beezee-user-data
    if (!userId) {
      const beezeeUserData = localStorage.getItem('beezee-user-data');
      if (beezeeUserData) {
        try {
          const userData = JSON.parse(beezeeUserData);
          userId = userData?.userId || userData?.id || userData?.sub;
          if (userId) {
            console.log('✅ User ID from beezee-user-data:', userId);
          }
        } catch (e) {
          console.log('❌ Failed to parse beezee-user-data:', e);
        }
      }
    }
    
    // Try beezee-auth
    if (!userId) {
      const beezeeAuth = localStorage.getItem('beezee-auth');
      if (beezeeAuth) {
        try {
          const authData = JSON.parse(beezeeAuth);
          userId = authData?.userId || authData?.id || authData?.sub;
          if (userId) {
            console.log('✅ User ID from beezee-auth:', userId);
          }
        } catch (e) {
          console.log('❌ Failed to parse beezee-auth:', e);
        }
      }
    }
    
    if (userId) {
      console.log('✅ getCurrentUserId would return:', userId);
      console.log('🎉 Authentication should work!');
    } else {
      console.log('❌ getCurrentUserId would return null');
      console.log('💡 This explains the "User not authenticated" error');
    }
    
  } catch (error) {
    console.error('❌ Error testing getCurrentUserId:', error);
  }
  
  // Check for any components that might be calling authentication
  console.log('\n🔍 Checking for potential issues...');
  
  // Check if we're on the homepage
  if (window.location.pathname === '/') {
    console.log('✅ We are on the homepage');
  } else {
    console.log('ℹ️ We are not on the homepage:', window.location.pathname);
  }
  
  // Check for any Beehive components that might be loaded
  const behiveElements = document.querySelectorAll('[class*="beehive"], [id*="beehive"]');
  if (beehiveElements.length > 0) {
    console.log('⚠️ Found Beehive-related elements on page:', behiveElements.length);
    console.log('💡 This might be causing the authentication check');
  } else {
    console.log('✅ No Beehive elements found on page');
  }
  
  console.log('\n📊 Summary:');
  console.log('✅ Authentication data:', authFound ? 'Found' : 'Not found');
  console.log('✅ User ID available:', userId ? 'Yes' : 'No');
  console.log('✅ Homepage clean:', beehiveElements.length === 0 ? 'Yes' : 'No');
  
  if (!authFound || !userId) {
    console.log('\n💡 Recommendations:');
    console.log('1. Make sure you are logged in to the Beezee app');
    console.log('2. Check that authentication data is stored in localStorage');
    console.log('3. Try logging out and logging back in');
    console.log('4. The error should disappear once authentication is properly set');
  } else {
    console.log('\n🎉 Everything looks good!');
    console.log('If you still see the error, it might be a component loading issue');
  }
}

console.log('🚀 Running homepage authentication test...');
testHomepageAuth();
