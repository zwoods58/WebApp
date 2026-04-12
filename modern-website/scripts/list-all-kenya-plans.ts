#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = 'https://api.kyshi.co/v1';

async function listAllPlans() {
  console.log('📋 Listing all plans in Kyshi...\n');

  try {
    const response = await fetch(`${KYSHI_BASE_URL}/plans`, {
      method: 'GET',
      headers: {
        'x-api-key': KYSHI_SECRET_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Found ${data.data?.data?.length || 0} plans\n`);
      
      const plans = data.data?.data || [];
      
      // Filter for Kenya/KES plans
      const kenyaPlans = plans.filter((p: any) => 
        p.name?.toLowerCase().includes('kenya') || 
        p.name?.toLowerCase().includes('kes') ||
        p.description?.toLowerCase().includes('kenya')
      );
      
      console.log('Kenya Plans:');
      kenyaPlans.forEach((plan: any) => {
        console.log(`\n  Name: ${plan.name}`);
        console.log(`  Code: ${plan.code}`);
        console.log(`  Amount: ${plan.amount} (${plan.amount / 100} KES if in cents)`);
        console.log(`  Interval: ${plan.interval}`);
        console.log(`  Active: ${plan.isActive}`);
      });
      
      console.log('\n\n💡 Recommendation:');
      const correctPlan = kenyaPlans.find((p: any) => p.amount === 20000);
      if (correctPlan) {
        console.log(`Use plan: ${correctPlan.code} (has correct amount: 200 KES)`);
      } else {
        console.log('No plan found with 20000 cents (200 KES)');
        console.log('You need to create a plan manually in Kyshi dashboard with amount 200 KES');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to list plans');
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

listAllPlans();
