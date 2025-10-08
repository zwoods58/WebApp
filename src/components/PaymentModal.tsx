'use client'

import { useState } from 'react'
import { X, CreditCard, CheckCircle, AlertCircle, Mail } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  consultationData: {
    id: string
    name: string
    email: string
    company: string
    projectDetails: string
    serviceType: string
    totalAmount: number
  }
}

export default function PaymentModal({ isOpen, onClose, consultationData }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  if (!isOpen) return null

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentStatus('success')
    // Redirect to success page after a short delay
    setTimeout(() => {
      window.location.href = `/payment-success?consultation=${consultationData.id}`
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error')
    setErrorMessage(error)
  }

  const handleClose = () => {
    if (paymentStatus === 'processing') return // Prevent closing during payment
    setPaymentStatus('idle')
    setErrorMessage('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Complete Your Payment</h2>
              <p className="text-sm text-gray-600">Secure your project with a deposit</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={paymentStatus === 'processing'}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Project Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Project Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Client:</span>
                <span className="font-semibold">{consultationData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-semibold">{consultationData.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-semibold">{consultationData.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project Details:</span>
                <span className="font-semibold">{consultationData.projectDetails}</span>
              </div>
            </div>
          </div>

          {/* Payment Status Messages */}
          {paymentStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Payment Successful!</h3>
                  <p className="text-green-700">Redirecting to confirmation page...</p>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Payment Failed</h3>
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Manual Payment Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Payment Information</h3>
            </div>
            <p className="text-blue-700 mb-4">
              We will send you a payment link via email after your consultation is confirmed.
            </p>
            <div className="bg-white border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Total Amount:</h4>
              <p className="text-2xl font-bold text-blue-600">${consultationData.totalAmount}</p>
            </div>
            <p className="text-sm text-blue-600 mt-4">
              You will receive payment instructions via email at <strong>{consultationData.email}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}