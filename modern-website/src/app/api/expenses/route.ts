import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrency } from '@/utils/currency';
import { expenseSchema } from '@/lib/validation/schemas';
import { validateRequest, handleValidationError } from '@/middleware/validate';
import { sanitizeObject } from '@/lib/validation/sanitizer';
import { withRateLimit } from '@/middleware/rate-limit-middleware';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function expenseHandler(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod schema
    const validation = validateRequest(expenseSchema, body);
    if (!validation.success) {
      return handleValidationError(validation.error);
    }

    // Sanitize validated data
    const sanitizedData = sanitizeObject(validation.data);
    const { business_id, industry, amount, category, description, vendor_name, payment_method, expense_date, metadata } = sanitizedData;

    console.log('🔧 API Route - Validated expense data:', { business_id, industry, amount, category });

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

    // Insert expense using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('expenses')
      .insert({
        business_id,
        industry,
        amount,
        category,
        description,
        vendor_name,
        // Only include payment_method if it exists in the table
        ...(payment_method && { payment_method }),
        expense_date,
        currency,
        metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Expense insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ API Route - Expense inserted successfully:', data);
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
export const POST = withRateLimit(expenseHandler, {
  type: 'expenses',
  getIdentifier: async (request: NextRequest) => {
    const body = await request.json();
    return body.business_id; // Use business_id as user identifier
  },
  isProgressive: false,
});
