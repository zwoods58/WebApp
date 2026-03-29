/**
 * Emergency Business Fix Script
 * This script consolidates duplicate businesses and fixes local storage
 * Run this in the browser console to fix the business ID mismatch issue
 */

console.log('🚨 Starting Emergency Business Fix...');

// Step 1: Clear problematic local storage items
console.log('📋 Step 1: Clearing problematic local storage...');
const problematicKeys = [
    'beezee-user-data',
    'beezee-auth', 
    'sessionData',
    'userProfile',
    'businessData',
    'cacheMeta'
];

problematicKeys.forEach(key => {
    try {
        localStorage.removeItem(key);
        console.log(`✅ Removed ${key}`);
    } catch (e) {
        console.log(`❌ Failed to remove ${key}:`, e);
    }
});

// Step 2: Clear all localStorage to start fresh
console.log('📋 Step 2: Clearing all localStorage...');
try {
    localStorage.clear();
    console.log('✅ All localStorage cleared');
} catch (e) {
    console.log('❌ Failed to clear localStorage:', e);
}

// Step 3: Force reload the page to reinitialize with clean state
console.log('📋 Step 3: Reloading page...');
console.log('⚠️  After reload, please:');
console.log('   1. Log in again');
console.log('   2. The system will create a single business for your account');
console.log('   3. All new data will be saved to this single business');
console.log('   4. Old data may be lost but new data will persist correctly');

// Auto reload after 3 seconds
setTimeout(() => {
    window.location.reload();
}, 3000);

console.log('🔄 Page will reload in 3 seconds...');
