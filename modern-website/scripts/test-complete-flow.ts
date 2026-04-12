#!/usr/bin/env ts-node

/**
 * Test Complete Flow - Verify all APIs are working
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testCompleteFlow() {
  console.log('Testing Complete Flow\n');
  console.log('='.repeat(70));

  // 1. Check if plans are available
  console.log('\n1. Checking available plans...');
  try {
    const { data: plans, error } = await supabase
      .from('kyshi_plans')
      .select('*')
      .eq('is_active', true)
      .order('country_code');
    
    if (error) {
      console.log('Error loading plans:', error.message);
      return;
    }
    
    console.log(`Found ${plans?.length || 0} active plans:`);
    plans?.forEach(plan => {
      console.log(`  - ${plan.country_code}: ${plan.name} (${plan.amount} ${plan.currency})`);
    });
    
    if (!plans || plans.length === 0) {
      console.log('No active plans found. Cannot continue.');
      return;
    }
    
    const kenyaPlan = plans.find(p => p.country_code === 'KE');
    if (!kenyaPlan) {
      console.log('Kenya plan not found. Cannot continue.');
      return;
    }
    
    console.log(`Using Kenya plan: ${kenyaPlan.id}`);
    
    // 2. Test API endpoint directly
    console.log('\n2. Testing create subscription API...');
    
    const testData = {
      email: 'test.flow@example.com',
      firstName: 'Test',
      lastName: 'Flow',
      phone: '+254712345678',
      countryCode: 'KE',
      planId: kenyaPlan.id
    };
    
    console.log('Test data:', testData);
    
    try {
      const response = await fetch('http://localhost:3000/api/kyshi/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      const data = await response.json();
      
      console.log(`Response status: ${response.status}`);
      console.log('Response data:', data);
      
      if (response.ok && data.success) {
        console.log('  - Subscription creation: SUCCESS');
        console.log(`  - Authorization URL: ${data.authorizationUrl ? 'YES' : 'NO'}`);
        console.log(`  - Subscription ID: ${data.subscription?.id || 'MISSING'}`);
      } else {
        console.log('  - Subscription creation: FAILED');
        console.log(`  - Error: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.log('  - API call failed:', err);
    }
    
    // 3. Check if subscription was saved
    console.log('\n3. Checking subscription in database...');
    try {
      const { data: subs, error } = await supabase
        .from('kyshi_subscriptions')
        .select('*')
        .eq('email', 'test.flow@example.com')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.log('Error checking subscription:', error.message);
      } else if (subs && subs.length > 0) {
        const sub = subs[0];
        console.log('  - Subscription found in database');
        console.log(`  - Email: ${sub.email || 'MISSING'}`);
        console.log(`  - Country: ${sub.country_code || 'MISSING'}`);
        console.log(`  - Plan code: ${sub.plan_code || 'MISSING'}`);
        console.log(`  - Status: ${sub.status}`);
        console.log(`  - Kyshi ID: ${sub.kyshi_subscription_id}`);
      } else {
        console.log('  - No subscription found in database');
      }
    } catch (err) {
      console.log('  - Database check failed:', err);
    }
    
    // 4. Test status check
    console.log('\n4. Testing status check API...');
    try {
      const response = await fetch(`http://localhost:3000/api/kyshi/subscription-status?email=test.flow@example.com`);
      const data = await response.json();
      
      console.log(`Response status: ${response.status}`);
      
      if (response.ok && data.success) {
        console.log('  - Status check: SUCCESS');
        console.log(`  - Subscriptions found: ${data.subscriptions?.length || 0}`);
        console.log(`  - Transactions found: ${data.transactions?.length || 0}`);
      } else {
        console.log('  - Status check: FAILED');
        console.log(`  - Error: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.log('  - Status check failed:', err);
    }
    
    // 5. Check webhook logs
    console.log('\n5. Checking webhook logs...');
    try {
      const { data: logs, error } = await supabase
        .from('kyshi_webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.log('Error checking webhook logs:', error.message);
      } else {
        console.log(`  - Webhook logs found: ${logs?.length || 0}`);
        logs?.forEach(log => {
          console.log(`    - ${log.event_type}: ${log.status} (${log.created_at})`);
        });
      }
    } catch (err) {
      console.log('  - Webhook check failed:', err);
    }
    
  } catch (err) {
    console.log('Test failed:', err);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\nFlow Test Summary:\n');
  console.log('To test manually:\n');
  console.log('1. Visit: http://localhost:3000/test/kyshi');
  console.log('2. Fill form with test.flow@example.com');
  console.log('3. Select Kenya plan');
  console.log('4. Click "Create Subscription"');
  console.log('5. Complete payment with test card');
  console.log('6. Check status and transactions');
}

testCompleteFlow().catch(console.error);
