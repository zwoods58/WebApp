// Debug script to check localStorage and authentication
// Run this in browser console

function debugAuth() {
  console.log('🔍 Debugging Authentication Issues');
  console.log('=====================================');
  
  // Check what's in localStorage
  console.log('📦 localStorage contents:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      console.log(`  ${key}:`, value ? value.substring(0, 100) + '...' : 'null');
    }
  }
  
  // Check session data specifically
  const sessionData = localStorage.getItem('sessionData');
  const userProfile = localStorage.getItem('userProfile');
  
  console.log('\n🔑 Session Data:');
  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);
      console.log('  ✅ Session data exists');
      console.log('  📋 Session keys:', Object.keys(parsed));
      console.log('  👤 User ID:', parsed.userId);
      console.log('  📧 Email:', parsed.email);
      console.log('  📱 Phone:', parsed.phone);
    } catch (e) {
      console.log('  ❌ Failed to parse session data:', e);
    }
  } else {
    console.log('  ❌ No session data found');
  }
  
  console.log('\n👤 User Profile:');
  if (userProfile) {
    try {
      const parsed = JSON.parse(userProfile);
      console.log('  ✅ User profile exists');
      console.log('  📋 Profile keys:', Object.keys(parsed));
      console.log('  🏢 Business ID:', parsed.businessId);
      console.log('  🏢 Business Name:', parsed.businessName);
      console.log('  🌍 Country:', parsed.country);
      console.log('  🏭 Industry:', parsed.industry);
    } catch (e) {
      console.log('  ❌ Failed to parse user profile:', e);
    }
  } else {
    console.log('  ❌ No user profile found');
  }
  
  // Test the getCurrentUserId function directly
  console.log('\n🧪 Testing getCurrentUserId():');
  try {
    const sessionData = localStorage.getItem('sessionData') as any;
    const userId = sessionData?.userId || null;
    console.log('  📱 Raw sessionData:', sessionData);
    console.log('  👤 Extracted userId:', userId);
    
    if (!userId) {
      console.log('  ❌ No userId found - this is the problem!');
      console.log('  🔧 Possible fixes:');
      console.log('    1. Check if user is properly logged in');
      console.log('    2. Check if sessionData key exists in localStorage');
      console.log('    3. Check if userId field exists in sessionData');
    } else {
      console.log('  ✅ userId found successfully');
    }
  } catch (e) {
    console.log('  ❌ Error testing getCurrentUserId():', e);
  }
  
  // Check if there are any authentication-related cookies
  console.log('\n🍪 Cookies:');
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      console.log(`  ${name}: ${value}`);
    }
  });
  
  console.log('\n🎯 Next Steps:');
  console.log('1. If no sessionData exists, user needs to log in again');
  console.log('2. If sessionData exists but no userId, check login flow');
  console.log('3. If everything looks correct, the getCurrentUserId function needs fixing');
}

console.log('🚀 Starting authentication debug...');
debugAuth();
