import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrency } from '@/utils/currency';
import { transactionSchema } from '@/lib/validation/schemas';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { sanitizeObject } from '@/lib/validation/sanitizer';
import { withRateLimit } from '@/middleware/rate-limit-middleware';
import { createServerClient, getUserFromToken } from '@/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function transactionHandler(request: NextRequest) {
  try {
    console.log('🚀 Unified Transaction API - POST request received');
    
    const body = await request.json();
    console.log('📥 Transaction data received:', { type: body.type, amount: body.amount, business_id: body.business_id });

    // Validate with unified Zod schema
    const validation = validateRequest(transactionSchema, body);
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.error);
      return handleValidationError(validation.error);
    }

    // Sanitize validated data
    const sanitizedData = sanitizeObject(validation.data);
    const { 
      business_id, 
      type, 
      industry, 
      amount, 
      category, 
      description, 
      customer_name,
      customer_phone,
      vendor_name,
      supplier_phone,
      payment_method, 
      transaction_date, 
      metadata 
    } = sanitizedData;

    // Validate business_id exists
    if (!business_id) {
      return NextResponse.json(
        { error: 'business_id is required' },
        { status: 400 }
      );
    }

    // Get user from token for authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    console.log('✅ Authenticated user:', { userId: user.id, business_id });

    // Fetch business to get country for currency derivation and verify ownership
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('country, supabase_user_id')
      .eq('id', business_id)
      .single();

    if (businessError || !business) {
      console.error('❌ Failed to fetch business:', businessError);
      return NextResponse.json(
        { error: 'Business not found', details: businessError?.message },
        { status: 404 }
      );
    }

    // Verify user owns this business
    if (business.supabase_user_id !== user.id) {
      console.error('❌ User does not own this business:', { userId: user.id, businessUserId: business.supabase_user_id });
      return NextResponse.json(
        { error: 'Access denied: You do not own this business' },
        { status: 403 }
      );
    }

    // Derive currency from country code
    const currency = getCurrency(business.country);
    console.log('� Derived currency:', { country: business.country, currency });

    // Prepare transaction data based on type
    const transactionData: any = {
      business_id,
      type,
      industry,
      amount,
      currency,
      category,
      description,
      payment_method,
      transaction_date: transaction_date || new Date().toISOString(),
      metadata: metadata || {}
    };

    // Add type-specific fields
    if (type === 'money_in') {
      if (customer_name) transactionData.customer_name = customer_name;
      if (customer_phone) transactionData.customer_phone = customer_phone;
    } else if (type === 'money_out') {
      if (vendor_name) transactionData.vendor_name = vendor_name;
      if (supplier_phone) transactionData.supplier_phone = supplier_phone;
    }

    console.log('🔧 About to insert unified transaction:', {
      ...transactionData,
      userId: user.id
    });

    // Insert into business_transactions table using admin client
    let { data, error } = await supabaseAdmin
      .from('business_transactions')
      .insert(transactionData)
      .select()
      .single();

    if (error) {
      console.error('❌ Transaction insert error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create transaction',
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('✅ Unified transaction created successfully:', data);
    return NextResponse.json({ 
      success: true,
      data,
      message: `${type === 'money_in' ? 'Money in' : 'Money out'} transaction recorded successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('💥 API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Export with user-based rate limiting
export const POST = withRateLimit(transactionHandler, {
  type: 'transactions',
  getIdentifier: async (body: any) => {
    return body.business_id;
  },
  isProgressive: false,
});

