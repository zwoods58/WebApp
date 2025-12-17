/**
 * Subscription Management Component
 * P1 Feature 14: Enhanced Billing
 */

'use client'

import React, { useState, useEffect } from 'react'
import { CreditCard, Check, X, TrendingUp, Zap, Crown } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: {
    maxProjects: number
    maxCollaborators: number
    aiRequestsPerMonth: number
    storageGB: number
    customDomain: boolean
    prioritySupport: boolean
  }
}

interface Usage {
  projects: number
  aiRequests: number
  storageGB: number
  deployments: number
}

interface SubscriptionManagerProps {
  userId: string
  currentPlan: string
  onUpgrade?: (planId: string) => void
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: {
      maxProjects: 3,
      maxCollaborators: 1,
      aiRequestsPerMonth: 100,
      storageGB: 1,
      customDomain: false,
      prioritySupport: false
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    interval: 'month',
    features: {
      maxProjects: 50,
      maxCollaborators: 10,
      aiRequestsPerMonth: 1000,
      storageGB: 10,
      customDomain: true,
      prioritySupport: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 100,
    interval: 'month',
    features: {
      maxProjects: -1, // unlimited
      maxCollaborators: -1,
      aiRequestsPerMonth: 10000,
      storageGB: 100,
      customDomain: true,
      prioritySupport: true
    }
  }
]

export default function SubscriptionManager({
  userId,
  currentPlan,
  onUpgrade
}: SubscriptionManagerProps) {
  const [usage, setUsage] = useState<Usage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsage()
  }, [userId])

  const loadUsage = async () => {
    try {
      const response = await fetch(`/api/analytics/usage?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUsage(data.metrics)
      }
    } catch (error) {
      console.error('Failed to load usage:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    if (onUpgrade) {
      onUpgrade(planId)
    } else {
      // Redirect to checkout
      window.location.href = `/billing/checkout?plan=${planId}`
    }
  }

  const currentPlanData = PLANS.find(p => p.id === currentPlan) || PLANS[0]

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-6">Subscription & Usage</h2>

      {/* Current Plan */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
        <div className="bg-gray-800 rounded-lg p-4 border-2 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-xl font-bold">{currentPlanData.name}</span>
              </div>
              <p className="text-gray-400 mt-1">
                ${currentPlanData.price}/{currentPlanData.interval}
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Manage Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      {usage && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Usage This Month</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Projects</div>
              <div className="text-2xl font-bold mt-1">
                {usage.projects}/{currentPlanData.features.maxProjects === -1 ? '∞' : currentPlanData.features.maxProjects}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">AI Requests</div>
              <div className="text-2xl font-bold mt-1">
                {usage.aiRequests}/{currentPlanData.features.aiRequestsPerMonth}
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Storage</div>
              <div className="text-2xl font-bold mt-1">
                {usage.storageGB.toFixed(2)}/{currentPlanData.features.storageGB} GB
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">Deployments</div>
              <div className="text-2xl font-bold mt-1">{usage.deployments}</div>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-gray-800 rounded-lg p-6 border-2 ${
                plan.id === currentPlan
                  ? 'border-blue-600'
                  : plan.id === 'pro'
                  ? 'border-yellow-500'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold">{plan.name}</h4>
                {plan.id === currentPlan && (
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">Current</span>
                )}
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-400">/{plan.interval}</span>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm">
                    {plan.features.maxProjects === -1 ? 'Unlimited' : plan.features.maxProjects} Projects
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm">
                    {plan.features.aiRequestsPerMonth.toLocaleString()} AI Requests/month
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{plan.features.storageGB} GB Storage</span>
                </li>
                {plan.features.customDomain && (
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Custom Domain</span>
                  </li>
                )}
                {plan.features.prioritySupport && (
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Priority Support</span>
                  </li>
                )}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={plan.id === currentPlan}
                className={`w-full py-2 rounded font-semibold ${
                  plan.id === currentPlan
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : plan.id === 'pro'
                    ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {plan.id === currentPlan ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}





