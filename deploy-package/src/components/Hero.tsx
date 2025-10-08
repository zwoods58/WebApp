'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Code, Zap, Shield, Users } from 'lucide-react'

export default function Hero() {
  const [currentText, setCurrentText] = useState(0)
  
  const heroTexts = [
    'Custom Web Applications',
    'E-commerce Solutions',
    'API Development',
    'Database Design',
    'Mobile-First Design'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % heroTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-50 section-padding">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                Transform Your Business with{' '}
                <span className="text-primary-600">
                  {heroTexts[currentText]}
                </span>
              </h1>
              <p className="text-xl text-secondary-600 leading-relaxed">
                Professional web development services that deliver scalable, secure, and user-friendly applications tailored to your business needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-primary inline-flex items-center justify-center">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/portfolio" className="btn-outline inline-flex items-center justify-center">
                View Our Work
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-secondary-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">100%</div>
                <div className="text-sm text-secondary-600">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">24/7</div>
                <div className="text-sm text-secondary-600">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">5+</div>
                <div className="text-sm text-secondary-600">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="card bg-white shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-secondary-500 ml-4">webapp-dashboard.tsx</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-primary-100 rounded w-3/4"></div>
                    <div className="h-4 bg-secondary-100 rounded w-1/2"></div>
                    <div className="h-4 bg-primary-100 rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 card bg-primary-600 text-white p-4 transform rotate-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">Fast Performance</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 card bg-secondary-100 p-4 transform -rotate-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-secondary-900">Secure & Reliable</span>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 card bg-white shadow-lg p-3 transform -rotate-12">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-semibold text-secondary-900">User-Friendly</span>
                </div>
              </div>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl transform rotate-6 scale-105 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary-200 to-primary-200 rounded-2xl transform -rotate-6 scale-105 -z-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
