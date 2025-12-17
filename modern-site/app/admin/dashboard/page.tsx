'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../src/lib/supabase'
import { 
  Users, DollarSign, CreditCard, MapPin, 
  Building2, Globe, LogOut, RefreshCw,
  ShoppingCart, UserCheck, AlertCircle, TrendingUp,
  BarChart3, Search,
  TrendingDown, Bell, Activity, Award
} from 'lucide-react'
import { RevenueTrendChart, UserGrowthChart, SubscriptionStatusChart } from './components/Charts'
import { ExportButton } from './components/ExportButton'

interface DashboardStats {
  totalUsers: number
  totalSubscriptions: number
  totalSales: number
  totalBuyouts: number
  activeSubscriptions: number
  revenue: number
  usersByCountry: Array<{ country: string; count: number; revenue: number }>
  usersByCity: Array<{ city: string; count: number; revenue: number }>
  usersByIndustry: Array<{ industry: string; count: number; revenue: number }>
  recentPayments: Array<Record<string, unknown>>
  recentUsers: Array<Record<string, unknown>>
  subscriptions: Array<Record<string, unknown>>
  buyouts: Array<Record<string, unknown>>
  // New metrics
  revenueTrend: Array<{ date: string; revenue: number }>
  userGrowth: Array<{ date: string; users: number }>
  subscriptionStatusBreakdown: Array<{ name: string; value: number }>
  conversionRate: number
  churnRate: number
  arpu: number
  ltv: number
  mrr: number
  newUsersThisMonth: number
  revenueThisMonth: number
  revenueLastMonth: number
  revenueGrowth: number
  userGrowthRate: number
  totalProjects: number
  avgProjectsPerUser: number
  paymentSuccessRate: number
  subscriptionRenewalRate: number
  topCustomers: Array<{ email: string; revenue: number; name: string }>
  activityFeed: Array<{ type: string; message: string; date: string; icon: string }>
  // Revenue breakdown
  revenueBySource: Array<{ source: string; amount: number; count: number }>
  revenueByPaymentType: Array<{ type: string; amount: number; count: number }>
  revenueByPeriod: Array<{ period: string; revenue: number; payments: number }>
  revenueVerification: {
    totalFromPayments: number
    totalFromBuyouts: number
    totalCalculated: number
    discrepancy: number
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [user, setUser] = useState<any>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Date range filtering
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    console.log('Dashboard: Initializing...')
    const startTime = Date.now()
    
    // Show UI immediately - don't wait for auth check
    setLoading(false)
    
    // Check auth in background (non-blocking)
    const authResult = await checkAuth()
    console.log(`Dashboard: Auth check completed in ${Date.now() - startTime}ms`)
    
    if (authResult) {
      console.log('Dashboard: Auth passed, fetching data...')
      // Fetch data in background (non-blocking)
      fetchDashboardData()
    } else {
      console.log('Dashboard: Auth failed, redirecting...')
      // Redirect happens in checkAuth
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    try {
      // Fast auth check - no timeout needed, this is usually instant
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      if (!currentUser) {
        router.push('/admin')
        return false
      }

      // Set user immediately - don't wait for admin check
      setUser(currentUser)

      // Admin check in background - don't block UI
      // Use very short timeout (500ms) - if it's slow, allow access anyway
      const adminCheckPromise = supabase
        .from('user_accounts')
        .select('account_tier')
        .eq('id', currentUser.id)
        .maybeSingle()

      const adminTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 500) // Very short - 500ms
      )

      try {
        const { data: userAccount, error: accountError } = await Promise.race([
          adminCheckPromise,
          adminTimeoutPromise
        ]) as any

        // Only redirect if we got a quick result AND user is not admin
        if (!accountError && userAccount && userAccount.account_tier !== 'admin') {
          console.log('Not admin, redirecting...')
          router.push('/admin')
          return false
        }

        // If timeout or error, allow access (user already set above)
        return true
      } catch (timeoutError: any) {
        if (timeoutError.message === 'TIMEOUT') {
          console.warn('Admin check timed out - allowing access (non-blocking)')
          // Already set user above, just return true
          return true
        }
        // Other error - allow access
        return true
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin')
      return false
    }
  }

  const fetchDashboardData = async () => {
    try {
      console.log('Dashboard: Starting data fetch...')
      const fetchStart = Date.now()
      setRefreshing(true)
      setError(null)

      // Fetch critical data first (for immediate display), then load rest
      console.log('Dashboard: Fetching critical data...')
      const criticalDataPromise = Promise.all([
        supabase
          .from('user_accounts')
          .select('id, email, full_name, account_tier, phone, created_at, subscription_status, has_buyout')
          .order('created_at', { ascending: false })
          .limit(50), // Reduced to 50 for even faster load
        
        supabase
          .from('subscriptions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(25), // Reduced to 25
        
        supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500) // Increased to get all payments for accurate revenue calculation
      ])

      // Fetch less critical data in parallel (but don't wait for it)
      console.log('Dashboard: Fetching secondary data...')
      const secondaryDataPromise = Promise.all([
        supabase
          .from('buyouts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500), // Increased to get all buyouts for revenue calculation
        
        supabase
          .from('draft_projects')
          .select('business_location, business_type, metadata, user_id, created_at')
          .order('created_at', { ascending: false })
          .limit(1000) // Increased to get all drafts for accurate location/industry mapping
      ])

      // Get critical data first
      const [
        { data: users, error: usersError },
        { data: subscriptions, error: subsError },
        { data: payments, error: paymentsError }
      ] = await criticalDataPromise

      console.log(`Dashboard: Critical data fetched in ${Date.now() - fetchStart}ms`)

      // Get secondary data (don't wait - process what we have)
      const [
        { data: buyouts, error: buyoutsError },
        { data: drafts, error: draftsError }
      ] = await secondaryDataPromise

      console.log(`Dashboard: All data fetched in ${Date.now() - fetchStart}ms`)

      // Handle errors gracefully - don't block on non-critical errors
      if (usersError) {
        console.error('Users error:', usersError)
        throw usersError
      }
      if (subsError) console.warn('Subscriptions error (non-critical):', subsError)
      if (paymentsError) console.warn('Payments error (non-critical):', paymentsError)
      if (buyoutsError) console.warn('Buyouts error (non-critical):', buyoutsError)
      if (draftsError) console.warn('Drafts error (non-critical):', draftsError)

      // Create user lookup map for O(1) access instead of O(n) find operations
      const userMap = new Map(users?.map(u => [u.id, u]) || [])

      // Map user emails to subscriptions, payments, and buyouts (optimized with Map)
      const subscriptionsWithEmails = subscriptions?.map(sub => {
        const user = userMap.get(sub.user_id)
        return { ...sub, user_email: user?.email || 'N/A', user_name: user?.full_name || 'N/A' }
      }) || []

      const paymentsWithEmails = payments?.map(payment => {
        const user = userMap.get(payment.user_id)
        return { ...payment, user_email: user?.email || 'N/A', user_name: user?.full_name || 'N/A' }
      }) || []

      const buyoutsWithEmails = buyouts?.map(buyout => {
        const user = userMap.get(buyout.user_id)
        return { ...buyout, user_email: user?.email || 'N/A', user_name: user?.full_name || 'N/A' }
      }) || []

      // Calculate stats
      const totalUsers = users?.length || 0
      const totalSubscriptions = subscriptions?.length || 0
      const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0
      const totalBuyouts = buyouts?.length || 0
      
      const completedPayments = payments?.filter(p => p.status === 'completed') || []
      const totalSales = completedPayments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
      const revenue = totalSales

      // Create maps to track revenue by location/industry
      // Structure: Map<location/industry, { count: number, revenue: number }>
      const countryMap = new Map<string, { count: number; revenue: number }>()
      const cityMap = new Map<string, { count: number; revenue: number }>()
      const industryMap = new Map<string, { count: number; revenue: number }>()

      // Create a map of user_id -> draft to quickly find user's location/industry
      const userDraftMap = new Map<string, any>()
      if (drafts && drafts.length > 0) {
        for (const draft of drafts) {
          // Store the most recent draft for each user (or all if needed)
          if (!userDraftMap.has(draft.user_id) || 
              new Date(draft.created_at || 0) > new Date(userDraftMap.get(draft.user_id)?.created_at || 0)) {
            userDraftMap.set(draft.user_id, draft)
          }
        }
      }

      // Calculate revenue per user from payments and buyouts
      const userRevenueMap = new Map<string, number>()
      
      // Add revenue from payments
      completedPayments.forEach(payment => {
        const userId = payment.user_id
        const amount = parseFloat(payment.amount || '0')
        userRevenueMap.set(userId, (userRevenueMap.get(userId) || 0) + amount)
      })

      // Add revenue from buyouts
      buyouts?.forEach(buyout => {
        if (buyout.status === 'completed') {
          const userId = buyout.user_id
          const amount = parseFloat(buyout.amount || '0')
          userRevenueMap.set(userId, (userRevenueMap.get(userId) || 0) + amount)
        }
      })

      // Process location and industry data with revenue
      if (drafts && drafts.length > 0) {
        for (const draft of drafts) {
          const userRevenue = userRevenueMap.get(draft.user_id) || 0
          
          // Extract country/city from business_location
          const location = (draft.business_location || '').toLowerCase().trim()
          if (location) {
            let country = ''
            let city = ''
            
            // Check for specific countries/cities first (most common)
            if (location.includes('kenya')) {
              country = 'Kenya'
              if (location.includes('nairobi')) city = 'Nairobi'
            } else if (location.includes('south africa')) {
              country = 'South Africa'
              if (location.includes('johannesburg')) city = 'Johannesburg'
              if (location.includes('cape town')) city = 'Cape Town'
              if (location.includes('durban')) city = 'Durban'
            } else if (location.includes('rwanda')) {
              country = 'Rwanda'
              if (location.includes('kigali')) city = 'Kigali'
            } else {
              // Generic country detection
              const parts = location.split(',').map((p: string) => p.trim()).filter((p: string) => p.length > 2)
              if (parts.length > 0) {
                country = parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1)
              }
            }

            if (country) {
              const current = countryMap.get(country) || { count: 0, revenue: 0 }
              countryMap.set(country, {
                count: current.count + 1,
                revenue: current.revenue + userRevenue
              })
            }

            if (city) {
              const current = cityMap.get(city) || { count: 0, revenue: 0 }
              cityMap.set(city, {
                count: current.count + 1,
                revenue: current.revenue + userRevenue
              })
            }
          }

          // Extract industry
          const businessType = draft.business_type || draft.metadata?.business_type || draft.metadata?.user_prompt || ''
          if (businessType) {
            const industry = extractIndustry(businessType)
            const current = industryMap.get(industry) || { count: 0, revenue: 0 }
            industryMap.set(industry, {
              count: current.count + 1,
              revenue: current.revenue + userRevenue
            })
          }
        }
      }

      // Convert maps to arrays with revenue
      const usersByCountry = Array.from(countryMap.entries())
        .map(([country, data]) => ({ country, count: data.count, revenue: data.revenue }))
        .sort((a, b) => b.revenue - a.revenue) // Sort by revenue (descending)

      const usersByCity = Array.from(cityMap.entries())
        .map(([city, data]) => ({ city, count: data.count, revenue: data.revenue }))
        .sort((a, b) => b.revenue - a.revenue) // Sort by revenue (descending)

      const usersByIndustry = Array.from(industryMap.entries())
        .map(([industry, data]) => ({ industry, count: data.count, revenue: data.revenue }))
        .sort((a, b) => b.revenue - a.revenue) // Sort by revenue (descending)

      // ========== NEW METRICS CALCULATIONS ==========
      
      // Date range filtering helper
      const getDateFilter = () => {
        const now = new Date()
        let start: Date
        switch (dateRange) {
          case '7d':
            start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case '30d':
            start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case '90d':
            start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            break
          default:
            start = new Date(0)
        }
        if (startDate && endDate) {
          return { start: new Date(startDate), end: new Date(endDate) }
        }
        return { start, end: now }
      }

      // Revenue trend (last 30 days)
      const revenueTrendMap = new Map<string, number>()
      completedPayments.forEach(payment => {
        const date = new Date(payment.paid_at || payment.created_at)
        const dateKey = date.toISOString().split('T')[0]
        const amount = parseFloat(payment.amount || '0')
        revenueTrendMap.set(dateKey, (revenueTrendMap.get(dateKey) || 0) + amount)
      })
      const revenueTrend = Array.from(revenueTrendMap.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30)

      // User growth (last 30 days)
      const userGrowthMap = new Map<string, number>()
      users?.forEach(user => {
        const date = new Date(user.created_at)
        const dateKey = date.toISOString().split('T')[0]
        userGrowthMap.set(dateKey, (userGrowthMap.get(dateKey) || 0) + 1)
      })
      const userGrowth = Array.from(userGrowthMap.entries())
        .map(([date, users]) => ({ date, users }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30)

      // Subscription status breakdown
      const subscriptionStatusBreakdown = [
        { name: 'Active', value: subscriptions?.filter(s => s.status === 'active').length || 0 },
        { name: 'Canceled', value: subscriptions?.filter(s => s.status === 'canceled').length || 0 },
        { name: 'Past Due', value: subscriptions?.filter(s => s.status === 'past_due').length || 0 },
        { name: 'Inactive', value: subscriptions?.filter(s => !['active', 'canceled', 'past_due'].includes(s.status)).length || 0 }
      ].filter(item => item.value > 0)

      // Conversion metrics
      const freeUsers = users?.filter(u => u.account_tier === 'default_draft' && !u.has_buyout && u.subscription_status !== 'active').length || 0
      const paidUsers = users?.filter(u => u.subscription_status === 'active' || u.has_buyout).length || 0
      const conversionRate = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0

      // Churn rate (canceled subscriptions / total subscriptions)
      const canceledSubs = subscriptions?.filter(s => s.status === 'canceled').length || 0
      const churnRate = totalSubscriptions > 0 ? (canceledSubs / totalSubscriptions) * 100 : 0

      // ARPU (Average Revenue Per User)
      const arpu = paidUsers > 0 ? revenue / paidUsers : 0

      // LTV (Lifetime Value) - estimated as ARPU * average subscription duration (months)                                                              
      const avgSubscriptionMonths = subscriptions && subscriptions.length > 0
        ? subscriptions.reduce((sum, sub) => {
            const start = new Date(sub.started_at || sub.created_at)
            const end = sub.current_period_end ? new Date(sub.current_period_end) : new Date()
            const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
            return sum + Math.max(1, months)
          }, 0) / subscriptions.length
        : 1
      const ltv = arpu * avgSubscriptionMonths

      // MRR (Monthly Recurring Revenue)
      const mrr = subscriptions?.filter(s => s.status === 'active')
        .reduce((sum, sub) => sum + parseFloat(sub.monthly_price || '20.00'), 0) || 0

      // This month vs last month
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

      const revenueThisMonth = completedPayments
        .filter(p => new Date(p.paid_at || p.created_at) >= thisMonthStart)
        .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)

      const revenueLastMonth = completedPayments
        .filter(p => {
          const date = new Date(p.paid_at || p.created_at)
          return date >= lastMonthStart && date <= lastMonthEnd
        })
        .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)

      const revenueGrowth = revenueLastMonth > 0 
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
        : 0

      const newUsersThisMonth = users?.filter(u => new Date(u.created_at) >= thisMonthStart).length || 0
      const newUsersLastMonth = users?.filter(u => {
        const date = new Date(u.created_at)
        return date >= lastMonthStart && date <= lastMonthEnd
      }).length || 0

      const userGrowthRate = newUsersLastMonth > 0 
        ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
        : 0

      // Additional metrics
      const totalProjects = drafts?.length || 0
      const avgProjectsPerUser = totalUsers > 0 ? totalProjects / totalUsers : 0

      const totalPaymentAttempts = payments?.length || 0
      const successfulPayments = completedPayments.length
      const paymentSuccessRate = totalPaymentAttempts > 0 ? (successfulPayments / totalPaymentAttempts) * 100 : 0

      const activeSubsWithRenewal = subscriptions?.filter(s => {
        if (s.status !== 'active') return false
        const endDate = s.current_period_end ? new Date(s.current_period_end) : null
        return endDate && endDate > new Date()
      }).length || 0
      const subscriptionRenewalRate = activeSubscriptions > 0 ? (activeSubsWithRenewal / activeSubscriptions) * 100 : 0

      // Top customers by revenue
      const customerRevenueMap = new Map<string, { revenue: number; name: string; email: string }>()
      completedPayments.forEach(payment => {
        const user = userMap.get(payment.user_id)
        const email = user?.email || payment.user_id
        const name = user?.full_name || 'N/A'
        const amount = parseFloat(payment.amount || '0')
        const current = customerRevenueMap.get(email) || { revenue: 0, name, email }
        customerRevenueMap.set(email, { ...current, revenue: current.revenue + amount })
      })
      buyouts?.forEach(buyout => {
        if (buyout.status === 'completed') {
          const user = userMap.get(buyout.user_id)
          const email = user?.email || buyout.user_id
          const name = user?.full_name || 'N/A'
          const amount = parseFloat(buyout.amount || '0')
          const current = customerRevenueMap.get(email) || { revenue: 0, name, email }
          customerRevenueMap.set(email, { ...current, revenue: current.revenue + amount })
        }
      })
      const topCustomers = Array.from(customerRevenueMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)

      // Activity feed
      const activityFeed: Array<{ type: string; message: string; date: string; icon: string }> = []
      
      // Recent signups
      users?.slice(0, 5).forEach(user => {
        activityFeed.push({
          type: 'signup',
          message: `${user.email} signed up`,
          date: user.created_at,
          icon: 'Users'
        })
      })

      // Recent payments
      completedPayments.slice(0, 5).forEach(payment => {
        const user = userMap.get(payment.user_id)
        activityFeed.push({
          type: 'payment',
          message: `${user?.email || 'User'} paid $${parseFloat(payment.amount || '0').toFixed(2)}`,
          date: payment.paid_at || payment.created_at,
          icon: 'DollarSign'
        })
      })

      // Failed payments
      payments?.filter(p => p.status === 'failed').slice(0, 3).forEach(payment => {
        const user = userMap.get(payment.user_id)
        activityFeed.push({
          type: 'alert',
          message: `Payment failed for ${user?.email || 'User'}`,
          date: payment.created_at,
          icon: 'AlertCircle'
        })
      })

      // Subscription cancellations
      subscriptions?.filter(s => s.status === 'canceled').slice(0, 3).forEach(sub => {
        const user = userMap.get(sub.user_id)
        activityFeed.push({
          type: 'cancel',
          message: `${user?.email || 'User'} canceled subscription`,
          date: sub.canceled_at || sub.updated_at || sub.created_at,
          icon: 'CreditCard'
        })
      })

      // Sort activity feed by date
      activityFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      const recentActivity = activityFeed.slice(0, 10)

      // Revenue by source (subscriptions vs buyouts)
      const revenueBySource = [
        {
          source: 'Subscriptions',
          amount: subscriptions?.filter(s => s.status === 'active')
            .reduce((sum, sub) => sum + parseFloat(sub.monthly_price || '20.00'), 0) || 0,
          count: activeSubscriptions
        },
        {
          source: 'Buyouts',
          amount: buyouts?.filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + parseFloat(b.amount || '0'), 0) || 0,
          count: buyouts?.filter(b => b.status === 'completed').length || 0
        }
      ]

      // Revenue by payment type
      const revenueByPaymentType = [
        {
          type: 'Flutterwave',
          amount: completedPayments.filter(p => p.payment_method === 'flutterwave' || !p.payment_method)
            .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0),
          count: completedPayments.filter(p => p.payment_method === 'flutterwave' || !p.payment_method).length
        },
        {
          type: 'Stripe',
          amount: completedPayments.filter(p => p.payment_method === 'stripe')
            .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0),
          count: completedPayments.filter(p => p.payment_method === 'stripe').length
        }
      ]

      // Monthly revenue breakdown
      const monthlyRevenueMap = new Map<string, { revenue: number; payments: number }>()
      completedPayments.forEach(payment => {
        const date = new Date(payment.paid_at || payment.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const current = monthlyRevenueMap.get(monthKey) || { revenue: 0, payments: 0 }
        monthlyRevenueMap.set(monthKey, {
          revenue: current.revenue + parseFloat(payment.amount || '0'),
          payments: current.payments + 1
        })
      })
      const monthlyRevenue = Array.from(monthlyRevenueMap.entries())
        .map(([period, data]) => ({ period, revenue: data.revenue, payments: data.payments }))
        .sort((a, b) => a.period.localeCompare(b.period))
        .slice(-12) // Last 12 months

      // Revenue verification
      const totalFromPayments = completedPayments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
      const totalFromBuyouts = buyouts?.filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.amount || '0'), 0) || 0
      const totalCalculated = totalFromPayments + totalFromBuyouts
      const revenueVerification = {
        totalFromPayments,
        totalFromBuyouts,
        totalCalculated,
        discrepancy: Math.abs(revenue - totalCalculated)
      }

      setStats({
        totalUsers,
        totalSubscriptions,
        totalSales,
        totalBuyouts,
        activeSubscriptions,
        revenue,
        usersByCountry,
        usersByCity,
        usersByIndustry,
        recentPayments: paymentsWithEmails.slice(0, 50),
        recentUsers: users?.slice(0, 50) || [],
        subscriptions: subscriptionsWithEmails,
        buyouts: buyoutsWithEmails,
        // New metrics
        revenueTrend,
        userGrowth,
        subscriptionStatusBreakdown,
        conversionRate,
        churnRate,
        arpu,
        ltv,
        mrr,
        newUsersThisMonth,
        revenueThisMonth,
        revenueLastMonth,
        revenueGrowth,
        userGrowthRate,
        totalProjects,
        avgProjectsPerUser,
        paymentSuccessRate,
        subscriptionRenewalRate,
        topCustomers,
        activityFeed: recentActivity,
        // Revenue breakdown
        revenueBySource,
        revenueByPaymentType,
        revenueByPeriod: monthlyRevenue, // Using monthly as default
        revenueVerification
      })
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      setError(error.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const extractIndustry = (text: string): string => {
    const lower = text.toLowerCase()
    if (lower.includes('restaurant') || lower.includes('food') || lower.includes('cafe')) return 'Food & Restaurant'
    if (lower.includes('real estate') || lower.includes('property')) return 'Real Estate'
    if (lower.includes('salon') || lower.includes('beauty') || lower.includes('spa')) return 'Beauty & Salon'
    if (lower.includes('ecommerce') || lower.includes('store') || lower.includes('shop')) return 'E-commerce'
    if (lower.includes('tech') || lower.includes('software') || lower.includes('saas')) return 'Technology'
    if (lower.includes('consulting') || lower.includes('business')) return 'Consulting'
    if (lower.includes('photography') || lower.includes('photographer')) return 'Photography'
    if (lower.includes('health') || lower.includes('medical')) return 'Healthcare'
    if (lower.includes('education') || lower.includes('school')) return 'Education'
    if (lower.includes('fitness') || lower.includes('gym')) return 'Fitness & Wellness'
    return 'Other'
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">AtarWebb Solutions - Analytics & Management</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Date Range Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={dateRange}
                  onChange={(e) => {
                    setDateRange(e.target.value as any)
                    fetchDashboardData()
                  }}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="End Date"
                />
              </div>
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Total Users</p>
                <p className="text-4xl font-bold mt-2">{stats?.totalUsers || 0}</p>
                {stats?.newUsersThisMonth !== undefined && (
                  <div className="flex items-center gap-1 mt-2">
                    {stats.userGrowthRate >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-xs">{stats.newUsersThisMonth} this month</span>
                    {stats.userGrowthRate !== 0 && (
                      <span className={`text-xs ${stats.userGrowthRate >= 0 ? 'text-teal-200' : 'text-red-200'}`}>
                        ({stats.userGrowthRate >= 0 ? '+' : ''}{stats.userGrowthRate.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <Users className="w-12 h-12 text-teal-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Subscriptions</p>
                <p className="text-4xl font-bold mt-2">{stats?.activeSubscriptions || 0}</p>
                <p className="text-blue-200 text-xs mt-1">of {stats?.totalSubscriptions || 0} total</p>
                {stats?.mrr !== undefined && (
                  <p className="text-blue-200 text-xs mt-1">MRR: ${stats.mrr.toFixed(2)}</p>
                )}
              </div>
              <CreditCard className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold mt-2">${stats?.revenue.toFixed(2) || '0.00'}</p>
                {stats?.revenueThisMonth !== undefined && (
                  <div className="flex items-center gap-1 mt-2">
                    {stats.revenueGrowth >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-xs">${stats.revenueThisMonth.toFixed(2)} this month</span>
                    {stats.revenueGrowth !== 0 && (
                      <span className={`text-xs ${stats.revenueGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                        ({stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
              <DollarSign className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Buyouts</p>
                <p className="text-4xl font-bold mt-2">{stats?.totalBuyouts || 0}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
                <p className="text-3xl font-bold mt-2 text-teal-600">{stats?.conversionRate.toFixed(1) || '0.0'}%</p>
              </div>
              <UserCheck className="w-10 h-10 text-teal-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">ARPU</p>
                <p className="text-3xl font-bold mt-2 text-blue-600">${stats?.arpu.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-gray-500 mt-1">LTV: ${stats?.ltv.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Churn Rate</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{stats?.churnRate.toFixed(1) || '0.0'}%</p>
              </div>
              <TrendingDown className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Payment Success</p>
                <p className="text-3xl font-bold mt-2 text-green-600">{stats?.paymentSuccessRate.toFixed(1) || '0.0'}%</p>
              </div>
              <Award className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            {stats?.revenueTrend && stats.revenueTrend.length > 0 ? (
              <RevenueTrendChart data={stats.revenueTrend} />
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No revenue data available</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            {stats?.userGrowth && stats.userGrowth.length > 0 ? (
              <UserGrowthChart data={stats.userGrowth} />
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No user growth data available</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Subscription Status</h2>
              <CreditCard className="w-5 h-5 text-teal-600" />
            </div>
            {stats?.subscriptionStatusBreakdown && stats.subscriptionStatusBreakdown.length > 0 ? (
              <SubscriptionStatusChart data={stats.subscriptionStatusBreakdown} />
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">No subscription data available</p>
            )}
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Customers</h2>
              <Award className="w-5 h-5 text-teal-600" />
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {stats?.topCustomers && stats.topCustomers.length > 0 ? (
                stats.topCustomers.map((customer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">${customer.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No customer data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Analysis Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-900">Revenue Analysis</h2>
            </div>
            <ExportButton 
              data={stats?.revenueByPeriod || []} 
              filename="revenue-analysis"
              headers={['Period', 'Revenue', 'Payments']}
            />
          </div>

          {/* Revenue Verification */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">From Payments</p>
              <p className="text-2xl font-bold text-green-600">${stats?.revenueVerification.totalFromPayments.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">From Buyouts</p>
              <p className="text-2xl font-bold text-purple-600">${stats?.revenueVerification.totalFromBuyouts.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Calculated</p>
              <p className="text-2xl font-bold text-teal-600">${stats?.revenueVerification.totalCalculated.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Discrepancy</p>
              <p className={`text-2xl font-bold ${(stats?.revenueVerification.discrepancy || 0) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats?.revenueVerification.discrepancy.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {/* Revenue by Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Source</h3>
              <div className="space-y-3">
                {stats?.revenueBySource.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{source.source}</p>
                      <p className="text-sm text-gray-500">{source.count} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${source.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        {stats?.revenueVerification.totalCalculated > 0 
                          ? ((source.amount / stats.revenueVerification.totalCalculated) * 100).toFixed(1) 
                          : '0'}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Payment Type</h3>
              <div className="space-y-3">
                {stats?.revenueByPaymentType && stats.revenueByPaymentType.length > 0 ? (
                  stats.revenueByPaymentType.map((type, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{type.type}</p>
                        <p className="text-sm text-gray-500">{type.count} payments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">${type.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No payment type data</p>
                )}
              </div>
            </div>
          </div>

          {/* Revenue by Period Table */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Period</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Revenue</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Transactions</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Avg per Transaction</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats?.revenueByPeriod && stats.revenueByPeriod.length > 0 ? (
                    stats.revenueByPeriod.map((period, idx) => {
                      const prevPeriod = idx > 0 ? stats.revenueByPeriod[idx - 1] : null
                      const growth = prevPeriod && prevPeriod.revenue > 0
                        ? ((period.revenue - prevPeriod.revenue) / prevPeriod.revenue) * 100
                        : 0
                      const avgPerTransaction = period.payments > 0 ? period.revenue / period.payments : 0
                      
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{period.period}</td>
                          <td className="px-4 py-3 font-semibold text-green-600">${period.revenue.toFixed(2)}</td>
                          <td className="px-4 py-3 text-gray-600">{period.payments}</td>
                          <td className="px-4 py-3 text-gray-600">${avgPerTransaction.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            {idx > 0 && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No revenue data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {stats?.activityFeed && stats.activityFeed.length > 0 ? (
              stats.activityFeed.map((activity, idx) => {
                const IconComponent = activity.icon === 'Users' ? Users :
                  activity.icon === 'DollarSign' ? DollarSign :
                  activity.icon === 'AlertCircle' ? AlertCircle :
                  activity.icon === 'CreditCard' ? CreditCard : Activity
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'payment' ? 'bg-green-100 text-green-600' :
                      activity.type === 'alert' ? 'bg-red-100 text-red-600' :
                      activity.type === 'cancel' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-teal-100 text-teal-600'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleString()}</p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Geographic Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Users by Country */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">By Country</h2>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded block">{stats?.usersByCountry.reduce((sum, item) => sum + item.count, 0) || 0} users</span>
                <span className="text-xs text-green-600 font-semibold">${stats?.usersByCountry.reduce((sum, item) => sum + item.revenue, 0).toFixed(2) || '0.00'}</span>
              </div>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {stats?.usersByCountry.length ? (
                stats.usersByCountry.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-700 block">{item.country}</span>
                        <span className="text-xs text-gray-500">{item.count} {item.count === 1 ? 'user' : 'users'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600 block">${item.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No country data</p>
              )}
            </div>
          </div>

          {/* Users by City */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">By City</h2>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded block">{stats?.usersByCity.reduce((sum, item) => sum + item.count, 0) || 0} users</span>
                <span className="text-xs text-green-600 font-semibold">${stats?.usersByCity.reduce((sum, item) => sum + item.revenue, 0).toFixed(2) || '0.00'}</span>
              </div>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {stats?.usersByCity.length ? (
                stats.usersByCity.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-700 block">{item.city}</span>
                        <span className="text-xs text-gray-500">{item.count} {item.count === 1 ? 'user' : 'users'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600 block">${item.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No city data</p>
              )}
            </div>
          </div>

          {/* Users by Industry */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">By Industry</h2>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded block">{stats?.usersByIndustry.reduce((sum, item) => sum + item.count, 0) || 0} users</span>
                <span className="text-xs text-green-600 font-semibold">${stats?.usersByIndustry.reduce((sum, item) => sum + item.revenue, 0).toFixed(2) || '0.00'}</span>
              </div>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {stats?.usersByIndustry.length ? (
                stats.usersByIndustry.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">{item.industry}</span>
                      <span className="text-xs text-gray-500">{item.count} {item.count === 1 ? 'user' : 'users'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600 block">${item.revenue.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No industry data</p>
              )}
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">Subscriptions</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Total: <strong>{stats?.totalSubscriptions || 0}</strong></span>
              <span className="text-sm text-green-600">Active: <strong>{stats?.activeSubscriptions || 0}</strong></span>
              <ExportButton 
                data={stats?.subscriptions || []} 
                filename="subscriptions"
                headers={['User Email', 'Status', 'Price', 'Started', 'Ends', 'Provider']}
              />
            </div>
          </div>
          <div className="mb-4 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="canceled">Canceled</option>
              <option value="past_due">Past Due</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">User Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Started</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Ends</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats?.subscriptions.length ? (
                  stats.subscriptions
                    .filter((sub: any) => {
                      if (searchQuery && !sub.user_email?.toLowerCase().includes(searchQuery.toLowerCase())) return false
                      if (filterStatus !== 'all' && sub.status !== filterStatus) return false
                      return true
                    })
                    .sort((a: any, b: any) => {
                      if (sortBy === 'date') {
                        const dateA = new Date(a.started_at || a.created_at).getTime()
                        const dateB = new Date(b.started_at || b.created_at).getTime()
                        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
                      }
                      return 0
                    })
                    .map((sub: any) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{sub.user_email || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sub.status === 'active' ? 'bg-green-100 text-green-700' :
                          sub.status === 'past_due' ? 'bg-yellow-100 text-yellow-700' :
                          sub.status === 'canceled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {sub.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">${parseFloat(sub.monthly_price || '20.00').toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">{sub.started_at ? new Date(sub.started_at).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{sub.payment_provider || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No subscriptions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales & Payments Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">Sales & Payments</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Total: <strong>{stats?.recentPayments.length || 0}</strong></span>
              <span className="text-sm text-green-600">Revenue: <strong>${stats?.revenue.toFixed(2) || '0.00'}</strong></span>
              <ExportButton 
                data={stats?.recentPayments || []} 
                filename="payments"
                headers={['Date', 'User Email', 'Type', 'Amount', 'Status', 'Provider']}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">User Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats?.recentPayments.length ? (
                  stats.recentPayments.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : new Date(payment.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-gray-900">{payment.user_email || payment.user_id}</td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{payment.payment_type || 'N/A'}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">${parseFloat(payment.amount || '0').toFixed(2)} {payment.currency || 'USD'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{payment.payment_provider || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No payments yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Total: <strong>{stats?.totalUsers || 0}</strong></span>
              <ExportButton 
                data={stats?.recentUsers || []} 
                filename="users"
                headers={['Email', 'Name', 'Account Tier', 'Phone', 'Joined', 'Status']}
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Account Tier</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Joined</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats?.recentUsers.length ? (
                  stats.recentUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{user.email}</td>
                      <td className="px-4 py-3 text-gray-700">{user.full_name || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.account_tier === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.account_tier === 'pro_subscription' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.account_tier === 'default_draft' ? 'Free' : user.account_tier === 'pro_subscription' ? 'Pro' : 'Admin'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{user.phone || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.subscription_status === 'active' ? 'bg-green-100 text-green-700' :
                          user.has_buyout ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.subscription_status === 'active' ? 'Active' : user.has_buyout ? 'Buyout' : 'Free'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No users yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buyouts Table */}
        {stats?.buyouts && stats.buyouts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-gray-900">Buyouts</h2>
              </div>
              <span className="text-sm text-gray-500">Total: <strong>{stats?.totalBuyouts || 0}</strong></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">User Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Purchased</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Code Delivered</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats.buyouts.map((buyout: any) => (
                    <tr key={buyout.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{buyout.user_email || 'N/A'}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">${parseFloat(buyout.amount || '150.00').toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          buyout.status === 'completed' ? 'bg-green-100 text-green-700' :
                          buyout.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {buyout.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{buyout.purchased_at ? new Date(buyout.purchased_at).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-600">{buyout.code_delivered ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-3 text-gray-600">{buyout.payment_provider || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
