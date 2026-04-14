// Test the fixed verification endpoint with a real subscription
const testFixedVerification = async () => {
  try {
    console.log('Testing fixed verification endpoint...');
    
    // Use the most recent subscription code for ferb@gmail.com
    const reference = 'SUB_E6tNQlYlZf-TpR-';
    console.log('Testing verification for reference:', reference);
    
    const response = await fetch('http://localhost:3000/api/kyshi/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: reference
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testFixedVerification();
