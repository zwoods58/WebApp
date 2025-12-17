'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../src/lib/supabase'

export default function ProDashboardTestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const grantProAccess = async () => {
    try {
      setLoading(true)
      setMessage('')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMessage('Please log in first')
        return
      }

      // Update user account to Pro
      const { error } = await supabase
        .from('user_accounts')
        .update({
          account_tier: 'pro_subscription',
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
          subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      // Create a test subscription record
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          status: 'active',
          monthly_price: '20.00',
          started_at: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          payment_provider: 'test'
        }, {
          onConflict: 'user_id'
        })

      setMessage('✅ Pro access granted! Redirecting...')
      setTimeout(() => {
        router.push('/ai-builder/pro-dashboard')
      }, 1000)
    } catch (error: any) {
      console.error('Error granting Pro access:', error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const goToProDashboard = () => {
    router.push('/ai-builder/pro-dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Quick Pro Dashboard Access</h1>
        <p className="text-gray-600 mb-6">
          Grant yourself Pro subscription access for testing
        </p>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={grantProAccess}
            disabled={loading}
            className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Granting Access...' : 'Grant Pro Access & Go to Dashboard'}
          </button>

          <button
            onClick={goToProDashboard}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
          >
            Go to Pro Dashboard (Skip Grant) 
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is for testing only. In production, Pro access should be granted through proper subscription payment.
          </p>
        </div>
      </div>
    </div>
  )
}



