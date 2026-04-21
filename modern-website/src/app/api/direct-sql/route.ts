import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = body;
    
    console.log('🔧 Direct SQL - Executing:', sql);
    
    // Use raw SQL via postgres function if available
    try {
      const { data, error } = await supabaseAdmin
        .rpc('exec_sql', { sql });
      
      if (error) {
        console.error('SQL execution error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      console.log('SQL execution result:', data);
      return NextResponse.json({ data, success: true });
      
    } catch (rpcError) {
      console.log('RPC not available, trying direct approach...');
      
      // If RPC not available, return a helpful error
      return NextResponse.json({ 
        error: 'Direct SQL execution not available through API',
        suggestion: 'Use Supabase Dashboard or direct database connection'
      }, { status: 501 });
    }
    
  } catch (error: any) {
    console.error('Direct SQL exception:', error);
    return NextResponse.json({ 
      error: error.message,
      type: 'exception'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Direct SQL API - POST with { "sql": "your_sql_here" }',
    examples: [
      'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'',
      'CREATE TABLE IF NOT EXISTS test_table (id UUID PRIMARY KEY);',
      'INSERT INTO transactions (type, amount, currency) VALUES (\'money_in\', 100, \'KES\');'
    ]
  });
}
