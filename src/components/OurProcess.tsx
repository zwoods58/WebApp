'use client'

import { MessageSquare, Lightbulb, Code, Palette, Rocket, CheckCircle } from 'lucide-react'

const processSteps = [
  {
    step: 1,
    icon: MessageSquare,
    title: 'Discovery & Planning',
    titleKey: 'Consultation',
    description: 'We start by understanding your vision, goals, and requirements through detailed consultation.',
    descriptionKey: 'We start by understanding your vision, goals, and requirements through detailed consultation.',
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
    titleKey: 'Design & Development',
    description: 'We create a comprehensive strategy and design mockups that align with your business goals.',
    descriptionKey: 'We create a comprehensive strategy and design mockups that align with your business goals.',
    details: [
      'User experience research',
      'Wireframe creation',
      'Visual design mockups',
      'Design system development'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    step: 3,
    icon: Code,
    title: 'Development & Testing',
    titleKey: 'Design & Development',
    description: 'Our developers build your solution using modern technologies and best practices.',
    descriptionKey: 'Our developers build your solution using modern technologies and best practices.',
    details: [
      'Frontend development',
      'Supabase backend integration',
      'Database design & setup',
      'Quality assurance testing'
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    step: 4,
    icon: Palette,
    title: 'Refinement & Optimization',
    titleKey: 'Testing & Launch',
    description: 'We polish every detail and optimize for performance, security, and user experience.',
    descriptionKey: 'We polish every detail and optimize for performance, security, and user experience.',
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
    title: 'Launch & Deployment',
    description: 'We deploy your solution and ensure everything is working perfectly.',
    details: [
      'Production deployment',
      'Domain and hosting setup',
      'Performance monitoring',
      'Final testing and optimization'
    ],
    color: 'from-red-500 to-red-600'
  }
]

export default function OurProcess() {
  return (
    <section className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4" data-translate="Our Process">
            Our Development Process
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto" data-translate="We follow a proven 5-step process that ensures your project is delivered on time, on budget, and exceeds your expectations.">
            We follow a proven 5-step process that ensures your project is delivered on time, 
            on budget, and exceeds your expectations.
          </p>
        </div>

        {/* Staircase Process */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-blue-500 via-green-500 via-orange-500 to-red-500 rounded-full hidden lg:block"></div>

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
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 border-4 border-slate-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {step.step}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${
                    isEven ? 'lg:text-left' : 'lg:text-right'
                  }`}>
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700">
                      <h3 className="text-2xl font-bold text-white mb-4" data-translate={step.titleKey}>
                        {step.title}
                      </h3>
                      <p className="text-white mb-6 text-lg leading-relaxed" data-translate={step.descriptionKey}>
                        {step.description}
                      </p>
                      
                      {/* Step Details */}
                      <div className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-white">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow (for mobile) */}
                  {index < processSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center">
                      <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-20 bg-slate-900/50 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-slate-700">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4" data-translate="Why Our Process Works">
              Why Our Process Works
            </h3>
            <p className="text-lg text-white" data-translate="Every step is designed to ensure transparency, quality, and your complete satisfaction">
              Every step is designed to ensure transparency, quality, and your complete satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3" data-translate="Direct Team Access">Direct Team Access</h4>
              <p className="text-white" data-translate="Direct communication with our team regarding inquiries and project updates throughout the entire development process.">Direct communication with our team regarding inquiries and project updates throughout the entire development process.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3" data-translate="Fast Delivery">Fast Delivery</h4>
              <p className="text-white" data-translate="Our streamlined process delivers results in 7 days, not months like our competitors.">Our streamlined process delivers results in 7 days, not months like our competitors.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-3" data-translate="Quality Guaranteed">Quality Guaranteed</h4>
              <p className="text-white" data-translate="100% quality work guarantee with professional development standards.">100% quality work guarantee with professional development standards.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
