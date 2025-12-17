/**
 * PricingV1 - Basic pricing table component
 * Converted from generic/pricing.html
 */

import React from 'react'

export interface PricingPlan {
  name: string
  price: string
  billingPeriod?: string
  description?: string
  features: string[]
  isPopular?: boolean
  ctaText?: string
  ctaLink?: string
}

export interface PricingV1Props {
  title?: string
  plans: PricingPlan[]
  primaryColor?: string
}

export default function PricingV1({
  title = 'Pricing Plans',
  plans,
  primaryColor = 'blue-600'
}: PricingV1Props) {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {title && (
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-8 ${
                plan.isPopular ? 'border-2 border-' + primaryColor : 'border border-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className={`bg-${primaryColor} text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4`}>
                  Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              {plan.description && (
                <p className="text-gray-600 mb-4">{plan.description}</p>
              )}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {plan.billingPeriod && (
                  <span className="text-gray-600">/{plan.billingPeriod}</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.ctaLink && (
                <a
                  href={plan.ctaLink}
                  className={`block w-full bg-${primaryColor} text-white text-center py-3 rounded-lg font-semibold hover:opacity-90 transition`}
                >
                  {plan.ctaText || 'Get Started'}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}