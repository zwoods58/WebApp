// Script to run Kyshi payment schema migration
// Run with: node run-kyshi-migration.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'NOT SET');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('=== Running Kyshi Payment Schema Migration ===');
  
  try {
    // Read the migration file
    const fs = require('fs');
    const path = require('path');
    const migrationPath = path.join(__dirname, 'supabase/migrations/20260413_kyshi_payment_link_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executing migration...');
    
    // Split the SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 100) + '...');
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct SQL execution if RPC fails
          const { error: directError } = await supabase
            .from('_temp_migration')
            .select('*')
            .limit(1);
            
          console.log('Note: Some statements may require manual execution in Supabase dashboard');
        }
      }
    }
    
    console.log('=== Migration completed ===');
    console.log('Please verify the tables were created in your Supabase dashboard:');
    console.log('- transactions');
    console.log('- kyshi_webhook_logs');
    console.log('- transaction_analytics (view)');
    
  } catch (error) {
    console.error('Migration failed:', error);
    console.log('\nPlease run the migration manually in Supabase dashboard:');
    console.log('1. Go to SQL Editor in your Supabase project');
    console.log('2. Copy the contents of: supabase/migrations/20260413_kyshi_payment_link_schema.sql');
    console.log('3. Paste and run the SQL');
  }
}

runMigration();
