// Test script to verify the automatic authentication fix
// Run this in the browser console on the login page

console.log('🧪 Testing automatic authentication fix...');

// 1. Clear all existing sessions
localStorage.removeItem('beezee_unified_auth');
localStorage.removeItem('beezee_business_auth');
localStorage.removeItem('beezee_direct_auth');
localStorage.removeItem('sessionData');
localStorage.removeItem('userProfile');
localStorage.removeItem('beezee_simple_auth');

console.log('✅ All sessions cleared');

// 2. Simulate an existing session (this should cause auto-redirect in old version)
const fakeAuthData = {
  business: {
    id: 'test-business-id',
    phone_number: '+254712345678',
    business_name: 'Test Business',
    country: 'ke',
    industry: 'retail'
  },
  session: {
    businessId: 'test-business-id',
    businessName: 'Test Business',
    country: 'ke',
    industry: 'retail',
    phone: '+254712345678',
    timestamp: Date.now() // Fresh session
  }
};

// Store fake session
localStorage.setItem('beezee_unified_auth', JSON.stringify(fakeAuthData));
console.log('🔐 Fake session stored');

// 3. Check if user intent tracking works
console.log('📋 Testing user intent detection...');
console.log('Before user interaction: hasUserIntent should be false');

// Simulate user typing in phone number
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
  phoneInput.value = '+254712345678';
  phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
  console.log('📱 Phone number entered - user intent should be detected');
}

console.log('🎯 Test complete. Check console logs for authentication behavior');
console.log('Expected behavior: No automatic redirect should occur when user intent is detected');
