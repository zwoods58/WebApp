import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    const admin = createServerClient();
    const { data: business, error } = await admin
      .from('businesses')
      .select('subscription_status, subscription_expires_at')
      .eq('supabase_user_id', user.id)
      .single();

    if (error || !business) {
      return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });
    }

    const now = new Date();
    const expiresAt = business.subscription_expires_at ? new Date(business.subscription_expires_at) : null;
    const isActive = business.subscription_status === 'active' && !!expiresAt && expiresAt > now;
    const daysRemaining = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 86400000)) : 0;

    return NextResponse.json({
      success: true,
      status: business.subscription_status ?? 'inactive',
      isActive,
      expiresAt: business.subscription_expires_at ?? null,
      daysRemaining,
    });

  } catch (err) {
    console.error('[subscription] GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    );
  }
}
