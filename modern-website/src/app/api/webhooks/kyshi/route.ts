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
    
    // TODO: Implement signature verification
    // const webhookSecret = process.env.KYESHI_WEBHOOK_SECRET;
    // if (webhookSecret && signature) {
    //   const expectedSignature = crypto
    //     .createHmac('sha256', webhookSecret)
    //     .update(body)
    //     .digest('hex');
    //   
    //   if (signature !== `sha256=${expectedSignature}`) {
    //     console.error('Invalid webhook signature');
    //     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    //   }
    // }
    
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
    
    // Step 4: Update transaction in database
    try {
      const { data: transaction, error } = await supabaseAdmin
        .from('payment_link_transactions')
        .update({
          status: 'SUCCESSFUL',
          amount: amount,
          local_amount: localAmount,
          local_currency: localCurrency,
          fees: feeBreakdown?.totalFees || 0,
          paid_at: new Date().toISOString(),
          customer_name: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
          updated_at: new Date().toISOString(),
          webhook_data: data // Store full webhook response for debugging
        })
        .eq('reference', reference)
        .select()
        .single();
      
      if (error) {
        console.error('Database error updating transaction:', error);
        // Continue to business logic even if DB update fails
      } else {
        console.log('Transaction updated successfully:', transaction.id);
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
  
  // Your business logic here:
  // - Activate subscription
  // - Add credits to user account
  // - Send confirmation email
  // - Update inventory, etc.
  
  try {
    // Example: Activate subscription if this is a subscription payment
    if (data.customerEmail) {
      // Find user by email and activate their subscription
      const { data: business, error: userError } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('email', data.customerEmail)
        .single();
      
      if (!userError && business) {
        console.log(`Found business ${business.id}, activating subscription`);
        
        // Update subscription status
        await supabaseAdmin
          .from('businesses')
          .update({
            subscription_status: 'active',
            subscription_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            updated_at: new Date().toISOString()
          })
          .eq('id', business.id);
        
        console.log(`Subscription activated for business ${business.id}`);
      } else {
        console.log(`Business not found for email ${data.customerEmail}`);
      }
    }
    
    // TODO: Add more business logic as needed
    // - Send confirmation email
    // - Update usage metrics
    // - Log for analytics
    
    console.log(`=== PAYMENT PROCESSING COMPLETE ===`);
    
  } catch (businessError) {
    console.error('Business logic failed:', businessError);
    throw businessError; // Re-throw to be caught by outer try-catch
  }
}
