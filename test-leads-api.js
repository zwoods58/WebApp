// Test leads API
async function testLeadsAPI() {
  try {
    console.log('Testing leads API...');
    
    // Test GET leads
    const leadsResponse = await fetch('https://atarwebb.com/api/leads');
    console.log('Leads GET status:', leadsResponse.status);
    
    if (leadsResponse.status === 200) {
      const leadsResult = await leadsResponse.json();
      console.log('Leads result:', leadsResult);
    } else {
      const leadsText = await leadsResponse.text();
      console.log('Leads error (first 200 chars):', leadsText.substring(0, 200));
    }
    
    // Test debug env
    const debugResponse = await fetch('https://atarwebb.com/api/debug/env');
    console.log('Debug env status:', debugResponse.status);
    
    if (debugResponse.status === 200) {
      const debugResult = await debugResponse.json();
      console.log('Debug result:', debugResult);
    } else {
      const debugText = await debugResponse.text();
      console.log('Debug error (first 200 chars):', debugText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('Leads API test failed:', error.message);
  }
}

testLeadsAPI();


