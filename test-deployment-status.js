// Test if the new deployment is active
async function testDeploymentStatus() {
  try {
    console.log('Testing deployment status...');
    
    // Test a simple endpoint first
    const healthResponse = await fetch('https://atarwebb.com/api/health');
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.status === 200) {
      const healthData = await healthResponse.json();
      console.log('Health data:', healthData);
    }
    
    // Test with a very simple CSV
    const simpleCSV = `firstName,lastName,email
Test,User,test@example.com`;

    const boundary = '----formdata-test-boundary';
    let formData = '';
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="simple-test.csv"\r\n`;
    formData += `Content-Type: text/csv\r\n\r\n`;
    formData += simpleCSV;
    formData += `\r\n`;
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="assignedTo"\r\n\r\n`;
    formData += `sales`;
    formData += `\r\n`;
    
    formData += `--${boundary}--\r\n`;
    
    console.log('\nTesting simple import...');
    
    const response = await fetch('https://atarwebb.com/api/leads/import', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: formData
    });
    
    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);
    
    // Check current leads count
    const leadsResponse = await fetch('https://atarwebb.com/api/leads');
    const leads = await leadsResponse.json();
    console.log('Current leads count:', leads.length);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDeploymentStatus();


