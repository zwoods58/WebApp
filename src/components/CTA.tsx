'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="container-max">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            Join hundreds of businesses who've already made the switch to faster, 
            more affordable, and better web development.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center group"
            >
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/portfolio"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center group"
            >
              View Our Work
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm opacity-75 mb-4">
              Trusted by businesses worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm">Projects Completed</div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm">Quality Work</div>
              <div className="text-2xl font-bold">12mo</div>
              <div className="text-sm">Free Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
