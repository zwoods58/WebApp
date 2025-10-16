// Test fresh import with clean data
const fs = require('fs');

async function testFreshImport() {
  try {
    // Create a fresh CSV with different data
    const freshCSV = `firstName,lastName,email,company,phone,source,industry
Alice,Johnson,alice.j@freshcorp.com,Fresh Corp,555-1001,Website,Technology
Bob,Williams,bob.w@newstart.com,NewStart Inc,555-1002,Referral,Software
Carol,Davis,carol.d@innovate.io,Innovate LLC,555-1003,LinkedIn,Fintech`;

    // Write fresh CSV
    fs.writeFileSync('./fresh-leads.csv', freshCSV);
    
    // Create form data
    const boundary = '----formdata-test-boundary';
    let formData = '';
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="fresh-leads.csv"\r\n`;
    formData += `Content-Type: text/csv\r\n\r\n`;
    formData += freshCSV;
    formData += `\r\n`;
    
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="assignedTo"\r\n\r\n`;
    formData += `sales`;
    formData += `\r\n`;
    
    formData += `--${boundary}--\r\n`;
    
    console.log('Testing fresh import...');
    
    const response = await fetch('http://localhost:3000/api/leads/import', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: formData
    });
    
    const result = await response.text();
    console.log('Import result:', result);
    
    // Check final lead count
    const connectionResponse = await fetch('http://localhost:3000/api/test-supabase');
    const connectionResult = await connectionResponse.json();
    console.log('Final lead count:', connectionResult.leadCount);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testFreshImport();


