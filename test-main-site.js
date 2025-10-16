// Test main site
async function testMainSite() {
  try {
    console.log('Testing main site...');
    
    // Test homepage
    const homeResponse = await fetch('https://atarwebb.com/');
    console.log('Homepage status:', homeResponse.status);
    console.log('Homepage Content-Type:', homeResponse.headers.get('content-type'));
    
    // Test admin page
    const adminResponse = await fetch('https://atarwebb.com/admin');
    console.log('Admin status:', adminResponse.status);
    console.log('Admin Content-Type:', adminResponse.headers.get('content-type'));
    
    // Test a known API route
    const healthResponse = await fetch('https://atarwebb.com/api/health');
    console.log('Health API status:', healthResponse.status);
    
    if (healthResponse.status === 200) {
      const healthResult = await healthResponse.json();
      console.log('Health result:', healthResult);
    } else {
      const healthText = await healthResponse.text();
      console.log('Health error (first 200 chars):', healthText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('Main site test failed:', error.message);
  }
}

testMainSite();


