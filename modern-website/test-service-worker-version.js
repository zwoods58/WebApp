// Test script to verify service worker version is working
console.log('Testing Service Worker Version...\n');

async function testServiceWorkerVersion() {
  try {
    // Test version-check API
    console.log('1. Testing /api/version-check endpoint...');
    const versionResponse = await fetch('http://localhost:3000/api/version-check');
    const versionData = await versionResponse.json();
    
    console.log('Version API Response:', {
      version: versionData.version,
      cleanVersion: versionData.cleanVersion,
      manifestVersion: versionData.manifestVersion
    });
    
    // Check if version is v110
    if (versionData.cleanVersion === 'v110') {
      console.log('   SUCCESS: Version API is returning v110');
    } else {
      console.log('   ERROR: Version API is returning', versionData.cleanVersion, 'instead of v110');
    }
    
    // Test service worker registration
    console.log('\n2. Testing service worker registration...');
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('   Service worker found:', registration.scope);
        
        // Check if service worker is active
        if (registration.active) {
          console.log('   Service worker is active');
          
          // Try to communicate with service worker to get version
          registration.active.postMessage({ type: 'GET_VERSION' });
        } else {
          console.log('   Service worker is not active yet');
        }
      } else {
        console.log('   No service worker registration found');
      }
    } else {
      console.log('   Service Worker not supported in this browser');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run test
testServiceWorkerVersion();
