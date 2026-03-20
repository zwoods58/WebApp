import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side admin client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();
    
    console.log('🔍 [API] Checking phone number:', phoneNumber);
    
    // Validate phone number format
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Phone number is required',
        exists: false
      }, { status: 400 });
    }

    // Check if phone number already exists
    const { data: business, error } = await supabaseAdmin
      .from('businesses')
      .select('id, business_name, phone_number')
      .eq('phone_number', phoneNumber)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('❌ [API] Error checking phone:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to check phone number',
        exists: false
      }, { status: 500 });
    }

    const exists = !!business;
    
    console.log('✅ [API] Phone check result:', { 
      phoneNumber, 
      exists, 
      businessName: business?.business_name 
    });

    return NextResponse.json({
      success: true,
      exists,
      business: exists ? {
        id: business.id,
        business_name: business.business_name,
        phone_number: business.phone_number
      } : null
    });

  } catch (err) {
    console.error('💥 [API] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      exists: false
    }, { status: 500 });
  }
}
