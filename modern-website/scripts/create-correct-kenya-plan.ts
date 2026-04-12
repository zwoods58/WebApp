#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createCorrectKenyaPlan() {
  console.log('🔧 Creating Kenya plan with correct amount...\n');

  const planData = {
    name: 'Beezee Weekly Kenya',
    description: 'Weekly subscription for Beezee - Kenya',
    interval: 'weekly',
    amount: 20000, // 200 KES in cents
    localCurrency: 'KES'
  };

  console.log('Plan data:', planData);
  console.log(`Amount: ${planData.amount} cents = ${planData.amount / 100} KES\n`);

  try {
    const response = await fetch(`${KYSHI_BASE_URL}/plans`, {
      method: 'POST',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Plan created successfully!\n');
      console.log('Plan Details:');
      console.log(`Name: ${data.data.name}`);
      console.log(`Code: ${data.data.code}`);
      console.log(`Amount: ${data.data.amount} cents = ${data.data.amount / 100} KES`);
      console.log(`Interval: ${data.data.interval}`);
      
      // Update Supabase with new plan code
      console.log('\n📝 Updating Supabase...');
      const { error } = await supabase
        .from('kyshi_plans')
        .update({
          kyshi_plan_code: data.data.code,
          amount: 200 // Store as major units in our DB
        })
        .eq('country_code', 'KE');

      if (error) {
        console.log('❌ Error updating Supabase:', error);
      } else {
        console.log('✅ Supabase updated with new plan code:', data.data.code);
      }

      console.log('\n🎉 Done! Kenya plan now has correct amount (200 KES)');
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to create plan');
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

createCorrectKenyaPlan();
