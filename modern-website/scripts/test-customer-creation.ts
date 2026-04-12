#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';

async function testCustomerCreation() {
  console.log('🧪 Testing Kyshi Customer Creation\n');

  // Test 1: List existing customers
  console.log('1️⃣  Testing GET /customers (list)...');
  try {
    const listResponse = await fetch(`${KYSHI_BASE_URL}/customers`, {
      method: 'GET',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log(`   Status: ${listResponse.status}`);
    if (listResponse.ok) {
      const data = await listResponse.json();
      console.log('   ✅ Can list customers');
      console.log(`   Found ${data.data?.data?.length || 0} customers`);
    } else {
      const errorText = await listResponse.text();
      console.log('   ❌ Cannot list customers');
      console.log('   Error:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
  }

  // Test 2: Create a customer
  console.log('\n2️⃣  Testing POST /customers (create)...');
  const testCustomer = {
    email: `test-${Date.now()}@beezee.test`,
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '+254712345678'
  };

  console.log('   Payload:', JSON.stringify(testCustomer, null, 2));

  try {
    const createResponse = await fetch(`${KYSHI_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCustomer)
    });

    console.log(`   Status: ${createResponse.status}`);
    const responseText = await createResponse.text();

    if (createResponse.ok) {
      console.log('   ✅ Customer created successfully!');
      const data = JSON.parse(responseText);
      console.log('   Customer ID:', data.data?.id);
      console.log('   Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('   ❌ Customer creation failed');
      console.log('   Error:', responseText);
      
      // Try to parse error
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.message) {
          console.log('\n   💡 Error Message:', errorData.message);
        }
      } catch {}
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
  }

  // Test 3: Try with different payload formats
  console.log('\n3️⃣  Testing alternative payload formats...');
  
  const alternativePayloads = [
    {
      name: 'With currencyCode',
      payload: {
        email: `test2-${Date.now()}@beezee.test`,
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '+254712345678',
        currencyCode: 'KES'
      }
    },
    {
      name: 'Minimal (email only)',
      payload: {
        email: `test3-${Date.now()}@beezee.test`
      }
    },
    {
      name: 'With countryCode',
      payload: {
        email: `test4-${Date.now()}@beezee.test`,
        firstName: 'Test',
        lastName: 'User',
        countryCode: 'KE'
      }
    }
  ];

  for (const test of alternativePayloads) {
    console.log(`\n   Testing: ${test.name}`);
    try {
      const response = await fetch(`${KYSHI_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'x-api-key': KYSHI_SECRET_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.payload)
      });

      if (response.ok) {
        console.log(`   ✅ ${test.name} worked!`);
        const data = await response.json();
        console.log(`   Customer ID: ${data.data?.id}`);
        break; // Found working format
      } else {
        console.log(`   ❌ ${test.name} failed (${response.status})`);
      }
    } catch (error) {
      console.log(`   ❌ ${test.name} error`);
    }
  }
}

testCustomerCreation();
