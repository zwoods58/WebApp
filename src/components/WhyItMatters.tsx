'use client'

import { TrendingUp, Users, Clock, Shield, DollarSign, Target } from 'lucide-react'

const impacts = [
  {
    icon: TrendingUp,
    title: 'Business Growth',
    titleKey: 'Business Growth',
    description: 'Digital presence drives 24/7 customer engagement and revenue growth',
    descriptionKey: 'Digital presence drives 24/7 customer engagement and revenue growth',
    stat: '150%',
    statLabel: 'Average Revenue Increase',
    statLabelKey: 'Average Revenue Increase'
  },
  {
    icon: Users,
    title: 'Customer Reach',
    titleKey: 'Customer Reach',
    description: 'Expand your market reach and connect with customers globally',
    descriptionKey: 'Expand your market reach and connect with customers globally',
    stat: '10x',
    statLabel: 'Market Expansion',
    statLabelKey: 'Market Expansion'
  },
  {
    icon: Clock,
    title: 'Operational Efficiency',
    titleKey: 'Operational Efficiency',
    description: 'Automate processes and reduce manual work by up to 80%',
    descriptionKey: 'Automate processes and reduce manual work by up to 80%',
    stat: '80%',
    statLabel: 'Time Savings',
    statLabelKey: 'Time Savings'
  },
  {
    icon: Shield,
    title: 'Competitive Edge',
    titleKey: 'Competitive Edge',
    description: 'Stay ahead with cutting-edge technology and modern solutions',
    descriptionKey: 'Stay ahead with cutting-edge technology and modern solutions',
    stat: '99.9%',
    statLabel: 'Uptime Guarantee',
    statLabelKey: 'Uptime Guarantee'
  }
]

const challenges = [
  {
    icon: Target,
    title: 'Outdated Systems',
    titleKey: 'Outdated Systems',
    description: 'Legacy systems slow down operations and frustrate customers',
    descriptionKey: 'Legacy systems slow down operations and frustrate customers'
  },
  {
    icon: DollarSign,
    title: 'High Development Costs',
    titleKey: 'High Development Costs',
    description: 'Traditional agencies charge $50k+ for basic websites',
    descriptionKey: 'Traditional agencies charge $50k+ for basic websites'
  },
  {
    icon: Clock,
    title: 'Slow Delivery',
    titleKey: 'Slow Delivery',
    description: 'Most projects take 3-6 months to complete',
    descriptionKey: 'Most projects take 3-6 months to complete'
  }
]

export default function WhyItMatters() {
  return (
    <section className="section-padding">
      <div className="container-max">
        {/* Why Digital Matters */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4" data-translate="Why Digital Transformation Matters">
            Why Digital Transformation Matters
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto" data-translate="In today's digital-first world, your online presence isn't just important—it's essential for survival and growth.">
            In today's digital-first world, your online presence isn't just important—it's essential for survival and growth.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {impacts.map((impact, index) => {
            const IconComponent = impact.icon
            return (
              <div
                key={index}
                className="text-center bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-2xl mb-6">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4" data-translate={impact.titleKey}>
                  {impact.title}
                </h3>
                <p className="text-white mb-6" data-translate={impact.descriptionKey}>
                  {impact.description}
                </p>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {impact.stat}
                </div>
                <div className="text-sm text-white" data-translate={impact.statLabelKey}>
                  {impact.statLabel}
                </div>
              </div>
            )
          })}
        </div>

        {/* Current Challenges */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-slate-700">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4" data-translate="The Problem Most Businesses Face">
              The Problem Most Businesses Face
            </h3>
            <p className="text-lg text-white" data-translate="Traditional web development is expensive, slow, and often doesn't deliver results">
              Traditional web development is expensive, slow, and often doesn't deliver results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => {
              const IconComponent = challenge.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-xl mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-3" data-translate={challenge.titleKey}>
                    {challenge.title}
                  </h4>
                  <p className="text-white" data-translate={challenge.descriptionKey}>
                    {challenge.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
