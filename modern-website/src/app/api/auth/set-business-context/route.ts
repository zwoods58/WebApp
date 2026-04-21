import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // 1. Read the token from the Authorization header (client now sends this)
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized â no token provided' },
        { status: 401 }
      );
    }

    // 2. Read the body the client actually sends
    const { businessId, country, industry } = await req.json();

    // 3. Verify the JWT and get the user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized â invalid token' },
        { status: 401 }
      );
    }

    // 4. Use service role to query businesses
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    // 5. Verify the businessId the client sent matches what the JWT resolves to
    //    This prevents one user from setting context for another user's business
    if (business.id !== businessId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden â businessId mismatch' },
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
    console.error('set-business-context error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}