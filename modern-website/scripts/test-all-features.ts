#!/usr/bin/env ts-node

/**
 * Test All Features - Status, Transactions, Webhooks
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testAllFeatures() {
  console.log('Testing All Features: Status, Transactions, Webhooks\n');
  console.log('='.repeat(70));

  // 1. Check existing subscriptions
  console.log('\n1. Existing Subscriptions:\n');
  const { data: subs, error: subsError } = await supabase
    .from('kyshi_subscriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (subsError) {
    console.log('Error fetching subscriptions:', subsError.message);
  } else {
    subs?.forEach(sub => {
      console.log(`ID: ${sub.id}`);
      console.log(`Email: ${sub.email}`);
      console.log(`Country: ${sub.country_code}`);
      console.log(`Plan: ${sub.plan_code}`);
      console.log(`Status: ${sub.status}`);
      console.log(`Created: ${sub.created_at}`);
      console.log(`Next Charge: ${sub.next_charge_at}`);
      console.log('---');
    });
  }

  // 2. Check transactions
  console.log('\n2. Transaction History:\n');
  const { data: txns, error: txnError } = await supabase
    .from('kyshi_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (txnError) {
    console.log('Error fetching transactions:', txnError.message);
  } else {
    if (txns?.length === 0) {
      console.log('No transactions found yet');
    } else {
      txns?.forEach(txn => {
        console.log(`ID: ${txn.id}`);
        console.log(`Subscription: ${txn.subscription_id}`);
        console.log(`Type: ${txn.transaction_type}`);
        console.log(`Amount: ${txn.amount} ${txn.currency}`);
        console.log(`Status: ${txn.status}`);
        console.log(`Reference: ${txn.kyshi_reference}`);
        console.log(`Created: ${txn.created_at}`);
        console.log('---');
      });
    }
  }

  // 3. Check webhook logs
  console.log('\n3. Webhook Logs:\n');
  const { data: webhooks, error: webhookError } = await supabase
    .from('kyshi_webhook_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (webhookError) {
    console.log('Error fetching webhooks:', webhookError.message);
  } else {
    if (webhooks?.length === 0) {
      console.log('No webhook events received yet');
    } else {
      webhooks?.forEach(webhook => {
        console.log(`ID: ${webhook.id}`);
        console.log(`Event: ${webhook.event_type}`);
        console.log(`Status: ${webhook.status}`);
        console.log(`Subscription: ${webhook.subscription_code}`);
        console.log(`Created: ${webhook.created_at}`);
        console.log('---');
      });
    }
  }

  // 4. Check customers
  console.log('\n4. Customer Records:\n');
  const { data: customers, error: custError } = await supabase
    .from('kyshi_customers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (custError) {
    console.log('Error fetching customers:', custError.message);
  } else {
    customers?.forEach(cust => {
      console.log(`ID: ${cust.id}`);
      console.log(`Email: ${cust.email}`);
      console.log(`Customer Code: ${cust.kyshi_customer_code}`);
      console.log(`Created: ${cust.created_at}`);
      console.log('---');
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('\nTesting Guide:\n');

  if (subs && subs.length > 0) {
    console.log('To test features:\n');
    console.log('1. Status Check:');
    console.log(`   - Visit: http://localhost:3000/test/kyshi`);
    console.log(`   - Enter email from above: ${subs[0].email}`);
    console.log(`   - Click "Check Status"\n`);

    console.log('2. Manual Charge:');
    console.log(`   - Use same email: ${subs[0].email}`);
    console.log(`   - Click "Manual Charge"`);
    console.log(`   - Verify transaction appears below\n`);

    console.log('3. Webhook Events:');
    console.log(`   - Create a new subscription`);
    console.log(`   - Complete payment`);
    console.log(`   - Check webhook logs for events\n`);

    console.log('4. Auto-Renewal Test:');
    console.log(`   - Use test card: 4084 0840 8408 4081`);
    console.log(`   - Create subscription`);
    console.log(`   - Manually trigger webhook to simulate renewal`);
  } else {
    console.log('No subscriptions found. Create one first:');
    console.log('1. Visit: http://localhost:3000/test/kyshi');
    console.log('2. Fill form and create subscription');
    console.log('3. Complete payment');
    console.log('4. Then re-run this script to see data');
  }

  console.log('\n' + '='.repeat(70));
}

testAllFeatures().catch(console.error);
