'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-max">
        <div className="text-center text-white">
          <h2 className="text-4xl font-bold mb-6" data-translate="Ready to Get Started?">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto" data-translate="Join hundreds of businesses who've already made the switch to faster, more affordable, and better web development.">
            Join hundreds of businesses who've already made the switch to faster, 
            more affordable, and better web development.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center group"
            >
              <span data-translate="Start Your Project">Start Your Project</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/portfolio"
              className="border-2 border-slate-300 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-800 hover:text-white transition-all duration-300 inline-flex items-center group"
            >
              <span data-translate="View Our Work">View Our Work</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
