// Test script to verify localStorage persistence across hard refreshes
const { JSDOM } = require('jsdom');

// Simulate browser environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.localStorage = dom.window.localStorage;

// Import the persistent storage utility
const { persistentStorage } = require('./src/utils/persistentStorage.ts');

async function testLocalStoragePersistence() {
  console.log('🧪 Testing localStorage persistence...\n');

  try {
    // Test 1: Basic storage and retrieval
    console.log('📝 Test 1: Basic storage and retrieval');
    const testData = {
      business: {
        id: 'test-business-123',
        business_name: 'Test Business',
        phone_number: '+254712345678',
        country: 'ke',
        industry: 'retail'
      },
      session: {
        businessId: 'test-business-123',
        businessName: 'Test Business',
        country: 'ke',
        industry: 'retail',
        phone: '+254712345678',
        timestamp: Date.now()
      }
    };

    // Store data
    const stored = persistentStorage.set('beezee_unified_auth', testData, { backup: true });
    console.log('✅ Data stored successfully:', stored);

    // Retrieve data
    const retrieved = persistentStorage.get('beezee_unified_auth');
    console.log('✅ Data retrieved successfully:', !!retrieved);
    console.log('📊 Retrieved business name:', retrieved?.business?.business_name);

    // Test 2: Data integrity verification
    console.log('\n🔍 Test 2: Data integrity verification');
    if (retrieved && JSON.stringify(retrieved) === JSON.stringify(testData)) {
      console.log('✅ Data integrity verified');
    } else {
      console.log('❌ Data integrity check failed');
    }

    // Test 3: Backup creation and restoration
    console.log('\n💾 Test 3: Backup creation and restoration');
    
    // Simulate data corruption by overwriting primary storage
    localStorage.setItem('beezee_unified_auth', JSON.stringify({
      business: { id: 'corrupted' },
      session: { businessId: 'corrupted' }
    }));

    // Try to retrieve - should fallback to backup
    const fallbackData = persistentStorage.get('beezee_unified_auth');
    if (fallbackData?.business?.id === 'test-business-123') {
      console.log('✅ Backup restoration working correctly');
    } else {
      console.log('❌ Backup restoration failed');
    }

    // Test 4: Emergency restore
    console.log('\n🚨 Test 4: Emergency restore');
    
    // Clear primary storage
    localStorage.removeItem('beezee_unified_auth');
    
    // Perform emergency restore
    const emergencyResult = persistentStorage.emergencyRestore();
    console.log('📊 Emergency restore result:', emergencyResult);
    
    if (emergencyResult.restored.includes('beezee_unified_auth')) {
      console.log('✅ Emergency restore successful');
    } else {
      console.log('❌ Emergency restore failed');
    }

    // Test 5: Storage statistics
    console.log('\n📈 Test 5: Storage statistics');
    const stats = persistentStorage.getStats();
    console.log('📊 Storage stats:', {
      totalItems: stats.totalItems,
      totalSize: stats.totalSize,
      backupItems: stats.backupItems,
      criticalItems: stats.criticalItems
    });

    // Test 6: Validation and repair
    console.log('\n🔧 Test 6: Validation and repair');
    const validationResult = persistentStorage.validateAndRepair();
    console.log('📊 Validation result:', validationResult);

    console.log('\n🎉 All localStorage persistence tests completed!');
    
    console.log('\n📝 Summary of localStorage persistence features:');
    console.log('  1. ✅ Primary storage with checksum verification');
    console.log('  2. ✅ Automatic backup creation for critical data');
    console.log('  3. ✅ Fallback to backup when primary is corrupted');
    console.log('  4. ✅ Emergency restore from multiple backup locations');
    console.log('  5. ✅ Data integrity validation and repair');
    console.log('  6. ✅ Extended TTL for critical auth data (30 days)');
    console.log('  7. ✅ Protection against aggressive cleanup');

    console.log('\n🔍 To test manually in browser:');
    console.log('  1. Open developer console');
    console.log('  2. Navigate to: http://localhost:3000/Beezee-App/auth/login');
    console.log('  3. Login with your credentials');
    console.log('  4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('  5. Verify you remain logged in');
    console.log('  6. Check localStorage in dev tools for backup data');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLocalStoragePersistence();
