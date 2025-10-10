'use client'

import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  FileText,
  Download,
  Mail
} from 'lucide-react'

interface FinalInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  service: {
    name: string
    totalPrice: number
    depositAmount: number
    remainingAmount: number
    projectId: string
  }
  customer: {
    name: string
    email: string
  }
}

export default function FinalInvoiceModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
  service,
  customer
}: FinalInvoiceModalProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [showInvoice, setShowInvoice] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setPaymentStatus('processing')
    setErrorMessage('')

    try {
      // Create payment intent for remaining balance
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: service.remainingAmount,
          currency: 'usd',
          serviceId: service.projectId,
          customerEmail: customer.email,
          customerName: customer.name,
          metadata: {
            serviceName: service.name,
            totalPrice: service.totalPrice,
            depositAmount: service.depositAmount,
            remainingAmount: service.remainingAmount,
            paymentType: 'final_invoice',
            projectId: service.projectId,
            source: 'project_completion'
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
            name: customer.name,
            email: customer.email,
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const generateInvoicePDF = () => {
    // This would generate a professional invoice PDF
    // For now, we'll just show a success message
    setShowInvoice(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Final Invoice</h3>
                <p className="text-sm text-gray-500">Project: {service.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {showInvoice ? (
              // Invoice Generated Success
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Invoice Generated!</h3>
                <p className="text-gray-600 mb-6">
                  Your final invoice has been generated and sent to your email.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Project Total</span>
                    <span className="text-sm font-medium">{formatAmount(service.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Deposit Paid</span>
                    <span className="text-sm font-medium text-green-600">-{formatAmount(service.depositAmount)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Final Payment</span>
                      <span className="font-bold text-blue-600">{formatAmount(service.remainingAmount)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Invoice Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Invoice Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Project Total</span>
                      <span className="text-sm font-medium">{formatAmount(service.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Deposit Paid</span>
                      <span className="text-sm font-medium text-green-600">-{formatAmount(service.depositAmount)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Amount Due</span>
                        <span className="font-bold text-blue-600">{formatAmount(service.remainingAmount)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    * Project completed successfully. Thank you for your business!
                  </p>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Card Element */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Information
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
                      <span className="text-sm">Final payment successful!</span>
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
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
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
                        <span>Pay Final Invoice {formatAmount(service.remainingAmount)}</span>
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
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Lock className="h-4 w-4" />
              <span>Secured by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
