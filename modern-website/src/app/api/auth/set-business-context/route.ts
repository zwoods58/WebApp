import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  }
});

/**
 * Maps country names to 2-letter codes
 */
function getCountryCode(country: string): string {
  const countryMap: Record<string, string> = {
    'kenya': 'KE',
    'ke': 'KE',
    'nigeria': 'NG',
    'ng': 'NG',
    'south africa': 'ZA',
    'za': 'ZA',
    'ghana': 'GH',
    'gh': 'GH',
    'uganda': 'UG',
    'ug': 'UG',
    'rwanda': 'RW',
    'rw': 'RW',
    'tanzania': 'TZ',
    'tz': 'TZ'
  };

  return countryMap[country.toLowerCase()] || country.toUpperCase().substring(0, 2);
}

export async function POST(request: NextRequest) {
  try {
    const { businessId, country, industry } = await request.json();

    if (!businessId || !country || !industry) {
      return NextResponse.json(
        { error: 'Missing required fields: businessId, country, industry' },
        { status: 400 }
      );
    }

    // Get country code from country name
    const countryCode = getCountryCode(country);
    
    // Call the Supabase function to set session context
    const { data, error } = await supabaseAdmin.rpc('set_business_context', {
      p_business_id: businessId,
      p_country: countryCode,
      p_industry: industry.toLowerCase()
    });

    if (error) {
      // Check if function doesn't exist (common in dev)
      if (error.code === '42883' || error.message?.includes('function') || error.message?.includes('does not exist')) {
        console.warn('⚠️ set_business_context function not found in database - skipping (non-critical)');
        return NextResponse.json({ success: true, skipped: true });
      }
      
      // For other errors, log but don't throw (non-critical)
      console.warn('⚠️ Failed to set business context (non-critical):', error.message);
      return NextResponse.json({ success: true, skipped: true });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error setting business context:', error);
    return NextResponse.json(
      { error: 'Failed to set business context', details: error.message },
      { status: 500 }
    );
  }
}
