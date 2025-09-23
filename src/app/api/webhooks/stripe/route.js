import { NextResponse } from 'next/server'
import { verifyWebhookSignature } from '../../../../lib/stripe.js'
import { config } from '../../../../lib/config.js'

export async function POST(req) {
  try {
    // Get the raw body
    const body = await req.text()
    
    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')
    
    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const { success, event, error } = verifyWebhookSignature(body, signature)
    
    if (!success) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object)
        break
      
      case 'payment_intent.requires_action':
        await handlePaymentIntentRequiresAction(event.data.object)
        break
      
      case 'customer.created':
        await handleCustomerCreated(event.data.object)
        break
      
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object)
        break
      
      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Return success response
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Event handlers
async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  // TODO: Update your database with successful payment
  // TODO: Send confirmation email to customer
  // TODO: Update order status
  // TODO: Trigger any post-payment workflows
  
  // Example: Log payment details (without sensitive data)
  console.log({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    customerEmail: paymentIntent.receipt_email,
    metadata: paymentIntent.metadata
  })
}

async function handlePaymentIntentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id)
  
  // TODO: Update your database with failed payment
  // TODO: Send failure notification to customer
  // TODO: Update order status
  // TODO: Trigger retry or support workflows
  
  console.log({
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    lastPaymentError: paymentIntent.last_payment_error
  })
}

async function handlePaymentIntentCanceled(paymentIntent) {
  console.log('Payment canceled:', paymentIntent.id)
  
  // TODO: Update your database with canceled payment
  // TODO: Send cancellation notification
  // TODO: Update order status
  // TODO: Trigger refund or support workflows
}

async function handlePaymentIntentRequiresAction(paymentIntent) {
  console.log('Payment requires action:', paymentIntent.id)
  
  // TODO: Update your database with pending payment
  // TODO: Send notification to customer about required action
  // TODO: Update order status to pending
}

async function handleCustomerCreated(customer) {
  console.log('Customer created:', customer.id)
  
  // TODO: Update your database with new customer
  // TODO: Send welcome email
  // TODO: Create customer profile
}

async function handleCustomerUpdated(customer) {
  console.log('Customer updated:', customer.id)
  
  // TODO: Update your database with customer changes
  // TODO: Sync customer data
}

async function handlePaymentMethodAttached(paymentMethod) {
  console.log('Payment method attached:', paymentMethod.id)
  
  // TODO: Update your database with payment method
  // TODO: Send confirmation to customer
  // TODO: Update customer payment methods
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
    },
  })
}
