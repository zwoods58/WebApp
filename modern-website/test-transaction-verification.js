// Test the verification endpoint with the actual transaction reference
const testTransactionVerification = async () => {
  try {
    console.log('Testing transaction verification with actual transaction reference...');
    
    // Use the transaction reference we created
    const reference = 'KYSHI-1776167711918';
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

testTransactionVerification();
