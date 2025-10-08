import { loadStripe, Stripe } from '@stripe/stripe-js'
import StripeLib from 'stripe'

// Client-side Stripe
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Server-side Stripe
export const stripe = new StripeLib(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface CreateCheckoutSessionData {
  priceId: string
  quantity?: number
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession(data: CreateCheckoutSessionData) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: data.priceId,
          quantity: data.quantity || 1,
        },
      ],
      mode: 'payment',
      customer_email: data.customerEmail,
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: data.metadata || {},
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export interface CreateSubscriptionData {
  priceId: string
  customerEmail?: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export async function createSubscriptionSession(data: CreateSubscriptionData) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: data.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: data.customerEmail,
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: data.metadata || {},
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url
    }
  } catch (error) {
    console.error('Error creating subscription session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Webhook handling
export async function handleStripeWebhook(body: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as StripeLib.Checkout.Session
        console.log('Payment succeeded:', session.id)
        // Handle successful payment
        break
      
      case 'customer.subscription.created':
        const subscription = event.data.object as StripeLib.Subscription
        console.log('Subscription created:', subscription.id)
        // Handle new subscription
        break
      
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as StripeLib.Subscription
        console.log('Subscription updated:', updatedSubscription.id)
        // Handle subscription update
        break
      
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as StripeLib.Subscription
        console.log('Subscription cancelled:', deletedSubscription.id)
        // Handle subscription cancellation
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Webhook error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
