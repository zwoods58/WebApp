'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import { getFastAccount, isFastPro } from '../../../src/lib/fast-auth'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { BackgroundPaths } from '../../../src/components/ui/background-paths'
import { CheckCircle2, Rocket, Download, Code, Zap, Lock } from 'lucide-react'

function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const projectId = searchParams.get('projectId')

  useEffect(() => {
    loadAccount()
  }, [])

  const loadAccount = async () => {
    try {
      console.time('⚡ Upgrade: Load Account')
      
      // FAST - Get account (cached, <5ms)
      const userAccount = await getFastAccount()
      console.log('⚡ Upgrade: Account loaded:', userAccount ? 'YES' : 'NO')
      setAccount(userAccount)
      
      // FAST - Check if already Pro (cached, <5ms)
      const isPro = await isFastPro()
      console.log('⚡ Upgrade: isPro check:', isPro ? 'YES' : 'NO')
      
      if (isPro) {
        console.timeEnd('⚡ Upgrade: Load Account')
        router.push('/ai-builder/pro-dashboard')
        return
      }
      
      console.timeEnd('⚡ Upgrade: Load Account')
    } catch (error) {
      console.error('Error loading account:', error)
    } finally {
      setLoading(false)
    }
  }

  const [isProcessing, setIsProcessing] = useState(false)

  const handleProUpgrade = async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      // Get auth session token (cached, should be instant)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setIsProcessing(false)
        alert('Please log in to continue')
        router.push('/ai-builder/login')
        return
      }

      // Initialize Flutterwave payment for Pro subscription
      const response = await fetch('/api/ai-builder/payments/pro-subscription', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          projectId,
          context: 'general'
        })
      })

      const data = await response.json()
      
      if (data.success && data.paymentLink) {
        // Redirect immediately to Flutterwave payment page
        window.location.href = data.paymentLink
      } else {
        setIsProcessing(false)
        alert(data.error || 'Failed to initialize payment. Please try again.')
      }
    } catch (error) {
      setIsProcessing(false)
      console.error('Error initiating Pro upgrade:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const [isBuyoutProcessing, setIsBuyoutProcessing] = useState(false)

  const handleBuyout = async () => {
    if (!projectId) {
      alert('Please select a project first')
      return
    }

    if (isBuyoutProcessing) return
    
    setIsBuyoutProcessing(true)

    try {
      // Get auth session token (cached, should be instant)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setIsBuyoutProcessing(false)
        alert('Please log in to continue')
        router.push('/ai-builder/login')
        return
      }

      // Initialize Flutterwave payment for Buyout
      const response = await fetch('/api/ai-builder/payments/buyout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          projectId
        })
      })

      const data = await response.json()
      
      if (data.success && data.paymentLink) {
        // Redirect immediately to Flutterwave payment page
        window.location.href = data.paymentLink
      } else {
        setIsBuyoutProcessing(false)
        alert(data.error || 'Failed to initialize payment. Please try again.')
      }
    } catch (error) {
      setIsBuyoutProcessing(false)
      console.error('Error initiating buyout:', error)
      alert('An error occurred. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-black relative overflow-hidden" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
      {/* Background Paths */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30" style={{ color: '#000000' }}>
        <BackgroundPaths title="" />
      </div>
      
      <PageHeader />
      
      {/* Main Content */}
      <div className="pt-24 relative z-10">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              Upgrade Your Account
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              Choose a plan to unlock premium features and take your website to the next level
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Pro Subscription */}
            <div className="bg-white border-2 rounded-2xl p-8 shadow-lg transition-all border-gray-200 hover:border-gray-300 hover:shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Pro Plan</h3>
                  <p className="text-gray-600">Subscription</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-gray-900">$20</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Billed monthly, cancel anytime</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Full code editing capabilities</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Live deployment & custom domains</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">10 regenerations per month</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited preview (while subscribed)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Terminal & advanced features</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </div>
              </div>

              <button
                onClick={handleProUpgrade}
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 font-semibold transition-all flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(13, 148, 136, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Subscribe to Pro
                  </>
                )}
              </button>
            </div>

            {/* Buyout */}
            <div className="bg-white border-2 rounded-2xl p-8 shadow-lg transition-all border-gray-200 hover:border-gray-300 hover:shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Buyout</h3>
                  <p className="text-gray-600">One-time purchase</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-gray-900">$150</span>
                  <span className="text-gray-600">one-time</span>
                </div>
                <p className="text-gray-600">Own your code forever</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Full code access (view, copy, download)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Code ownership - no expiration</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Download as ZIP file</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Use code anywhere</span>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Does not include live deployment</span>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Pro subscription required for publishing</span>
                </div>
              </div>

              <button
                onClick={handleBuyout}
                disabled={!projectId || isBuyoutProcessing}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
                style={{
                  boxShadow: '0 8px 32px 0 rgba(147, 51, 234, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                {isBuyoutProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Code className="w-5 h-5" />
                    {projectId ? 'Purchase Buyout' : 'Select a Project First'}
                  </>
                )}
              </button>
              {!projectId && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Buyout is available per project. Open a project first.
                </p>
              )}
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-lg">
            <p className="text-sm text-gray-700 text-center" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              All payments are processed securely through Flutterwave. Supports M-Pesa, MTN MoMo, ZAR EFT, and all major cards.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}

