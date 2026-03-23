import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { withRateLimit, RATE_LIMITS } from '@/middleware/rateLimit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Validation schema for PIN reset completion
const pinResetCompleteSchema = z.object({
  resetToken: z.string().min(10, 'Invalid reset token'),
  businessId: z.string().uuid('Invalid business ID'),
  newPin: z.string()
    .length(6, 'PIN must be exactly 6 digits')
    .regex(/^\d{6}$/, 'PIN must contain only digits')
});

/**
 * POST /api/auth/pin-reset/complete
 * Complete PIN reset with new PIN
 * 
 * Body: { resetToken: string, businessId: string, newPin: string }
 * Returns: { success: boolean, message: string }
 */
async function pinResetCompleteHandler(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateRequest(pinResetCompleteSchema, body);
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    const { resetToken, businessId, newPin } = validation.data;

    console.log('🔐 [PIN Reset] Completing reset for business:', businessId);
    console.log('🔍 [PIN Reset] Reset token:', resetToken);

    // ✅ FIXED: Validate token format correctly
    // Token format: {businessId}-{timestamp}-{random}
    // Since businessId contains hyphens, we need to find the last two hyphens
    const lastHyphenIndex = resetToken.lastIndexOf('-');
    const secondLastHyphenIndex = resetToken.lastIndexOf('-', lastHyphenIndex - 1);
    
    if (secondLastHyphenIndex === -1) {
      console.log('❌ [PIN Reset] Invalid reset token format - not enough separators');
      return NextResponse.json({
        success: false,
        error: 'Invalid reset token'
      }, { status: 400 });
    }
    
    const extractedBusinessId = resetToken.substring(0, secondLastHyphenIndex);
    const timestampPart = resetToken.substring(secondLastHyphenIndex + 1, lastHyphenIndex);
    const randomPart = resetToken.substring(lastHyphenIndex + 1);
    
    console.log('🔍 [PIN Reset] Extracted businessId:', extractedBusinessId);
    console.log('🔍 [PIN Reset] Extracted timestamp:', timestampPart);
    console.log('🔍 [PIN Reset] Extracted random:', randomPart);
    
    // Validate businessId matches
    if (extractedBusinessId !== businessId) {
      console.log('❌ [PIN Reset] Business ID mismatch');
      return NextResponse.json({
        success: false,
        error: 'Invalid reset token'
      }, { status: 400 });
    }
    
    // Validate timestamp is a number
    const tokenTimestamp = parseInt(timestampPart);
    if (isNaN(tokenTimestamp)) {
      console.log('❌ [PIN Reset] Invalid timestamp in token');
      return NextResponse.json({
        success: false,
        error: 'Invalid reset token'
      }, { status: 400 });
    }
    
    // Check expiration (15 minutes, same as rate limit window)
    const tokenAge = Date.now() - tokenTimestamp;
    const fifteenMinutes = 15 * 60 * 1000;
    
    if (tokenAge > fifteenMinutes) {
      console.log('❌ [PIN Reset] Reset token expired. Age:', tokenAge / 1000, 'seconds');
      return NextResponse.json({
        success: false,
        error: 'Reset token has expired. Please start the reset process again.'
      }, { status: 400 });
    }

    console.log('✅ [PIN Reset] Token validated successfully');

    // Verify business exists
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, phone_number')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      console.log('❌ [PIN Reset] Business not found');
      return NextResponse.json({
        success: false,
        error: 'Business not found'
      }, { status: 404 });
    }

    // Hash the new PIN
    const saltRounds = 12;
    const pinHash = await bcrypt.hash(newPin, saltRounds);

    console.log('🔒 [PIN Reset] Hashing new PIN');

    // Update PIN in database
    const { error: updateError } = await supabaseAdmin
      .from('businesses')
      .update({ 
        pin_hash: pinHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', businessId);

    if (updateError) {
      console.error('💥 [PIN Reset] Failed to update PIN:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to update PIN'
      }, { status: 500 });
    }

    // Clean up recovery attempts
    await supabaseAdmin
      .from('businesses')
      .update({
        recovery_attempts: 0,
        recovery_locked_until: null
      })
      .eq('id', businessId);

    console.log('✅ [PIN Reset] PIN updated successfully');

    return NextResponse.json({
      success: true,
      message: 'PIN has been reset successfully. You can now sign in with your new PIN.'
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
export const POST = withRateLimit(pinResetCompleteHandler, RATE_LIMITS.AUTH);