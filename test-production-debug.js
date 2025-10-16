// Test production debug routes
async function testProductionDebug() {
  try {
    console.log('Testing production debug routes...');
    
    // Test simple route
    console.log('\n1. Testing simple route...');
    const simpleResponse = await fetch('https://atarwebb.com/api/test-simple');
    console.log('Simple status:', simpleResponse.status);
    const simpleResult = await simpleResponse.json();
    console.log('Simple result:', simpleResult);
    
    // Test environment route
    console.log('\n2. Testing environment route...');
    const envResponse = await fetch('https://atarwebb.com/api/test-env');
    console.log('Env status:', envResponse.status);
    const envResult = await envResponse.json();
    console.log('Env result:', envResult);
    
    // Test Supabase route
    console.log('\n3. Testing Supabase route...');
    const supabaseResponse = await fetch('https://atarwebb.com/api/test-supabase');
    console.log('Supabase status:', supabaseResponse.status);
    
    if (supabaseResponse.status === 200) {
      const supabaseResult = await supabaseResponse.json();
      console.log('Supabase result:', supabaseResult);
    } else {
      const supabaseText = await supabaseResponse.text();
      console.log('Supabase error (first 200 chars):', supabaseText.substring(0, 200));
    }
    
  } catch (error) {
    console.error('Debug test failed:', error.message);
  }
}

testProductionDebug();


