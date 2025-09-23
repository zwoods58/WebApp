'use client'

import { MessageSquare, Lightbulb, Code, Palette, Rocket, CheckCircle } from 'lucide-react'

const processSteps = [
  {
    step: 1,
    icon: MessageSquare,
    title: 'Discovery & Planning',
    description: 'We start by understanding your vision, goals, and requirements through detailed consultation.',
    details: [
      'Initial consultation call',
      'Requirements gathering',
      'Project scope definition',
      'Timeline and budget planning'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    step: 2,
    icon: Lightbulb,
    title: 'Strategy & Design',
    description: 'We create a comprehensive strategy and design mockups that align with your business goals.',
    details: [
      'User experience research',
      'Wireframe creation',
      'Visual design mockups',
      'Design system development'
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    step: 3,
    icon: Code,
    title: 'Development & Testing',
    description: 'Our developers build your solution using modern technologies and best practices.',
    details: [
      'Frontend development',
      'Backend API development',
      'Database design',
      'Quality assurance testing'
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    step: 4,
    icon: Palette,
    title: 'Refinement & Optimization',
    description: 'We polish every detail and optimize for performance, security, and user experience.',
    details: [
      'Performance optimization',
      'Security hardening',
      'Cross-browser testing',
      'Mobile responsiveness'
    ],
    color: 'from-orange-500 to-orange-600'
  },
  {
    step: 5,
    icon: Rocket,
    title: 'Launch & Support',
    description: 'We deploy your solution and provide ongoing support to ensure continued success.',
    details: [
      'Production deployment',
      'Domain and hosting setup',
      '6 months free support',
      'Performance monitoring'
    ],
    color: 'from-red-500 to-red-600'
  }
]

export default function OurProcess() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Development Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We follow a proven 5-step process that ensures your project is delivered on time, 
            on budget, and exceeds your expectations.
          </p>
        </div>

        {/* Staircase Process */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 via-green-500 via-orange-500 to-red-500 rounded-full hidden lg:block"></div>

          {/* Process Steps */}
          <div className="space-y-12">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon
              const isEven = index % 2 === 0
              
              return (
                <div
                  key={step.step}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-8 lg:gap-16`}
                >
                  {/* Step Number & Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      <IconComponent className="w-10 h-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
                      {step.step}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${
                    isEven ? 'lg:text-left' : 'lg:text-right'
                  }`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                        {step.description}
                      </p>
                      
                      {/* Step Details */}
                      <div className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow (for mobile) */}
                  {index < processSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Process Benefits */}
        <div className="mt-20 bg-white rounded-3xl p-12 shadow-xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Our Process Works
            </h3>
            <p className="text-lg text-gray-600">
              Every step is designed to ensure transparency, quality, and your complete satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Direct Team Access</h4>
              <p className="text-gray-600">Direct communication with our team regarding inquiries and project updates throughout the entire development process.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h4>
              <p className="text-gray-600">Our streamlined process delivers results in 21 days, not months like our competitors.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Quality Guaranteed</h4>
              <p className="text-gray-600">100% quality work guarantee with 12 months of free support and maintenance included.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
