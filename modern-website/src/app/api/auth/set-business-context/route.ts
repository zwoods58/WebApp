import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // Get the user's JWT from the Authorization header or cookie
    const authHeader = req.headers.get('authorization');
    const cookieHeader = req.headers.get('cookie') ?? '';
    
    // Extract token from Authorization header
    let token = authHeader?.replace('Bearer ', '');
    
    // If no auth header, try to get from Supabase cookie
    if (!token) {
      // Supabase stores token in cookie named sb-{project-ref}-auth-token
      const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
          const [k, ...v] = c.trim().split('=');
          return [k, v.join('=')];
        })
      );
      
      // Find the supabase auth cookie (dynamic name)
      const authCookieKey = Object.keys(cookies).find(k => 
        k.includes('auth-token') || k.includes('sb-') 
      );
      
      if (authCookieKey) {
        try {
          const cookieValue = decodeURIComponent(cookies[authCookieKey]);
          const parsed = JSON.parse(cookieValue);
          token = Array.isArray(parsed) ? parsed[0] : parsed?.access_token;
        } catch {
          token = cookies[authCookieKey];
        }
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Use anon key + user token to get the actual user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Use service role to query businesses (bypasses RLS)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: business, error: bizError } = await adminClient
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