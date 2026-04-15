import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { pinVerificationSchema } from '@/lib/validation/schemas';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { sanitizeObject } from '@/lib/validation/sanitizer';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { rateLimiter } from '@/lib/rate-limit/phone-limiter';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side admin client that bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function verifyPinHandler(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with Zod schema
    const validation = validateRequest(pinVerificationSchema, body);
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    // Sanitize validated data
    const { phoneNumber, pin } = sanitizeObject(validation.data);
    
    console.log('🔐 [API] Verifying PIN for phone:', phoneNumber);

    // Find business by phone number
    const { data: businesses, error: findError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('phone_number', phoneNumber)
      .order('created_at', { ascending: false }); // Get most recent first

    let business = null;
    
    if (findError) {
      console.log('❌ [API] Database error:', findError.message);
      return NextResponse.json({
        success: false,
        error: 'Database error occurred',
        business: null
      }, { status: 500 });
    }

    // Handle multiple businesses with same phone number
    if (businesses && businesses.length > 0) {
      business = businesses[0]; // Use most recent
      console.log('🔍 [API] Found multiple businesses with phone:', phoneNumber, 'using most recent:', business.business_name);
    } else if (businesses && businesses.length === 1) {
      business = businesses[0];
    }

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

    // PIN is valid - reset failed attempts and return business data (excluding PIN hash)
    await rateLimiter.resetPinVerification(phoneNumber);
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

// Export with progressive phone-based rate limiting
export const POST = withRateLimit(verifyPinHandler, {
  type: 'pin_verify',
  getIdentifier: async (body: any) => {
    return body.phoneNumber;
  },
  isProgressive: true, // Enables progressive backoff
});
