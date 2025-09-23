'use client'

import { Code, Smartphone, ArrowRight, CheckCircle, X, DollarSign, Plus, Building2, FileText, CreditCard } from 'lucide-react'
import { useState } from 'react'
import QuoteConfirmationModal from './QuoteConfirmationModal'
import ConsultationModal from './ConsultationModal'
import PaymentModal from './PaymentModal'

interface AddOn {
  name: string
  price: number
}

interface Service {
  icon: any
  title: string
  description: string
  features: string[]
  gradient: string
  bgGradient: string
  basePrice: number
  baseFeatures: string[]
  addOns: AddOn[]
  industries: string[]
}

const services: Service[] = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies for optimal performance and user experience.',
    features: ['React & Next.js Development', 'Responsive Design', 'SEO Optimization', 'Performance Tuning'],
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    basePrice: 600,
    baseFeatures: [
      'Custom website design & development',
      'Mobile-responsive layout',
      'Contact forms & basic functionality',
      'SEO optimization',
      'Fast loading performance',
      'Basic content management',
      'SSL certificate setup',
      'Domain & hosting setup',
      'Basic analytics integration',
      '12 months free support'
    ],
    addOns: [
      { name: 'E-commerce Integration', price: 75 },
      { name: 'Advanced Analytics', price: 50 },
      { name: 'Multi-language Support', price: 50 },
      { name: 'Admin Dashboard', price: 75 },
      { name: 'API Integration', price: 60 }
    ],
    industries: ['E-commerce', 'Healthcare', 'Education', 'Real Estate', 'Restaurants', 'Professional Services', 'Non-Profit', 'Technology']
  },
  {
    icon: Smartphone,
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps that deliver seamless experiences across all devices.',
    features: ['iOS & Android Development', 'Cross-Platform Solutions', 'App Store Optimization', 'Push Notifications'],
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    basePrice: 650,
    baseFeatures: [
      'Cross-platform mobile app development',
      'iOS & Android compatibility',
      'Custom UI/UX design',
      'Basic app functionality',
      'User authentication system',
      'Data storage & management',
      'App store submission',
      'Basic testing & quality assurance',
      'Performance optimization',
      '12 months free support'
    ],
    addOns: [
      { name: 'Backend API Development', price: 75 },
      { name: 'Push Notifications', price: 50 },
      { name: 'Social Media Integration', price: 60 },
      { name: 'Payment Processing', price: 75 },
      { name: 'Offline Functionality', price: 60 }
    ],
    industries: ['Healthcare', 'Fitness', 'Food Delivery', 'E-commerce', 'Banking', 'Education', 'Travel', 'Entertainment']
  }
]

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({})
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [consultationData, setConsultationData] = useState<any>(null)

  const toggleAddOn = (serviceIndex: number, addOnIndex: number) => {
    const key = `${serviceIndex}-${addOnIndex}`
    setSelectedAddOns(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const calculateTotal = (service: Service) => {
    let total = service.basePrice
    service.addOns.forEach((_, addOnIndex) => {
      const key = `${services.indexOf(service)}-${addOnIndex}`
      if (selectedAddOns[key]) {
        total += service.addOns[addOnIndex].price
      }
    })
    return total
  }

  const handleGetQuote = () => {
    setShowQuoteModal(true)
  }

  const handleScheduleConsultation = () => {
    setShowQuoteModal(false)
    setShowConsultationModal(true)
  }

  const handleConsultationSuccess = (consultation: any) => {
    setConsultationData(consultation)
    setShowConsultationModal(false)
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setSelectedService(null)
    setSelectedAddOns({})
    setConsultationData(null)
  }

  const handlePaymentClose = () => {
    setShowPaymentModal(false)
    setConsultationData(null)
  }


  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container-max relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Code className="h-4 w-4 mr-2" />
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            What We Do Best
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We provide comprehensive web development services to help your business grow and succeed in the digital world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${service.bgGradient} rounded-3xl transform group-hover:scale-105 transition-transform duration-500`}></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-transparent">
                <div className="space-y-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <button 
                      onClick={() => setSelectedService(service)}
                      className="group/btn flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                    >
                      More Details
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Let's discuss your project and create something amazing together. Get a free consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a href="/portfolio" className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-colors border border-white/30 inline-flex items-center justify-center">
                  View Our Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${selectedService.gradient} rounded-2xl flex items-center justify-center`}>
                    <selectedService.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedService.title}</h2>
                    <p className="text-gray-600">{selectedService.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pricing & Add-ons */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <DollarSign className="h-6 w-6 mr-2 text-green-600" />
                    Pricing & Add-ons
                  </h3>
                  
                  {/* Base Price */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Base Service</h4>
                        <p className="text-gray-600">Includes all core features</p>
                      </div>
                      <div className="text-2xl font-bold text-green-600">${selectedService.basePrice}</div>
                    </div>
                    
                    {/* Base Features List */}
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900 mb-3">What's Included:</h5>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedService.baseFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Plus className="h-5 w-5 mr-2 text-blue-600" />
                      Add-ons (Mix & Match)
                    </h4>
                    {selectedService.addOns.map((addOn, index) => {
                      const key = `${services.indexOf(selectedService)}-${index}`
                      const isSelected = selectedAddOns[key]
                      return (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleAddOn(services.indexOf(selectedService), index)}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div>
                              <h5 className="font-medium text-gray-900">{addOn.name}</h5>
                              <p className="text-sm text-gray-600">+${addOn.price}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Total */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Price:</span>
                      <span className="text-3xl font-bold text-blue-600">${calculateTotal(selectedService)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">* Final price may vary based on project complexity</p>
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Building2 className="h-6 w-6 mr-2 text-purple-600" />
                    Industries We Serve
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {selectedService.industries.map((industry, index) => (
                      <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 text-center">
                        <span className="font-medium text-gray-900">{industry}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> We work with businesses across all industries. 
                      Our solutions are tailored to meet the specific needs of your sector.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Get a custom quote for your project and schedule a consultation with our team.
                </p>
                
                {/* CTA Button */}
                <div className="flex justify-center">
                  <button 
                    onClick={handleGetQuote}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Get Custom Quote</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Confirmation Modal */}
      {selectedService && (
        <QuoteConfirmationModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          onScheduleConsultation={handleScheduleConsultation}
          service={{
            name: selectedService.title,
            basePrice: selectedService.basePrice,
            addOns: selectedService.addOns.map((addOn, index) => ({
              name: addOn.name,
              price: addOn.price,
              selected: selectedAddOns[`${services.indexOf(selectedService)}-${index}`] || false
            })),
            totalPrice: calculateTotal(selectedService)
          }}
        />
      )}

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        onSuccess={handleConsultationSuccess}
      />

      {/* Payment Modal */}
      {consultationData && selectedService && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentClose}
          consultationData={{
            id: consultationData.id,
            name: consultationData.name,
            email: consultationData.email,
            company: consultationData.company,
            projectDetails: consultationData.projectDetails,
            serviceType: selectedService.title,
            totalAmount: calculateTotal(selectedService)
          }}
        />
      )}
    </section>
  )
}
