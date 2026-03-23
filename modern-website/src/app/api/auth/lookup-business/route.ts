import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { phoneLookupSchema } from '@/lib/validation/schemas';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { sanitizeObject } from '@/lib/validation/sanitizer';

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
    const body = await request.json();
    
    // Validate with Zod schema
    const validation = validateRequest(phoneLookupSchema, body);
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    // Sanitize validated data
    const { phoneNumber } = sanitizeObject(validation.data);
    
    console.log('🔍 [API] Looking up business for phone:', phoneNumber);

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
