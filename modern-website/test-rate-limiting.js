// Test script for phone-based rate limiting
const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '+254700000000';

// Test data
const signupData = {
  phoneNumber: TEST_PHONE,
  pin: '123456',
  name: 'Test User',
  businessName: 'Test Business',
  country: 'KE',
  industry: 'technology',
  currency: 'KES',
  dailyTarget: 1000,
  inviteCode: 'TEST123',
  industrySector: 'software'
};

const pinVerifyData = {
  phoneNumber: TEST_PHONE,
  pin: '123456'
};

async function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: JSON.parse(body)
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

async function testSignupRateLimit() {
  console.log('\n=== Testing Signup Rate Limit (10 attempts per 15 min) ===');
  
  for (let i = 1; i <= 12; i++) {
    try {
      const response = await makeRequest('/api/auth/signup', signupData);
      console.log(`Attempt ${i}: Status ${response.statusCode}, RateLimit-Remaining: ${response.headers['x-ratelimit-remaining']}`);
      
      if (response.statusCode === 429) {
        console.log(`Rate limit hit on attempt ${i}: ${response.body.message}`);
        break;
      }
    } catch (error) {
      console.error(`Attempt ${i} failed:`, error.message);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function testPinVerificationProgressiveBackoff() {
  console.log('\n=== Testing PIN Verification Progressive Backoff ===');
  
  // Use wrong PIN to trigger progressive backoff
  const wrongPinData = { ...pinVerifyData, pin: '000000' };
  
  for (let i = 1; i <= 16; i++) {
    try {
      const response = await makeRequest('/api/auth/verify-pin', wrongPinData);
      console.log(`Attempt ${i}: Status ${response.statusCode}, Escalation: ${response.body.escalationLevel || 'N/A'}`);
      
      if (response.statusCode === 429) {
        console.log(`Progressive backoff on attempt ${i}: ${response.body.message}`);
        console.log(`Lockout until: ${response.body.lockoutUntil}`);
        console.log(`Escalation level: ${response.body.escalationLevel}`);
        break;
      }
    } catch (error) {
      console.error(`Attempt ${i} failed:`, error.message);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function testBeehiveRateLimit() {
  console.log('\n=== Testing Beehive Rate Limit (1000 attempts per 1 min) ===');
  
  const beehiveData = {
    action: 'addRequest',
    data: {
      title: 'Test Feature Request',
      content: 'This is a test feature request for rate limiting',
      business_id: 'test-business-id',
      industry: 'technology',
      country: 'KE'
    },
    userId: 'test-user-id'
  };
  
  for (let i = 1; i <= 5; i++) {
    try {
      const response = await makeRequest('/api/beehive', beehiveData);
      console.log(`Beehive attempt ${i}: Status ${response.statusCode}, RateLimit-Remaining: ${response.headers['x-ratelimit-remaining']}`);
      
      if (response.statusCode === 429) {
        console.log(`Beehive rate limit hit on attempt ${i}: ${response.body.message}`);
        break;
      }
    } catch (error) {
      console.error(`Beehive attempt ${i} failed:`, error.message);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function testSyncRateLimit() {
  console.log('\n=== Testing Sync Rate Limit (1000 attempts per 1 min) ===');
  
  const syncData = {
    operations: [
      {
        id: 'test-op-1',
        table: 'inventory',
        type: 'CREATE',
        data: {
          business_id: 'test-business-id',
          item_name: 'Test Item',
          quantity: 10,
          price: 100
        }
      }
    ]
  };
  
  for (let i = 1; i <= 5; i++) {
    try {
      const response = await makeRequest('/api/offline/sync', syncData);
      console.log(`Sync attempt ${i}: Status ${response.statusCode}, RateLimit-Remaining: ${response.headers['x-ratelimit-remaining']}`);
      
      if (response.statusCode === 429) {
        console.log(`Sync rate limit hit on attempt ${i}: ${response.body.message}`);
        break;
      }
    } catch (error) {
      console.error(`Sync attempt ${i} failed:`, error.message);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function runTests() {
  console.log('Starting Rate Limiting Tests...');
  console.log('Make sure the development server is running on http://localhost:3000');
  
  try {
    await testSignupRateLimit();
    await testPinVerificationProgressiveBackoff();
    await testBeehiveRateLimit();
    await testSyncRateLimit();
    console.log('\n=== Tests Complete ===');
  } catch (error) {
    console.error('Test suite failed:', error);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { makeRequest, testSignupRateLimit, testPinVerificationProgressiveBackoff };
