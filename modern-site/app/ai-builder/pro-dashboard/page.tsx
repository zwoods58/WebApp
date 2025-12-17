'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import { getFastAccount, isFastPro, clearFastAccountCache, hasFastFeatureAccess, type FastUserAccount } from '../../../src/lib/fast-auth'
import { 
  LayoutDashboard, Globe, ShoppingCart, BarChart3, Settings, 
  CreditCard, Calendar, Users, FileText, Download, ExternalLink,
  RefreshCw, Eye, TrendingUp, Zap, Shield, Database, Bell,
  HelpCircle, LogOut, Sparkles, CheckCircle2, AlertCircle,
  Star, Plus, ChevronRight, Grid3x3, List, Search, MoreVertical,
  Edit, Download as DownloadIcon, Trash2, Share2, Lock, X
} from 'lucide-react'

interface ProDashboardStats {
  totalProjects: number
  activeProjects: number
  totalVisits: number
  totalRevenue: number
  subscription: {
    status: string
    current_period_end: string
    monthly_price: string
    next_payment: string
  }
  usage: {
    projectsCreated: number
    storageUsed: number
    storageLimit: number
    apiCalls: number
  }
}

export default function ProDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [account, setAccount] = useState<FastUserAccount | null>(null)
  const [drafts, setDrafts] = useState<Array<{ id: string; business_name?: string; draft_url?: string; updated_at?: string; created_at?: string; status?: string }>>([])
  const [subscription, setSubscription] = useState<{ current_period_end?: string; payment_provider?: string; status?: string; monthly_price?: string } | null>(null)
  const [stats, setStats] = useState<ProDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'recent' | 'shared-files' | 'shared-projects' | 'billing' | 'settings'>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openProjectMenu, setOpenProjectMenu] = useState<string | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<Array<{ id: string; amount: number; status: string; created_at: string; type: string }>>([])
  const [cancelingSubscription, setCancelingSubscription] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [hasClientDashboard, setHasClientDashboard] = useState(true) // Pro users have all features
  const [hasDeployment, setHasDeployment] = useState(true) // Pro users have all features

  useEffect(() => {
    console.log('Pro Dashboard: Component mounted, loading data...')
    loadDashboardData()
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenProjectMenu(null)
    }
    if (openProjectMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [openProjectMenu])

  const loadDashboardData = async () => {
    try {
      console.log('⚡ Pro Dashboard: Starting data load...')
      console.time('⚡ Pro Dashboard: Total Load Time')
      setLoading(true)
      
      // Get current user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      console.log('⚡ Pro Dashboard: Auth user:', authUser ? 'Found' : 'Not found')
      if (authError || !authUser) {
        console.error('Auth error:', authError)
        router.replace('/ai-builder/login')
        setLoading(false)
        return
      }

      setUser(authUser as { email?: string })

      // FAST - Get account info (cached, <5ms)
      // Auto-creates account if it doesn't exist
      const userAccount = await getFastAccount()
      console.log('⚡ Pro Dashboard: Account loaded:', userAccount ? 'YES' : 'NO', userAccount?.account_tier)
      
      // If account is null, create a default account object to prevent errors
      // The account will be created automatically by getFastAccount() on next call
      if (!userAccount) {
        console.warn('⚠️ No user account found - using default account (will be created automatically)')
        // Create a temporary default account object
        const defaultAccount: FastUserAccount = {
          id: authUser.id,
          email: authUser.email || '',
          account_tier: 'default_draft',
          has_buyout: false,
          created_at: new Date().toISOString()
        }
        setAccount(defaultAccount)
        
        // Redirect to regular dashboard (not Pro)
        router.replace('/ai-builder/dashboard')
        setLoading(false)
        return
      }

      // FAST - Check if user is Pro (cached, <5ms)
      const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost'
      const isPro = await isFastPro()
      console.log('⚡ Pro Dashboard: isPro check:', isPro ? 'YES' : 'NO')
      
      if (!isPro) {
        if (!isDevelopment) {
          console.warn('User does not have Pro subscription, redirecting to regular dashboard')
          router.replace('/ai-builder/dashboard')
          setLoading(false)
          return
        }
        console.warn('Pro dashboard accessed without Pro subscription (development mode)')
      }

      setAccount(userAccount)

      // Get subscription details
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('status', 'active')
        .maybeSingle()

      if (subError && subError.code !== 'PGRST116') {
        console.warn('Subscription fetch error (non-critical):', subError)
      }
      
      setSubscription(subData || null)

      // Get all projects
      const { data: draftsData } = await supabase
        .from('draft_projects')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      setDrafts(draftsData || [])

      // Get payment history
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('id, amount, status, created_at, payment_type')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setPaymentHistory(paymentsData?.map(p => ({
        id: p.id,
        amount: p.amount || 0,
        status: p.status || 'pending',
        created_at: p.created_at,
        type: p.payment_type || 'subscription'
      })) || [])

      // Calculate stats
      const totalProjects = draftsData?.length || 0
      const activeProjects = draftsData?.filter(d => d.status === 'generated').length || 0

      setStats({
        totalProjects,
        activeProjects,
        totalVisits: 0,
        totalRevenue: 0,
        subscription: {
          status: subData?.status || 'active',
          current_period_end: subData?.current_period_end || '',
          monthly_price: subData?.monthly_price || '20.00',
          next_payment: subData?.current_period_end || ''
        },
        usage: {
          projectsCreated: totalProjects,
          storageUsed: 0,
          storageLimit: 10000,
          apiCalls: 0
        }
      })
      
      console.log('⚡ Pro Dashboard: Data loaded successfully')
      console.timeEnd('⚡ Pro Dashboard: Total Load Time')
      setLoading(false)
      setError(null)
    } catch (error: unknown) {
      console.error('Error loading Pro dashboard:', error)
      console.timeEnd('⚡ Pro Dashboard: Total Load Time')
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearFastAccountCache() // Clear cache on logout
    router.push('/ai-builder/login')
  }

  const handleCancelSubscription = async () => {
    setCancelingSubscription(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Please log in to continue')
        return
      }

      const response = await fetch('/api/ai-builder/payments/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        alert('Subscription canceled successfully. You will retain access until ' + new Date(data.accessUntil).toLocaleDateString())
        setShowCancelConfirm(false)
        loadDashboardData() // Reload to update status
      } else {
        alert(data.error || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setCancelingSubscription(false)
    }
  }

  const getDaysAgo = (date: string | undefined) => {
    if (!date) return 'Unknown'
    const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  const isInvoicePastDue = () => {
    if (!subscription?.current_period_end) return false
    return new Date(subscription.current_period_end) < new Date()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Pro Dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              loadDashboardData()
            }}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#2a2a2a] border-r border-[#3a3a3a] transition-all duration-300 flex flex-col`}>
        {/* AtarWebb Branding Section */}
        <div className="p-4 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-3">
            <img 
              src="/favicom.png" 
              alt="AtarWebb Logo" 
              className="w-10 h-10 object-contain"
              style={{ filter: 'brightness(0) invert(1)' } as React.CSSProperties}
            />
            {sidebarOpen && (
              <div>
                <span className="text-lg font-bold text-white">AtarWebb</span>
                <p className="text-xs text-gray-400">Pro Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              <div 
                onClick={() => setActiveTab('recent')}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                  activeTab === 'recent' ? 'bg-[#3a3a3a]' : 'hover:bg-[#3a3a3a]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Dashboard</span>
              </div>
              <div 
                onClick={() => router.push('/ai-builder')}
                className="flex items-center gap-2 p-2 hover:bg-[#3a3a3a] rounded-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">New Project</span>
              </div>
              {hasClientDashboard && (
                <div 
                  onClick={() => router.push('/client-dashboard')}
                  className="flex items-center gap-2 p-2 hover:bg-[#3a3a3a] rounded-lg cursor-pointer"
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Client Dashboard</span>
                </div>
              )}
              {hasDeployment && (
                <div 
                  onClick={() => router.push('/deployment')}
                  className="flex items-center gap-2 p-2 hover:bg-[#3a3a3a] rounded-lg cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">Deployment</span>
                </div>
              )}
              <div 
                onClick={() => {
                  setActiveTab('billing')
                  // Hide header tabs when on billing
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                  activeTab === 'billing' ? 'bg-[#3a3a3a]' : 'hover:bg-[#3a3a3a]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Billing</span>
              </div>
              <div 
                onClick={() => {
                  setActiveTab('settings')
                  // Hide header tabs when on settings
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                  activeTab === 'settings' ? 'bg-[#3a3a3a]' : 'hover:bg-[#3a3a3a]'
                }`}
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Settings</span>
              </div>
              <div 
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 hover:bg-[#3a3a3a] rounded-lg cursor-pointer mt-4"
              >
                <LogOut className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Log out</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#1a1a1a] border-b border-[#3a3a3a] px-6 py-4">
          {/* Subscription Status Badge */}
          {account && (
            <div className="mb-4 flex items-center justify-end">
              {account.subscription_status === 'active' && account.subscription_ends_at && (
                (() => {
                  const daysUntilExpiry = Math.ceil((new Date(account.subscription_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
                    return (
                      <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400 font-medium">
                          Subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )
                  } else if (daysUntilExpiry <= 0) {
                    return (
                      <div className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-red-400 font-medium">
                          Subscription expired
                        </span>
                      </div>
                    )
                  }
                  return (
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 font-medium">
                        Pro Active
                      </span>
                    </div>
                  )
                })()
              )}
            </div>
          )}
          {(activeTab === 'recent' || activeTab === 'shared-files' || activeTab === 'shared-projects') && (
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-white">Recents</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#3a3a3a]' : 'hover:bg-[#2a2a2a]'}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#3a3a3a]' : 'hover:bg-[#2a2a2a]'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <select className="bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm rounded px-3 py-1">
                  <option>All organizations</option>
                </select>
                <select className="bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm rounded px-3 py-1">
                  <option>All files</option>
                </select>
                <select className="bg-[#2a2a2a] border border-[#3a3a3a] text-white text-sm rounded px-3 py-1">
                  <option>Last viewed</option>
                </select>
              </div>
            </div>
          )}

          {/* Tabs - Only show when not on billing/settings */}
          {(activeTab === 'recent' || activeTab === 'shared-files' || activeTab === 'shared-projects') && (
            <div className="flex items-center gap-6 border-b border-[#3a3a3a]">
              {[
                { id: 'recent', label: 'Recently viewed' },
                { id: 'shared-files', label: 'Shared files' },
                { id: 'shared-projects', label: 'Shared projects' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-white text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          
          {/* Billing/Settings Header */}
          {(activeTab === 'billing' || activeTab === 'settings') && (
            <div className="flex items-center gap-6 border-b border-[#3a3a3a]">
              <h2 className="text-xl font-semibold text-white pb-3">
                {activeTab === 'billing' ? 'Billing & Subscription' : 'Settings'}
              </h2>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div 
          className="flex-1 overflow-y-auto p-6 bg-[#1a1a1a]" 
          onClick={() => setOpenProjectMenu(null)}
        >
          {/* Billing Tab Content */}
          {activeTab === 'billing' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Billing Alert */}
              {isInvoicePastDue() && (
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-l-4 border-yellow-500 rounded-lg p-6 flex items-start gap-4 shadow-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-yellow-400 mb-2 text-lg">Payment Required</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Your invoice is past due. Please update your payment method to continue using Pro features.
                    </p>
                    <button className="px-6 py-2.5 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-semibold transition-colors">
                      Pay Invoice Now
                    </button>
                  </div>
                </div>
              )}

              {/* Current Plan Card */}
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-xl p-8 border border-[#3a3a3a] shadow-xl">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">AtarWebb Pro</h3>
                        <p className="text-sm text-gray-400">Premium Website Builder</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full font-semibold border border-green-500/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Active
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-[#1a1a1a]/50 rounded-lg p-5 border border-[#3a3a3a]/50">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Monthly Price</p>
                    <p className="text-3xl font-bold text-white">${stats?.subscription.monthly_price || '20.00'}</p>
                    <p className="text-xs text-gray-500 mt-1">per month</p>
                  </div>
                  <div className="bg-[#1a1a1a]/50 rounded-lg p-5 border border-[#3a3a3a]/50">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Next Billing</p>
                    <p className="text-2xl font-bold text-white">
                      {subscription?.current_period_end 
                        ? new Date(subscription.current_period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Auto-renewal enabled</p>
                  </div>
                  <div className="bg-[#1a1a1a]/50 rounded-lg p-5 border border-[#3a3a3a]/50">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Payment Method</p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <p className="text-lg font-semibold text-white">
                        {subscription?.payment_provider || 'Credit Card'} •••• 4242
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Expires 12/25</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#3a3a3a]">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 font-semibold transition-all shadow-lg hover:shadow-xl">
                    Update Payment Method
                  </button>
                  <button className="px-6 py-3 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] font-semibold transition-colors border border-[#4a4a4a]">
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Invoice
                  </button>
                  {account?.subscription_status === 'active' && (
                    <button 
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-6 py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 font-semibold transition-colors border border-red-500/30"
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-xl p-8 border border-[#3a3a3a] shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Payment History</h3>
                  <button className="text-sm text-teal-400 hover:text-teal-300 font-medium">View All</button>
                </div>
                <div className="space-y-3">
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((payment) => (
                      <div key={payment.id} className="bg-[#1a1a1a]/50 rounded-lg p-4 border border-[#3a3a3a]/50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            payment.status === 'completed' ? 'bg-green-500/20' : 
                            payment.status === 'failed' ? 'bg-red-500/20' : 
                            'bg-yellow-500/20'
                          }`}>
                            {payment.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : payment.status === 'failed' ? (
                              <X className="w-5 h-5 text-red-400" />
                            ) : (
                              <RefreshCw className="w-5 h-5 text-yellow-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {payment.type === 'subscription' ? 'Pro Subscription' : 
                               payment.type === 'buyout' ? 'Code Buyout' : 
                               'Payment'}
                            </p>
                            <p className="text-sm text-gray-400">
                              ${payment.amount.toFixed(2)} • {new Date(payment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">${payment.amount.toFixed(2)}</p>
                          <p className={`text-xs ${
                            payment.status === 'completed' ? 'text-green-400' : 
                            payment.status === 'failed' ? 'text-red-400' : 
                            'text-yellow-400'
                          }`}>
                            {payment.status === 'completed' ? 'Paid' : 
                             payment.status === 'failed' ? 'Failed' : 
                             'Pending'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">No payment history found</p>
                  )}
                </div>
              </div>

              {/* Cancel Subscription Confirmation Modal */}
              {showCancelConfirm && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCancelConfirm(false)}>
                  <div 
                    className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Cancel Subscription</h3>
                    <p className="text-gray-300 mb-6">
                      Are you sure you want to cancel your Pro subscription? You will retain access until your current billing period ends ({subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'end of period'}), after which you'll be downgraded to the Free plan.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancelSubscription}
                        disabled={cancelingSubscription}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors disabled:opacity-50"
                      >
                        {cancelingSubscription ? 'Canceling...' : 'Yes, Cancel Subscription'}
                      </button>
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="flex-1 px-6 py-3 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] font-semibold transition-colors"
                      >
                        Keep Subscription
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab Content */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Account Information */}
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-xl p-8 border border-[#3a3a3a] shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Account Information</h3>
                    <p className="text-sm text-gray-400">Update your personal details</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-white rounded-lg cursor-not-allowed opacity-60"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Lock className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={account?.full_name || ''}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={account?.phone || ''}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-[#3a3a3a]">
                    <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 font-semibold transition-all shadow-lg hover:shadow-xl">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] rounded-xl p-8 border border-[#3a3a3a] shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
                    <p className="text-sm text-gray-400">Control how you receive updates</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications', description: 'Receive updates via email', default: true },
                    { label: 'Billing reminders', description: 'Get notified about upcoming payments', default: true },
                    { label: 'Project updates', description: 'Updates on your website projects', default: true },
                    { label: 'Security alerts', description: 'Important security notifications', default: true }
                  ].map((notif, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#1a1a1a]/50 rounded-lg border border-[#3a3a3a]/50">
                      <div>
                        <p className="font-semibold text-white">{notif.label}</p>
                        <p className="text-sm text-gray-400">{notif.description}</p>
                      </div>
                      <button className={`relative w-14 h-7 rounded-full transition-all ${notif.default ? 'bg-teal-600' : 'bg-[#3a3a3a]'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-lg ${notif.default ? 'translate-x-7' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#3a3a3a]">
                <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#3a3a3a] rounded-lg">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-300">Help Center</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#3a3a3a] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-300">Contact Support</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Projects View (Recent/Shared Files/Shared Projects) */}
          {(activeTab === 'recent' || activeTab === 'shared-files' || activeTab === 'shared-projects') && (
            <>
              {/* Billing Alert */}
              {isInvoicePastDue() && (
                <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-500 mb-1">Your invoice is past due</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Please pay your invoice before your team is locked and your subscription is downgraded.
                    </p>
                    <button 
                      onClick={() => setActiveTab('billing')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      Pay invoice
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Grid */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-4">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      onClick={() => router.push(`/ai-builder/editor/${draft.id}`)}
                      className="group bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition-colors cursor-pointer"
                    >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-teal-600/20 to-blue-600/20 relative overflow-hidden">
                    {draft.draft_url ? (
                      <iframe
                        src={draft.draft_url}
                        className="w-full h-full scale-50 origin-top-left pointer-events-none"
                        style={{ width: '200%', height: '200%' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {draft.business_name}
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenProjectMenu(openProjectMenu === draft.id ? null : draft.id)
                          }}
                          className="p-2 bg-black/50 rounded-lg hover:bg-black/70"
                        >
                          <MoreVertical className="w-4 h-4 text-white" />
                        </button>
                        {openProjectMenu === draft.id && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg z-50">
                            <div className="py-1">
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                                    try {
                                      const { error } = await supabase
                                        .from('draft_projects')
                                        .delete()
                                        .eq('id', draft.id)
                                      
                                      if (error) throw error
                                      
                                      // Remove from local state
                                      setDrafts(drafts.filter(d => d.id !== draft.id))
                                    } catch (error) {
                                      console.error('Error deleting project:', error)
                                      alert('Failed to delete project. Please try again.')
                                    }
                                  }
                                  setOpenProjectMenu(null)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-white mb-1 line-clamp-1">
                      {draft.business_name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Edited {getDaysAgo(draft.updated_at || draft.created_at)}
                    </p>
                  </div>
                    </div>
                  ))}

                  {/* Add New Project Card */}
                  <div
                    onClick={() => router.push('/ai-builder')}
                    className="bg-[#2a2a2a] rounded-lg border-2 border-dashed border-[#3a3a3a] hover:border-teal-500/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-8 min-h-[200px]"
                  >
                    <div className="w-12 h-12 bg-[#3a3a3a] rounded-lg flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">Create new project</p>
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="space-y-2">
                  {drafts.map((draft) => (
                    <div
                      key={draft.id}
                      onClick={() => router.push(`/ai-builder/editor/${draft.id}`)}
                      className="bg-[#2a2a2a] rounded-lg p-4 hover:bg-[#3a3a3a] transition-colors cursor-pointer flex items-center gap-4"
                    >
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-600/20 to-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white mb-1">{draft.business_name}</h3>
                    <p className="text-xs text-gray-400">
                      Edited {getDaysAgo(draft.updated_at || draft.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {draft.draft_url && (
                      <a
                        href={draft.draft_url}
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-[#3a3a3a] rounded-lg"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/ai-builder?regenerate=${draft.id}`)
                      }}
                      className="p-2 hover:bg-[#3a3a3a] rounded-lg"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenProjectMenu(openProjectMenu === draft.id ? null : draft.id)
                        }}
                        className="p-2 hover:bg-[#3a3a3a] rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {openProjectMenu === draft.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg shadow-lg z-50">
                          <div className="py-1">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation()
                                if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                                  try {
                                    const { error } = await supabase
                                      .from('draft_projects')
                                      .delete()
                                      .eq('id', draft.id)
                                    
                                    if (error) throw error
                                    
                                    // Remove from local state
                                    setDrafts(drafts.filter(d => d.id !== draft.id))
                                  } catch (error) {
                                    console.error('Error deleting project:', error)
                                    alert('Failed to delete project. Please try again.')
                                  }
                                }
                                setOpenProjectMenu(null)
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {drafts.length === 0 && activeTab === 'recent' && (
            <div className="text-center py-16">
              <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No projects yet</p>
              <button
                onClick={() => router.push('/ai-builder')}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                Create Your First Project
              </button>
            </div>
          )}

          {/* Billing Tab Content */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Billing & Subscription</h2>
                <p className="text-gray-400">Manage your subscription and payment methods</p>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#3a3a3a]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Current Plan</h3>
                    <p className="text-sm text-gray-400">AtarWebb Pro Subscription</p>
                  </div>
                  <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-medium border border-green-500/30">
                    Active
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                    <div>
                      <p className="text-sm text-gray-400">Monthly Price</p>
                      <p className="text-2xl font-bold text-white">${stats?.subscription.monthly_price || '20.00'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                    <div>
                      <p className="text-sm text-gray-400">Next Billing Date</p>
                      <p className="text-lg font-semibold text-white">
                        {subscription?.current_period_end 
                          ? new Date(subscription.current_period_end).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
                  Manage Billing
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab Content */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
                <p className="text-gray-400">Manage your account preferences</p>
              </div>

              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#3a3a3a]">
                <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={account?.full_name || ''}
                      className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#3a3a3a] text-white rounded-lg"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
