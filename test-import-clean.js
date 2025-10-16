// Test import with clean CSV file
const fs = require('fs');

async function testCleanImport() {
  try {
    // Read the clean CSV file
    const csvContent = fs.readFileSync('./test-leads-clean.csv', 'utf8');
    
    // Create form data manually
    const boundary = '----formdata-test-boundary';
    let formData = '';
    
    // Add file field
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="test-leads-clean.csv"\r\n`;
    formData += `Content-Type: text/csv\r\n\r\n`;
    formData += csvContent;
    formData += `\r\n`;
    
    // Add assignedTo field
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="assignedTo"\r\n\r\n`;
    formData += `sales`;
    formData += `\r\n`;
    
    // Close boundary
    formData += `--${boundary}--\r\n`;
    
    console.log('Testing clean CSV import...');
    
    const response = await fetch('http://localhost:3000/api/leads/import', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: formData
    });
    
    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);
    
    // Test the connection to see if leads were imported
    console.log('\n---\nTesting connection to see lead count...');
    const connectionResponse = await fetch('http://localhost:3000/api/test-supabase');
    const connectionResult = await connectionResponse.json();
    console.log('Connection result:', connectionResult);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testCleanImport();


