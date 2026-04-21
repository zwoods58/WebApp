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
      .select('*')
      .eq('supabase_user_id', user.id)
      .single();

    if (error || !business) {
      return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, business });

  } catch (err) {
    console.error('[business] GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    // Only allow safe fields to be updated
    const allowed = ['business_name', 'phone_number', 'industry', 'country', 'settings'];
    const updates: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update' }, { status: 400 });
    }

    const admin = createServerClient();
    const { data, error } = await admin
      .from('businesses')
      .update(updates)
      .eq('supabase_user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: 'Update failed', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, business: data });

  } catch (err) {
    console.error('[business] PATCH error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 }
    );
  }
}
