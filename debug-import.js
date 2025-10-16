// Debug script to see what's happening with the import
const fs = require('fs');

async function debugImport() {
  try {
    // Read the CSV file
    const csvContent = fs.readFileSync('./test-leads-import.csv', 'utf8');
    console.log('CSV Content:');
    console.log(csvContent);
    console.log('\n---\n');
    
    // Parse CSV manually to see what we're getting
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('Headers:', headers);
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const values = line.split(',');
      console.log(`Row ${i}:`, values);
    }
    
    // Test a simple lead creation via API
    console.log('\n---\nTesting simple lead creation...');
    
    const testLead = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      company: 'Test Corp',
      phone: '555-0123',
      source: 'Test',
      industry: 'Technology',
      status: 'NEW',
      score: 50,
      userId: '00000000-0000-0000-0000-000000000002' // Sales user ID
    };
    
    const response = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testLead)
    });
    
    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugImport();


