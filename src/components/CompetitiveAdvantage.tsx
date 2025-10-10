'use client'

import { CheckCircle, Clock, DollarSign, Users, Zap, Award, Star } from 'lucide-react'

const advantages = [
  {
    icon: Clock,
    title: 'Fast Delivery',
    titleKey: 'Fast Delivery',
    description: '7 days vs 3-6 months industry standard',
    descriptionKey: '7 days vs 3-6 months industry standard',
    highlight: '5x Faster',
    highlightKey: '5x Faster',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    titleKey: 'Transparent Pricing',
    description: 'Clear pricing tiers starting at $150 with no hidden fees',
    descriptionKey: 'Clear pricing tiers starting at $150 with no hidden fees',
    highlight: '80% Less Cost',
    highlightKey: '80% Less Cost',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Users,
    title: 'Personal Attention',
    titleKey: 'Personal Attention',
    description: 'Direct communication with our team regarding inquiries of your custom project',
    descriptionKey: 'Direct communication with our team regarding inquiries of your custom project',
    highlight: '1-on-1 Service',
    highlightKey: '1-on-1 Service',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: Zap,
    title: 'Modern Technology',
    titleKey: 'Modern Technology',
    description: 'Latest frameworks and Supabase backend for optimal performance and scalability',
    descriptionKey: 'Latest frameworks and Supabase backend for optimal performance and scalability',
    highlight: 'Future-Proof',
    highlightKey: 'Future-Proof',
    color: 'from-orange-500 to-red-600'
  },
  {
    icon: Award,
    title: 'Quality Work',
    titleKey: 'Quality Work',
    description: '100% quality work delivered on time',
    descriptionKey: '100% quality work delivered on time',
    highlight: 'Quality First',
    highlightKey: 'Quality First',
    color: 'from-indigo-500 to-purple-600'
  }
]

const comparison = [
  {
    feature: 'Project Timeline',
    atarweb: '7 days',
    competitors: '3-6 months',
    advantage: true
  },
  {
    feature: 'Pricing',
    atarweb: 'Starting at $150',
    competitors: '$5,000 - $50,000+',
    advantage: true
  },
  {
    feature: 'Technology Stack',
    atarweb: 'Latest frameworks + Supabase',
    competitors: 'Often outdated',
    advantage: true
  },
  {
    feature: 'Quality Work',
    atarweb: '100% quality work',
    competitors: 'Limited or none',
    advantage: true
  }
]

export default function CompetitiveAdvantage() {
  return (
    <section className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4" data-translate="Why Choose AtarWebb?">
            Why Choose AtarWebb?
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto" data-translate="We've revolutionized web development by delivering premium quality at startup prices, with lightning-fast delivery and personal attention you won't find anywhere else.">
            We've revolutionized web development by delivering premium quality at startup prices, 
            with lightning-fast delivery and personal attention you won't find anywhere else.
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon
            return (
              <div
                key={index}
                className="relative bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${advantage.color} text-white rounded-2xl mb-6`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full" data-translate={advantage.highlightKey}>
                    {advantage.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4" data-translate={advantage.titleKey}>
                  {advantage.title}
                </h3>
                <p className="text-white leading-relaxed" data-translate={advantage.descriptionKey}>
                  {advantage.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-12 border border-slate-700">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4" data-translate="AtarWebb vs. Traditional Agencies">
              AtarWebb vs. Traditional Agencies
            </h3>
            <p className="text-lg text-white" data-translate="See why businesses are switching to our modern approach">
              See why businesses are switching to our modern approach
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white">
                  <th className="text-left py-4 px-6 font-semibold text-white" data-translate="Feature">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-green-600" data-translate="AtarWebb">AtarWebb</th>
                  <th className="text-center py-4 px-6 font-semibold text-white" data-translate="Traditional Agencies">Traditional Agencies</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr key={index} className="border-b border-white hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-white" data-translate={item.feature}>{item.feature}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center text-green-600 font-semibold">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span data-translate={item.atarweb}>{item.atarweb}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-white" data-translate={item.competitors}>{item.competitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
