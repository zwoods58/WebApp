#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';

async function testKyshiConnection() {
  console.log('🔍 Testing Kyshi API Connection...\n');
  console.log('Configuration:');
  console.log(`  Base URL: ${KYSHI_BASE_URL}`);
  console.log(`  API Key: ${KYSHI_SECRET_KEY ? KYSHI_SECRET_KEY.substring(0, 12) + '...' : 'MISSING'}`);
  console.log(`  Key Length: ${KYSHI_SECRET_KEY?.length || 0} characters`);
  console.log(`  Key Prefix: ${KYSHI_SECRET_KEY?.substring(0, 8) || 'N/A'}\n`);

  if (!KYSHI_SECRET_KEY) {
    console.error('❌ KYSHI_SECRET_KEY is not set in .env.local');
    process.exit(1);
  }

  if (!KYSHI_SECRET_KEY.startsWith('sk_test_')) {
    console.warn('⚠️  Warning: API key does not start with sk_test_');
    console.warn('   Make sure you are using the test mode secret key\n');
  }

  try {
    console.log('📡 Making request to GET /plans...');
    const url = `${KYSHI_BASE_URL}/plans`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log(`\n📊 Response Status: ${response.status} ${response.statusText}`);
    console.log('Response Headers:');
    response.headers.forEach((value: string, key: string) => {
      console.log(`  ${key}: ${value}`);
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('\n❌ API Request Failed!');
      console.error('Status:', response.status);
      console.error('Response:', responseText);
      
      if (response.status === 401) {
        console.error('\n🔑 Authentication Error - Possible causes:');
        console.error('  1. API key is incorrect or expired');
        console.error('  2. Using public key (pk_test_) instead of secret key (sk_test_)');
        console.error('  3. API key is not active in Kyshi dashboard');
        console.error('\n💡 Solution:');
        console.error('  - Go to Kyshi dashboard → API Configuration');
        console.error('  - Copy the Test Mode Secret Key (starts with sk_test_)');
        console.error('  - Update KYSHI_SECRET_KEY in .env.local');
        console.error('  - Restart your dev server');
      }
      
      process.exit(1);
    }

    console.log('\n✅ API Connection Successful!');
    
    try {
      const data = JSON.parse(responseText);
      console.log('\n📋 Response Data:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.data && Array.isArray(data.data)) {
        console.log(`\n📊 Found ${data.data.length} plans in Kyshi`);
        
        const beezeePlans = data.data.filter((plan: any) => 
          plan.name?.toLowerCase().includes('beezee')
        );
        
        if (beezeePlans.length > 0) {
          console.log(`\n🐝 Beezee Plans (${beezeePlans.length}):`);
          beezeePlans.forEach((plan: any) => {
            console.log(`  - ${plan.name} (${plan.code}): ${plan.amount} ${plan.localCurrency}`);
          });
        }
      }
    } catch (parseError) {
      console.log('\nRaw Response:', responseText);
    }

    console.log('\n✨ Test completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n💥 Error during API test:');
    console.error(error);
    
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        console.error('\n🌐 Network Error - Possible causes:');
        console.error('  1. No internet connection');
        console.error('  2. Kyshi API is down');
        console.error('  3. Firewall blocking the request');
      }
    }
    
    process.exit(1);
  }
}

testKyshiConnection();
