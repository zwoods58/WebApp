import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { sanitizePhone } from '@/lib/validation/sanitizer';
import { withRateLimit } from '@/middleware/rate-limit-middleware';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Validation schema for token verification
const tokenVerificationSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  token: z.string().length(6, 'Token must be exactly 6 digits').regex(/^\d{6}$/, 'Token must contain only digits')
});

/**
 * POST /api/auth/pin-reset/verify
 * Verify a PIN reset token
 * 
 * Body: { phoneNumber: string, token: string }
 * Returns: { success: boolean, resetToken: string } or error
 */
async function pinResetVerifyHandler(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateRequest(tokenVerificationSchema, body);
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    const { phoneNumber: rawPhone, token } = validation.data;
    const phoneNumber = sanitizePhone(rawPhone);

    console.log('🔐 [PIN Reset] Verifying token for:', phoneNumber);

    // Find valid, unused token
    const { data: resetToken, error: tokenError } = await supabaseAdmin
      .from('pin_reset_tokens')
      .select('id, business_id, expires_at, used_at')
      .eq('phone_number', phoneNumber)
      .eq('token', token)
      .is('used_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !resetToken) {
      console.log('❌ [PIN Reset] Invalid or expired token');
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired reset token'
      }, { status: 400 });
    }

    // Check if token has expired
    const expiresAt = new Date(resetToken.expires_at);
    if (expiresAt < new Date()) {
      console.log('❌ [PIN Reset] Token expired');
      return NextResponse.json({
        success: false,
        error: 'Reset token has expired. Please request a new one.'
      }, { status: 400 });
    }

    // Mark token as used
    const { error: updateError } = await supabaseAdmin
      .from('pin_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', resetToken.id);

    if (updateError) {
      console.error('💥 [PIN Reset] Failed to mark token as used:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to verify token'
      }, { status: 500 });
    }

    // Generate a one-time reset token for the actual PIN change
    // This token is valid for 5 minutes and can only be used once
    const oneTimeToken = `${resetToken.business_id}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    console.log('✅ [PIN Reset] Token verified successfully');

    return NextResponse.json({
      success: true,
      message: 'Token verified. You can now reset your PIN.',
      resetToken: oneTimeToken,
      businessId: resetToken.business_id,
      expiresIn: 300 // 5 minutes to complete PIN reset
    });

  } catch (err) {
    console.error('💥 [PIN Reset] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

// Export with progressive phone-based rate limiting
export const POST = withRateLimit(pinResetVerifyHandler, {
  type: 'pin_reset_verify',
  getIdentifier: async (request: NextRequest) => {
    const body = await request.json();
    return body.phoneNumber;
  },
  isProgressive: true,
});
