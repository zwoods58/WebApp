#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE_URL = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';

const PLAN_CODES_TO_VERIFY = [
  { country: 'Kenya', code: 'PLN_7fgRaAQBesq9iLu', currency: 'KES' },
  { country: 'Ghana', code: 'GH_WEEKLY_20', currency: 'GHS' },
  { country: 'Nigeria', code: 'NG_WEEKLY_500', currency: 'NGN' },
  { country: 'South Africa', code: 'ZA_WEEKLY_50', currency: 'ZAR' },
  { country: 'Côte d\'Ivoire', code: 'PLN_IVD0jEfuxAwh-Z-', currency: 'XOF' }
];

async function verifyPlanExists(code: string) {
  const url = `${KYSHI_BASE_URL}/plans/${code}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': KYSHI_SECRET_KEY,
      'Content-Type': 'application/json',
    },
  });

  return {
    exists: response.ok,
    status: response.status,
    data: response.ok ? await response.json() : await response.text()
  };
}

async function main() {
  console.log('🔍 Verifying existing plan codes in Kyshi...\n');

  for (const plan of PLAN_CODES_TO_VERIFY) {
    console.log(`\nChecking ${plan.country} (${plan.currency}): ${plan.code}`);
    
    try {
      const result = await verifyPlanExists(plan.code);
      
      if (result.exists) {
        console.log(`  ✅ Plan exists in Kyshi`);
        console.log(`  Details:`, JSON.stringify(result.data, null, 2));
      } else {
        console.log(`  ❌ Plan NOT found (${result.status})`);
        console.log(`  Response:`, result.data);
      }
    } catch (error) {
      console.log(`  ❌ Error:`, error);
    }
  }
}

main();
