'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '../../src/components/sections/PageHeader'
import { HeroGeometric } from '../../src/components/ui/shape-landing-hero'
import { CTAWithFooter } from '../../src/components/sections/CTAWithFooter'
import { Sparkles, Zap, Shield, CreditCard, CheckCircle2, ArrowRight, Store, Rocket, Briefcase, Database, Code2, Smartphone, DollarSign, FileCheck, Wifi, MessageCircle, X, Mail, Lock } from 'lucide-react'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'next/navigation'

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
  const [userPrompt, setUserPrompt] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
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

  // Animated placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % promptPlaceholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        if (showAuthModal) {
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

  const handleGenerate = async () => {
    if (!userPrompt.trim()) {
      alert('Please describe what you want to build')
      return
    }

    if (!user) {
      localStorage.setItem('ai_builder_prompt', userPrompt)
      setShowAuthModal(true)
      return
    }

    setIsGenerating(true)

    try {
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

      // Store the prompt in metadata
      await supabase
        .from('draft_projects')
        .update({
          metadata: {
            user_prompt: userPrompt
          }
        })
        .eq('id', draftId)

      router.push(`/ai-builder/building/${draftId}`)
      setIsGenerating(false)
    } catch (error) {
      console.error('Error generating draft:', error)
      alert('Failed to generate draft. Please try again.')
      setIsGenerating(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
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
  }

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

                <button
                  onClick={handleGenerate}
                  disabled={!userPrompt.trim() || isGenerating}
                  className="w-full mt-6 py-5 px-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-2xl hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      START BUILD
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

        {/* Rest of the page content (pricing, features, etc.) */}
        {/* ... Keep existing sections ... */}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {authMode === 'login' ? 'Login' : 'Sign Up'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
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
                {isAuthenticating ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign Up'}
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

      <CTAWithFooter />
    </div>
  )
}


