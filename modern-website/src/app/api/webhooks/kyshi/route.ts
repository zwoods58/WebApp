import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const KYSHI_WEBHOOK_SECRET = process.env.KYSHI_WEBHOOK_SECRET!;

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Helper function to verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    // Kyshi may use different signature methods - adjust based on their documentation
    // Common methods: HMAC-SHA256, SHA256 with secret, etc.
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    // Remove any hash prefixes from the signature (e.g., 'sha256=')
    const receivedSignature = signature.replace(/^sha256=/, '').replace(/^hmac=/, '');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    );
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Helper function to log webhook for debugging
async function logWebhook(eventType: string, reference: string | null, payload: any, processed: boolean, errorMessage?: string) {
  try {
    await supabase
      .from('kyshi_webhook_logs')
      .insert({
        event_type: eventType,
        reference,
        payload,
        processed,
        error_message: errorMessage,
      });
  } catch (error) {
    console.error('Error logging webhook:', error);
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const payload = JSON.parse(body);
    
    // Get signature from headers - adjust header name based on Kyshi's documentation
    const signature = request.headers.get('x-kyshi-signature') || 
                     request.headers.get('x-kyshi-webhook-signature') ||
                     request.headers.get('kyshi-signature') ||
                     request.headers.get('webhook-signature') ||
                     '';

    console.log(`Received Kyshi webhook: ${payload.event || 'unknown event'}`, {
      signature: signature.substring(0, 20) + '...',
      hasSignature: !!signature
    });

    // Verify webhook signature
    if (!signature) {
      console.error('Missing webhook signature');
      await logWebhook('signature_missing', null, payload, false, 'Missing webhook signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const isValidSignature = verifyWebhookSignature(body, signature, KYSHI_WEBHOOK_SECRET);
    
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      await logWebhook('signature_invalid', null, payload, false, 'Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('Webhook signature verified successfully');

    // Process the webhook event
    const eventType = payload.event;
    const eventData = payload.data;

    if (!eventType || !eventData) {
      console.error('Invalid webhook payload structure');
      await logWebhook('invalid_payload', null, payload, false, 'Invalid webhook payload structure');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    console.log(`Processing webhook event: ${eventType}`);

    // Handle different event types
    switch (eventType) {
      case 'successful':
        await handleSuccessfulPayment(eventData);
        break;
      
      case 'failed':
        await handleFailedPayment(eventData);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(eventData);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(eventData);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(eventData);
        break;
      
      case 'chargeback':
        await handleChargeback(eventData);
        break;
      
      case 'refund':
        await handleRefund(eventData);
        break;
      
      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
        await logWebhook(eventType, eventData.reference, payload, true, 'Event type not handled');
        break;
    }

    const processingTime = Date.now() - startTime;
    console.log(`Webhook processed successfully in ${processingTime}ms`);

    // Always return 200 OK to prevent retries
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      processingTime 
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('Webhook processing error:', error);
    
    // Log the error but still return 200 to prevent retries
    await logWebhook('processing_error', null, request.body, false, error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json({ 
      success: false, 
      message: 'Webhook processing failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime 
    }, { status: 200 }); // Return 200 even on error to prevent retries
  }
}

async function handleSuccessfulPayment(eventData: any) {
  const { reference, amount, customer } = eventData;
  
  if (!reference || !customer?.email) {
    console.error('Missing required data in successful payment event');
    await logWebhook('successful', reference, eventData, false, 'Missing required data');
    return;
  }

  console.log(`Processing successful payment: ${reference} for ${customer.email}`);

  // Check idempotency - has this transaction been processed?
  const { data: existingTransaction, error: checkError } = await supabase
    .from('kyshi_transactions')
    .select('*')
    .eq('kyshi_reference', reference)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking existing transaction:', checkError);
    await logWebhook('successful', reference, eventData, false, 'Database error checking transaction');
    return;
  }

  if (existingTransaction) {
    console.log(`Transaction ${reference} already processed with status: ${existingTransaction.status}`);
    await logWebhook('successful', reference, eventData, true, 'Transaction already processed');
    return;
  }

  // Find the active subscription for this customer
  const { data: subscription, error: subError } = await supabase
    .from('kyshi_subscriptions')
    .select(`
      *,
      kyshi_plans!kyshi_subscriptions_plan_id_fkey (
        amount,
        currency,
        interval
      )
    `)
    .eq('status', 'active')
    .eq('email', customer.email) // Use email field instead of customer_id
    .single();

  if (subError) {
    console.error('Error finding subscription:', subError);
    await logWebhook('successful', reference, eventData, false, 'Subscription not found');
    return;
  }

  if (!subscription) {
    console.log(`No active subscription found for customer: ${customer.email}`);
    await logWebhook('successful', reference, eventData, false, 'No active subscription found');
    return;
  }

  // Insert new transaction
  const { data: transaction, error: insertError } = await supabase
    .from('kyshi_transactions')
    .insert({
      subscription_id: subscription.id,
      kyshi_reference: reference,
      amount: amount || subscription.kyshi_plans.amount,
      currency: eventData.currency || subscription.kyshi_plans.currency,
      customer_email: customer.email,
      status: 'success',
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting transaction:', insertError);
    await logWebhook('successful', reference, eventData, false, 'Database error inserting transaction');
    return;
  }

  console.log(`Created transaction: ${transaction.id}`);

  // Update subscription's next billing date
  const currentPeriodEnd = new Date(subscription.current_period_end);
  const nextPeriodEnd = new Date(currentPeriodEnd.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days

  const { error: updateError } = await supabase
    .from('kyshi_subscriptions')
    .update({
      current_period_end: nextPeriodEnd.toISOString().split('T')[0],
      status: 'active', // Ensure status is active
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscription.id);

  if (updateError) {
    console.error('Error updating subscription:', updateError);
    await logWebhook('successful', reference, eventData, false, 'Database error updating subscription');
    return;
  }

  console.log(`Updated subscription next billing date to: ${nextPeriodEnd.toISOString().split('T')[0]}`);

  // Optionally send email to customer (implement email service)
  // await sendPaymentConfirmationEmail(customer.email, transaction);

  await logWebhook('successful', reference, eventData, true);
}

async function handleFailedPayment(eventData: any) {
  const { reference, amount, customer } = eventData;
  
  console.log(`Processing failed payment: ${reference} for ${customer?.email}`);

  // Find and update the pending transaction
  const { data: transaction, error: updateError } = await supabase
    .from('kyshi_transactions')
    .update({
      status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('kyshi_reference', reference)
    .eq('status', 'pending')
    .select()
    .single();

  if (updateError) {
    console.error('Error updating transaction to failed:', updateError);
    await logWebhook('failed', reference, eventData, false, 'Database error updating transaction');
    return;
  }

  if (transaction) {
    console.log(`Updated transaction ${transaction.id} to failed status`);
    
    // Update subscription to past_due
    const { error: subUpdateError } = await supabase
      .from('kyshi_subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('id', transaction.subscription_id);

    if (subUpdateError) {
      console.error('Error updating subscription to past_due:', subUpdateError);
    }
  }

  await logWebhook('failed', reference, eventData, true);
}

async function handleSubscriptionCreated(eventData: any) {
  console.log('Subscription created event received');
  await logWebhook('subscription.created', eventData.subscription?.id, eventData, true);
}

async function handleSubscriptionUpdated(eventData: any) {
  console.log('Subscription updated event received');
  await logWebhook('subscription.updated', eventData.subscription?.id, eventData, true);
}

async function handleSubscriptionCancelled(eventData: any) {
  console.log('Subscription cancelled event received');
  await logWebhook('subscription.cancelled', eventData.subscription?.id, eventData, true);
}

async function handleChargeback(eventData: any) {
  const { reference, amount, customer, reason } = eventData;
  
  console.log(`[CHARGEBACK] ⚠️ Chargeback received for ${reference}`);

  // Find the transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('kyshi_transactions')
    .select('id, subscription_id')
    .eq('kyshi_reference', reference)
    .single();

  if (transactionError || !transaction) {
    console.error('Error finding transaction for chargeback:', transactionError);
    await logWebhook('chargeback', reference, eventData, false, 'Transaction not found');
    return;
  }

  // Record chargeback
  const { error: chargebackError } = await supabase
    .from('kyshi_chargebacks')
    .insert({
      transaction_id: transaction.id,
      subscription_id: transaction.subscription_id,
      amount: amount,
      currency: eventData.currency || 'KES',
      status: 'pending',
      reason: reason,
      notified_at: new Date().toISOString(),
    });

  if (chargebackError) {
    console.error('Error inserting chargeback:', chargebackError);
    await logWebhook('chargeback', reference, eventData, false, 'Database error inserting chargeback');
    return;
  }

  // Cancel the subscription to prevent future charges
  const { error: cancelError } = await supabase
    .from('kyshi_subscriptions')
    .update({ 
      status: 'cancelled', 
      cancelled_at: new Date().toISOString(), 
      updated_at: new Date().toISOString() 
    })
    .eq('id', transaction.subscription_id);

  if (cancelError) {
    console.error('Error cancelling subscription:', cancelError);
  }

  console.log(`[CHARGEBACK] Subscription ${transaction.subscription_id} cancelled due to chargeback`);
  
  // Send alert to admin
  await sendAdminAlert('CHARGEBACK', { reference, amount, customer, reason });

  await logWebhook('chargeback', reference, eventData, true);
}

async function handleRefund(eventData: any) {
  const { reference, original_reference, amount, customer } = eventData;
  
  console.log(`[REFUND] ↩️ Processing refund for ${original_reference}`);

  // Find the original transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('kyshi_transactions')
    .select('id, subscription_id')
    .eq('kyshi_reference', original_reference)
    .single();

  if (transactionError || !transaction) {
    console.error('Error finding original transaction for refund:', transactionError);
    await logWebhook('refund', reference, eventData, false, 'Original transaction not found');
    return;
  }

  // Update transaction status to refunded
  const { error: updateError } = await supabase
    .from('kyshi_transactions')
    .update({ 
      status: 'refunded', 
      refunded_at: new Date().toISOString(), 
      refund_reference: reference 
    })
    .eq('id', transaction.id);

  if (updateError) {
    console.error('Error updating transaction to refunded:', updateError);
    await logWebhook('refund', reference, eventData, false, 'Database error updating transaction');
    return;
  }

  // Record refund
  const { error: refundError } = await supabase
    .from('refunds')
    .insert({
      transaction_id: transaction.id,
      subscription_id: transaction.subscription_id,
      amount: amount,
      currency: eventData.currency || 'KES',
      kyshi_refund_reference: reference,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

  if (refundError) {
    console.error('Error inserting refund:', refundError);
    await logWebhook('refund', reference, eventData, false, 'Database error inserting refund');
    return;
  }

  console.log(`[REFUND] Refund processed successfully for ${original_reference}`);
  await logWebhook('refund', reference, eventData, true);
}

async function sendAdminAlert(type: string, data: any) {
  // Implement email, Slack, or webhook notification
  console.log(`ALERT: ${type}`, data);
  
  // TODO: Implement actual notification system
  // Examples:
  // - Send email via SendGrid/Resend
  // - Send Slack webhook
  // - Send SMS notification
  // - Create admin dashboard notification
}
