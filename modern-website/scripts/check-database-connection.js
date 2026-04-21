#!/usr/bin/env node

/**
 * Database Connection Checker
 * Helps identify which Supabase project the environment variables are pointing to
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Database Connection Check');
console.log('================================');
console.log('URL:', supabaseUrl || 'NOT SET');
console.log('Has Service Key:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project reference from URL
const urlMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
const projectRef = urlMatch ? urlMatch[1] : 'unknown';

console.log('Project Ref:', projectRef);
console.log('');

// Test connection
async function testConnection() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('🔗 Testing database connection...');
    
    // Test basic connectivity with direct table queries
    console.log('Testing with direct table queries...');
    
    // Test businesses table directly
    const { data: businessesData, error: businessesError } = await supabase
      .from('businesses')
      .select('id')
      .limit(1);
    
    if (businessesError) {
      console.error('❌ Businesses table error:', businessesError.message);
      console.error('Code:', businessesError.code);
    } else {
      console.log('✅ Businesses table accessible');
    }
    
    // Test expenses table directly
    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .select('id')
      .limit(1);
    
    if (expensesError) {
      console.error('❌ Expenses table error:', expensesError.message);
      console.error('Code:', expensesError.code);
    } else {
      console.log('✅ Expenses table accessible');
    }
    
    // Test transactions table directly
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
    
    if (transactionsError) {
      console.error('❌ Transactions table error:', transactionsError.message);
      console.error('Code:', transactionsError.code);
    } else {
      console.log('✅ Transactions table accessible');
    }
    
    // Try information_schema as fallback
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('');
    console.log('Available tables:');
    const tables = data?.map(t => `  - ${t.table_name}`) || [];
    console.log(tables.join('\n'));
    
    // Check for required tables
    const requiredTables = ['businesses', 'expenses', 'transactions'];
    const existingTables = data?.map(t => t.table_name) || [];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    console.log('');
    if (missingTables.length === 0) {
      console.log('✅ All required tables exist!');
    } else {
      console.log('❌ Missing tables:', missingTables.join(', '));
      console.log('');
      console.log('This suggests you are connected to the wrong Supabase project');
      console.log('or the database schema has not been migrated.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testConnection();
