// Debug lead creation process
const fs = require('fs');

async function debugLeadCreation() {
  try {
    // Test creating a single lead with the exact data from CSV
    const testLead = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'Acme Corporation',
      phone: '555-0123',
      source: 'Website',
      industry: 'Technology',
      status: 'NEW',
      score: 50,
      userId: '00000000-0000-0000-0000-000000000002' // Sales user ID
    };
    
    console.log('Testing lead creation with data:', testLead);
    
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
    
    if (response.status !== 200) {
      console.log('Lead creation failed. Checking what leads exist...');
      
      // Check existing leads
      const leadsResponse = await fetch('http://localhost:3000/api/leads');
      const leads = await leadsResponse.json();
      console.log('Existing leads:', leads);
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  }
}

debugLeadCreation();


