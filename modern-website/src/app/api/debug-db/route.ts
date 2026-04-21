import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log('Debug DB - URL:', supabaseUrl);
console.log('Debug DB - Key:', supabaseServiceKey ? 'SET' : 'NOT SET');

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabaseAdmin.from('businesses').select('count').single();
    
    if (error) {
      console.log('Debug DB - Error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection working',
      count: data
    });
  } catch (e: any) {
    console.log('Debug DB - Exception:', e);
    return NextResponse.json({ 
      success: false, 
      error: e.message,
      type: 'exception'
    });
  }
}
