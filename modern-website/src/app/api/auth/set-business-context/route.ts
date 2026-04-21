import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    console.log('set-business-context: Request received');
    console.log('set-business-context: Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV,
    });
    
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('set-business-context: Missing Supabase environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error - missing database credentials' },
        { status: 500 }
      );
    }
    
    // 1. Read the token from the Authorization header (client now sends this)
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    console.log('set-business-context: Auth header present:', !!authHeader);
    console.log('set-business-context: Token present:', !!token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - no token provided' },
        { status: 401 }
      );
    }

    // 2. Read the body the client actually sends
    let body;
    try {
      body = await req.json();
      console.log('set-business-context: Body parsed successfully:', body);
    } catch (parseError) {
      console.error('set-business-context: Failed to parse body:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { businessId, country, industry } = body;

    // 3. Verify the JWT and get the user
    console.log('set-business-context: Getting Supabase client...');
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (clientError) {
      console.error('set-business-context: Failed to get Supabase client:', clientError);
      return NextResponse.json(
        { success: false, message: 'Database configuration error' },
        { status: 500 }
      );
    }

    console.log('set-business-context: Verifying JWT token...');
    let user, authError;
    try {
      const result = await supabase.auth.getUser(token);
      user = result.data.user;
      authError = result.error;
    } catch (jwtError) {
      console.error('set-business-context: JWT verification failed:', jwtError);
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    console.log('set-business-context: Auth error:', authError?.message);
    console.log('set-business-context: User found:', !!user);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - invalid token', error: authError?.message },
        { status: 401 }
      );
    }

    // 4. Use service role to query businesses
    console.log('set-business-context: Getting admin client...');
    let adminClient;
    try {
      adminClient = getSupabaseAdminClient();
    } catch (adminClientError) {
      console.error('set-business-context: Failed to get admin client:', adminClientError);
      return NextResponse.json(
        { success: false, message: 'Database admin configuration error' },
        { status: 500 }
      );
    }

    console.log('set-business-context: Looking up business for user:', user.id);
    let business, bizError;
    try {
      const result = await adminClient
        .from('businesses')
        .select('id, subscription_status, subscription_expires_at')
        .eq('supabase_user_id', user.id)
        .single();
      business = result.data;
      bizError = result.error;
    } catch (dbError) {
      console.error('set-business-context: Database query failed:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database query error' },
        { status: 500 }
      );
    }

    console.log('set-business-context: Business lookup error:', bizError?.message);
    console.log('set-business-context: Business found:', !!business);

    if (bizError || !business) {
      return NextResponse.json(
        { success: false, message: 'Business not found', error: bizError?.message },
        { status: 404 }
      );
    }

    // 5. Verify the businessId the client sent matches what the JWT resolves to
    //    This prevents one user from setting context for another user's business
    console.log('set-business-context: Comparing business IDs:', { 
      clientProvided: businessId, 
      databaseFound: business.id 
    });

    if (business.id !== businessId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden - businessId mismatch' },
        { status: 403 }
      );
    }

    const now = new Date();
    const expiresAt = business.subscription_expires_at
      ? new Date(business.subscription_expires_at)
      : null;

    const isActive =
      business.subscription_status === 'active' &&
      expiresAt !== null &&
      expiresAt > now;

    return NextResponse.json({
      success: true,
      businessId: business.id,
      country,
      industry,
      subscriptionActive: isActive,
      subscriptionExpiresAt: business.subscription_expires_at ?? null,
      daysRemaining: expiresAt
        ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0,
    });

  } catch (error) {
    console.error('set-business-context: Unexpected error:', error);
    console.error('set-business-context: Error stack:', error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}