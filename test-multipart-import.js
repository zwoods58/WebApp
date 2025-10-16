// Test import with exact multipart form data format
const fs = require('fs');

async function testMultipartImport() {
  try {
    console.log('Testing multipart form data import...');
    
    const testCSV = `firstName,lastName,email,company,phone,source,industry
Multipart,Test,multipart.test@example.com,Multipart Corp,555-8888,Website,Technology`;

    const boundary = '----formdata-test-boundary';
    let formData = '';
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="test.csv"\r\n`;
    formData += `Content-Type: text/csv\r\n\r\n`;
    formData += testCSV;
    formData += `\r\n`;
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="assignedTo"\r\n\r\n`;
    formData += `sales`;
    formData += `\r\n`;
    
    formData += `--${boundary}--\r\n`;
    
    console.log('Form data length:', formData.length);
    console.log('First 200 chars of form data:');
    console.log(formData.substring(0, 200));
    
    const response = await fetch('https://atarwebb.com/api/leads/import', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: formData
    });
    
    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Import result:', JSON.stringify(result, null, 2));
    
    // Check current leads count
    const leadsResponse = await fetch('https://atarwebb.com/api/leads');
    const leads = await leadsResponse.json();
    console.log('Current leads count after import:', leads.length);
    
  } catch (error) {
    console.error('Multipart test failed:', error);
  }
}

testMultipartImport();


