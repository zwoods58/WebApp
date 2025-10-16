// Test GET leads endpoint
async function testLeadsGet() {
  try {
    console.log('Testing GET leads endpoint...');
    
    const response = await fetch('https://atarwebb.com/api/leads');
    
    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);
    
    if (response.status === 200) {
      console.log('SUCCESS! GET leads works');
    } else {
      console.log('FAILED! GET leads failed');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLeadsGet();


