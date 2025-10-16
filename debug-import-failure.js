// Debug import failure in production
const fs = require('fs');

async function debugImportFailure() {
  try {
    console.log('Debugging import failure...');
    
    // Create a simple test CSV
    const testCSV = `firstName,lastName,email,company,phone,source,industry
Debug,Test,debug.test@example.com,Debug Corp,555-9999,Website,Technology`;

    // Write test CSV
    fs.writeFileSync('./debug-test.csv', testCSV);
    
    // Create form data
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
    
    console.log('Testing production import...');
    
    const response = await fetch('https://atarwebb.com/api/leads/import', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: formData
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log('Response body:', result);
    
    // Also test the leads API to see current state
    console.log('\n---\nTesting leads API...');
    const leadsResponse = await fetch('https://atarwebb.com/api/leads');
    console.log('Leads API status:', leadsResponse.status);
    
    if (leadsResponse.status === 200) {
      const leads = await leadsResponse.json();
      console.log('Current leads count:', leads.length);
      console.log('Latest lead:', leads[0]);
    } else {
      const leadsText = await leadsResponse.text();
      console.log('Leads API error:', leadsText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugImportFailure();


