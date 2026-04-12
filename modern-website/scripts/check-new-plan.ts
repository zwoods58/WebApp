#!/usr/bin/env ts-node

import { config } from 'dotenv';

config({ path: '.env.local' });

const KYSHI_SECRET_KEY = process.env.KYSHI_SECRET_KEY!;
const NEW_PLAN_CODE = 'PLN_VDMjfGKQKEAhqgL';

async function checkPlan() {
  const res = await fetch(`https://api.kyshi.co/v1/plans/${NEW_PLAN_CODE}`, {
    headers: { 'x-api-key': KYSHI_SECRET_KEY }
  });
  const data = await res.json();
  console.log('Plan:', data.data.name);
  console.log('Amount:', data.data.amount, 'cents =', data.data.amount/100, 'KES');
  console.log('Code:', data.data.code);
}

checkPlan();
