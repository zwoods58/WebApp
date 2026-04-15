// Edge Function Test Script
// Tests the Supabase Edge Function for subscription creation

const testEdgeFunction = async () => {
  console.log('🚀 Testing Edge Function: create-subscription\n');

  // Test data
  const testData = {
    user_id: 'test-user-' + Date.now(),
    user_email: 'test@example.com',
    user_phone: '+254712345678',
    country: 'Kenya',
    full_name: 'Test User'
  };

  try {
    // Get Supabase configuration
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    console.log('📤 Sending test data:', testData);

    // Call the Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);

    if (!response.ok) {
      console.error('❌ Edge Function failed:', data.error);
      return false;
    }

    if (data.success) {
      console.log('✅ Edge Function executed successfully');
      console.log('🔗 Payment URL:', data.paymentUrl);
      console.log('💰 Amount:', data.amount, data.currency);
      console.log('📱 Payment Method:', data.paymentMethod);
      console.log('🔄 Redirect Behavior:', data.redirectBehavior);
      
      if (data.mobileMoneyProvider) {
        console.log('📱 Mobile Money Provider:', data.mobileMoneyProvider);
      }
      
      return true;
    } else {
      console.error('❌ Edge Function returned failure:', data);
      return false;
    }

  } catch (error) {
    console.error('❌ Error testing Edge Function:', error.message);
    return false;
  }
};

// Test different countries
const testCountries = async () => {
  const countries = ['Kenya', 'Nigeria', 'Ghana'];
  
  for (const country of countries) {
    console.log(`\n🌍 Testing ${country}...`);
    
    const testData = {
      user_id: `test-user-${country}-${Date.now()}`,
      user_email: `test-${country.toLowerCase()}@example.com`,
      user_phone: country === 'Kenya' ? '+254712345678' : 
                  country === 'Nigeria' ? '+2348012345678' : 
                  '+233201234567',
      country: country,
      full_name: `Test User ${country}`
    };

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`✅ ${country}: Success - ${data.paymentMethod} - ${data.amount} ${data.currency}`);
      } else {
        console.log(`❌ ${country}: Failed - ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${country}: Error - ${error.message}`);
    }
  }
};

// Check environment
const checkEnvironment = () => {
  console.log('🔧 Checking Environment Variables:');
  
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  let allSet = true;
  
  required.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${varName.includes('KEY') ? '***SET***' : value}`);
    } else {
      console.log(`❌ ${varName}: NOT SET`);
      allSet = false;
    }
  });
  
  return allSet;
};

// Run tests
if (checkEnvironment()) {
  testEdgeFunction().then(success => {
    if (success) {
      console.log('\n🎯 Testing multiple countries...');
      testCountries();
    }
  });
} else {
  console.log('\n❌ Cannot run test due to missing environment variables.');
}
