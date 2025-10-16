// Test import with the exact same format as the working simple test
const fs = require('fs');

async function testFixedImport() {
  try {
    console.log('Testing fixed import...');
    
    // Use the exact same CSV format that worked
    const testCSV = `firstName,lastName,email,company,phone,source,industry
Fixed,Test,fixed.test@example.com,Fixed Corp,555-8888,Website,Technology`;

    const boundary = '----formdata-test-boundary';
    let formData = '';
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="fixed-test.csv"\r\n`;
    formData += `Content-Type: text/csv\r\n\r\n`;
    formData += testCSV;
    formData += `\r\n`;
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="assignedTo"\r\n\r\n`;
    formData += `sales`;
    formData += `\r\n`;
    
    formData += `--${boundary}--\r\n`;
    
    console.log('Testing import with fixed format...');
    
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
    
    if (leads.length > 9) {
      console.log('SUCCESS! New lead was imported');
      console.log('Latest lead:', leads[0]);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testFixedImport();


