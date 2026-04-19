const https = require('https');

const KYSHI_SECRET_KEY = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';

function testCountry(country, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'api.kyshi.co',
      port: 443,
      path: '/v1/transactions/initialize',
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          console.log(`\n--- Testing ${country} ---`);
          if (json.status) {
            console.log(`✅ Success! URL: ${json.data.authorizationUrl}`);
          } else {
            console.log(`❌ Failed: ${json.message}`);
            if (json.data) console.log('Data:', json.data);
          }
          resolve(json);
        } catch (e) {
          console.log(`\n--- Testing ${country} ---`);
          console.log('❌ Invalid JSON response:', responseBody);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Error with ${country}:`, e);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  await testCountry('Kenya (KE)', {
    email: 'test-ke@example.com',
    amount: 200,
    localCurrency: 'KES',
    reference: `TEST-KE-${Date.now()}`,
    channels: ['mobileMoney'],
    mobileMoneyProvider: 'm-pesa',
    redirectUrl: 'https://example.com'
  });

  await testCountry('Nigeria (NG)', {
    email: 'test-ng@example.com',
    amount: 500,
    localCurrency: 'NGN',
    reference: `TEST-NG-${Date.now()}`,
    channels: ['card', 'bank_transfer'],
    redirectUrl: 'https://example.com'
  });

  await testCountry('Ghana (GH)', {
    email: 'test-gh@example.com',
    amount: 20,
    localCurrency: 'GHS',
    reference: `TEST-GH-${Date.now()}`,
    channels: ['mobileMoney'],
    mobileMoneyProvider: 'mtn',
    redirectUrl: 'https://example.com'
  });

  await testCountry('Cote d\'Ivoire (CI)', {
    email: 'test-ci@example.com',
    amount: 1000,
    localCurrency: 'XOF',
    reference: `TEST-CI-${Date.now()}`,
    channels: ['mobileMoney'],
    mobileMoneyProvider: 'orange-money',
    redirectUrl: 'https://example.com'
  });
}

runTests();
