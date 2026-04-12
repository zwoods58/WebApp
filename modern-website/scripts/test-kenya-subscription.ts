#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';

const KENYA_PLAN_CODE = 'PLN_7fgRaAQBesq9iLu';

async function testKenyaPlan() {
  console.log('🇰🇪 Testing Kenya Plan Setup\n');
  console.log('═══════════════════════════════════════════════════\n');

  // 1. Verify plan exists in Kyshi
  console.log('1️⃣  Verifying plan in Kyshi API...');
  try {
    const planResponse = await fetch(`${KYSHI_BASE_URL}/plans/${KENYA_PLAN_CODE}`, {
      method: 'GET',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!planResponse.ok) {
      console.log('   ❌ Plan not found in Kyshi');
      return;
    }

    const planData = await planResponse.json();
    console.log('   ✅ Plan exists in Kyshi');
    console.log('   📋 Plan Details:');
    console.log(`      Name: ${planData.data.name}`);
    console.log(`      Code: ${planData.data.code}`);
    console.log(`      Amount: ${planData.data.amount} ${planData.data.localCurrency || 'KES'}`);
    console.log(`      Interval: ${planData.data.interval}`);
    console.log(`      Status: ${planData.data.isActive ? 'Active' : 'Inactive'}`);

    // 2. Test creating a customer
    console.log('\n2️⃣  Testing customer creation...');
    const testCustomer = {
      email: `test-${Date.now()}@beezee.test`,
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '+254712345678',
      currencyCode: 'KES'
    };

    const customerResponse = await fetch(`${KYSHI_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCustomer)
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.log('   ⚠️  Customer creation failed (might already exist)');
      console.log('   Error:', errorText);
    } else {
      const customerData = await customerResponse.json();
      console.log('   ✅ Customer created successfully');
      console.log(`      Customer ID: ${customerData.data.id}`);
      console.log(`      Email: ${customerData.data.email}`);
    }

    // 3. Summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅ KENYA PLAN IS READY FOR TESTING!\n');
    console.log('📝 Next Steps:');
    console.log('   1. Go to /test/kyshi in your app');
    console.log('   2. Select "Kenya" from country dropdown');
    console.log('   3. The plan should appear: "Beezee Weekly Kenya - 200 KES"');
    console.log('   4. Enter test customer details');
    console.log('   5. Create subscription\n');
    console.log('💡 Test Customer Details:');
    console.log(`   Email: ${testCustomer.email}`);
    console.log(`   Phone: ${testCustomer.phoneNumber}`);
    console.log(`   Country: Kenya (KE)`);
    console.log('\n═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.log('   ❌ Error:', error);
  }
}

testKenyaPlan();
