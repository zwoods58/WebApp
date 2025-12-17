'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Portfolio items using gallery images
const portfolioItems = [
  {
    id: 1,
    name: "MM Technical Solutions",
    industry: 'Security & Solar',
    image: '/gallery (1).png',
    description: 'Professional security, solar power, and electrical solutions',
    url: 'https://mmtechnicalsolutions.co.za',
  },
  {
    id: 2,
    name: 'ShopShop Marketplace',
    industry: 'E-Commerce',
    image: '/gallery (2).png',
    description: 'Modern e-commerce platform with premium electronics',
    url: 'https://fence-ballet-04289111.figma.site',
  },
  {
    id: 3,
    name: 'System Limited Vantage',
    industry: 'IT Solutions',
    image: '/gallery (3).png',
    description: 'Enterprise-grade technology solutions for businesses',
    url: 'https://ring-rabid-85204258.figma.site',
  },
  {
    id: 4,
    name: 'Flame & Fork Steakhouse',
    industry: 'Restaurant',
    image: '/gallery (4).png',
    description: 'Atlanta&apos;s distinguished culinary destination',
    url: 'https://rabbit-shown-24552124.figma.site',
  },
  {
    id: 5,
    name: 'YourBrand Solutions',
    industry: 'Business Services',
    image: '/gallery (5).png',
    description: 'Transform your business with innovative solutions',
    url: 'https://nature-art-35903808.figma.site',
  },
  {
    id: 6,
    name: 'Mbobo Legacy',
    industry: 'Real Estate',
    image: '/gallery (6).png',
    description: 'Quality short and long-term accommodation',
    url: 'https://mbobolegacystays.co.za',
  },
  {
    id: 7,
    name: "SMOK'D BBQ",
    industry: 'Restaurant',
    image: '/Screenshot 2025-11-27 204537.png',
    description: 'Authentic Texas BBQ, smoked to perfection',
    url: 'https://rabbit-shown-24552124.figma.site',
  },
]

export function Portfolio() {
  const { ref: sectionRef } = useInView({ triggerOnce: false, threshold: 0 })

  return (
    <div 
      className="relative pt-20 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-white"
      style={{
        position: 'relative',
      }}
    >
      <section 
        ref={sectionRef}
        className="relative w-full min-h-full z-10"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              A Website For Everyone
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Explore the websites we&apos;ve built for businesses across various industries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {portfolioItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
