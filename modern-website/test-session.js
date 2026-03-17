// Quick test session - run this in browser console
localStorage.setItem('sessionData', JSON.stringify({
  isLoggedIn: true,
  lastLogin: Date.now(),
  expiresAt: Date.now() + (24 * 60 * 60 * 1000),
  userId: 'c8abd2cb-6b99-47d5-85c8-6b9ab5ba9056'
}));

localStorage.setItem('userProfile', JSON.stringify({
  phoneNumber: '+254700000000',
  businessName: 'Test Business',
  country: 'KE',
  name: 'Test User',
  industry: 'retail',
  dailyTarget: 5000,
  currency: 'KES'
}));

console.log('Test session created! Refresh the page.');
