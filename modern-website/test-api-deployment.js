// Test API deployment on production
require('dotenv').config({ path: '.env.production' });

const https = require('https');

async function testAPIEndpoint() {
  console.log('Testing production API deployment...');
  
  const options = {
    hostname: 'atarwebb.com',
    port: 443,
    path: '/api/auth/security-questions',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NodeJS Test Client'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response body:', data);
        try {
          const parsed = JSON.parse(data);
          console.log('Parsed response:', parsed);
          resolve({ success: true, data: parsed });
        } catch (e) {
          console.log('Failed to parse JSON:', e.message);
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });

    req.on('error', (e) => {
      console.error('Request error:', e.message);
      reject({ success: false, error: e.message });
    });

    req.setTimeout(15000, () => {
      console.error('Request timeout after 15 seconds');
      req.destroy();
      reject({ success: false, error: 'Request timeout' });
    });

    req.end();
  });
}

testAPIEndpoint()
  .then(result => {
    if (result.success) {
      console.log('✅ API Test PASSED');
    } else {
      console.log('❌ API Test FAILED:', result.error);
    }
  })
  .catch(err => {
    console.error('❌ API Test ERROR:', err);
  });
