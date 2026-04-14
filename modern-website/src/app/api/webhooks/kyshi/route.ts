import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    console.log('=== KYESHI WEBHOOK START ===');
    
    // Step 1: Verify webhook signature (security)
    const headersList = await headers();
    const signature = headersList.get('x-kyshi-signature');
    const body = await request.text();
    
    console.log('Webhook received:', {
      signature: signature?.substring(0, 20) + '...',
      bodyLength: body.length
    });
    
    // Step 1: Verify webhook signature (security)
    const webhookSecret = 'c4accdbb6b2f49608ef729cd9afed411';
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      
      if (signature !== `sha256=${expectedSignature}`) {
        console.error('Invalid webhook signature:', {
          received: signature,
          expected: `sha256=${expectedSignature}`
        });
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
      
      console.log('Webhook signature verified successfully');
    } else {
      console.warn('Missing webhook signature or secret - proceeding without verification');
    }
    
    // Parse the body after reading it for signature verification
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (parseError) {
      console.error('Failed to parse webhook body:', parseError);
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    
    // Step 2: Check event type (only "successful" is sent by Kyshi)
    if (parsedBody.event !== 'successful') {
      console.log('Ignoring non-successful event:', parsedBody.event);
      return NextResponse.json({ received: true }); // Ignore other events
    }
    
    const { data } = parsedBody;
    console.log('Processing successful payment:', {
      reference: data.reference,
      amount: data.amount,
      customer: data.customer?.email
    });
    
    // Step 3: Extract payment data
    const {
      reference,
      amount,
      customer,
      meta: {
        localCurrency,
        localAmount,
        feeBreakdown
      }
    } = data;
    
    if (!reference) {
      console.error('Missing reference in webhook data');
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }
    
    // Step 4: Create or update transaction in kyshi_transactions table
    try {
      // First try to find existing transaction
      const { data: existingTransaction, error: findError } = await supabaseAdmin
        .from('kyshi_transactions')
        .select('*')
        .eq('kyshi_reference', reference)
        .single();

      let transaction;
      
      if (findError && findError.code === 'PGRST116') {
        // Transaction doesn't exist, create it
        console.log('Creating new transaction record for reference:', reference);
        const { data: newTransaction, error: insertError } = await supabaseAdmin
          .from('kyshi_transactions')
          .insert({
            kyshi_reference: reference,
            amount: amount,
            currency: localCurrency,
            customer_email: customer?.email || '',
            status: 'success',
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating transaction:', insertError);
        } else {
          transaction = newTransaction;
          console.log('Transaction created successfully:', transaction.id);
        }
      } else if (findError) {
        console.error('Error finding transaction:', findError);
      } else {
        // Update existing transaction
        console.log('Updating existing transaction:', existingTransaction.id);
        const { data: updatedTransaction, error: updateError } = await supabaseAdmin
          .from('kyshi_transactions')
          .update({
            status: 'success',
            amount: amount,
            currency: localCurrency,
            customer_email: customer?.email || existingTransaction.customer_email,
            updated_at: new Date().toISOString()
          })
          .eq('kyshi_reference', reference)
          .select()
          .single();
        
        if (updateError) {
          console.error('Error updating transaction:', updateError);
        } else {
          transaction = updatedTransaction;
          console.log('Transaction updated successfully:', transaction.id);
        }
      }
    } catch (dbError) {
      console.error('Database error updating transaction:', dbError);
      // Continue to business logic even if DB update fails
    }
    
    // Step 5: Trigger business logic (activate subscription, add credits, etc.)
    try {
      await handleSuccessfulPayment(reference, {
        amount,
        currency: localCurrency,
        customerEmail: customer?.email,
        customerName: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim()
      });
    } catch (businessError) {
      console.error('Business logic error:', businessError);
      // Don't fail the webhook - business logic can be retried manually
    }
    
    // Step 6: Return 200 to acknowledge receipt
    console.log('=== KYESHI WEBHOOK SUCCESS ===');
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('=== KYESHI WEBHOOK ERROR ===', error);
    // Always return 200 to prevent Kyshi from retrying
    return NextResponse.json({ 
      received: false, 
      error: 'Webhook failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}

// Optional GET for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'Kyshi webhook endpoint active',
    timestamp: new Date().toISOString()
  });
}

async function handleSuccessfulPayment(reference: string, data: {
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName?: string;
}) {
  console.log(`=== PROCESSING SUCCESSFUL PAYMENT ===`);
  console.log(`Reference: ${reference}`);
  console.log(`Amount: ${data.amount} ${data.currency}`);
  console.log(`Customer: ${data.customerEmail || data.customerName || 'Unknown'}`);
  
  // Business logic for Kyshi subscriptions:
  // - Activate subscription in kyshi_subscriptions table
  // - Link transaction to subscription
  // - Update subscription period
  
  try {
    if (data.customerEmail) {
      // Find customer by email and activate their subscription
      const { data: customer, error: customerError } = await supabaseAdmin
        .from('kyshi_customers')
        .select('*')
        .eq('email', data.customerEmail)
        .single();
      
      if (!customerError && customer) {
        console.log(`Found customer ${customer.id}, finding subscription`);
        
        // Find the subscription that matches this transaction reference
        const { data: subscription, error: subscriptionError } = await supabaseAdmin
          .from('kyshi_subscriptions')
          .select('*')
          .eq('customer_id', customer.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (!subscriptionError && subscription) {
          console.log(`Found subscription ${subscription.id}, activating`);
          
          // Calculate new billing period (7 days from now)
          const subscriptionDays = getSubscriptionDuration(data.currency);
          const today = new Date();
          const nextWeek = new Date(today.getTime() + subscriptionDays * 24 * 60 * 60 * 1000);
          
          // Update subscription status to active
          const { error: updateError } = await supabaseAdmin
            .from('kyshi_subscriptions')
            .update({
              status: 'active',
              current_period_start: today.toISOString().split('T')[0],
              current_period_end: nextWeek.toISOString().split('T')[0],
              updated_at: new Date().toISOString()
            })
            .eq('id', subscription.id);
          
          if (updateError) {
            console.error('Error updating subscription:', updateError);
          } else {
            console.log(`Subscription ${subscription.id} activated successfully`);
            console.log(`New billing period: ${today.toISOString().split('T')[0]} to ${nextWeek.toISOString().split('T')[0]}`);
          }
        } else {
          console.log('No pending subscription found for customer');
          console.log('SubscriptionError:', subscriptionError);
        }
        
        // Link transaction to subscription if we have both
        if (subscription) {
          try {
            await supabaseAdmin
              .from('kyshi_transactions')
              .update({ subscription_id: subscription.id })
              .eq('kyshi_reference', reference);
            
            console.log(`Transaction ${reference} linked to subscription ${subscription.id}`);
          } catch (linkError) {
            console.error('Error linking transaction to subscription:', linkError);
          }
        }
        
      } else {
        console.log(`Customer not found for email ${data.customerEmail}`);
        console.log('CustomerError:', customerError);
      }
    }
    
    console.log(`=== PAYMENT PROCESSING COMPLETE ===`);
    
    // Step 6: Send customer data to Kyshi dashboard
    try {
      if (data.customerEmail) {
        console.log('Sending customer data to Kyshi dashboard...');
        
        const baseUrl = process.env.NGROK_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
        const customerUpdateResponse = await fetch(`${baseUrl}/api/kyshi/update-customer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.customerEmail,
            businessData: {
              payment_amount: data.amount,
              payment_currency: data.currency,
              payment_reference: reference,
              payment_completed_at: new Date().toISOString(),
              source: 'kyshi_webhook_payment_success'
            },
            industry: 'general',
            businessType: 'small_business',
            additionalMetadata: {
              webhook_source: 'kyshi_payment_success',
              payment_reference: reference
            }
          })
        });

        if (customerUpdateResponse.ok) {
          const customerUpdateResult = await customerUpdateResponse.json();
          console.log('Customer data sent to Kyshi dashboard successfully:', customerUpdateResult);
        } else {
          console.error('Failed to send customer data to Kyshi dashboard:', await customerUpdateResponse.text());
        }
      }
    } catch (syncError) {
      console.error('Error syncing customer data to Kyshi dashboard:', syncError);
      // Don't fail the webhook - sync can be retried manually
    }
    
  } catch (businessError) {
    console.error('Business logic failed:', businessError);
    throw businessError; // Re-throw to be caught by outer try-catch
  }
}

// Helper function to determine subscription duration based on currency
function getSubscriptionDuration(currency: string): number {
  // All plans are weekly (7 days) regardless of currency
  return 7;
}

// Helper function to detect country from currency
function detectCountryFromCurrency(currency: string): string {
  const currencyMap = {
    'KES': 'KE',
    'GHS': 'GH', 
    'NGN': 'NG',
    'XOF': 'CI'
  };
  return currencyMap[currency as keyof typeof currencyMap] || 'Unknown';
}

// Log subscription activation for analytics
async function logSubscriptionActivation(data: {
  businessId: string;
  businessEmail: string;
  country: string;
  currency: string;
  amount: number;
  reference: string;
  activatedAt: string;
  expiresAt: string;
}) {
  try {
    await supabaseAdmin
      .from('subscription_activations')
      .insert({
        business_id: data.businessId,
        business_email: data.businessEmail,
        country: data.country,
        currency: data.currency,
        amount: data.amount,
        reference: data.reference,
        activated_at: data.activatedAt,
        expires_at: data.expiresAt,
        created_at: new Date().toISOString()
      });
    
    console.log(`Subscription activation logged for ${data.businessId}`);
  } catch (logError) {
    console.error('Failed to log subscription activation:', logError);
    // Don't throw - logging failure shouldn't break the payment flow
  }
}
