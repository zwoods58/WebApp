'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestPaymentPage() {
  const [consultationId, setConsultationId] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Test Payment Page</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation ID
            </label>
            <input
              type="text"
              value={consultationId}
              onChange={(e) => setConsultationId(e.target.value)}
              placeholder="Enter consultation ID (e.g., CONS-1234567890-abc123)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Link
              href={`/simple-payment?consultationId=${consultationId}`}
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Deposit Payment (Stripe Checkout)
            </Link>
            
            <Link
              href={`/simple-payment?consultationId=${consultationId}&type=final`}
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Final Payment (Stripe Checkout)
            </Link>
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>To get a consultation ID:</strong></p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Go to <Link href="/admin" className="text-blue-600 underline">Admin Dashboard</Link></li>
              <li>Click "Generate Test Data"</li>
              <li>Copy a consultation ID from the table</li>
              <li>Paste it above and test</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
