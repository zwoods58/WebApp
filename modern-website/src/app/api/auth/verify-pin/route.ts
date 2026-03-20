import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

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
    const { phoneNumber, pin } = await request.json();
    
    console.log('🔐 [API] Verifying PIN for phone:', phoneNumber);
    
    // Validate inputs
    if (!phoneNumber || !pin) {
      return NextResponse.json({
        success: false,
        error: 'Phone number and PIN are required',
        business: null
      }, { status: 400 });
    }

    // Validate PIN format
    if (!/^\d{6}$/.test(pin)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid PIN format',
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

    // Check if business has PIN hash
    if (!business.pin_hash) {
      console.error('❌ [API] No PIN hash found for business:', business.id);
      return NextResponse.json({
        success: false,
        error: 'PIN not set for this account',
        business: null
      }, { status: 400 });
    }

    // Verify PIN against hash
    let pinValid: boolean;
    try {
      console.log('🔐 Comparing PIN with stored hash:', { 
        inputPinLength: pin.length,
        storedHashLength: business.pin_hash.length,
        storedHashPrefix: business.pin_hash.substring(0, 7) + '...',
        pinValue: pin ? '***' : 'none'
      });
      pinValid = await bcrypt.compare(pin, business.pin_hash);
      console.log('✅ [API] PIN verification completed:', { 
        valid: pinValid,
        businessId: business.id,
        businessName: business.business_name
      });
    } catch (compareError) {
      console.error('❌ [API] Error comparing PIN:', compareError);
      return NextResponse.json({
        success: false,
        error: 'Failed to verify PIN',
        business: null
      }, { status: 500 });
    }

    if (!pinValid) {
      console.log('❌ [API] Invalid PIN provided');
      return NextResponse.json({
        success: false,
        error: 'Invalid PIN',
        business: null
      }, { status: 401 });
    }

    // PIN is valid - return business data (excluding PIN hash)
    const { pin_hash: _, ...businessResponse } = business;
    
    console.log('✅ [API] PIN verification successful for:', business.business_name);

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
