// Test the debug import endpoint
const fs = require('fs');

async function testDebugEndpoint() {
  try {
    console.log('Testing debug import endpoint...');
    
    const testCSV = `firstName,lastName,email,company,phone,source,industry
Debug,Test,debug.test@example.com,Debug Corp,555-9999,Website,Technology`;

    const boundary = '----formdata-debug-boundary';
    let formData = '';
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="debug-test.csv"\r\n`;
    formData += `Content-Type: text/csv\r\n\r\n`;
    formData += testCSV;
    formData += `\r\n`;
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="assignedTo"\r\n\r\n`;
    formData += `sales`;
    formData += `\r\n`;
    
    formData += `--${boundary}--\r\n`;
    
    const response = await fetch('https://atarwebb.com/api/debug-import', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: formData
    });
    
    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Debug result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Debug test failed:', error);
  }
}

testDebugEndpoint();


