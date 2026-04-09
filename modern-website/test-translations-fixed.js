// Test script to verify translation system is working
const testTranslations = async () => {
  console.log('=== Testing Translation System Fix ===');
  console.log('');
  
  try {
    // Test importing the TypeScript smart-translation
    const { default: smartTranslate } = await import('./src/translations/smart-translation.ts');
    
    console.log('1. Testing subscription translations:');
    
    // Test subscription modal translations
    const subscriptionTests = [
      { key: 'subscription.upgrade_to_premium', expected: 'Upgrade to Premium' },
      { key: 'subscription.subscription_activated', expected: 'Subscription Activated!' },
      { key: 'subscription.enjoy_premium_features', expected: 'Enjoy all premium features' },
      { key: 'subscription.subscribe_now', expected: 'Subscribe Now' },
      { key: 'more.subscription', expected: 'Subscription' },
      { key: 'more.subscription_description', expected: 'Upgrade to premium features' }
    ];
    
    subscriptionTests.forEach((test, index) => {
      const result = smartTranslate(test.key, 'en', 'retail');
      const passed = result === test.expected;
      console.log(`  ${index + 1}. ${test.key}: ${passed ? 'PASS' : 'FAIL'}`);
      console.log(`     Expected: "${test.expected}"`);
      console.log(`     Got: "${result}"`);
      if (!passed) {
        console.log(`     ERROR: Raw string detected!`);
      }
      console.log('');
    });
    
    console.log('2. Testing other languages:');
    
    // Test Swahili
    const swahiliResult = smartTranslate('subscription.upgrade_to_premium', 'sw', 'retail');
    console.log(`  Swahili: "${swahiliResult}"`);
    
    // Test Hausa
    const hausaResult = smartTranslate('subscription.upgrade_to_premium', 'ha', 'retail');
    console.log(`  Hausa: "${hausaResult}"`);
    
    console.log('');
    console.log('3. Testing fallback behavior:');
    
    // Test non-existent key
    const fallbackResult = smartTranslate('non.existent.key', 'en', 'retail', 'Fallback Text');
    console.log(`  Fallback: "${fallbackResult}" (should be "Fallback Text")`);
    
    console.log('');
    console.log('=== Translation System Test Complete ===');
    console.log('If all tests show PASS instead of raw strings, the fix is successful!');
    
  } catch (error) {
    console.error('Test failed:', error);
    console.log('This indicates the TypeScript conversion may have issues.');
  }
};

// Run the test
testTranslations();
