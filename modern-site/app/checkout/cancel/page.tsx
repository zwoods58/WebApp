/**
 * Checkout Cancel Page
 * Shown when user cancels checkout
 */

'use client'

import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your checkout was cancelled. No charges were made.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Return to Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

