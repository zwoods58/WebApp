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
    
    console.log('🔍 [API] Looking up business for phone:', phoneNumber);
    
    // Validate inputs
    if (!phoneNumber) {
      return NextResponse.json({
        success: false,
        error: 'Phone number is required',
        business: null
      }, { status: 400 });
    }

    // Find business by phone number
    const { data: business, error: findError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();

    if (findError || !business) {
      console.log('❌ [API] No business found for phone:', phoneNumber);
      return NextResponse.json({
        success: false,
        error: 'Business not found',
        business: null
      }, { status: 404 });
    }

    console.log('✅ [API] Business found:', business.business_name);

    // Return business data (excluding sensitive fields if any)
    const { pin_hash: _, ...businessResponse } = business;

    return NextResponse.json({
      success: true,
      error: null,
      business: businessResponse
    });

  } catch (err) {
    console.error('💥 [API] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      business: null
    }, { status: 500 });
  }
}
