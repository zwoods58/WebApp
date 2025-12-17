'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { XCircle, RefreshCw, ArrowLeft, Mail } from 'lucide-react'

function PaymentFailedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get('message') || 'Payment could not be processed'
  const txRef = searchParams.get('tx_ref')

  const handleRetry = () => {
    // Redirect back to upgrade page
    router.push('/ai-builder/upgrade')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>

        {txRef && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-gray-500 mb-1">Transaction Reference</p>
            <p className="text-sm font-mono text-gray-700">{txRef}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{
              boxShadow: '0 8px 32px 0 rgba(13, 148, 136, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={() => router.push('/ai-builder/dashboard')}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <a
            href="mailto:support@atarwebb.com"
            className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <p>Common reasons for payment failure:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-left">
            <li>Insufficient funds</li>
            <li>Card declined by bank</li>
            <li>Incorrect card details</li>
            <li>Network connectivity issues</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  )
}

