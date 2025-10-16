// Simple production test
async function testProduction() {
  try {
    console.log('Testing production deployment...');
    
    // Test basic connection
    console.log('\n1. Testing basic connection...');
    const response = await fetch('https://atarwebb.com/api/test-supabase');
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    const text = await response.text();
    console.log('Response (first 200 chars):', text.substring(0, 200));
    
    // Test if it's JSON
    try {
      const json = JSON.parse(text);
      console.log('JSON response:', json);
    } catch (e) {
      console.log('Not JSON response - might be HTML error page');
    }
    
    // Test admin panel
    console.log('\n2. Testing admin panel...');
    const adminResponse = await fetch('https://atarwebb.com/admin');
    console.log('Admin status:', adminResponse.status);
    console.log('Admin Content-Type:', adminResponse.headers.get('content-type'));
    
  } catch (error) {
    console.error('Production test failed:', error.message);
  }
}

testProduction();


