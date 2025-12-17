'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const features = [
  {
    id: 1,
    name: 'Fast Delivery',
    title: '5x Faster Than Industry Standard',
    description: 'Get your website live in just 7 days, compared to the industry standard of 3-6 months. Our streamlined process and dedicated team ensure lightning-fast delivery without compromising on quality.',
    size: 'large', // spans 2 columns, 2 rows
  },
  {
    id: 2,
    name: 'Transparent Pricing',
    title: '80% Less Cost',
    description: 'No surprises, no hidden costs. Our transparent pricing model starts at just $150, saving you up to 80% compared to traditional agencies.',
    size: 'medium', // spans 1 column, 2 rows
  },
  {
    id: 3,
    name: 'Personal Attention',
    title: '1-on-1 Dedicated Service',
    description: 'Experience true personalized service with direct access to our team. We prioritize your project and provide dedicated support.',
    size: 'medium', // spans 1 column, 2 rows
  },
  {
    id: 4,
    name: 'Modern Technology',
    title: 'Future-Proof & Scalable',
    description: 'Built with cutting-edge technologies including React, Next.js, and Supabase. Your website will be fast, secure, and scalable.',
    size: 'wide', // spans 2 columns, 1 row
  },
  {
    id: 5,
    name: 'Quality Work',
    title: '100% Quality Guaranteed',
    description: 'We don&apos;t compromise on quality. Every project is meticulously crafted with attention to detail, ensuring professional results that exceed expectations.',
    size: 'wide', // spans 2 columns, 1 row
  },
]

function BentoCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const cardClasses = {
    large: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[400px] md:min-h-[500px]',
    medium: 'col-span-1 md:col-span-1 lg:col-span-1 row-span-2 min-h-[400px] md:min-h-[500px]',
    wide: 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1 min-h-[200px] md:min-h-[250px]',
  }

  // Determine slide direction based on index (alternating left/right)
  const slideDirection = index % 2 === 0 ? -50 : 50

  return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: slideDirection, y: 30 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: slideDirection, y: 30 }}
        transition={{ 
          duration: 0.8, 
          delay: index * 0.15,
          ease: [0.25, 0.4, 0.25, 1]
        }}
        className={`${cardClasses[feature.size as keyof typeof cardClasses]} group`}
        style={{ perspective: '1000px' }}
      >
      <motion.div
        className="h-full p-6 md:p-8 rounded-2xl bg-white border border-gray-200/60 cursor-pointer group relative overflow-hidden"
        style={{
          boxShadow: `
            0 1px 3px 0 rgba(0, 0, 0, 0.05),
            0 4px 12px 0 rgba(0, 0, 0, 0.08),
            0 8px 24px 0 rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05)
          `,
          background: 'linear-gradient(to bottom, #ffffff 0%, #fafafa 100%)',
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ 
          scale: 1.02,
          y: -4,
          rotateX: 2,
          rotateY: index % 2 === 0 ? -1 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Subtle gradient overlay for depth */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.02) 100%)',
          }}
        />
        
        {/* Top highlight for 3D effect */}
        <div 
          className="absolute top-0 left-0 right-0 h-px opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent)',
          }}
        />
        
        {/* Subtle texture pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 0, 0, 0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
        
        {/* Content */}
        <div className="flex flex-col h-full relative z-10">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-950 transition-colors">
            {feature.name}
          </h3>
          <p className="text-sm md:text-base font-semibold text-gray-700 mb-4">
            {feature.title}
          </p>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed flex-grow">
            {feature.description}
          </p>
        </div>
        
        {/* Bottom shadow gradient */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-b-2xl"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.03), transparent)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export function WhyChooseAtarWebb() {
  return (
    <section className="w-full bg-white pt-12 md:pt-16 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Why Choose AtarWebb?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            We&apos;ve revolutionized web development by delivering premium quality at startup prices,
            with lightning-fast delivery and personal attention you won&apos;t find anywhere else.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {features.map((feature, index) => (
            <BentoCard key={feature.id} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
