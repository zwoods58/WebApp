'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'How long does it take to build my website?',
    answer: 'Most websites are completed in 2-4 weeks, depending on complexity and content readiness. We will give you a specific timeline during consultation.',
  },
  {
    question: 'What is included in the price?',
    answer: 'Everything listed in your package—design, development, hosting setup, SSL certificate, and support. No hidden fees.',
  },
  {
    question: 'Can I update the website myself?',
    answer: 'Absolutely! We build on user-friendly platforms and provide training so you can make updates anytime.',
  },
  {
    question: 'Do you provide hosting?',
    answer: 'Yes, the first year of hosting is included. After that, we offer affordable hosting plans or you can host elsewhere.',
  },
  {
    question: 'What if I need changes after launch?',
    answer: 'All packages include post-launch support. After that, we offer maintenance plans or hourly rates for updates.',
  },
  {
    question: 'Do I need to provide content and images?',
    answer: 'You can provide them, or we can help source professional stock images and write basic content for an additional fee.',
  },
  {
    question: 'Will my website work on mobile phones?',
    answer: 'Yes! All our websites are fully responsive and optimized for phones, tablets, and desktops.',
  },
  {
    question: 'Can you help with SEO?',
    answer: 'Yes, basic SEO is included in all packages. We can also provide advanced SEO services separately.',
  },
  {
    question: 'What if I am not happy with the design?',
    answer: 'We include revision rounds in every package. We will work with you until you are thrilled with the result.',
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'Yes, we offer flexible payment options. Contact us to discuss what works for your budget.',
  },
]

export function FAQ() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section 
      className="relative"
      style={{
        background: 'linear-gradient(to bottom, #f8f9fa 0%, white 100%)',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      {/* Subtle Portfolio Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=900&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 
            className="font-bold mb-4"
            style={{ fontSize: '42px' }}
          >
            Frequently Asked Questions
          </h2>
          <p 
            className="text-gray-600"
            style={{ fontSize: '20px' }}
          >
            Everything you need to know
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold pr-4" style={{ fontSize: '18px' }}>
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-600" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                        {faq.answer}
                      </p>
        </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-block text-blue-600 hover:underline font-semibold"
            style={{ fontSize: '16px' }}
          >
            Still have questions? Schedule a free call →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
