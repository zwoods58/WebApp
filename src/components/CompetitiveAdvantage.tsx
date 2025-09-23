'use client'

import { CheckCircle, Clock, DollarSign, Users, Zap, Award, Star } from 'lucide-react'

const advantages = [
  {
    icon: Clock,
    title: 'Fast Delivery',
    description: '21 days vs 3-6 months industry standard',
    highlight: '5x Faster',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    description: 'Majority of base services are under $1,000 with no hidden fees',
    highlight: '80% Less Cost',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Users,
    title: 'Personal Attention',
    description: 'Direct communication with our team regarding inquiries of your custom project',
    highlight: '1-on-1 Service',
    color: 'from-purple-500 to-pink-600'
  },
  {
    icon: Zap,
    title: 'Modern Technology',
    description: 'Latest frameworks and best practices for optimal performance',
    highlight: 'Future-Proof',
    color: 'from-orange-500 to-red-600'
  },
  {
    icon: Award,
    title: 'Quality Work',
    description: '100% quality work delivered on time',
    highlight: 'Quality First',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    icon: Star,
    title: 'Ongoing Support',
    description: 'Free maintenance and updates for 12 months after launch',
    highlight: '12 Months Free',
    color: 'from-teal-500 to-green-600'
  }
]

const comparison = [
  {
    feature: 'Project Timeline',
    atarweb: '21 days',
    competitors: '3-6 months',
    advantage: true
  },
  {
    feature: 'Pricing',
    atarweb: 'Majority under $1,000',
    competitors: '$5,000 - $50,000+',
    advantage: true
  },
  {
    feature: 'Technology Stack',
    atarweb: 'Latest frameworks',
    competitors: 'Often outdated',
    advantage: true
  },
  {
    feature: 'Support Included',
    atarweb: '12 months free',
    competitors: 'Extra cost',
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
    <section className="section-padding bg-white">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose AtarWeb?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${advantage.color} text-white rounded-2xl mb-6`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {advantage.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {advantage.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              AtarWeb vs. Traditional Agencies
            </h3>
            <p className="text-lg text-gray-600">
              See why businesses are switching to our modern approach
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-semibold text-green-600">AtarWeb</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-500">Traditional Agencies</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-white transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.feature}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center text-green-600 font-semibold">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        {item.atarweb}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-500">{item.competitors}</td>
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
