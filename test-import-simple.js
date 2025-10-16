// Simple test for lead import
const fs = require('fs');

async function testImport() {
  try {
    // Read the CSV file
    const csvContent = fs.readFileSync('./test-leads-import.csv', 'utf8');
    
    // Create form data manually
    const boundary = '----formdata-test-boundary';
    let formData = '';
    
    // Add file field
    formData += `--${boundary}\r\n`;
    formData += `Content-Disposition: form-data; name="file"; filename="test-leads-import.csv"\r\n`;
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
    
    console.log('Testing lead import...');
    console.log('CSV content length:', csvContent.length);
    
    const response = await fetch('http://localhost:3000/api/leads/import', {
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
    
    try {
      const jsonResult = JSON.parse(result);
      console.log('Parsed JSON:', jsonResult);
    } catch (e) {
      console.log('Could not parse as JSON:', e.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testImport();


