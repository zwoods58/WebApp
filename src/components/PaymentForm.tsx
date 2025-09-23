'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle 
} from 'lucide-react'

interface PaymentFormProps {
  amount: number
  currency: string
  serviceId: string
  serviceName: string
  customerEmail: string
  customerName: string
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
}

export default function PaymentForm({
  amount,
  currency,
  serviceId,
  serviceName,
  customerEmail,
  customerName,
  onSuccess,
  onError
}: PaymentFormProps) {
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
          currency,
          serviceId,
          customerEmail,
          customerName,
          metadata: {
            serviceName,
            source: 'website'
          }
        }),
      })

      const { success, clientSecret, paymentIntentId, error } = await response.json()

      if (!success) {
        throw new Error(error || 'Failed to create payment intent')
      }

      // Get card element
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (paymentIntent.status === 'succeeded') {
        setPaymentStatus('succeeded')
        onSuccess(paymentIntent)
      } else {
        throw new Error('Payment was not successful')
      }

    } catch (error: any) {
      console.error('Payment error:', error)
      setPaymentStatus('failed')
      setErrorMessage(error.message || 'Payment failed. Please try again.')
      onError(error.message || 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
        <p className="text-gray-600 mt-2">
          Pay {formatAmount(amount, currency)} for {serviceName}
        </p>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#1f2937',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <XCircle className="h-5 w-5" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        {/* Success Message */}
        {paymentStatus === 'succeeded' && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">Payment successful!</span>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <Lock className="h-4 w-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing || paymentStatus === 'succeeded'}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : paymentStatus === 'succeeded' ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>Payment Complete</span>
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              <span>Pay {formatAmount(amount, currency)}</span>
            </>
          )}
        </button>
      </form>

      {/* Payment Status */}
      {paymentStatus === 'processing' && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Processing your payment...</span>
          </div>
        </div>
      )}
    </div>
  )
}
