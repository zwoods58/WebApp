import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

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
    
    console.log('🔧 [API] Creating business in database with PIN:', userData);
    
    // Validate required fields
    if (!userData.phoneNumber || !userData.name || !userData.country || !userData.industry) {
      return NextResponse.json({
        success: false,
        existingUser: false,
        error: 'Missing required fields: phone, name, country, industry',
        data: null
      }, { status: 400 });
    }

    // Validate PIN
    if (!userData.pin || userData.pin.length !== 6 || !/^\d{6}$/.test(userData.pin)) {
      return NextResponse.json({
        success: false,
        existingUser: false,
        error: 'Invalid PIN. PIN must be exactly 6 digits.',
        data: null
      }, { status: 400 });
    }

    // Hash the PIN with bcrypt
    const saltRounds = 12;
    let pinHash: string;
    
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
    } catch (hashError) {
      console.error('❌ Error hashing PIN:', hashError);
      return NextResponse.json({
        success: false,
        existingUser: false,
        error: 'Failed to secure PIN',
        data: null
      }, { status: 500 });
    }

    // Prepare business data for database insertion
    const businessData = {
      phone_number: userData.phoneNumber,
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

    console.log('✅ [API] Business created successfully with PIN hash:', {
      id: business.id,
      business_name: business.business_name,
      country: business.country,
      industry: business.industry,
      home_currency: business.home_currency
    });

    // Remove PIN hash from response for security
    const { pin_hash: _, ...businessResponse } = business;

    return NextResponse.json({
      success: true,
      existingUser: false,
      error: null,
      data: {
        business: businessResponse
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
