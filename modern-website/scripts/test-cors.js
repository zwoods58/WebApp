#!/usr/bin/env node

/**
 * CORS Testing Script
 * Tests CORS configuration for the Beezee API
 * 
 * Usage: node scripts/test-cors.js [url]
 * Example: node scripts/test-cors.js http://localhost:3000
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const TEST_ORIGIN = 'http://localhost:3000';

console.log('🧪 CORS Testing Script');
console.log('='.repeat(50));
console.log(`Testing URL: ${BASE_URL}`);
console.log(`Test Origin: ${TEST_ORIGIN}`);
console.log('='.repeat(50));
console.log('');

// Test endpoints
const endpoints = [
  '/api/auth/signup',
  '/api/auth/verify-pin',
  '/api/auth/check-phone',
  '/api/transactions',
  '/api/expenses'
];

// Helper to make HTTP request
function makeRequest(url, method, headers, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: headers
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

// Test preflight request
async function testPreflight(endpoint) {
  console.log(`\n📋 Testing Preflight: ${endpoint}`);
  console.log('-'.repeat(50));

  try {
    const response = await makeRequest(
      `${BASE_URL}${endpoint}`,
      'OPTIONS',
      {
        'Origin': TEST_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    );

    console.log(`Status: ${response.status}`);
    console.log('\nCORS Headers:');
    console.log(`  Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || '❌ Missing'}`);
    console.log(`  Access-Control-Allow-Methods: ${response.headers['access-control-allow-methods'] || '❌ Missing'}`);
    console.log(`  Access-Control-Allow-Headers: ${response.headers['access-control-allow-headers'] || '❌ Missing'}`);
    console.log(`  Access-Control-Allow-Credentials: ${response.headers['access-control-allow-credentials'] || '❌ Missing'}`);
    console.log(`  Access-Control-Max-Age: ${response.headers['access-control-max-age'] || '❌ Missing'}`);

    // Validate
    const isValid = 
      response.status === 204 &&
      response.headers['access-control-allow-origin'] &&
      response.headers['access-control-allow-methods'] &&
      response.headers['access-control-allow-headers'];

    if (isValid) {
      console.log('\n✅ Preflight test PASSED');
    } else {
      console.log('\n❌ Preflight test FAILED');
    }

    return isValid;
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    return false;
  }
}

// Test actual request
async function testActualRequest(endpoint) {
  console.log(`\n📨 Testing Actual Request: ${endpoint}`);
  console.log('-'.repeat(50));

  try {
    const testData = JSON.stringify({
      phoneNumber: '+254712345678',
      name: 'Test User',
      country: 'KE',
      industry: 'retail',
      pin: '123456'
    });

    const response = await makeRequest(
      `${BASE_URL}${endpoint}`,
      'POST',
      {
        'Origin': TEST_ORIGIN,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      },
      testData
    );

    console.log(`Status: ${response.status}`);
    console.log('\nCORS Headers:');
    console.log(`  Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || '❌ Missing'}`);
    console.log(`  Access-Control-Allow-Credentials: ${response.headers['access-control-allow-credentials'] || '❌ Missing'}`);

    const isValid = response.headers['access-control-allow-origin'] === TEST_ORIGIN;

    if (isValid) {
      console.log('\n✅ Actual request test PASSED');
    } else {
      console.log('\n❌ Actual request test FAILED');
    }

    return isValid;
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    return false;
  }
}

// Test unauthorized origin
async function testUnauthorizedOrigin(endpoint) {
  console.log(`\n🚫 Testing Unauthorized Origin: ${endpoint}`);
  console.log('-'.repeat(50));

  try {
    const response = await makeRequest(
      `${BASE_URL}${endpoint}`,
      'OPTIONS',
      {
        'Origin': 'http://evil.com',
        'Access-Control-Request-Method': 'POST'
      }
    );

    console.log(`Status: ${response.status}`);
    console.log(`Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || 'Not set'}`);

    // Should NOT have CORS headers for unauthorized origin
    const isBlocked = !response.headers['access-control-allow-origin'] || 
                      response.headers['access-control-allow-origin'] !== 'http://evil.com';

    if (isBlocked) {
      console.log('\n✅ Unauthorized origin correctly blocked');
    } else {
      console.log('\n❌ WARNING: Unauthorized origin was allowed!');
    }

    return isBlocked;
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  const results = {
    preflight: 0,
    actual: 0,
    security: 0,
    total: 0
  };

  // Test first endpoint thoroughly
  const testEndpoint = endpoints[0];
  
  const preflightResult = await testPreflight(testEndpoint);
  if (preflightResult) results.preflight++;
  results.total++;

  const actualResult = await testActualRequest(testEndpoint);
  if (actualResult) results.actual++;
  results.total++;

  const securityResult = await testUnauthorizedOrigin(testEndpoint);
  if (securityResult) results.security++;
  results.total++;

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`Preflight Tests: ${results.preflight > 0 ? '✅' : '❌'} ${results.preflight}/1`);
  console.log(`Actual Request Tests: ${results.actual > 0 ? '✅' : '❌'} ${results.actual}/1`);
  console.log(`Security Tests: ${results.security > 0 ? '✅' : '❌'} ${results.security}/1`);
  console.log('-'.repeat(50));
  
  const passed = results.preflight + results.actual + results.security;
  console.log(`Total: ${passed}/${results.total} tests passed`);
  
  if (passed === results.total) {
    console.log('\n🎉 All CORS tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some CORS tests failed. Please review the configuration.');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Test execution failed:', error);
  process.exit(1);
});
