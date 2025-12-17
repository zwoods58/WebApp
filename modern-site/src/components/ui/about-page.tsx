'use client'

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export default function AboutPage() {
  const { ref } = useInView({ triggerOnce: false, threshold: 0 })

  return (
    <section 
      ref={ref}
      className="our-story-section bg-gray-50 py-20 md:py-32 px-4 md:px-8 min-h-[400px]" 
      style={{ 
        position: 'relative', 
        zIndex: 5, 
        display: 'block', 
        visibility: 'visible', 
        width: '100%',
        opacity: 1
      }}
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Paper-Style Quote Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-white rounded-lg"
          style={{
            padding: '3rem 2.5rem',
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.1),
              0 0 1px rgba(0, 0, 0, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
          }}
        >
          {/* Subtle paper texture overlay */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-lg opacity-30"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px)
              `,
            }}
          />

          {/* Large Opening Quote Mark */}
          <div 
            className="absolute top-4 left-6 text-gray-300" 
            style={{ 
              fontSize: '100px', 
              lineHeight: 1, 
              fontFamily: 'Georgia, serif',
              opacity: 0.4
            }}
          >
            &ldquo;
          </div>

          {/* Content Container */}
          <div className="relative z-10">
            {/* Our Mission - Combined Quote */}
            <div className="pt-8 pb-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl md:text-3xl font-semibold mb-8 text-gray-900"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Our Mission
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <p className="text-lg md:text-xl italic text-gray-700 leading-relaxed pl-4" style={{ fontFamily: 'Georgia, serif' }}>
                  At AtarWebb, our mission is clear: every small business deserves a powerful, beautiful online presence. 
                  We believe exceptional quality should be accessible to everyone—so we create premium websites at prices 
                  small businesses can truly afford.
                </p>
                
                <p className="text-lg md:text-xl italic text-gray-700 leading-relaxed pl-4" style={{ fontFamily: 'Georgia, serif' }}>
                  We&apos;re driven by three guiding principles that shape everything we do:
                </p>
                
                <p className="text-lg md:text-xl italic text-gray-700 leading-relaxed pl-4" style={{ fontFamily: 'Georgia, serif' }}>
                  <strong className="not-italic font-semibold">Affordable Excellence</strong><br />
                  We deliver high-quality, professional websites at budget-friendly rates. With transparent pricing, no hidden fees, 
                  and no unexpected costs, you always know exactly what you&apos;re paying for.
                </p>
                
                <p className="text-lg md:text-xl italic text-gray-700 leading-relaxed pl-4" style={{ fontFamily: 'Georgia, serif' }}>
                  <strong className="not-italic font-semibold">Professional Design</strong><br />
                  Our websites are built to impress—modern, responsive, and optimized for every device. Each design follows the 
                  latest web standards to ensure fast loading times, seamless user experience, and lasting performance.
                </p>
                
                <p className="text-lg md:text-xl italic text-gray-700 leading-relaxed pl-4" style={{ fontFamily: 'Georgia, serif' }}>
                  <strong className="not-italic font-semibold">Fast Delivery</strong><br />
                  We know your time matters. That&apos;s why we guarantee a complete, fully functional website in just two weeks—without 
                  ever compromising on quality. Launch quickly, grow faster.
                </p>
                
                <p className="text-lg md:text-xl italic text-gray-700 leading-relaxed pl-4" style={{ fontFamily: 'Georgia, serif' }}>
                  By combining professional design, modern technology, and efficient workflows, we help small businesses stand out online—beautifully, 
                  affordably, and fast. Your success is our mission.
                </p>
              </motion.div>
            </div>

            {/* Closing Quote Mark and Signature */}
            <div className="pt-8 relative">
              {/* Large Closing Quote Mark */}
              <div 
                className="absolute bottom-0 right-4 text-gray-300" 
                style={{ 
                  fontSize: '100px', 
                  lineHeight: 1, 
                  fontFamily: 'Georgia, serif',
                  opacity: 0.4
                }}
              >
                &rdquo;
              </div>
              
              {/* AtarWebb Signature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-right mt-12 relative z-10"
              >
                <div className="inline-block">
                  <div className="w-20 h-px bg-gray-400 mb-4 mx-auto"></div>
                  <div className="flex items-center justify-end gap-2">
                    <img 
                      src="/favicom.png" 
                      alt="AtarWebb Logo" 
                      className="w-8 h-8 object-contain"
                    />
                    <p 
                      className="text-xl md:text-2xl font-semibold text-gray-900 tracking-wider"
                      style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.1em' }}
                    >
                      AtarWebb
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  )
}

