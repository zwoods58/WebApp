#!/usr/bin/env ts-node

/**
 * Debug Paystack Endpoint - Check Kyshi subscription creation
 */

import { kyshiApi } from '../src/lib/kyshi';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function debugPaystackEndpoint() {
  console.log('Debugging Paystack Endpoint Issue\n');
  console.log('='.repeat(70));

  // 1. Get Kenya plan details
  console.log('\n1. Getting Kenya plan details...');
  try {
    const { data: plans, error } = await supabase
      .from('kyshi_plans')
      .select('*')
      .eq('country_code', 'KE')
      .eq('is_active', true)
      .limit(1);
    
    if (error || !plans || plans.length === 0) {
      console.log('Error: Kenya plan not found');
      return;
    }
    
    const kenyaPlan = plans[0];
    console.log('Plan found:', {
      name: kenyaPlan.name,
      amount: kenyaPlan.amount,
      currency: kenyaPlan.currency,
      kyshi_plan_code: kenyaPlan.kyshi_plan_code
    });
    
    // 2. Create subscription directly via Kyshi API
    console.log('\n2. Creating subscription via Kyshi API...');
    
    const subscriptionData = {
      customer: 'test.paystack@example.com',
      planCode: kenyaPlan.kyshi_plan_code,
    };
    
    console.log('Request data:', subscriptionData);
    
    try {
      const subscription = await kyshiApi().createSubscription(subscriptionData);
      
      console.log('\nKyshi Response:');
      console.log('ID:', subscription.id);
      console.log('Code:', subscription.code);
      console.log('Authorization URL:', subscription.authorizationUrl || 'MISSING');
      console.log('Access Code:', subscription.accessCode || 'MISSING');
      console.log('Reference:', subscription.reference);
      console.log('Is Active:', subscription.isActive);
      console.log('Customer:', subscription.customer?.email || 'MISSING');
      console.log('Plan:', subscription.plan?.name || 'MISSING');
      
      if (subscription.authorizationUrl) {
        console.log('\n3. Checking Paystack URL...');
        const url = subscription.authorizationUrl;
        console.log('Full URL:', url);
        
        // Check if it's a Paystack URL
        if (url.includes('paystack') || url.includes('checkout.paystack')) {
          console.log('  - This is a Paystack URL');
          
          // Try to fetch the URL to see if it's accessible
          try {
            const response = await fetch(url, { method: 'HEAD' });
            console.log(`  - URL Status: ${response.status}`);
            console.log(`  - URL Headers:`, Object.fromEntries(response.headers));
          } catch (err) {
            console.log('  - URL fetch error:', err);
          }
        } else {
          console.log('  - Not a Paystack URL, checking provider...');
          console.log('  - URL domain:', new URL(url).hostname);
        }
      } else {
        console.log('\n3. No authorization URL found!');
        console.log('This means the subscription might be active already');
        console.log('or Kyshi didn\'t return a payment URL');
      }
      
      // 4. Check subscription status in Kyshi
      console.log('\n4. Checking subscription status...');
      try {
        const statusCheck = await kyshiApi().getSubscription(subscription.id);
        console.log('Status from Kyshi:', {
          id: statusCheck.id,
          code: statusCheck.code,
          isActive: statusCheck.isActive,
          authorizationUrl: statusCheck.authorizationUrl || 'MISSING',
          startDate: statusCheck.startDate,
          nextPaymentDate: statusCheck.nextPaymentDate
        });
      } catch (err) {
        console.log('Status check error:', err);
      }
      
    } catch (err) {
      console.log('Subscription creation error:', err);
    }
    
  } catch (err) {
    console.log('Plan fetch error:', err);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\nTroubleshooting Tips:\n');
  console.log('1. If no authorization URL: Subscription might be auto-activated');
  console.log('2. If Paystack URL fails: Check ngrok tunnel is running');
  console.log('3. If URL exists but page blank: Check browser console for errors');
  console.log('4. Test manually: http://localhost:3000/test/kyshi');
}

debugPaystackEndpoint().catch(console.error);
