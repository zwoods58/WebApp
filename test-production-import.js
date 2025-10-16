// Test production lead import
const fs = require('fs');

async function testProductionImport() {
  try {
    // Create a production test CSV
    const prodCSV = `firstName,lastName,email,company,phone,source,industry
Production,Test,prod.test@example.com,Production Corp,555-2001,Website,Technology
Live,User,live.user@demo.com,Live Demo Inc,555-2002,Referral,Software`;

    // Write production CSV
    fs.writeFileSync('./production-test-leads.csv', prodCSV);
    
    // Create form data
    const boundary = '----formdata-prod-boundary';
    let formData = '';
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="production-test-leads.csv"\r\n`;
    formData += `Content-Type: text/csv\r\n\r\n`;
    formData += prodCSV;
    formData += `\r\n`;
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="assignedTo"\r\n\r\n`;
    formData += `sales`;
    formData += `\r\n`;
    
    formData += `--${boundary}--\r\n`;
    
    console.log('Testing production import...');
    
    const response = await fetch('https://atarwebb.com/api/leads/import', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: formData
    });
    
    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Import result:', result);
    
    // Test connection
    console.log('\n---\nTesting production connection...');
    const connectionResponse = await fetch('https://atarwebb.com/api/test-supabase');
    const connectionResult = await connectionResponse.json();
    console.log('Connection result:', connectionResult);
    
  } catch (error) {
    console.error('Production test failed:', error);
  }
}

testProductionImport();


