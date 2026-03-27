import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { pinVerificationSchema } from '@/lib/validation/schemas';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { sanitizeObject } from '@/lib/validation/sanitizer';
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from '@/middleware/rateLimit';

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
      
      // Apply rate limiting ONLY for failed attempts
      const identifier = getRateLimitIdentifier(request);
      const rateLimitResult = await checkRateLimit(request, RATE_LIMITS.PIN_VERIFY);
      
      if (!rateLimitResult.success) {
        console.log('🚫 [API] Rate limit exceeded for failed PIN attempts:', identifier);
        return NextResponse.json({
          success: false,
          error: 'Too many failed attempts. Please try again later.',
          business: null,
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000 / 60) // minutes
        }, { status: 429 });
      }
      
      return NextResponse.json({
        success: false,
        error: 'Invalid PIN',
        business: null,
        remainingAttempts: rateLimitResult.remaining
      }, { status: 401 });
    }

    // PIN is valid - return business data (excluding PIN hash)
    // Successful logins do NOT count toward rate limiting
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

// Export handler - rate limiting applied only for failed PIN attempts (inside handler)
export const POST = verifyPinHandler;
