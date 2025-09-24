'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  amount: number
  consultationId: string
  clientEmail: string
  clientName: string
  serviceType: string
  paymentType?: 'deposit' | 'final'
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function PaymentForm({ amount, consultationId, clientEmail, clientName, serviceType, paymentType = 'deposit', onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setPaymentStatus('processing')
    setErrorMessage('')

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          consultationId,
          clientEmail,
          clientName,
          serviceType,
          paymentType
        }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?consultation=${consultationId}`,
        },
      })

      if (result.error) {
        setPaymentStatus('failed')
        setErrorMessage(result.error.message || 'Payment failed')
        onError(result.error.message || 'Payment failed')
      } else if ('paymentIntent' in result && (result.paymentIntent as any)?.status === 'succeeded') {
        setPaymentStatus('succeeded')
        onSuccess((result.paymentIntent as any).id)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentStatus('failed')
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed')
      onError(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const depositAmount = Math.round(amount * 0.5) // 50% deposit
  const remainingAmount = amount - depositAmount

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h3>
        <p className="text-gray-600">Pay your deposit to secure your project</p>
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Project Cost:</span>
            <span className="font-semibold">${amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Deposit (50%):</span>
            <span className="font-semibold text-blue-600">${depositAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining Balance:</span>
            <span className="font-semibold text-gray-500">${remainingAmount.toLocaleString()}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Amount Due Today:</span>
              <span className="text-lg font-bold text-green-600">${depositAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
        </div>

        {/* Status Messages */}
        {paymentStatus === 'processing' && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing payment...</span>
          </div>
        )}

        {paymentStatus === 'succeeded' && (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>Payment successful!</span>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing || paymentStatus === 'succeeded'}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : paymentStatus === 'succeeded' ? (
            'Payment Complete!'
          ) : (
            `Pay $${depositAmount.toLocaleString()} Deposit`
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment is secured by Stripe. We never store your card details.
        </p>
      </div>
    </div>
  )
}

interface StripePaymentButtonProps {
  amount: number
  consultationId: string
  clientEmail: string
  clientName: string
  serviceType: string
  paymentType?: 'deposit' | 'final'
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export default function StripePaymentButton({ 
  amount, 
  consultationId, 
  clientEmail, 
  clientName, 
  serviceType, 
  paymentType = 'deposit',
  onSuccess, 
  onError 
}: StripePaymentButtonProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        consultationId={consultationId}
        clientEmail={clientEmail}
        clientName={clientName}
        serviceType={serviceType}
        paymentType={paymentType}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
