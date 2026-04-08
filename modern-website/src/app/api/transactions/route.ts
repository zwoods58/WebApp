import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrency } from '@/utils/currency';
import { transactionSchema } from '@/lib/validation/schemas';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { sanitizeObject } from '@/lib/validation/sanitizer';
import { withRateLimit } from '@/middleware/rate-limit-middleware';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function transactionHandler(request: NextRequest) {
  try {
    console.log('🔧 API Route - POST request received');
    
    const body = await request.json();

    // Validate with Zod schema
    const validation = validateRequest(transactionSchema, body);
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    // Sanitize validated data
    const sanitizedData = sanitizeObject(validation.data);
    const { business_id, industry, amount, category, description, customer_name, payment_method, transaction_date, metadata } = sanitizedData;

    console.log('🔧 API Route - Validated transaction data:', { business_id, industry, amount, category });

    // Fetch business to get country for currency derivation
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('country')
      .eq('id', business_id)
      .single();

    if (businessError || !business) {
      console.error('Failed to fetch business:', businessError);
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Derive currency from country code
    const currency = getCurrency(business.country);
    console.log('🔧 Derived currency from country:', { country: business.country, currency });

    console.log('🔧 About to insert transaction with data:', {
      business_id,
      industry,
      amount,
      category,
      description,
      customer_name,
      payment_method,
      transaction_date,
      currency,
      metadata
    });

    // Insert transaction using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('transactions')
      .insert({
        business_id,
        industry,
        amount,
        category,
        description,
        customer_name,
        payment_method,
        transaction_date,
        currency,
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Transaction insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ API Route - Transaction inserted successfully:', data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export with user-based rate limiting
export const POST = withRateLimit(transactionHandler, {
  type: 'transactions',
  getIdentifier: async (request: NextRequest) => {
    const body = await request.json();
    return body.business_id; // Use business_id as user identifier
  },
  isProgressive: false,
});
