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

// DEBUG: Log database connection info
console.log('🔧 Database Connection Debug:', {
  url: supabaseUrl,
  hasServiceKey: !!supabaseServiceKey,
  serviceKeyPrefix: supabaseServiceKey ? supabaseServiceKey.substring(0, 20) + '...' : 'none'
});

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

    // DEBUG: Tables exist (verified by database check), proceed with business query
    console.log('🔍 Proceeding with business fetch (tables verified)...');

    // Fetch business to get country for currency derivation
    console.log('🔍 Attempting to fetch business:', { business_id });
    const { data: business, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('country')
      .eq('id', business_id)
      .single();

    if (businessError) {
      console.error('Business fetch failed:', {
        error: businessError,
        code: businessError.code,
        message: businessError.message,
        details: businessError.details
      });
      
      // Specific handling for missing table
      if (businessError.code === '42P01') {
        return NextResponse.json(
          { 
            error: 'Database schema error: businesses table not found',
            code: 'SCHEMA_ERROR',
            details: 'The businesses table does not exist in the connected database',
            suggestion: 'Check if environment variables point to the correct Supabase project'
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Business not found', details: businessError.message },
        { status: 404 }
      );
    }
    
    if (!business) {
      console.error('Business not found for ID:', business_id);
      return NextResponse.json(
        { error: 'Business not found', business_id },
        { status: 404 }
      );
    }

    // Derive currency from country code
    const currency = getCurrency(business.country);
    console.log('🔧 Derived currency from country:', { country: business.country, currency });

    // Insert expense using admin client (bypasses RLS)
    let { data, error } = await supabaseAdmin
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
  getIdentifier: async (body: any) => {
    return body.business_id; // Use business_id as user identifier
  },
  isProgressive: false,
});

