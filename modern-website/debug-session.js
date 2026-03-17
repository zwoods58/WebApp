// Comprehensive debugging script for authentication issues
// Run this in browser console

function debugSessionData() {
  console.log('🔍 Comprehensive Authentication Debug');
  console.log('=====================================');
  
  // Check all localStorage keys
  console.log('📦 All localStorage keys:');
  const allKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      allKeys.push(key);
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value ? (value.length > 100 ? value.substring(0, 100) + '...' : value) : 'null'}`);
    }
  }
  
  // Check for authentication-related keys
  console.log('\n🔐 Authentication-related keys:');
  const authKeys = ['sessionData', 'userProfile', 'isLoggedIn', 'beezee-auth', 'beezee-user-data', 'beezee-business-profile'];
  authKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`  ${key}: ${value ? 'EXISTS' : 'MISSING'}`);
  });
  
  // Check sessionData specifically
  console.log('\n📄 Session Data Analysis:');
  const sessionData = localStorage.getItem('sessionData');
  if (!sessionData) {
    console.log('❌ sessionData is completely missing');
    console.log('🔧 Possible solutions:');
    console.log('  1. User needs to log in again');
    console.log('  2. Session expired and was cleared');
    console.log('  3. Login flow not setting sessionData properly');
    return;
  }
  
  console.log('✅ sessionData exists');
  
  try {
    const session = JSON.parse(sessionData);
    console.log('📋 Session structure:', Object.keys(session));
    console.log('📱 Session content:', session);
    
    // Check required fields
    const requiredFields = ['isLoggedIn', 'userId'];
    const missingFields = requiredFields.filter(field => !session[field]);
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      console.log('🔧 Session data is incomplete');
    } else {
      console.log('✅ Session has required fields');
      console.log('👤 User ID:', session.userId);
      console.log('🔐 Login Status:', session.isLoggedIn);
    }
  } catch (e) {
    console.log('❌ Failed to parse sessionData:', e);
    console.log('🔧 Session data is malformed JSON');
  }
  
  // Check userProfile
  console.log('\n👤 User Profile Analysis:');
  const userProfile = localStorage.getItem('userProfile');
  if (!userProfile) {
    console.log('❌ userProfile is missing');
  } else {
    try {
      const profile = JSON.parse(userProfile);
      console.log('✅ userProfile exists');
      console.log('📋 Profile structure:', Object.keys(profile));
      console.log('🏢 Business ID:', profile.businessId || profile.id || 'MISSING');
      console.log('🏢 Business Name:', profile.businessName || 'MISSING');
    } catch (e) {
      console.log('❌ Failed to parse userProfile:', e);
    }
  }
  
  // Check if user is actually logged in via other means
  console.log('\n🔍 Alternative login indicators:');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const beezeeAuth = localStorage.getItem('beezee-auth');
  
  console.log('  isLoggedIn:', isLoggedIn || 'MISSING');
  console.log('  beezee-auth:', beezeeAuth ? 'EXISTS' : 'MISSING');
  
  if (isLoggedIn === 'true' || beezeeAuth) {
    console.log('✅ User appears to be logged in via alternative method');
    console.log('🔧 Try using the beezee authentication system instead');
  }
  
  // Test if we can create a simple session
  console.log('\n🧪 Testing session creation...');
  const testSession = {
    isLoggedIn: true,
    userId: 'test-user-' + Date.now(),
    email: 'test@example.com',
    loginTime: new Date().toISOString()
  };
  
  console.log('📝 Test session:', testSession);
  console.log('💡 If you need to test, run:');
  console.log('localStorage.setItem("sessionData", JSON.stringify(testSession));');
  
  // Provide recommendations
  console.log('\n🎯 Recommendations:');
  if (!sessionData) {
    console.log('1. User needs to log in through the proper login flow');
    console.log('2. Check if the login page is working correctly');
    console.log('3. Verify the login flow sets sessionData');
  } else if (JSON.parse(sessionData).isLoggedIn && JSON.parse(sessionData).userId) {
    console.log('✅ Authentication looks correct, try creating a Beehive request');
  } else {
    console.log('1. Session data exists but is incomplete');
    console.log('2. Check the login flow to ensure proper session creation');
    console.log('3. Verify all required fields are being set');
  }
  
  // Test the getCurrentUserId function directly
  console.log('\n🧪 Testing getCurrentUserId function:');
  try {
    // Simulate the current getCurrentUserId logic
    const sessionDataLocal = localStorage.getItem('sessionData');
    if (!sessionDataLocal) {
      console.log('❌ getCurrentUserId will return null (no sessionData)');
      return;
    }
    
    const session = JSON.parse(sessionDataLocal);
    if (!session.isLoggedIn || !session.userId) {
      console.log('❌ getCurrentUserId will return null (invalid session)');
      return;
    }
    
    console.log('✅ getCurrentUserId should return:', session.userId);
    console.log('🎉 Authentication should work!');
  } catch (e) {
    console.log('❌ Error testing getCurrentUserId:', e);
  }
}

console.log('🚀 Starting comprehensive authentication debug...');
debugSessionData();
