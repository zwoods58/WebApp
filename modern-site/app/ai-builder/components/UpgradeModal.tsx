'use client'

import React, { useState } from 'react'
import { X, CheckCircle2, Rocket, Download, Code, Zap, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  projectId?: string
  context?: 'publish' | 'code' | 'terminal' | 'general'
}

export default function UpgradeModal({ isOpen, onClose, projectId, context = 'general' }: UpgradeModalProps) {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'buyout' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const handleProUpgrade = async () => {
    setIsProcessing(true)
    try {
      // Get auth session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in to continue')
        setIsProcessing(false)
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
          context
        })
      })

      const data = await response.json()
      
      if (data.success && data.paymentLink) {
        // Redirect to Flutterwave payment page
        window.location.href = data.paymentLink
      } else {
        alert(data.error || 'Failed to initialize payment. Please try again.')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Error initiating Pro upgrade:', error)
      alert('An error occurred. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleBuyout = async () => {
    if (!projectId) {
      alert('Please select a project first')
      return
    }

    setIsProcessing(true)
    try {
      // Get auth session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in to continue')
        setIsProcessing(false)
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
        // Redirect to Flutterwave payment page
        window.location.href = data.paymentLink
      } else {
        alert(data.error || 'Failed to initialize payment. Please try again.')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Error initiating buyout:', error)
      alert('An error occurred. Please try again.')
      setIsProcessing(false)
    }
  }

  const getContextMessage = () => {
    switch (context) {
      case 'publish':
        return 'Upgrade to Pro to publish your website live'
      case 'code':
        return 'Upgrade to view, copy, and download your full code'
      case 'terminal':
        return 'Upgrade to Pro to access terminal and advanced features'
      default:
        return 'Choose a plan to unlock premium features'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white border-2 border-gray-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Encode Sans, sans-serif' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Encode Sans, sans-serif' }}>Upgrade Your Account</h2>
            <p className="text-gray-600 text-sm">{getContextMessage()}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Plans */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Pro Subscription */}
          <div className={`bg-gradient-to-br from-gray-50 to-white border-2 rounded-xl p-6 transition-all ${
            selectedPlan === 'pro' 
              ? 'border-teal-500 ring-4 ring-teal-500/20' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pro Plan</h3>
                <p className="text-gray-600 text-sm">Subscription</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">$20</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 text-sm">Billed monthly, cancel anytime</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Full code editing capabilities</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Live deployment & custom domains</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">10 regenerations per month</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Unlimited preview (while subscribed)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Terminal & advanced features</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Priority support</span>
              </div>
            </div>

            <button
              onClick={handleProUpgrade}
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
          <div className={`bg-gradient-to-br from-gray-50 to-white border-2 rounded-xl p-6 transition-all ${
            selectedPlan === 'buyout' 
              ? 'border-purple-500 ring-4 ring-purple-500/20' 
              : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Buyout</h3>
                <p className="text-gray-600 text-sm">One-time purchase</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">$150</span>
                <span className="text-gray-600">one-time</span>
              </div>
              <p className="text-gray-600 text-sm">Own your code forever</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Full code access (view, copy, download)</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Code ownership - no expiration</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Download as ZIP file</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Use code anywhere</span>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Does not include live deployment</span>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">Pro subscription required for publishing</span>
              </div>
            </div>

            <button
              onClick={handleBuyout}
              disabled={isProcessing || !projectId}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              style={{
                boxShadow: '0 8px 32px 0 rgba(147, 51, 234, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Code className="w-5 h-5" />
                  Purchase Buyout
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <p className="text-xs text-gray-600 text-center" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
            All payments are processed securely through Flutterwave. Supports M-Pesa, MTN MoMo, ZAR EFT, and all major cards.
          </p>
        </div>
      </div>
    </div>
  )
}

