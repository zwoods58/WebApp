import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const userData = await request.json();
    
    console.log('🔧 [API] Creating business in database:', userData);
    
    // Prepare business data for database insertion
    const businessData = {
      phone_number: userData.phoneNumber,
      business_name: userData.businessName,
      country: userData.country.toUpperCase(),
      industry: userData.industry,
      settings: {
        currency: userData.currency,
        daily_target: userData.dailyTarget,
        invite_code: userData.inviteCode,
        user_name: userData.name
      },
      is_active: true
    };

    console.log('📝 [API] Inserting business data:', businessData);

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

    console.log('✅ [API] Business created successfully:', {
      id: business.id,
      business_id: business.business_id,
      country_code: business.country_code,
      industry_code: business.industry_code,
      home_currency: business.home_currency
    });

    return NextResponse.json({
      success: true,
      existingUser: false,
      error: null,
      data: {
        business: business
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
