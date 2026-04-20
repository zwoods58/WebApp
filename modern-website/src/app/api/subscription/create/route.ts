import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const KYSHI_SECRET = process.env.KYSHI_SECRET_KEY!;
const KYSHI_BASE = process.env.KYSHI_ENV === 'live'
  ? 'https://api.kyshi.co'
  : 'https://api.sandbox.kyshi.co';

const COUNTRY_CONFIG: Record<string, {
  amount: number;
  currency: string;
  channels: string[];
}> = {
  KEN: { amount: 200,  currency: 'KES', channels: ['mobileMoney'] },
  NGA: { amount: 500,  currency: 'NGN', channels: ['bankTransfer'] },
  GHA: { amount: 20,   currency: 'GHS', channels: ['mobileMoney'] },
  CIV: { amount: 1000, currency: 'XOF', channels: ['mobileMoney'] },
};

export async function POST(req: NextRequest) {
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { countryCode } = await req.json();
    const config = COUNTRY_CONFIG[countryCode?.toUpperCase()];

    if (!config) {
      return NextResponse.json(
        { success: false, message: `Unsupported country: ${countryCode}` },
        { status: 400 }
      );
    }

    // Unique reference you control — used to match webhook back to this user
    const reference = `BEE-${user.id.slice(0, 8)}-${Date.now()}`;

    const kyshiRes = await fetch(`${KYSHI_BASE}/v1/transactions/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KYSHI_SECRET,
      },
      body: JSON.stringify({
        email: user.email,
        amount: config.amount,
        amountCurrency: 'local',
        localCurrency: config.currency,
        reference,
        channels: config.channels,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app?payment=success&ref=${reference}`,
      }),
    });

    const kyshiData = await kyshiRes.json();

    if (!kyshiData.status) {
      console.error('Kyshi API error:', kyshiData);
      return NextResponse.json(
        { success: false, message: kyshiData.message || 'Payment initialization failed' },
        { status: 502 }
      );
    }

    // Get business linked to this user
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Save pending transaction so webhook can match it
    if (business) {
      await supabaseAdmin.from('payment_transactions').insert({
        business_id: business.id,
        user_id: user.id,
        reference,
        amount: config.amount,
        currency: config.currency,
        country_code: countryCode.toUpperCase(),
        status: 'PENDING',
        email: user.email,
      });
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: kyshiData.data.authorizationUrl,
      reference,
    });

  } catch (error) {
    console.error('Subscription create error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}