import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // I need to get this from env or find it
const SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY';

// I'll use a more direct approach: fetch the edge function directly if I know the URL.
// But I can also just simulate the fetch call that the edge function does.

const KYSHI_SECRET_KEY = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
const KYSHI_API = 'https://api.kyshi.co';

async function testCountry(country, amount, currency, channels, provider) {
  console.log(`\n--- Testing ${country} ---`);
  const payload = {
    email: 'test@example.com',
    amount: amount,
    localCurrency: currency,
    reference: `TEST-${country}-${Date.now()}`,
    channels: channels,
    redirectUrl: 'https://example.com/callback'
  };

  if (provider) {
    payload.mobileMoneyProvider = provider;
  }

  const response = await fetch(`${KYSHI_API}/v1/transactions/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KYSHI_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (data.status) {
    console.log(`✅ ${country} Success! URL: ${data.data.authorizationUrl}`);
  } else {
    console.log(`❌ ${country} Failed: ${data.message}`);
  }
}

async function runTests() {
  await testCountry('KE', 200, 'KES', ['mobileMoney'], 'm-pesa');
  await testCountry('NG', 500, 'NGN', ['card', 'bank_transfer']);
  await testCountry('GH', 20, 'GHS', ['mobileMoney'], 'mtn');
  await testCountry('CI', 1000, 'XOF', ['mobileMoney'], 'orange-money');
}

runTests();
