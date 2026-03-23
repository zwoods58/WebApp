import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

// Validation schema
const verifyPhoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters')
});

/**
 * Normalize phone number to match database format
 */
function normalizePhoneNumber(phone: string): string {
  // Remove any spaces
  let cleaned = phone.replace(/\s/g, '');
  
  // If it starts with 0, replace with +254
  if (cleaned.startsWith('0')) {
    cleaned = '+254' + cleaned.slice(1);
  }
  
  // If it doesn't have +, add it
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * POST /api/auth/forgot-pin/verify-phone
 * Verify phone number exists and return user's security questions
 * 
 * Body: { phoneNumber: string }
 * Returns: { success: boolean, questions: SecurityQuestion[], businessId: string }
 */
async function verifyPhoneHandler(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔍 [verify-phone] ========== DEBUG ==========');
    console.log('🔍 [verify-phone] Received body:', JSON.stringify(body, null, 2));
    console.log('🔍 [verify-phone] Original phoneNumber:', body.phoneNumber);
    console.log('🔍 [verify-phone] phoneNumber type:', typeof body.phoneNumber);
    
    // Validate input
    const validation = validateRequest(verifyPhoneSchema, body);
    if (!validation.success) {
      console.log('❌ [verify-phone] Validation failed');
      return handleValidationError(validation.error);
    }

    const { phoneNumber } = validation.data;
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    
    console.log('🔍 [verify-phone] After validation - phoneNumber:', phoneNumber);
    console.log('🔍 [verify-phone] Normalized phone for DB query:', normalizedPhone);
    console.log('📱 [Forgot PIN] Verifying phone number for recovery');
    
    // Find business by phone number (using normalized format)
    const { data: business, error: findError } = await supabaseAdmin
      .from('businesses')
      .select(`
        id,
        phone_number,
        recovery_locked_until,
        recovery_attempts,
        security_question_1_id
      `)
      .eq('phone_number', normalizedPhone)
      .single();

    if (findError || !business) {
      console.log('❌ [Forgot PIN] Phone number not found. Query used:', normalizedPhone);
      console.log('❌ [Forgot PIN] Error:', findError);
      // Generic error to prevent phone enumeration
      return NextResponse.json({
        success: false,
        error: 'Unable to verify phone number. Please check and try again.',
        questions: null,
        businessId: null
      }, { status: 404 });
    }

    console.log('✅ [verify-phone] Found business:', {
      id: business.id,
      phone_number: business.phone_number,
      hasSecurityQuestion: !!business.security_question_1_id
    });

    // Check if account is locked
    const now = Date.now();
    if (business.recovery_locked_until && business.recovery_locked_until > now) {
      const remainingTime = Math.ceil((business.recovery_locked_until - now) / 1000 / 60);
      console.log(`🔒 [Forgot PIN] Account locked for ${remainingTime} more minutes`);
      
      return NextResponse.json({
        success: false,
        error: `Account is temporarily locked. Please try again in ${remainingTime} minute(s).`,
        questions: null,
        businessId: null,
        lockoutTime: business.recovery_locked_until
      }, { status: 429 });
    }

    // Check if security question is set up
    if (!business.security_question_1_id) {
      console.log('❌ [Forgot PIN] Security question not set up for this account');
      return NextResponse.json({
        success: false,
        error: 'Security question is not set up for this account. Please contact support.',
        questions: null,
        businessId: null
      }, { status: 400 });
    }

    // Fetch the security question
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('security_questions')
      .select('id, question_text, category')
      .in('id', [business.security_question_1_id]);

    if (questionsError || !questions || questions.length !== 1) {
      console.error('❌ [Forgot PIN] Error fetching security questions:', questionsError);
      return NextResponse.json({
        success: false,
        error: 'Unable to retrieve security questions',
        questions: null,
        businessId: null
      }, { status: 500 });
    }

    // Return the security question
    const orderedQuestions = questions;

    console.log('✅ [Forgot PIN] Phone verified, returning security questions');
    console.log('🔍 [verify-phone] Returning businessId:', business.id);
    console.log('🔍 [verify-phone] Returning question:', orderedQuestions[0]?.question_text);

    return NextResponse.json({
      success: true,
      error: null,
      questions: orderedQuestions,
      businessId: business.id,
      remainingAttempts: Math.max(0, 3 - (business.recovery_attempts || 0))
    });

  } catch (err) {
    console.error('💥 [Forgot PIN] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred',
      questions: null,
      businessId: null
    }, { status: 500 });
  }
}

// Export with rate limiting (10 requests per 15 minutes)
export const POST = withRateLimit(verifyPhoneHandler, RATE_LIMITS.AUTH);