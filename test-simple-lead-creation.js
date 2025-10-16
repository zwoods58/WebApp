// Test simple lead creation via API
async function testSimpleLeadCreation() {
  try {
    console.log('Testing simple lead creation...');
    
    const testLead = {
      firstName: 'Simple',
      lastName: 'Test',
      email: 'simple.test@example.com',
      company: 'Simple Corp',
      phone: '555-7777',
      source: 'API Test',
      industry: 'Technology',
      status: 'NEW',
      score: 50,
      userId: '00000000-0000-0000-0000-000000000002'
    };
    
    console.log('Creating lead with data:', testLead);
    
    const response = await fetch('https://atarwebb.com/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testLead)
    });
    
    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);
    
    if (response.status === 200) {
      console.log('SUCCESS! Lead created successfully');
      
      // Check current leads count
      const leadsResponse = await fetch('https://atarwebb.com/api/leads');
      const leads = await leadsResponse.json();
      console.log('Current leads count:', leads.length);
    } else {
      console.log('FAILED! Lead creation failed');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSimpleLeadCreation();


