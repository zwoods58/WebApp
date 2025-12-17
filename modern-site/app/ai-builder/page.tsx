'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '../../src/components/sections/PageHeader'
import { HeroGeometric } from '../../src/components/ui/shape-landing-hero'
import { CTAWithFooter } from '../../src/components/sections/CTAWithFooter'
import { Sparkles, Zap, Shield, CreditCard, CheckCircle2, ArrowRight, Store, Rocket, Briefcase, Database, Code2, Smartphone, DollarSign, FileCheck, Wifi, MessageCircle, ChevronRight, ChevronLeft, X, Mail, Lock, Upload, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'next/navigation'
import { getFastUser } from '../../src/lib/fast-auth'

const promptPlaceholders = [
  'Create a website for a coffee shop in Nairobi...',
  'Build an e-commerce store for handmade jewelry...',
  'Design a portfolio site for a photographer...',
  'Create a landing page for a SaaS product...',
  'Build a website for a real estate agency...',
  'Design a blog for a food blogger...',
  'Create a business website for a consulting firm...',
  'Build an online store for fashion clothing...',
]

export default function AIBuilderPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [pricingView, setPricingView] = useState<'monthly' | 'buyout'>('monthly')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authFullName, setAuthFullName] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState('')

  // Prompt-based input
  const [userPrompt, setUserPrompt] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  
  // Image upload
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Animated placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % promptPlaceholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploadedImage(file)
    
    // Create local preview URL
    const previewUrl = URL.createObjectURL(file)
    setUploadedImageUrl(previewUrl)
  }

  const removeImage = () => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl)
    }
    setUploadedImage(null)
    setUploadedImageUrl('')
  }

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      alert('Please describe what you want to build')
      return
    }

    if (!user) {
      localStorage.setItem('ai_builder_prompt', userPrompt)
      if (uploadedImage) {
        // Store image in session storage temporarily (small images only)
        const reader = new FileReader()
        reader.onload = (e) => {
          localStorage.setItem('ai_builder_image_preview', e.target?.result as string)
        }
        reader.readAsDataURL(uploadedImage)
      }
      setShowAuthModal(true)
      return
    }

    setIsGenerating(true)

    try {
      let finalImageUrl = ''
      
      // Upload image to Supabase Storage if provided
      if (uploadedImage) {
        setIsUploadingImage(true)
        const fileExt = uploadedImage.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user-uploads')
          .upload(fileName, uploadedImage, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          console.error('Image upload error:', uploadError)
          alert('Failed to upload image. Continuing without image.')
        } else {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('user-uploads')
            .getPublicUrl(uploadData.path)
          
          finalImageUrl = publicUrl
        }
        setIsUploadingImage(false)
      }

      const { createDraftProject } = await import('../../src/lib/account-tiers')
      
      // Create draft project with prompt stored in metadata
      const draftId = await createDraftProject({
        businessName: 'Generated from Prompt', // Will be extracted by AI
        businessLocation: 'kenya', // Default, can be extracted from prompt
        businessDescription: userPrompt,
        email: user.email || '',
        phoneNumber: '', // Can be extracted from prompt
        businessType: 'other', // Will be inferred from prompt
        idealCustomer: '',
        keyDifferentiator: '',
        targetKeywords: '',
        toneOfVoice: '',
        preferredColors: '',
        aestheticStyle: '',
        existingLinks: '',
        logoUrl: null,
        facebookLink: '',
        instagramLink: '',
        twitterLink: '',
        linkedinLink: '',
        needsEcommerce: userPrompt.toLowerCase().includes('store') || userPrompt.toLowerCase().includes('ecommerce') || userPrompt.toLowerCase().includes('shop'),
        needsCRM: false,
        conversionGoal: ''
      })

      if (!draftId) {
        throw new Error('Failed to create draft project')
      }

      // Store the prompt and image URL in metadata
      await supabase
        .from('draft_projects')
        .update({
          metadata: {
            user_prompt: userPrompt,
            uploaded_image_url: finalImageUrl || null
          }
        })
        .eq('id', draftId)

      // Redirect to editor page (bolt.new style)
      router.push(`/ai-builder/editor/${draftId}`)
      setIsGenerating(false)
    } catch (error) {
      console.error('Error generating draft:', error)
      alert('Failed to generate draft. Please try again.')
      setIsGenerating(false)
    }
  }

  // Check authentication status (FAST - non-blocking)
  useEffect(() => {
    // Set loading to false immediately so page renders
    setLoading(false)
    
    // Check auth in background (non-blocking)
    const checkAuth = async () => {
      try {
        // FAST - Use cached auth check (<5ms)
        const fastUser = await getFastUser()
        setUser(fastUser)
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      }
    }

    // Run auth check in background (non-blocking)
    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Only set user if we have an active session
      if (session?.user) {
        setUser(session.user)
        
        if (showAuthModal) {
          // Close modal when user successfully authenticates
          setShowAuthModal(false)
          setAuthError('')
          setAuthEmail('')
          setAuthPassword('')
          setAuthFullName('')
        }
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const africanBusinessFeatures = [
    {
      icon: CreditCard,
      title: 'Mobile Money & Cards',
      subtitle: 'Pay How You Want, Not How They Want',
      description: 'We are integrated with Flutterwave and support local payments: M-Pesa, MTN MoMo, ZAR EFT, and all major cards.',
      trustSignal: 'The presence of familiar logos (M-Pesa, Flutterwave) is the single most powerful trust signal for financial transactions.',
    },
    {
      icon: DollarSign,
      title: 'No USD Exchange Shock',
      subtitle: 'Transparent Local Pricing',
      description: 'All our prices are displayed and processed in KES, ZAR, and RWF. You never pay hidden currency conversion fees or deal with fluctuating USD rates.',
      trustSignal: 'Solves a major local pain point (exchange rate fluctuation and hidden bank fees).',
    },
    {
      icon: FileCheck,
      title: 'VAT/Tax Ready',
      subtitle: 'Built for Compliance',
      description: 'Your payments are processed with the necessary KRA SEP Tax and SARS VAT structures in mind, keeping your business compliant from day one.',
      trustSignal: 'Addresses the complexity of the African regulatory environment, which builds enormous trust with serious business owners.',
    },
    {
      icon: Smartphone,
      title: 'Lightning-Fast on Mobile',
      subtitle: 'Optimized for 2G/3G Networks',
      description: 'Your site is built using Vercel—the global standard for speed. This guarantees quick loading on mobile, reducing customer drop-off.',
      trustSignal: 'Directly addresses the reality of variable mobile network quality outside major metros.',
    },
    {
      icon: Wifi,
      title: 'Low Data Consumption',
      subtitle: 'Lightweight Code',
      description: 'The AI-generated code is clean, efficient, and uses minimal data, ensuring your customers can browse without worrying about high data costs.',
      trustSignal: 'Shows empathy for the customer\'s customer (data costs are a major concern).',
    },
    {
      icon: MessageCircle,
      title: 'Accessible Support',
      subtitle: 'Local, Responsive Help',
      description: 'Get support via WhatsApp and local phone lines during business hours.',
      trustSignal: 'Provides an accessible, non-email-based channel for help, which is critical for local SMEs.',
    },
  ]

  const outcomes = [
    {
      title: 'Speed',
      subtitle: 'Lightning Fast Global Hosting',
      description: 'Your website is deployed on Vercel\'s Edge Network—the same technology used by global tech giants. This guarantees superior load times, critical for mobile users across Africa.',
      icon: Rocket,
    },
    {
      title: 'Reliability',
      subtitle: 'Client-Owned Database',
      description: 'We use Supabase to power your e-commerce and inventory. This stack is designed for scale and is fully managed by you, ensuring your customer data is always secure and solely yours.',
      icon: Database,
    },
    {
      title: 'Future-Proof Code',
      subtitle: 'Clean, Modern Code',
      description: 'The AI system generates only production-ready Next.js/React code. This means your site is built on the world\'s most popular framework, making it easy to upgrade or transfer to any developer, anytime.',
      icon: Code2,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-black relative overflow-hidden" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
      {/* Background Component */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-50">
        <HeroGeometric />
      </div>
      
      <PageHeader />
      
      <div className="pt-32 sm:pt-40 relative z-10">
        {/* Hero Section - Bolt.new Style */}
        <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold italic mb-6 leading-tight text-gray-900" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              Launch a full business in days, not months
            </h1>
            <p className="text-xl sm:text-2xl italic text-gray-600 mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              Create Something Great With Technology
            </p>
          </div>

          {/* Prompt Input */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Describe what you want to build</h3>
                  <p className="text-gray-600">Tell us about your business, industry, and what you need. The more details, the better!</p>
                </div>

                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder={promptPlaceholders[placeholderIndex]}
                  rows={6}
                  className="w-full px-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 text-lg resize-none"
                  style={{ fontFamily: 'Encode Sans, sans-serif' }}
                />

                {/* Image Upload Section */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Add an image (optional)</span>
                    <span className="text-xs text-gray-500">Logo, hero image, or product photo</span>
                  </div>

                  {!uploadedImage ? (
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-xl px-6 py-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="text-teal-600 font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                      </div>
                    </label>
                  ) : (
                    <div className="border-2 border-teal-500 rounded-xl p-4 bg-teal-50/30 relative">
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-start gap-4">
                        <img
                          src={uploadedImageUrl}
                          alt="Preview"
                          className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-sm"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 mb-1">{uploadedImage.name}</p>
                          <p className="text-xs text-gray-600 mb-2">
                            {(uploadedImage.size / 1024).toFixed(1)} KB
                          </p>
                          <div className="flex items-center gap-2 text-xs text-teal-700 bg-white px-3 py-1.5 rounded-lg inline-block">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            AI will analyze this image
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!userPrompt.trim() || isGenerating || isUploadingImage}
                  className="w-full mt-6 py-5 px-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-2xl hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                >
                  {isUploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading image...
                    </>
                  ) : isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      START BUILD {uploadedImage && '✨'}
                      <Zap className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Examples: "Coffee shop in Nairobi with online ordering", "E-commerce store for handmade jewelry", "Portfolio site for photographer"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing - Simple & Transparent */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            
            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <button
                onClick={() => setPricingView('monthly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  pricingView === 'monthly'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Monthly Plans
              </button>
              <button
                onClick={() => setPricingView('buyout')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  pricingView === 'buyout'
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                One-Time Buyout
              </button>
            </div>

            {pricingView === 'monthly' ? (
              <>
                <p className="text-xl text-gray-600 mb-12">
                  Monthly recurring plan with managed services and support.
                </p>
                
                <div className="max-w-2xl mx-auto">
                  {/* Pro Plan */}
                  <div className="bg-white border-2 border-teal-500 rounded-2xl p-8 relative hover:shadow-lg shadow-sm">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        MOST POPULAR
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">🚀 Pro Plan</h3>
                    <p className="text-gray-500 mb-6">Monthly Subscription</p>
                    <div className="text-5xl font-bold mb-2 text-gray-900">$20.00</div>
                    <p className="text-sm text-gray-500 mb-6">/ Month (Local Price)</p>
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                      <p className="text-teal-700 font-semibold text-sm">
                        Ideal for businesses focused on growth, e-commerce, and high-value customer management.
                      </p>
                    </div>
                    <ul className="space-y-3 mb-8 text-left">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Dynamic (E-commerce/SaaS) website</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Full Supabase integration</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Client dashboard (Full Admin Access)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">E-commerce: Unlimited products</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">0% platform transaction fees</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Automated daily database backups</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Free access to new AI feature components</span>
                      </li>
                    </ul>
                    <button className="w-full py-4 px-6 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all">
                      Sign Up
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl text-gray-600 mb-12">
                  One-time buyout. Own your code forever. No recurring fees.
                </p>
                
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white border-2 border-teal-500 rounded-2xl p-8 relative hover:shadow-lg shadow-sm">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        💎 UNIFIED BUYOUT
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">Unified Buyout</h3>
                    <p className="text-gray-500 mb-6">One-Time Payment</p>
                    <div className="text-5xl font-bold mb-2 text-gray-900">$150</div>
                    <p className="text-sm text-gray-500 mb-6">(or KES/ZAR equivalent)</p>
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                      <p className="text-teal-700 font-semibold text-sm">
                        Ideal for customers who want a great design and complete code ownership without any recurring fees.
                      </p>
                    </div>
                    <ul className="space-y-3 mb-8 text-left">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Static (Code Folders & Docs Only)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">AI-generated website design</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Mobile & desktop responsive</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Complete code ownership</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">No recurring fees ever</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Full source code & documentation</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Build your own backend (customer managed)</span>
                      </li>
                    </ul>
                    <button className="w-full py-4 px-6 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all">
                      Sign Up
                    </button>
                  </div>
                </div>
              </>
            )}

            <p className="text-gray-500 mt-8 text-sm">
              Pay with M-Pesa, MTN MoMo, ZAR EFT, or cards • No hidden fees
            </p>
          </div>
        </section>

        {/* Outcomes Section - Unique Grid Design */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-900">
              Built for Performance & Scale
            </h2>
            <p className="text-center text-xl text-gray-600 mb-12 italic" style={{ fontFamily: 'Encode Sans, sans-serif' }}>
              From Prompt To Production Atar Handles The Hard Work
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {outcomes.map((outcome, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                      <outcome.icon className="w-8 h-8 text-teal-600" />
                    </div>
                    <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full mb-3">
                      {outcome.subtitle}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{outcome.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{outcome.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Built for African Businesses - Unique Grid Design */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">
              Built for African Businesses
            </h2>
            
            {/* Unique Asymmetric Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {africanBusinessFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white border-2 border-teal-500 rounded-3xl p-6 lg:p-8 hover:shadow-xl transition-all relative overflow-hidden group ${
                    index === 0 ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-teal-600 to-teal-700 text-white' : ''
                  }`}
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500 ${
                    index === 0 ? 'bg-white/10' : 'bg-teal-500/10'
                  }`}></div>
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                      index === 0 ? 'bg-white/20 backdrop-blur-sm border border-white/30' : 'bg-teal-100'
                    }`}>
                      <feature.icon className={`w-8 h-8 ${index === 0 ? 'text-white' : 'text-teal-600'}`} />
                    </div>
                    <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${
                      index === 0 ? 'bg-white/20 backdrop-blur-sm text-white border border-white/30' : 'bg-teal-50 text-teal-700'
                    }`}>
                      {feature.subtitle}
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${index === 0 ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                    <p className={`leading-relaxed mb-4 text-sm ${index === 0 ? 'text-white/90' : 'text-gray-600'}`}>{feature.description}</p>
                    <div className={`border rounded-lg p-3 ${
                      index === 0 ? 'bg-white/10 backdrop-blur-sm border-white/20' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`text-xs italic ${index === 0 ? 'text-white/80' : 'text-gray-600'}`}>{feature.trustSignal}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">
              Ready to launch your business?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join businesses across Africa building their online presence with AI
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-6 bg-teal-600 text-white text-xl font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-2xl hover:shadow-teal-500/50 transform hover:scale-105"
            >
              Start Building Now
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </section>
      </div>

      <CTAWithFooter />

      {/* Authentication Modal - Login/Signup Toggle */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            <button
              onClick={() => {
                setShowAuthModal(false)
                setAuthError('')
                setAuthEmail('')
                setAuthPassword('')
                setAuthFullName('')
                setAuthMode('login')
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </h2>
              <p className="text-gray-600">
                {authMode === 'login' ? 'Welcome back!' : 'Create your account to get started'}
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              setIsAuthenticating(true)
              setAuthError('')

              try {
                if (authMode === 'signup') {
                  const { data, error } = await supabase.auth.signUp({
                    email: authEmail,
                    password: authPassword,
                    options: {
                      data: {
                        full_name: authFullName
                      }
                    }
                  })

                  if (error) throw error

                  if (!data.session) {
                    setAuthError('Please check your email to confirm your account')
                    setIsAuthenticating(false)
                    return
                  }
                } else {
                  const { error } = await supabase.auth.signInWithPassword({
                    email: authEmail,
                    password: authPassword,
                  })

                  if (error) throw error
                }

                // Restore prompt after auth
                const savedPrompt = localStorage.getItem('ai_builder_prompt')
                if (savedPrompt) {
                  setUserPrompt(savedPrompt)
                  localStorage.removeItem('ai_builder_prompt')
                }

                setShowAuthModal(false)
              } catch (error: any) {
                setAuthError(error.message || 'Authentication failed')
              } finally {
                setIsAuthenticating(false)
              }
            }} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                />
              </div>

              {authError && (
                <div className="text-red-600 text-sm">{authError}</div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                    <span>{authMode === 'login' ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In' : 'Sign Up'}</span>
                    <ArrowRight className="w-5 h-5 inline-block ml-2" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login')
                  setAuthError('')
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
