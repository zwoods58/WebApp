import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use service role — no user session in webhook context
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function verifySignature(body: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', process.env.KYSHI_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  return expected === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-kyshi-signature') ?? '';

    if (!verifySignature(body, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhookData = JSON.parse(body);
    console.log('🔔 Kyshi Webhook received:', JSON.stringify(webhookData, null, 2));

    // Kyshi docs say event is "successful" (not "transaction.successful")
    if (webhookData.event !== 'successful') {
      console.log(`ℹ️ Ignoring event: ${webhookData.event}`);
      return NextResponse.json({ received: true });
    }

    const txn = webhookData.data;
    const reference = txn.reference || txn.authorization?.authorizationCode;

    if (!reference) {
      console.error('❌ No reference in webhook payload');
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    // Check if already processed (idempotency)
    const { data: existing } = await supabase
      .from('payment_transactions')
      .select('id, status')
      .eq('reference', reference)
      .single();

    if (existing?.status === 'SUCCESS') {
      console.log('ℹ️ Already processed:', reference);
      return NextResponse.json({ received: true });
    }

    // Find the pending transaction to get business_id / user_id
    // Fall back to email lookup if no pending record exists
    let businessId: string | null = null;
    let userId: string | null = null;

    if (existing) {
      // We have a payment_transactions record — use it
      const { data: fullTxn } = await supabase
        .from('payment_transactions')
        .select('business_id, user_id')
        .eq('reference', reference)
        .single();
      businessId = fullTxn?.business_id ?? null;
      userId = fullTxn?.user_id ?? null;
    } else {
      // Fallback: look up by customer email
      const email = txn.customer?.email;
      if (!email) {
        console.error('❌ Cannot identify user — no reference match and no email');
        return NextResponse.json({ error: 'Cannot identify user' }, { status: 404 });
      }

      const { data: business } = await supabase
        .from('businesses')
        .select('id, user_id')
        .eq('email', email)
        .single();

      if (!business) {
        // Try auth.users
        const { data: { users } } = await supabase.auth.admin.listUsers();
        const matchedUser = users.find(u => u.email === email);
        if (matchedUser) {
          userId = matchedUser.id;
          const { data: biz } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', matchedUser.id)
            .single();
          businessId = biz?.id ?? null;
        }
      } else {
        businessId = business.id;
        userId = business.user_id;
      }
    }

    if (!businessId && !userId) {
      console.error('❌ Could not find business/user for reference:', reference);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Mark transaction as successful
    if (existing) {
      await supabase
        .from('payment_transactions')
        .update({ status: 'SUCCESS', paid_at: new Date().toISOString() })
        .eq('reference', reference);
    } else {
      // Insert if no pending record existed
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

    // Grant 7-day access on businesses table
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    if (businessId) {
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
        console.error('❌ Failed to update business subscription:', bizError);
        return NextResponse.json({ error: 'Failed to activate subscription' }, { status: 500 });
      }
    }

    console.log(`✅ Subscription activated. Business: ${businessId}, Expires: ${expiresAt.toISOString()}`);

    return NextResponse.json({
      received: true,
      success: true,
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}