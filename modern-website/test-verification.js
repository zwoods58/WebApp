// Test script for payment verification endpoint
const testVerification = async () => {
  try {
    console.log('Testing payment verification endpoint...');
    
    const response = await fetch('http://localhost:3000/api/kyshi/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: 'ad8e6b57-278c-4848-a3e9-9fe444542eff'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testVerification();
