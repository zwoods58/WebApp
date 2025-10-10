'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
  questionKey: string
  answerKey: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How long does it take to build a website?",
    answer: "We deliver all websites in just 7 days! This is much faster than traditional agencies who take 3-6 months. Our streamlined process and modern development tools allow us to maintain quality while delivering quickly.",
    category: "Timeline",
    questionKey: "How long does it take to build a website?",
    answerKey: "We deliver all websites in just 7 days! This is much faster than traditional agencies who take 3-6 months. Our streamlined process and modern development tools allow us to maintain quality while delivering quickly."
  },
  {
    id: 2,
    question: "What's included in each package?",
    answer: "All packages include mobile-first responsive design, SEO optimization, fast loading times, modern clean code, and professional design. The Basic Launchpad includes 1 review round, Standard Optimizer includes 2 review rounds, and Premium Accelerator includes 3 review rounds.",
    category: "Packages",
    questionKey: "What's included in each package?",
    answerKey: "All packages include mobile-first responsive design, SEO optimization, fast loading times, modern clean code, and professional design. The Basic Launchpad includes 1 review round, Standard Optimizer includes 2 review rounds, and Premium Accelerator includes 3 review rounds."
  },
  {
    id: 3,
    question: "Do you provide ongoing support after launch?",
    answer: "Yes! We provide ongoing support including bug fixes, performance optimization, content updates, technical support, and future enhancements. We believe in long-term partnerships with our clients.",
    category: "Support",
    questionKey: "Do you provide ongoing support after launch?",
    answerKey: "Yes! We provide ongoing support including bug fixes, performance optimization, content updates, technical support, and future enhancements. We believe in long-term partnerships with our clients."
  },
  {
    id: 4,
    question: "Can you work with my existing brand colors and design?",
    answer: "Absolutely! We can incorporate your existing brand colors, fonts, and design elements. For the Standard and Premium packages, we can work with your logo and brand guidelines to create a cohesive look.",
    category: "Design",
    questionKey: "Can you work with my existing brand colors and design?",
    answerKey: "Absolutely! We can incorporate your existing brand colors, fonts, and design elements. For the Standard and Premium packages, we can work with your logo and brand guidelines to create a cohesive look."
  },
  {
    id: 5,
    question: "What if I need changes after the project is complete?",
    answer: "We include multiple review rounds in each package to ensure you're completely satisfied. After launch, we offer ongoing support for bug fixes and can discuss additional changes or enhancements as needed.",
    category: "Revisions",
    questionKey: "What if I need changes after the project is complete?",
    answerKey: "We include multiple review rounds in each package to ensure you're completely satisfied. After launch, we offer ongoing support for bug fixes and can discuss additional changes or enhancements as needed."
  },
  {
    id: 6,
    question: "Do you offer custom development beyond the packages?",
    answer: "Yes! We offer custom web applications, mobile apps, and complex integrations. Contact us at admin@atarwebb.com to discuss your specific requirements and get a custom quote.",
    category: "Custom",
    questionKey: "Do you offer custom development beyond the packages?",
    answerKey: "Yes! We offer custom web applications, mobile apps, and complex integrations. Contact us at admin@atarwebb.com to discuss your specific requirements and get a custom quote."
  },
  {
    id: 7,
    question: "What technologies do you use?",
    answer: "We use modern technologies including React, Next.js, TypeScript, Tailwind CSS, and other industry-standard tools. All code is clean, maintainable, and follows best practices for performance and security.",
    category: "Technology",
    questionKey: "What technologies do you use?",
    answerKey: "We use modern technologies including React, Next.js, TypeScript, Tailwind CSS, and other industry-standard tools. All code is clean, maintainable, and follows best practices for performance and security."
  },
  {
    id: 8,
    question: "How do I get started?",
    answer: "Getting started is easy! 1) Choose a package that fits your needs, 2) Schedule a consultation to discuss your project, 3) We'll create a custom strategy and timeline, 4) Development begins with regular updates. Visit our contact page to get started!",
    category: "Getting Started",
    questionKey: "How do I get started?",
    answerKey: "Getting started is easy! 1) Choose a package that fits your needs, 2) Schedule a consultation to discuss your project, 3) We'll create a custom strategy and timeline, 4) Development begins with regular updates. Visit our contact page to get started!"
  },
  {
    id: 9,
    question: "What makes you different from other web developers?",
    answer: "We offer passion-driven excellence, results-focused approach, technical integrity, and reliable partnerships. Our 7-day delivery time, transparent pricing, and professional development standards set us apart from traditional agencies.",
    category: "Why Choose Us",
    questionKey: "What makes you different from other web developers?",
    answerKey: "We offer passion-driven excellence, results-focused approach, technical integrity, and reliable partnerships. Our 7-day delivery time, transparent pricing, and professional development standards set us apart from traditional agencies."
  },
  {
    id: 10,
    question: "Do you work with small businesses?",
    answer: "Yes! Our mission is to democratize high-quality web development by making professional-grade solutions accessible to businesses of all sizes. Our packages are designed to be affordable for startups and small businesses.",
    category: "Business Size",
    questionKey: "Do you work with small businesses?",
    answerKey: "Yes! Our mission is to democratize high-quality web development by making professional-grade solutions accessible to businesses of all sizes. Our packages are designed to be affordable for startups and small businesses."
  },
  {
    id: 11,
    question: "What if I'm not happy with the final result?",
    answer: "We include multiple review rounds in each package to ensure your satisfaction. If you're not completely happy, we'll work with you to make the necessary changes. Our goal is your complete satisfaction.",
    category: "Satisfaction",
    questionKey: "What if I'm not happy with the final result?",
    answerKey: "We include multiple review rounds in each package to ensure your satisfaction. If you're not completely happy, we'll work with you to make the necessary changes. Our goal is your complete satisfaction."
  },
  {
    id: 12,
    question: "Can you help with SEO and marketing?",
    answer: "Yes! All our packages include basic SEO optimization. For the Standard and Premium packages, we can set up analytics tracking and provide guidance on content optimization for better search rankings.",
    category: "SEO",
    questionKey: "Can you help with SEO and marketing?",
    answerKey: "Yes! All our packages include basic SEO optimization. For the Standard and Premium packages, we can set up analytics tracking and provide guidance on content optimization for better search rankings."
  }
]

const categories = ["All", "Timeline", "Packages", "Support", "Design", "Revisions", "Custom", "Technology", "Getting Started", "Why Choose Us", "Business Size", "Satisfaction", "SEO"]

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = selectedCategory === "All" 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory)

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" data-translate="Frequently Asked Questions">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-translate="Get answers to common questions about our web development services, packages, and process.">
            Get answers to common questions about our web development services, packages, and process.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900 pr-4" data-translate={item.questionKey}>
                  {item.question}
                </span>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed" data-translate={item.answerKey}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
