'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CreditCard, Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import StripePaymentButton from '@/components/StripePaymentButton'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const consultationId = searchParams.get('consultationId')
  const paymentType = (searchParams.get('type') || 'deposit') as 'deposit' | 'final'
  const [consultation, setConsultation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (consultationId) {
      fetchConsultationDetails()
    } else {
      setError('No consultation ID provided')
      setLoading(false)
    }
  }, [consultationId])

  const fetchConsultationDetails = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`)
      const data = await response.json()
      
      if (data.success) {
        setConsultation(data.consultation)
      } else {
        setError(data.error || 'Failed to load consultation details')
      }
    } catch (err) {
      console.error('Error fetching consultation:', err)
      setError('Failed to load consultation details')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    // Redirect to success page
    window.location.href = `/payment-success?consultationId=${consultationId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-lg w-full">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Loading Payment Details...</h1>
          <p className="text-gray-600">Please wait while we prepare your payment.</p>
        </div>
      </div>
    )
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-lg w-full">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Consultation not found'}</p>
          <div className="space-y-3">
            <Link 
              href="/contact" 
              className="block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              href="/test-payment" 
              className="block bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Test Payment Page
            </Link>
            <Link 
              href="/" 
              className="block bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Check if payment is already completed
  if (paymentType === 'deposit' && consultation.paymentStatus === 'deposit_paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-lg w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Deposit Already Paid</h1>
          <p className="text-gray-600 mb-6">
            Your deposit has already been processed. We'll begin your project soon!
          </p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  if (paymentType === 'final' && consultation.paymentStatus === 'fully_paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-lg w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Complete</h1>
          <p className="text-gray-600 mb-6">
            Your final payment has been processed. Your project files will be delivered soon!
          </p>
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Homepage
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {paymentType === 'final' ? 'Complete Your Final Payment' : 'Complete Your Deposit Payment'}
          </h1>
          <p className="text-xl text-gray-600">
            {paymentType === 'final' ? 'Final payment for your completed project' : 'Secure your project with a 50% deposit'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Details */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
                <p className="text-gray-600">Review your project information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Client Information</h3>
                <p className="text-gray-600">{consultation.name}</p>
                <p className="text-gray-600">{consultation.email}</p>
                {consultation.company && (
                  <p className="text-gray-600">{consultation.company}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Project Description</h3>
                <p className="text-gray-600">{consultation.projectDetails || 'Custom Web Development'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">Service Type</h3>
                <p className="text-gray-600">{consultation.serviceType || 'Web Development'}</p>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Summary</h2>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Project Value:</span>
                  <span className="font-semibold">${consultation.totalAmount?.toLocaleString() || '1,000'}</span>
                </div>
                {paymentType === 'deposit' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deposit Required (50%):</span>
                      <span className="font-semibold text-blue-600">${consultation.depositAmount?.toLocaleString() || '500'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Remaining Balance:</span>
                      <span className="font-semibold">${consultation.remainingAmount?.toLocaleString() || '500'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deposit Paid:</span>
                      <span className="font-semibold text-green-600">${consultation.depositAmount?.toLocaleString() || '500'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Final Balance Due:</span>
                      <span className="font-semibold text-blue-600">${consultation.remainingAmount?.toLocaleString() || '500'}</span>
                    </div>
                  </>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Amount Due Today:</span>
                    <span className="text-blue-600">
                      ${paymentType === 'final' ? (consultation.remainingAmount?.toLocaleString() || '500') : (consultation.depositAmount?.toLocaleString() || '500')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stripe Payment Form */}
            <StripePaymentButton
              consultationId={consultation.id}
              amount={paymentType === 'final' ? (consultation.remainingAmount || 500) : (consultation.depositAmount || 500)}
              clientEmail={consultation.email}
              clientName={consultation.name}
              serviceType={consultation.serviceType || 'Web Development'}
              paymentType={paymentType}
              onSuccess={handlePaymentSuccess}
              onError={(error) => console.error('Payment error:', error)}
            />

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-900 mb-2">
                {paymentType === 'final' ? 'What happens next?' : 'What happens next?'}
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {paymentType === 'final' ? (
                  <>
                    <li>• Your payment is processed securely via Stripe</li>
                    <li>• You'll receive your completed project files within 24 hours</li>
                    <li>• Project handover and documentation will be provided</li>
                    <li>• 12 months of free support included</li>
                  </>
                ) : (
                  <>
                    <li>• Your payment is processed securely via Stripe</li>
                    <li>• We'll begin your project within 24 hours</li>
                    <li>• You'll receive regular updates on progress</li>
                    <li>• Final payment will be due upon completion</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
