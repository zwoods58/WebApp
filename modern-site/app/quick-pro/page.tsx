'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '../../src/lib/supabase'
import { Zap } from 'lucide-react'

export default function QuickProPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const grantProAccess = async () => {
    try {
      setLoading(true)
      setMessage('')

      if (!user) {
        setMessage('Please log in first')
        router.push('/ai-builder/login')
        return
      }

      // Update user account to Pro
      const { error: accountError } = await supabase
        .from('user_accounts')
        .update({
          account_tier: 'pro_subscription',
          subscription_status: 'active',
          subscription_started_at: new Date().toISOString(),
          subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', user.id)

      if (accountError) throw accountError

      // Create/update subscription record
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          status: 'active',
          monthly_price: '20.00',
          started_at: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          payment_provider: 'test',
          payment_type: 'subscription'
        }, {
          onConflict: 'user_id'
        })

      if (subError) throw subError

      setMessage('✅ Pro access granted! Redirecting to Pro Dashboard...')
      setTimeout(() => {
        window.location.href = '/ai-builder/pro-dashboard'
      }, 1500)
    } catch (error: any) {
      console.error('Error granting Pro access:', error)
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Pro Access</h1>
          <p className="text-gray-600">
            Grant yourself Pro subscription for testing
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('❌') ? 'bg-red-50 text-red-700 border border-red-200' : 
            'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {!user ? (
          <div className="space-y-3">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                You need to be logged in first
              </p>
            </div>
            <button
              onClick={() => router.push('/ai-builder/login')}
              className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Logged in as:</strong> {user.email}
              </p>
            </div>
            <button
              onClick={grantProAccess}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg font-semibold hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Granting Pro Access...
                </span>
              ) : (
                '🚀 Grant Pro Access & Open Dashboard'
              )}
            </button>
            <button
              onClick={() => router.push('/ai-builder/pro-dashboard')}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Go to Pro Dashboard (Skip)
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Development Only:</strong> This bypasses payment. In production, Pro access requires a paid subscription.
          </p>
        </div>
      </div>
    </div>
  )
}



