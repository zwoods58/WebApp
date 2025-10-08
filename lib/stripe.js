import Stripe from 'stripe'
import { config } from './config'

// Initialize Stripe with secret key
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export default stripe

// Create a payment intent
export async function createPaymentIntent(amount, currency, metadata = {}) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        source: 'atarweb-website'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })
    
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Confirm a payment intent
export async function confirmPaymentIntent(paymentIntentId, paymentMethodId) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    })
    
    return {
      success: true,
      paymentIntent
    }
  } catch (error) {
    console.error('Error confirming payment intent:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Create a customer
export async function createCustomer(email, name, metadata = {}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        ...metadata,
        source: 'atarweb-website'
      }
    })
    
    return {
      success: true,
      customer
    }
  } catch (error) {
    console.error('Error creating customer:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Retrieve a customer
export async function getCustomer(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return {
      success: true,
      customer
    }
  } catch (error) {
    console.error('Error retrieving customer:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Create a payment method
export async function createPaymentMethod(type, card) {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type,
      card
    })
    
    return {
      success: true,
      paymentMethod
    }
  } catch (error) {
    console.error('Error creating payment method:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Verify webhook signature
export function verifyWebhookSignature(payload, signature) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret
    )
    return {
      success: true,
      event
    }
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Get payment intent status
export async function getPaymentIntentStatus(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      success: true,
      status: paymentIntent.status,
      paymentIntent
    }
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
