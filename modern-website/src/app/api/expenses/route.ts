import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrency } from '@/utils/currency';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { business_id, industry, amount, category, description, vendor_name, payment_method, expense_date, metadata } = body;

    console.log('🔧 API Route - Received expense data:', { business_id, industry, amount, category, description, vendor_name, payment_method, expense_date, metadata });

    // Validate required fields
    if (!business_id || !industry || !amount || !expense_date) {
      return NextResponse.json(
        { error: 'Missing required fields: business_id, industry, amount, expense_date' },
        { status: 400 }
      );
    }

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
        payment_method,
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
