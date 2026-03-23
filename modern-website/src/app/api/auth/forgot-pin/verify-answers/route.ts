import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { withRateLimit, RATE_LIMITS } from '@/middleware/rateLimit';
import { sanitizeObject } from '@/lib/validation/sanitizer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Validation schema
const verifyAnswersSchema = z.object({
  phoneNumber: z.string().min(10),
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    answer: z.string().min(1).max(100)
  })).length(1, 'Answer is required')
});

/**
 * Normalize answer for consistent comparison
 * - Convert to lowercase
 * - Trim whitespace
 * - Remove extra spaces
 */
function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim().replace(/\s+/g, ' ');
}

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
 * POST /api/auth/forgot-pin/verify-answers
 * Verify user's answers to security questions
 * 
 * Body: { phoneNumber: string, answers: [{ questionId: string, answer: string }] }
 * Returns: { success: boolean, resetToken?: string, remainingAttempts?: number }
 */
async function verifyAnswersHandler(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔍 [verify-answers] ========== DEBUG START ==========');
    console.log('🔍 [verify-answers] Full body:', JSON.stringify(body, null, 2));
    console.log('🔍 [verify-answers] Original phoneNumber:', body.phoneNumber);
    console.log('🔍 [verify-answers] phoneNumber type:', typeof body.phoneNumber);
    console.log('🔍 [verify-answers] answers:', JSON.stringify(body.answers, null, 2));
    console.log('🔍 [verify-answers] ========== DEBUG END ==========');
    
    // Validate input
    const validation = validateRequest(verifyAnswersSchema, body);
    if (!validation.success) {
      console.log('❌ [verify-answers] Validation failed');
      return handleValidationError(validation.error);
    }

    const { phoneNumber, answers } = sanitizeObject(validation.data);
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    
    console.log('🔐 [Forgot PIN] Verifying security answers for phone:', phoneNumber);
    console.log('🔐 [Forgot PIN] Normalized phone for DB:', normalizedPhone);
    console.log('🔐 [Forgot PIN] Answers:', JSON.stringify(answers, null, 2));

    // ✅ FIXED: Only select columns that actually exist in your database
    const { data: business, error: findError } = await supabaseAdmin
      .from('businesses')
      .select(`
        id,
        phone_number,
        recovery_locked_until,
        recovery_attempts,
        security_question_1_id,
        security_answer_1_hash
      `)
      .eq('phone_number', normalizedPhone)
      .single();

    if (findError || !business) {
      console.log('❌ [Forgot PIN] Business not found. Query used:', normalizedPhone);
      console.log('❌ [Forgot PIN] Error:', findError);
      return NextResponse.json({
        success: false,
        error: 'Unable to verify answers',
        resetToken: null
      }, { status: 404 });
    }

    console.log('✅ [verify-answers] Found business:', {
      id: business.id,
      phone_number: business.phone_number,
      hasSecurityHash: !!business.security_answer_1_hash,
      hashPreview: business.security_answer_1_hash ? business.security_answer_1_hash.substring(0, 20) + '...' : 'null'
    });

    // Check if account is locked
    const now = Date.now();
    if (business.recovery_locked_until && business.recovery_locked_until > now) {
      const remainingTime = Math.ceil((business.recovery_locked_until - now) / 1000 / 60);
      console.log(`🔒 [Forgot PIN] Account locked for ${remainingTime} more minutes`);
      
      return NextResponse.json({
        success: false,
        error: `Account is temporarily locked. Please try again in ${remainingTime} minute(s).`,
        resetToken: null,
        lockoutTime: business.recovery_locked_until
      }, { status: 429 });
    }

    // Map question IDs to their hashes (only one question)
    const questionMap = new Map([
      [business.security_question_1_id, business.security_answer_1_hash]
    ]);

    // Verify answers
    let correctAnswers = 0;
    for (const answer of answers) {
      const storedHash = questionMap.get(answer.questionId);
      
      console.log('🔍 [verify-answers] Verifying answer:', {
        questionId: answer.questionId,
        rawAnswer: answer.answer,
        normalizedAnswer: normalizeAnswer(answer.answer),
        hasStoredHash: !!storedHash
      });
      
      if (!storedHash) {
        console.log('⚠️ [Forgot PIN] Invalid question ID provided:', answer.questionId);
        continue;
      }

      // Normalize the answer before comparison
      const normalizedAnswer = normalizeAnswer(answer.answer);
      
      try {
        const isCorrect = await bcrypt.compare(normalizedAnswer, storedHash);
        console.log('🔍 [verify-answers] bcrypt.compare result:', isCorrect);
        if (isCorrect) {
          correctAnswers++;
        }
      } catch (compareError) {
        console.error('❌ [Forgot PIN] Error comparing answer:', compareError);
      }
    }

    // Need at least 1 correct answer (since we have 1 question)
    const isVerified = correctAnswers >= 1;
    console.log('🔍 [verify-answers] Correct answers:', correctAnswers, 'isVerified:', isVerified);

    if (!isVerified) {
      // Increment failed attempts
      const newAttempts = (business.recovery_attempts || 0) + 1;
      const remainingAttempts = Math.max(0, 3 - newAttempts);
      
      console.log(`❌ [Forgot PIN] Incorrect answers. Attempts: ${newAttempts}/3`);

      // Lock account after 3 failed attempts
      let lockoutTime = null;
      if (newAttempts >= 3) {
        lockoutTime = now + (15 * 60 * 1000); // 15 minutes
        console.log('🔒 [Forgot PIN] Account locked for 15 minutes');
      }

      // Update attempts and lockout
      await supabaseAdmin
        .from('businesses')
        .update({
          recovery_attempts: newAttempts,
          recovery_locked_until: lockoutTime
        })
        .eq('id', business.id);

      return NextResponse.json({
        success: false,
        error: newAttempts >= 3 
          ? 'Too many failed attempts. Account locked for 15 minutes.'
          : `Incorrect answers. ${remainingAttempts} attempt(s) remaining.`,
        resetToken: null,
        remainingAttempts,
        lockoutTime
      }, { status: 401 });
    }

    // Answers verified successfully - generate reset token
    const resetToken = `${business.id}-${now}-${Math.random().toString(36).substring(2, 15)}`;
    
    console.log('✅ [Forgot PIN] Security answers verified successfully');
    console.log('🔍 [verify-answers] Generated resetToken:', resetToken);

    // Reset recovery attempts on successful verification
    await supabaseAdmin
      .from('businesses')
      .update({
        recovery_attempts: 0,
        recovery_locked_until: null
      })
      .eq('id', business.id);

    return NextResponse.json({
      success: true,
      error: null,
      resetToken,
      businessId: business.id
    });

  } catch (err) {
    console.error('💥 [Forgot PIN] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred',
      resetToken: null
    }, { status: 500 });
  }
}

// Export with strict rate limiting (3 attempts per 15 minutes)
export const POST = withRateLimit(verifyAnswersHandler, {
  maxRequests: 3,
  windowMs: 15 * 60 * 1000
});