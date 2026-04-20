import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST() {
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { data: business, error: bizError } = await supabaseAdmin
      .from('businesses')
      .select('id, subscription_status, subscription_expires_at')
      .eq('user_id', user.id)
      .single();

    if (bizError || !business) {
      return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });
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
      subscriptionActive: isActive,
      subscriptionExpiresAt: business.subscription_expires_at ?? null,
      daysRemaining: expiresAt
        ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0,
    });

  } catch (error) {
    console.error('set-business-context error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}