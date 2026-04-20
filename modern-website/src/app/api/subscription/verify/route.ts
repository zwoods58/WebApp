import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');
    const sub_id = searchParams.get('sub_id');

    if (!reference) {
      return NextResponse.json(
        { status: "failed", message: "Missing reference" }, 
        { status: 400 }
      );
    }

    const response = await fetch(`https://api.kyshi.co/v1/transactions/verify/${reference}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.KYSHI_SECRET_KEY!
      }
    });

    const data = await response.json();
    const txStatus = data.data.status; // PENDING, SUCCESS, FAILED, COLLECTED

    if (txStatus === 'SUCCESS' || txStatus === 'COLLECTED') {
      // Update subscriptions table
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/subscriptions?id=eq.${sub_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        },
        body: JSON.stringify({
          status: 'active',
          is_active: true,
          last_charge_date: new Date().toISOString(),
          next_charge_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // NOW+7days
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // NOW+7days
          updated_at: new Date().toISOString()
        })
      });

      return NextResponse.json({ status: "success" });
    } else if (txStatus === 'PENDING') {
      return NextResponse.json({ status: "pending" });
    } else if (txStatus === 'FAILED') {
      // Update subscriptions set status=failed
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/subscriptions?id=eq.${sub_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        },
        body: JSON.stringify({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
      });

      return NextResponse.json({ status: "failed" });
    }

    return NextResponse.json({ status: "unknown" });
  } catch (error) {
    return NextResponse.json(
      { 
        status: "failed", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}
