import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { businessSignupSchema } from '@/lib/validation/schemas';
import { validateRequest, handleValidationError, formatValidationErrors } from '@/middleware/validate';
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

async function signupHandler(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔧 [API] Creating business in database with PIN');
    console.log('📥 [API] Received body:', {
      ...body,
      pin: body.pin ? '***' : 'none',
      securityQuestions: body.securityQuestions ? {
        questionId: body.securityQuestions.questionId,
        hasAnswer: !!body.securityQuestions.answer
      } : 'NOT PROVIDED'
    });
    
    // Validate with Zod schema
    const validation = validateRequest(businessSignupSchema, body);
    if (!validation.success) {
      const formattedErrors = formatValidationErrors(validation.error);
      console.error('❌ [API] Validation failed:', {
        errors: validation.error.issues,
        formattedErrors,
        receivedBody: {
          ...body,
          pin: body.pin ? '***' : 'none',
          securityQuestions: body.securityQuestions ? {
            questionId: body.securityQuestions.questionId,
            hasAnswer: !!body.securityQuestions.answer
          } : 'NOT PROVIDED'
        }
      });
      
      return NextResponse.json({
        success: false,
        existingUser: false,
        error: 'Invalid input data',
        details: formattedErrors
      }, { status: 400 });
    }

    // Sanitize validated data
    const userData = sanitizeObject(validation.data) as any;
    console.log('✅ [API] After validation, userData.securityQuestions:', userData.securityQuestions ? 'EXISTS' : 'NULL');

    // Hash the PIN with bcrypt
    const saltRounds = 12;
    let pinHash: string;
    let answerHash: string | null = null;
    
    try {
      console.log('🔐 Hashing PIN:', { 
        pinLength: userData.pin.length, 
        saltRounds,
        pinValue: userData.pin ? '***' : 'none'
      });
      pinHash = await bcrypt.hash(userData.pin, saltRounds);
      console.log('✅ PIN hashed successfully:', { 
        hashLength: pinHash.length,
        hashPrefix: pinHash.substring(0, 7) + '...'
      });

      // Hash security question answer if provided
      if (userData.securityQuestions) {
        const normalizeAnswer = (answer: string) => answer.toLowerCase().trim().replace(/\s+/g, ' ');
        
        console.log('🔐 Hashing security question answer');
        answerHash = await bcrypt.hash(normalizeAnswer(userData.securityQuestions.answer), saltRounds);
        console.log('✅ Security answer hashed successfully');
      }
    } catch (hashError) {
      console.error('❌ Error hashing PIN or security answers:', hashError);
      return NextResponse.json({
        success: false,
        existingUser: false,
        error: 'Failed to secure credentials',
        data: null
      }, { status: 500 });
    }

    // Prepare business data for database insertion
    const businessData: any = {
      phone_number: userData.phoneNumber,
      email: userData.email,
      business_name: userData.businessName || `${userData.name}'s Business`,
      country: userData.country.toUpperCase(),
      industry: userData.industry,
      settings: {
        currency: userData.currency,
        daily_target: userData.dailyTarget,
        invite_code: userData.inviteCode,
        user_name: userData.name,
        industry_sector: userData.industrySector
      },
      home_currency: userData.currency,
      pin_hash: pinHash, // Store the hashed PIN
      is_active: true
    };

    // Add security question if provided
    if (userData.securityQuestions && answerHash) {
      businessData.security_question_1_id = userData.securityQuestions.questionId;
      businessData.security_answer_1_hash = answerHash;
      console.log('📝 [API] Including security question in business data');
    }

    console.log('📝 [API] Inserting business data with hashed PIN');

    // Insert business into database (bypasses RLS with service role)
    const { data: business, error } = await supabaseAdmin
      .from('businesses')
      .insert(businessData)
      .select()
      .single();

    if (error) {
      console.error('❌ [API] Database error:', error);
      
      // Check for unique constraint violation (phone already exists)
      if (error.code === '23505') {
        return NextResponse.json({
          success: false,
          existingUser: true,
          error: 'A business with this phone number already exists',
          data: null
        }, { status: 409 });
      }
      
      return NextResponse.json({
        success: false,
        existingUser: false,
        error: error.message || 'Failed to create business',
        data: null
      }, { status: 500 });
    }

    console.log('API] Business created successfully with PIN hash:', {
      id: business.id,
      business_name: business.business_name,
      country: business.country,
      industry: business.industry,
      home_currency: business.home_currency
    });

    // On successful signup, ensure no failed PIN attempts remain
    await rateLimiter.resetPinVerification(userData.phoneNumber);

    // Remove PIN hash from response for security
    const { pin_hash: _, ...businessResponse } = business;

    // Create session data for immediate authentication
    const sessionData = {
      businessId: business.id,
      businessName: business.business_name,
      country: business.country,
      industry: business.industry,
      phone: business.phone_number,
      timestamp: Date.now()
    };

    return NextResponse.json({
      success: true,
      existingUser: false,
      error: null,
      data: {
        business: businessResponse,
        session: sessionData
      }
    });

  } catch (err) {
    console.error('💥 [API] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      existingUser: false,
      error: err instanceof Error ? err.message : 'Unexpected error occurred',
      data: null
    }, { status: 500 });
  }
}

// Export with phone-based rate limiting
export const POST = withRateLimit(signupHandler, {
  type: 'signup',
  getIdentifier: async (body: any) => {
    return body.phoneNumber;
  },
  isProgressive: false,
});
