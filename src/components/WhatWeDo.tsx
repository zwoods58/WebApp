'use client'

import { Smartphone, Globe, Zap } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies for optimal performance and user experience.',
    features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile-First']
  },
  {
    icon: Smartphone,
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps that deliver seamless experiences across all devices.',
    features: ['iOS & Android', 'Cross-Platform', 'App Store Ready', 'Push Notifications']
  }
]

export default function WhatWeDo() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What We Do
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We build digital solutions that drive business growth, enhance user experiences, 
            and solve real-world problems through innovative technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-gray-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
