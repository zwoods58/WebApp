// Test script for all countries subscription webhook functionality
const testCountryWebhook = async (country, planId, amount, currency) => {
  console.log(`Testing ${country} subscription webhook...`);
  
  const webhookPayload = {
    event: 'subscription.created',
    data: {
      subscription: {
        id: `sub_test_${Date.now()}_${planId}`,
        customer: {
          id: `cust_${Date.now()}`,
          email: `test.${country.toLowerCase()}@example.com`,
          currencyCode: currency
        },
        plan: {
          id: planId,
          name: `${country} Weekly Plan`,
          amount: amount,
          currency: currency,
          interval: 'weekly',
          code: `${currency}_WEEKLY_${amount}`
        },
        startDate: new Date().toISOString(),
        nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        reference: `kyshi_ref_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3000/api/webhook/kyshi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    const result = await response.json();
    console.log(`${country} Webhook Response:`, result);
    return result;
  } catch (error) {
    console.error(`${country} Test failed:`, error);
    return null;
  }
};

// Test all countries
const testAllCountries = async () => {
  const countries = [
    { name: 'Kenya', planId: 'plan_ke_weekly', amount: 200, currency: 'KES' },
    { name: 'Nigeria', planId: 'plan_ng_weekly', amount: 500, currency: 'NGN' },
    { name: 'South Africa', planId: 'plan_za_weekly', amount: 30, currency: 'ZAR' },
    { name: 'Ghana', planId: 'plan_gh_weekly', amount: 15, currency: 'GHS' },
    { name: 'Uganda', planId: 'plan_ug_weekly', amount: 4000, currency: 'UGX' },
    { name: 'Rwanda', planId: 'plan_rw_weekly', amount: 1500, currency: 'RWF' },
    { name: 'Tanzania', planId: 'plan_tz_weekly', amount: 2000, currency: 'TZS' }
  ];

  console.log('=== Testing Universal Subscription System ===');
  
  for (const country of countries) {
    await testCountryWebhook(country.name, country.planId, country.amount, country.currency);
    console.log('---');
  }
  
  console.log('All country tests completed!');
};

// Run the test
testAllCountries();
