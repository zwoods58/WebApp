import { Check, Star, Users, Code, Search, Clock, Layers, Globe, Zap, DollarSign, ArrowRight, ExternalLink, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const pricingPlans = [
  {
    name: 'The Basic Launchpad',
    tier: 'Basic (Single Page)',
    price: '$150',
    priceUSD: 150,
    description: 'Perfect for startups and budget-focused campaigns',
    idealFor: 'Startups, lead capture, single product launches, budget-focused campaigns.',
    coreStructure: 'One single-scroll page (no navigation bar).',
    designApproach: 'Template-Based. Design chosen from a curated list of modern, proven layouts.',
    includedSections: [
      'Hero Section',
      'Features/Services', 
      'CTA/Offer',
      'Basic Contact Form'
    ],
    customGraphics: 'Standard stock imagery placeholders.',
    formDataCapture: 'One basic contact form (Name, Email, Message).',
    codeOptimization: [
      'Basic mobile responsiveness',
      'Clean semantic HTML/CSS'
    ],
    seoCapability: 'Minimal Foundation: Proper <title> and <H1> tags, clean URL structure.',
    reviewRounds: 1,
    deliverables: [
      'Final website code (HTML/CSS/JS files)',
      'Asset Folder'
    ],
    popular: false,
    icon: Layers,
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    name: 'The Standard Optimizer',
    tier: 'Standard (Multi-Page)',
    price: '$250',
    priceUSD: 250,
    description: 'Ideal for growing businesses needing credibility and better conversion rates',
    idealFor: 'Growing businesses needing credibility and better conversion rates across multiple content areas.',
    coreStructure: 'Three pages (Home, About, Contact).',
    designApproach: 'Semi-Custom Design. Template structure with tailored colors, typography, and section reordering.',
    includedSections: [
      'Hero Section',
      'About/Company Info',
      'Services/Features',
      'Social Proof/Testimonials',
      'Simple Gallery/Process',
      'Contact Form'
    ],
    customGraphics: 'Custom icons and minor graphic tweaks (client-provided logo).',
    formDataCapture: 'One multi-step form or simple subscription integration (e.g., Mailchimp).',
    codeOptimization: [
      'Enhanced speed optimization',
      'Improved image lazy loading',
      'Accessibility review'
    ],
    seoCapability: 'Standard Structure: Correct use of H1-H6 hierarchy, semantic tags, and image alt attributes.',
    reviewRounds: 2,
    deliverables: [
      'Final website code',
      'Asset Folder',
      'Basic Deployment Guide'
    ],
    popular: true,
    icon: Globe,
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    name: 'The Premium Accelerator',
    tier: 'Premium (Advanced Multi-Page)',
    price: '$600',
    priceUSD: 600,
    description: 'For high-traffic campaigns and established brands requiring unique visual identity',
    idealFor: 'High-traffic campaigns, established brands requiring unique visual identity and complex data capture.',
    coreStructure: 'Up to Five pages (custom structure with deep component reuse).',
    designApproach: 'Semi-Custom but with more control over design. Deep customization of template components and user flows.',
    includedSections: [
      'Custom Hero Section',
      'Advanced Features/Services',
      'Custom Calculator',
      'Interactive FAQ',
      'Advanced Lead Magnet',
      'Portfolio/Gallery',
      'Contact/Booking System'
    ],
    customGraphics: 'Custom vector illustrations, branded graphics, and high-resolution hero imagery integration.',
    formDataCapture: 'Advanced form integration with CRM or sales platform (e.g., HubSpot, Salesforce).',
    codeOptimization: [
      'Advanced conversion optimization',
      'Minified code',
      'Browser caching setup',
      'Schema markup integration'
    ],
    seoCapability: 'Full Technical Foundation: Hard-coded Schema Markup (JSON-LD), XML Sitemap file, and robots.txt included.',
    reviewRounds: 5,
    deliverables: [
      'Final website code',
      'Asset Folder',
      'Full Deployment Guide'
    ],
    popular: false,
    icon: Zap,
    gradient: 'from-purple-500 to-pink-600'
  }
]

export default function Pricing() {
  const [showPricingModal, setShowPricingModal] = useState(false)

  useEffect(() => {
    // Initialize currency converter
  }, [])

  const handleGetQuote = () => {
    setShowPricingModal(true)
  }

  const handleCloseModal = () => {
    setShowPricingModal(false)
  }

  return (
    <>
      <section className="section-padding bg-gray-800">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" data-translate="Our Service Plans">
            Our Service Plans
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto mb-8" data-translate="Choose the perfect plan for your business needs. All plans include modern technology, Supabase backend integration, and professional development.">
            Choose the perfect plan for your business needs. All plans include modern technology, 
            Supabase backend integration, and professional development.
          </p>
            
            {/* Technology Stack Highlight */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 max-w-4xl mx-auto mb-8">
              <h3 className="text-2xl font-bold text-white mb-4" data-translate="Powered by Modern Technology">Powered by Modern Technology</h3>
              <p className="text-lg text-white mb-4" data-translate="All our projects are built with Supabase backend for secure, scalable, and real-time data management, combined with the latest frontend frameworks for optimal performance.">
                All our projects are built with <strong>Supabase backend</strong> for secure, scalable, and real-time data management, 
                combined with the latest frontend frameworks for optimal performance.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium" data-translate="Supabase Backend">Supabase Backend</span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium" data-translate="React/Next.js">React/Next.js</span>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium" data-translate="Real-time Database">Real-time Database</span>
                <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium" data-translate="Secure Authentication">Secure Authentication</span>
              </div>
            </div>


            <button
              onClick={handleGetQuote}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center"
              data-translate="View All Plans & Pricing"
            >
              View All Plans & Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {/* Bottom CTA */}
          <div className="text-center bg-gray-800 border border-gray-700 rounded-3xl p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-white mb-4" data-translate="Need a Custom Solution?">
              Need a Custom Solution?
            </h3>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto" data-translate="We're happy to discuss your specific requirements and create a tailored solution that fits your unique needs.">
              We're happy to discuss your specific requirements and create a tailored solution that fits your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                data-translate="Contact Us for Custom Quote"
              >
                Contact Us for Custom Quote
              </a>
              <a
                href="/portfolio"
                className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-700 transition-all duration-300 inline-flex items-center justify-center border-2 border-gray-600"
                data-translate="View Our Work"
              >
                View Our Work
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Service Plans & Pricing</h3>
                    <p className="text-white">Choose the perfect plan for your project</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
        </div>

              {/* Pricing Cards */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {pricingPlans.map((plan, index) => {
                    const IconComponent = plan.icon
                    return (
            <div
              key={index}
                        className={`relative bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                          plan.popular ? 'border-blue-500 scale-105' : 'border-gray-100'
                        }`}
            >
              {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

                        {/* Plan Header */}
                        <div className="text-center mb-6">
                          <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${plan.gradient} text-white rounded-xl mb-4`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-1">{plan.name}</h4>
                          <p className="text-sm text-gray-500 mb-3">{plan.tier}</p>
                          <div className="text-3xl font-bold text-white mb-2" data-price={plan.priceUSD}>{plan.price}</div>
                          <p className="text-sm text-white">{plan.description}</p>
                </div>

                        {/* Key Features */}
                        <div className="space-y-3 mb-6">
                          <div>
                            <h5 className="font-semibold text-white mb-1 text-sm">Ideal For</h5>
                            <p className="text-xs text-white">{plan.idealFor}</p>
              </div>

                          <div>
                            <h5 className="font-semibold text-white mb-2 text-sm">Included Sections</h5>
                            <ul className="space-y-1">
                              {plan.includedSections.map((section, sectionIndex) => (
                                <li key={sectionIndex} className="flex items-center text-xs text-white">
                                  <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                  {section}
                  </li>
                ))}
              </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold text-white mb-1 text-sm">Review Rounds</h5>
                            <p className="text-xs text-white">{plan.reviewRounds} round{plan.reviewRounds > 1 ? 's' : ''} of revisions</p>
                          </div>
                        </div>

                        <button
                          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                            plan.popular
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg'
                              : 'bg-gray-100 hover:bg-gray-200 text-white'
                          }`}
                        >
                          Choose {plan.name}
                        </button>
            </div>
                    )
                  })}
        </div>

                {/* Bottom CTA */}
                <div className="mt-8 text-center">
                  <p className="text-white mb-4">
                    Need help choosing the right plan? We're here to help!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="/contact"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Contact Us for Help
                    </a>
                    <button
                      onClick={handleCloseModal}
                      className="bg-gray-100 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      )}
    </>
  )
}
