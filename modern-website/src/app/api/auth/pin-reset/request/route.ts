import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { phoneNumberSchema } from '@/lib/validation/schemas';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { sanitizePhone } from '@/lib/validation/sanitizer';
import { withRateLimit, RATE_LIMITS } from '@/middleware/rateLimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

/**
 * Generate a 6-digit PIN reset token
 */
function generateResetToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/pin-reset/request
 * Request a PIN reset token
 * 
 * Body: { phoneNumber: string }
 * Returns: { success: boolean, message: string, expiresIn: number }
 */
async function pinResetRequestHandler(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate phone number
    const validation = validateRequest(phoneNumberSchema, body.phoneNumber);
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    // Sanitize phone number
    const phoneNumber = sanitizePhone(validation.data);

    console.log('🔐 [PIN Reset] Request received for:', phoneNumber);

    // Check if business exists
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, phone_number, business_name')
      .eq('phone_number', phoneNumber)
      .single();

    if (businessError || !business) {
      console.log('❌ [PIN Reset] Business not found:', phoneNumber);
      // Return success even if not found (security: don't reveal if phone exists)
      return NextResponse.json({
        success: true,
        message: 'If this phone number is registered, a reset token has been generated.',
        expiresIn: 900 // 15 minutes in seconds
      });
    }

    // Generate 6-digit token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    console.log('🔑 [PIN Reset] Generated token for business:', business.id);

    // Store token in database
    const { error: insertError } = await supabaseAdmin
      .from('pin_reset_tokens')
      .insert({
        business_id: business.id,
        phone_number: phoneNumber,
        token: token,
        expires_at: expiresAt.toISOString()
      });

    if (insertError) {
      console.error('💥 [PIN Reset] Failed to store token:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Failed to generate reset token'
      }, { status: 500 });
    }

    // TODO: Send token via SMS
    // For now, we'll return it in development (remove in production)
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.log('✅ [PIN Reset] Token stored successfully');
    console.log(`📱 [PIN Reset] ${isDevelopment ? 'Token: ' + token : 'SMS would be sent in production'}`);

    return NextResponse.json({
      success: true,
      message: 'Reset token has been generated. Check your phone for the code.',
      expiresIn: 900, // 15 minutes in seconds
      ...(isDevelopment && { token, businessName: business.business_name }) // Only in dev
    });

  } catch (err) {
    console.error('💥 [PIN Reset] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

// Export with rate limiting (5 requests per 15 minutes)
export const POST = withRateLimit(pinResetRequestHandler, RATE_LIMITS.AUTH);
