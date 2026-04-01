import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      }
    })
  : null;

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
    // Check if service key is configured
    if (!supabaseAdmin) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Service key not configured' },
        { status: 500 }
      );
    }

    // Parse and validate JSON request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { businessId, country, industry } = body;

    // Validate required fields
    if (!businessId || typeof businessId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: businessId' },
        { status: 400 }
      );
    }

    if (!country || typeof country !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: country' },
        { status: 400 }
      );
    }

    if (!industry || typeof industry !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid required field: industry' },
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
      { error: 'Failed to set business context', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
