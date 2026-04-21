import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // 1. Read the token from the Authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - no token provided' },
        { status: 401 }
      );
    }

    // 2. Read body
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { businessId, country, industry } = body;

    // 3. Create Supabase clients directly in the route
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 4. Verify the JWT and get user
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - invalid token', error: authError?.message },
        { status: 401 }
      );
    }

    // 5. Use service role to query businesses
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: business, error: bizError } = await adminClient
      .from('businesses')
      .select('id, subscription_status, subscription_expires_at')
      .eq('supabase_user_id', user.id)
      .single();

    if (bizError || !business) {
      return NextResponse.json(
        { success: false, message: 'Business not found', error: bizError?.message },
        { status: 404 }
      );
    }

    // 6. Verify businessId matches
    if (business.id !== businessId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden - businessId mismatch' },
        { status: 403 }
      );
    }

    // 7. Calculate subscription status
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
    console.error('set-business-context error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}