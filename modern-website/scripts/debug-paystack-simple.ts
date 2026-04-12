#!/usr/bin/env ts-node

/**
 * Debug Paystack Endpoint - Simple API test
 */

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
    
    // 2. Test subscription creation via our API
    console.log('\n2. Testing subscription creation via API...');
    
    const testData = {
      email: 'test.paystack@example.com',
      firstName: 'Test',
      lastName: 'Paystack',
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
      
      console.log('\nAPI Response:');
      console.log('Status:', response.status);
      console.log('Success:', data.success);
      console.log('Message:', data.message);
      
      if (data.success) {
        console.log('\nSubscription Details:');
        console.log('ID:', data.subscription?.id);
        console.log('Email:', data.subscription?.email);
        console.log('Country:', data.subscription?.country_code);
        console.log('Plan Code:', data.subscription?.plan_code);
        console.log('Kyshi ID:', data.kyshiSubscriptionId);
        console.log('Authorization URL:', data.authorizationUrl || 'MISSING');
        
        if (data.authorizationUrl) {
          console.log('\n3. Analyzing Paystack URL...');
          const url = data.authorizationUrl;
          console.log('Full URL:', url);
          
          // Check if it's a Paystack URL
          if (url.includes('paystack') || url.includes('checkout.paystack')) {
            console.log('  - This is a Paystack URL');
            
            // Extract components
            try {
              const urlObj = new URL(url);
              console.log('  - Domain:', urlObj.hostname);
              console.log('  - Path:', urlObj.pathname);
              console.log('  - Query params:', urlObj.searchParams.toString());
              
              // Test if URL is accessible
              try {
                const headResponse = await fetch(url, { method: 'HEAD' });
                console.log(`  - URL Status: ${headResponse.status}`);
                console.log(`  - Content-Type: ${headResponse.headers.get('content-type')}`);
                console.log(`  - Location: ${headResponse.headers.get('location') || 'None'}`);
              } catch (err) {
                console.log('  - URL fetch error:', err);
              }
            } catch (urlErr) {
              console.log('  - URL parse error:', urlErr);
            }
          } else {
            console.log('  - Not a Paystack URL');
            console.log('  - URL domain:', new URL(url).hostname);
          }
          
          console.log('\n4. Manual Test Instructions:');
          console.log('  - Copy this URL and paste in browser:');
          console.log(`  - ${url}`);
          console.log('  - Or test via test page: http://localhost:3000/test/kyshi');
        } else {
          console.log('\n3. No authorization URL found!');
          console.log('This means:');
          console.log('  - Subscription might be auto-activated');
          console.log('  - Kyshi didn\'t return a payment URL');
          console.log('  - Plan might be set to auto-charge');
        }
      } else {
        console.log('Error details:', data);
      }
      
    } catch (err) {
      console.log('API call error:', err);
    }
    
  } catch (err) {
    console.log('Plan fetch error:', err);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\nCommon Issues:\n');
  console.log('1. ngrok tunnel not running');
  console.log('2. Paystack URL blocked by browser');
  console.log('3. Invalid test card details');
  console.log('4. Kyshi plan configuration issue');
  console.log('\nSolutions:\n');
  console.log('- Check ngrok is running');
  console.log('- Use test card: 4084 0840 8408 4081');
  console.log('- Try incognito browser window');
  console.log('- Check browser console for errors');
}

debugPaystackEndpoint().catch(console.error);
