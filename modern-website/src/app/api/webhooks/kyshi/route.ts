import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-kyshi-signature') ?? '';

    // Verify signature using SHA256 (as per Kyshi docs)
    const expected = crypto
      .createHmac('sha256', process.env.KYSHI_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (!signature || expected !== signature) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhookData = JSON.parse(body);
    console.log('🔔 Kyshi Webhook event:', webhookData.event);

    // Kyshi sends "successful" not "transaction.successful"
    if (webhookData.event !== 'successful') {
      console.log(`ℹ️ Ignoring event: ${webhookData.event}`);
      return NextResponse.json({ received: true });
    }

    const txn = webhookData.data;
    const reference = txn.reference;

    if (!reference) {
      console.error('❌ No reference in webhook payload');
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    // Idempotency — don't process the same payment twice
    const { data: existing } = await supabase
      .from('payment_transactions')
      .select('id, status, business_id, user_id')
      .eq('reference', reference)
      .single();

    if (existing?.status === 'SUCCESS') {
      console.log('ℹ️ Already processed:', reference);
      return NextResponse.json({ received: true });
    }

    let businessId: string | null = existing?.business_id ?? null;
    let userId: string | null = existing?.user_id ?? null;

    // Fallback: find business by customer email from webhook payload
    if (!businessId) {
      const email = txn.customer?.email;
      if (email) {
        const { data: business } = await supabase
          .from('businesses')
          .select('id, user_id')
          .eq('email', email)
          .single();

        if (business) {
          businessId = business.id;
          userId = business.user_id;
        }
      }
    }

    if (!businessId) {
      console.error('❌ Cannot find business for reference:', reference);
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Update or insert transaction record
    if (existing) {
      await supabase
        .from('payment_transactions')
        .update({
          status: 'SUCCESS',
          paid_at: new Date().toISOString(),
        })
        .eq('reference', reference);
    } else {
      await supabase.from('payment_transactions').insert({
        business_id: businessId,
        user_id: userId,
        reference,
        amount: txn.amount,
        currency: txn.meta?.localCurrency ?? 'USD',
        status: 'SUCCESS',
        paid_at: new Date().toISOString(),
        webhook_payload: txn,
      });
    }

    // Grant 7 days of access on the businesses table
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error: bizError } = await supabase
      .from('businesses')
      .update({
        subscription_status: 'active',
        subscription_expires_at: expiresAt.toISOString(),
        last_payment_reference: reference,
        last_payment_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', businessId);

    if (bizError) {
      console.error('❌ Failed to update business:', bizError);
      return NextResponse.json({ error: 'Failed to activate subscription' }, { status: 500 });
    }

    console.log(`✅ Activated business ${businessId} until ${expiresAt.toISOString()}`);
    return NextResponse.json({ received: true, success: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}