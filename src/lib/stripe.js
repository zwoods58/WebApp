import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe on the client side
let stripePromise

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

// Server-side Stripe initialization
export const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Payment configuration
export const PAYMENT_CONFIG = {
  currency: 'usd',
  depositPercentage: 0.5, // 50% deposit
  applicationFee: 0.029, // 2.9% + 30¢ per transaction
  applicationFeeFixed: 30 // 30 cents
}

// Calculate application fee
export const calculateApplicationFee = (amount) => {
  return Math.round(amount * PAYMENT_CONFIG.applicationFee + PAYMENT_CONFIG.applicationFeeFixed)
}

// Calculate deposit amount
export const calculateDeposit = (totalAmount) => {
  return Math.round(totalAmount * PAYMENT_CONFIG.depositPercentage)
}

// Calculate remaining amount
export const calculateRemaining = (totalAmount) => {
  return totalAmount - calculateDeposit(totalAmount)
}
