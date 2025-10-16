// Test script for lead importing
const fs = require('fs');
const FormData = require('form-data');

async function testLeadImport() {
  try {
    // Read the test CSV file
    const csvContent = fs.readFileSync('./test-leads-import.csv', 'utf8');
    
    // Create form data
    const formData = new FormData();
    formData.append('file', csvContent, {
      filename: 'test-leads-import.csv',
      contentType: 'text/csv'
    });
    formData.append('assignedTo', 'sales');
    
    // Test locally
    console.log('Testing local import...');
    const localResponse = await fetch('http://localhost:3000/api/leads/import', {
      method: 'POST',
      body: formData
    });
    
    const localResult = await localResponse.json();
    console.log('Local result:', localResult);
    
    // Test production (replace with your actual domain)
    console.log('\nTesting production import...');
    const prodResponse = await fetch('https://your-domain.vercel.app/api/leads/import', {
      method: 'POST',
      body: formData
    });
    
    const prodResult = await prodResponse.json();
    console.log('Production result:', prodResult);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLeadImport();


