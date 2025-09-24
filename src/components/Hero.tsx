'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Code, Zap, Shield, Users, Star, CheckCircle, Play } from 'lucide-react'

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
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container-max py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                Transform Your Business with{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  {heroTexts[currentText]}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Professional web development services that deliver scalable, secure, and user-friendly applications tailored to your business needs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 inline-flex items-center justify-center">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/portfolio" className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 inline-flex items-center justify-center">
                View Our Work
                <Play className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-blue-100">Free Consultation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-blue-100">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-blue-100">Quality Work Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative">
            {/* Main Dashboard Mockup */}
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="space-y-4">
                {/* Browser Header */}
                <div className="flex items-center space-x-3 pb-4 border-b border-white/20">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-white/70 ml-4">atarweb-dashboard.tsx</span>
                </div>
                
                {/* Dashboard Content */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"></div>
                    <div className="h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl"></div>
                    <div className="h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"></div>
                  </div>
                  <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl"></div>
                    <div className="h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Feature Cards */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl transform rotate-3 shadow-2xl">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span className="font-bold text-sm">Lightning Fast</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-2xl transform -rotate-3 shadow-2xl">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="font-bold text-sm">Secure & Reliable</span>
              </div>
            </div>

            <div className="absolute top-1/2 -left-8 bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl transform -rotate-12 shadow-xl border border-white/30">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-bold">User-Friendly</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="absolute -right-4 top-1/4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-blue-200">Projects</div>
              </div>
            </div>

            <div className="absolute -left-4 bottom-1/4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-xs text-blue-200">Quality Work</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">50+</div>
            <div className="text-blue-200">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-blue-200">Quality Work</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-blue-200">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">5+</div>
            <div className="text-blue-200">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  )
}
