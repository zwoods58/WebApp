'use client'

import { useState, useEffect } from 'react'
import { 
  Code, 
  Zap, 
  Shield, 
  CheckCircle, 
  Star, 
  Users, 
  Clock, 
  DollarSign,
  ArrowRight,
  ExternalLink,
  Palette,
  Database,
  Search,
  Layers,
  Smartphone,
  Globe,
  Rocket,
  Building,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Mail,
  FileText,
  Monitor,
  Workflow
} from 'lucide-react'
import ConsultationModal from './ConsultationModal'
import QuoteConfirmationModal from './QuoteConfirmationModal'

interface PricingPlan {
  id: string
  name: string
  tier: string
  price: number
  description: string
  idealFor: string
  coreStructure: string
  designApproach: string
  includedSections: string[]
  customGraphics: string
  formDataCapture: string
  codeOptimization: string[]
  seoCapability: string
  reviewRounds: number | string
  deliverables: string[]
  popular?: boolean
  gradient: string
  bgGradient: string
  addOns: Array<{ name: string; price: number; selected: boolean }>
}

interface AdditionalService {
  id: string
  name: string
  price?: number
  description: string
  category: string
  type: string
  icon: string
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'The Basic Launchpad',
    tier: 'Basic (Single Page)',
    price: 150,
    description: 'Professional website with lead capture and conversion optimization',
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
    reviewRounds: 'Unlimited',
    deliverables: [
      'Final website code (HTML/CSS/JS files)',
      'Asset Folder'
    ],
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    addOns: []
  },
  {
    id: 'standard',
    name: 'The Standard Optimizer',
    tier: 'Standard (Multi-Page)',
    price: 250,
    description: 'Multi-page website with customer management capabilities',
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
    reviewRounds: 'Unlimited',
    deliverables: [
      'Final website code',
      'Asset Folder',
      'Basic Deployment Guide'
    ],
    popular: true,
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    addOns: []
  },
  {
    id: 'premium',
    name: 'The Premium Accelerator',
    tier: 'Premium (Advanced Multi-Page)',
    price: 600,
    description: 'Advanced website with custom integrations and advanced features',
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
    reviewRounds: 'Unlimited',
    deliverables: [
      'Final website code',
      'Asset Folder',
      'Full Deployment Guide'
    ],
    gradient: 'from-purple-500 to-pink-600',
    bgGradient: 'from-purple-50 to-pink-50',
    addOns: []
  }
]

// Additional Services Data
const additionalServices: AdditionalService[] = [
  {
    id: 'logo-design',
    name: 'Logo Design',
    price: 50,
    description: 'Professional logo design',
    category: 'Design',
    type: 'one-time',
    icon: 'Palette'
  },
  {
    id: 'domain-registration',
    name: 'Domain Registration',
    price: 25,
    description: 'Yearly domain subscription',
    category: 'Infrastructure',
    type: 'yearly',
    icon: 'Globe'
  },
  {
    id: 'hosting',
    name: 'Hosting',
    price: 25,
    description: 'Monthly hosting subscription',
    category: 'Infrastructure',
    type: 'monthly',
    icon: 'Database'
  },
  {
    id: 'email-service',
    name: 'Email Service',
    price: 15,
    description: 'Monthly email subscription',
    category: 'Infrastructure',
    type: 'monthly',
    icon: 'Mail'
  },
  {
    id: 'ad-copies',
    name: 'Ad Copies',
    price: 10,
    description: '5 professional ad copies',
    category: 'Marketing',
    type: 'one-time',
    icon: 'FileText'
  },
  {
    id: 'supabase-connect',
    name: 'Supabase Connect',
    price: 50,
    description: 'Monthly Supabase connection',
    category: 'Infrastructure',
    type: 'monthly',
    icon: 'Database'
  },
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    price: 50,
    description: 'Custom frontend design',
    category: 'Design',
    type: 'one-time',
    icon: 'Monitor'
  },
  {
    id: 'api-usage',
    name: 'Custom API',
    price: 100,
    description: 'Monthly API usage subscription',
    category: 'Development',
    type: 'monthly',
    icon: 'Zap'
  },
  {
    id: 'automation-workflow',
    name: 'Automation Workflow',
    description: 'Custom automation workflow',
    category: 'Marketing',
    type: 'one-time',
    icon: 'Workflow'
  }
]

// Combo Deals
const comboDeals = [
  {
    id: 'smart-launch-package',
    name: 'Smart Launch Package',
    description: 'Complete business package with professional setup',
    badge: 'Most Popular',
    services: ['basic-launchpad', 'logo-design', 'domain-registration', 'hosting', 'email-service', 'ad-copies'],
    features: ['Lead capture forms', 'Email marketing setup', 'Professional branding']
  },
  {
    id: 'business-automation-bundle',
    name: 'Business Growth Bundle',
    description: 'Multi-channel marketing and customer management',
    badge: 'Best Value',
    services: ['standard-optimizer', 'logo-design', 'domain-hosting-combo', 'email-service', 'ad-copies'],
    features: ['Customer journey optimization', 'Multi-page website', 'Professional setup']
  },
  {
    id: 'enterprise-automation-suite',
    name: 'Enterprise Growth Suite',
    description: 'Complete business growth ecosystem',
    badge: 'Complete',
    services: ['premium-accelerator', 'logo-design', 'domain-hosting-combo', 'email-service', 'supabase-connect', 'api-usage', 'automation-workflow'],
    features: ['Complete business ecosystem', 'Advanced features', 'Custom integrations']
  }
]

export default function Services() {
  const [showConsultationModal, setShowConsultationModal] = useState(false)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [consultationData, setConsultationData] = useState<any>(null)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  
  // Force re-render to clear any cached issues
  useEffect(() => {
    console.log('Services component mounted successfully')
  }, [])
  const [currency, setCurrency] = useState<'USD' | 'KSH' | 'ZAR'>('USD')

  useEffect(() => {
    // Initialize currency converter
  }, [])

  const handleGetQuote = (planId: string) => {
    // Handle combo deals
    if (planId.startsWith('combo-')) {
      const comboId = planId.replace('combo-', '')
      const combo = comboDeals.find(c => c.id === comboId)
      if (combo) {
        // Create a temporary plan object for combo deals
        const tempPlan = {
          id: comboId,
          name: combo.name,
          tier: combo.badge,
          price: 0, // No fixed price for combo deals
          description: combo.description,
          idealFor: combo.features.join(', '),
          coreStructure: 'Complete package',
          designApproach: 'Professional setup',
          includedSections: combo.features,
          customGraphics: 'Included',
          formDataCapture: 'Automated',
          codeOptimization: ['Optimized'],
          seoCapability: 'Included',
          reviewRounds: 'Unlimited' as any,
          deliverables: ['Complete setup'],
          popular: combo.badge === 'Most Popular',
          gradient: 'from-blue-500 to-cyan-600',
          bgGradient: 'from-blue-50 to-cyan-50',
          addOns: []
        }
        setSelectedPlan(tempPlan)
        setShowQuoteModal(true)
      }
    }
    // Handle additional services
    else if (planId.startsWith('service-')) {
      const serviceId = planId.replace('service-', '')
      const service = additionalServices.find(s => s.id === serviceId)
      if (service) {
        // Create a temporary plan object for additional services
        const tempPlan = {
          id: serviceId,
          name: service.name,
          tier: service.type,
          price: service.price || 0, // Use 0 if no price is set
          description: service.description,
          idealFor: service.category,
          coreStructure: 'Single service',
          designApproach: 'Professional',
          includedSections: [service.description],
          customGraphics: 'Included',
          formDataCapture: 'Included',
          codeOptimization: ['Optimized'],
          seoCapability: 'Included',
          reviewRounds: 'Unlimited' as any,
          deliverables: ['Complete service'],
          popular: false,
          gradient: 'from-gray-500 to-gray-600',
          bgGradient: 'from-gray-50 to-gray-50',
          addOns: []
        }
        setSelectedPlan(tempPlan)
        setShowQuoteModal(true)
      }
    }
    // Handle main services
    else {
      const plan = pricingPlans.find(p => p.id === planId)
      if (plan) {
        setSelectedPlan(plan)
        setShowQuoteModal(true)
      }
    }
  }

  const handleScheduleConsultation = () => {
    setShowQuoteModal(false)
    setShowConsultationModal(true)
  }

  const handleConsultationSuccess = (consultation: any) => {
    setConsultationData(consultation)
    setShowConsultationModal(false)
    // Reset form after successful submission
    setConsultationData(null)
  }

  const toggleExpanded = (planId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(planId)) {
        newSet.delete(planId)
      } else {
        newSet.add(planId)
      }
      return newSet
    })
  }

  const isExpanded = (planId: string) => expandedCards.has(planId)



  // Currency conversion (approximate rates)
  const convertPrice = (usdPrice: number) => {
    if (currency === 'KSH') {
      return Math.round(usdPrice * 130) // Approximate USD to KSH rate
    }
    if (currency === 'ZAR') {
      return Math.round(usdPrice * 18) // Approximate USD to ZAR rate
    }
    return usdPrice
  }

  const getCurrencySymbol = () => {
    if (currency === 'KSH') return 'KSh'
    if (currency === 'ZAR') return 'R'
    return '$'
  }

  return (
    <>
      <section className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4 font-tech" data-translate="Complete Digital Solutions for Your Business">
              Complete Digital Solutions for Your Business
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4" data-translate="From websites to automation workflows - we do it all. Starting at $200 for complete packages.">
              From websites to automation workflows - we do it all. Starting at $200 for complete packages.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8" data-translate="Professional development with modern technology, Supabase backend integration, and comprehensive digital solutions.">
              Professional development with modern technology, Supabase backend integration, and comprehensive digital solutions.
            </p>
            
            {/* Technology Stack Highlight */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 max-w-4xl mx-auto mb-8">
              <h3 className="text-2xl font-bold text-white mb-4" data-translate="Powered by Modern Technology">Powered by Modern Technology</h3>
              <p className="text-lg text-gray-400 mb-4" data-translate="All our projects are built with Supabase backend for secure, scalable, and real-time data management, combined with the latest frontend frameworks for optimal performance.">
                All our projects are built with <strong>Supabase backend</strong> for secure, scalable, and real-time data management, 
                combined with the latest frontend frameworks for optimal performance.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium tech-stack" data-translate="Supabase Backend">Supabase Backend</span>
                <span className="bg-green-600 text-white px-4 py-2 rounded-full font-medium tech-stack" data-translate="React/Next.js">React/Next.js</span>
                <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-medium tech-stack" data-translate="Real-time Database">Real-time Database</span>
                <span className="bg-orange-600 text-white px-4 py-2 rounded-full font-medium tech-stack" data-translate="Secure Authentication">Secure Authentication</span>
              </div>
            </div>

            {/* Currency Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-2 flex items-center gap-2">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currency === 'USD'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  🇺🇸 USD
                </button>
                <button
                  onClick={() => setCurrency('KSH')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currency === 'KSH'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  🇰🇪 KSH
                </button>
                <button
                  onClick={() => setCurrency('ZAR')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currency === 'ZAR'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  🇿🇦 ZAR
                </button>
              </div>
            </div>

      </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-gray-800 border border-gray-700 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${plan.gradient} text-white rounded-2xl mb-4`}>
                    {plan.id === 'basic' && <Layers className="w-8 h-8" />}
                    {plan.id === 'standard' && <Globe className="w-8 h-8" />}
                    {plan.id === 'premium' && <Zap className="w-8 h-8" />}
          </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-tech">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{plan.tier}</p>
                  <div className="text-4xl font-bold text-white mb-2" data-price={plan.price}>
                    {getCurrencySymbol()}{convertPrice(plan.price).toLocaleString()}
                  </div>
                  <p className="text-gray-400">{plan.description}</p>
        </div>

                {/* Basic Info - Always Visible */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      Ideal For
                    </h4>
                    <p className="text-sm text-gray-400">{plan.idealFor}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2 text-green-600" />
                      Core Structure
                    </h4>
                    <p className="text-sm text-gray-400">{plan.coreStructure}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Included Sections
                    </h4>
                    <ul className="space-y-2">
                      {plan.includedSections.slice(0, 3).map((section, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-400">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {section}
                      </li>
                    ))}
                      {plan.includedSections.length > 3 && !isExpanded(plan.id) && (
                        <li className="text-sm text-gray-400 italic">
                          +{plan.includedSections.length - 3} more sections
                        </li>
                      )}
                  </ul>
        </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      Review Rounds
                    </h4>
                    <p className="text-sm text-gray-400">{plan.reviewRounds === 'Unlimited' ? 'Unlimited' : `${plan.reviewRounds} round${typeof plan.reviewRounds === 'number' && plan.reviewRounds > 1 ? 's' : ''}`} of design and content revisions</p>
        </div>
      </div>

                {/* Expanded Details - Only when expanded */}
                {isExpanded(plan.id) && (
                  <div className="space-y-4 mb-6 border-t pt-6">
                    <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Palette className="h-4 w-4 mr-2 text-purple-600" />
                        Design Approach
                      </h4>
                      <p className="text-sm text-gray-400">{plan.designApproach}</p>
                  </div>

                  <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        All Included Sections
                      </h4>
                      <ul className="space-y-2">
                        {plan.includedSections.map((section, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-400">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {section}
                          </li>
                        ))}
                      </ul>
              </div>

                <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-orange-600" />
                        Custom Graphics
                      </h4>
                      <p className="text-sm text-gray-400">{plan.customGraphics}</p>
                    </div>

                      <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Database className="h-4 w-4 mr-2 text-indigo-600" />
                        Form/Data Capture
                      </h4>
                      <p className="text-sm text-gray-400">{plan.formDataCapture}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                        Code Optimization
                      </h4>
                      <ul className="space-y-1">
                        {plan.codeOptimization.map((item, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-400">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                  </div>

                    <div>
                      <h4 className="font-semibold text-white mb-2 flex items-center">
                        <Search className="h-4 w-4 mr-2 text-red-600" />
                        SEO Technical Capability
                    </h4>
                      <p className="text-sm text-gray-400">{plan.seoCapability}</p>
                  </div>

                    <div>
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                        Deliverables
                      </h4>
                      <ul className="space-y-1">
                        {plan.deliverables.map((item, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-400">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                  </div>
                </div>
                )}

                {/* See More/Less Button */}
                <div className="text-center mb-6">
                  <button
                    onClick={() => toggleExpanded(plan.id)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center mx-auto"
                  >
                    {isExpanded(plan.id) ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        See Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        See More Details
                      </>
                    )}
                  </button>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleGetQuote(plan.id)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  Get Quote for {plan.name}
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </button>
                      </div>
                    ))}
                  </div>

          {/* Combo Deals Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4" data-translate="Complete Business Packages">
                Complete Business Packages
              </h3>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto" data-translate="Everything you need to launch and grow your business online. Save money with our complete packages.">
                Everything you need to launch and grow your business online. Save money with our complete packages.
              </p>
            </div>

            {/* Combo Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
              {comboDeals.map((combo, index) => (
                <div
                  key={combo.id}
                  className="relative bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {combo.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className={`px-4 py-1 rounded-full text-sm font-medium ${
                        combo.badge === 'Most Popular' ? 'bg-blue-600 text-white' :
                        combo.badge === 'Best Value' ? 'bg-green-600 text-white' :
                        combo.badge === 'Complete' ? 'bg-purple-600 text-white' :
                        'bg-orange-600 text-white'
                      }`}>
                        {combo.badge}
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      {combo.id === 'smart-launch-package' && (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Rocket className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                      {combo.id === 'business-automation-bundle' && (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Zap className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                      {combo.id === 'enterprise-automation-suite' && (
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Building className="h-6 w-6 text-purple-600" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{combo.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{combo.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-2xl font-bold text-white">
                        Contact for Pricing
                      </div>
                      <div className="text-sm text-green-400">
                        Custom packages available
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="text-xs text-gray-300 font-medium mb-2 text-center">What's Included:</div>
                      {combo.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="text-xs text-gray-400 flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleGetQuote('combo-' + combo.id)
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Get Quote</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Services Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4" data-translate="Additional Services">
                Additional Services
              </h3>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto" data-translate="Add services to enhance your project and create a complete digital solution. From design to automation workflows.">
                Add services to enhance your project and create a complete digital solution. From design to automation workflows.
              </p>
            </div>

            {/* Additional Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {additionalServices.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      {service.icon === 'Palette' && <Palette className="h-6 w-6 text-blue-400" />}
                      {service.icon === 'Globe' && <Globe className="h-6 w-6 text-green-400" />}
                      {service.icon === 'Database' && <Database className="h-6 w-6 text-purple-400" />}
                      {service.icon === 'Mail' && <Mail className="h-6 w-6 text-red-400" />}
                      {service.icon === 'FileText' && <FileText className="h-6 w-6 text-yellow-400" />}
                      {service.icon === 'Monitor' && <Monitor className="h-6 w-6 text-indigo-400" />}
                      {service.icon === 'Zap' && <Zap className="h-6 w-6 text-orange-400" />}
                      {service.icon === 'Workflow' && <Workflow className="h-6 w-6 text-pink-400" />}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {service.price ? `${getCurrencySymbol()}${convertPrice(service.price).toLocaleString()}` : 'Contact for Pricing'}
                      </div>
                      <div className="text-sm text-gray-400 capitalize">{service.type}</div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">{service.name}</h4>
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      {service.category}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGetQuote('service-' + service.id)
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Get Quote</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="text-center bg-gray-800 border border-gray-700 rounded-3xl p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-white mb-4" data-translate="Need a Custom Solution?">
              Need a Custom Solution?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto" data-translate="We're happy to discuss your specific requirements and create a tailored solution that fits your unique needs.">
              We're happy to discuss your specific requirements and create a tailored solution that fits your unique needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
                data-translate="Get Quote"
              >
                Get Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/portfolio"
                className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-700 transition-all duration-300 inline-flex items-center justify-center border-2 border-gray-600"
                data-translate="View Portfolio"
              >
                View Our Work
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
                </div>
              </div>
            </div>
      </section>

      {/* Quote Confirmation Modal */}
      {selectedPlan && (
        <QuoteConfirmationModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          onScheduleConsultation={handleScheduleConsultation}
          service={{
            name: selectedPlan.name,
            basePrice: selectedPlan.price,
            addOns: selectedPlan.addOns,
            totalPrice: selectedPlan.price // This will be recalculated in the modal
          }}
          additionalServices={additionalServices.map(service => ({
            ...service,
            price: service.price || 0
          }))}
          comboDeals={comboDeals.map(combo => ({
            ...combo,
            price: 0,
            savings: 0
          }))}
          currency={currency}
        />
      )}

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        onSuccess={handleConsultationSuccess}
        selectedService={selectedPlan ? {
          name: selectedPlan.name,
          price: selectedPlan.price,
          description: selectedPlan.description,
          tier: selectedPlan.tier
        } : null}
      />
    </>
  )
}