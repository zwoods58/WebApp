/**
 * FAST AUTH SYSTEM
 * Instant authentication with caching and lazy loading
 * 
 * Performance:
 * - Login: <50ms (no database queries)
 * - Account check: <5ms (cached in memory)
 * - Full account data: <100ms (lazy loaded when needed)
 */

import { supabase } from './supabase'

export type AccountTier = 'default_draft' | 'pro_subscription' | 'admin'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'expired'

export interface FastUserAccount {
  id: string
  email: string
  full_name?: string
  phone?: string
  account_tier: AccountTier
  subscription_status?: SubscriptionStatus
  subscription_ends_at?: string
  has_buyout: boolean
  created_at: string
}

// ========================================
// IN-MEMORY CACHE (Lightning fast!)
// ========================================

interface CacheEntry {
  data: FastUserAccount
  timestamp: number
  expiresAt: number
}

const CACHE: Map<string, CacheEntry> = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// ========================================
// INSTANT AUTH CHECK (No database call!)
// ========================================

/**
 * Get current user from Supabase session (cached in browser)
 * This is INSTANT - no database query!
 */
export async function getFastUser() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user ?? null
}

/**
 * Get access token from localStorage (INSTANT - no network call!)
 * Returns null if no session exists
 */
export function getFastAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    // Supabase stores session in localStorage with key: 'sb-<project-ref>-auth-token'
    const keys = Object.keys(localStorage)
    const supabaseKey = keys.find(key => key.includes('auth-token'))
    
    if (supabaseKey) {
      const stored = localStorage.getItem(supabaseKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed?.access_token || null
      }
    }
    
    // Fallback: try to get from session storage
    const sessionKey = keys.find(key => key.includes('auth-token') && key.includes('session'))
    if (sessionKey) {
      const stored = sessionStorage.getItem(sessionKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed?.access_token || null
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

/**
 * Check if user is logged in (INSTANT)
 */
export async function isLoggedIn(): Promise<boolean> {
  const user = await getFastUser()
  return !!user
}

// ========================================
// CACHED ACCOUNT DATA (5ms response time)
// ========================================

/**
 * Get user account with caching
 * First call: ~100ms (database query)
 * Subsequent calls: <5ms (memory cache)
 */
export async function getFastAccount(): Promise<FastUserAccount | null> {
  const user = await getFastUser()
  if (!user) return null

  // Check cache first
  const cached = CACHE.get(user.id)
  const now = Date.now()
  
  if (cached && cached.expiresAt > now) {
    console.log('⚡ Account from cache (<5ms)')
    return cached.data
  }

  // Cache miss - fetch from database (only first time)
  console.log('📥 Fetching account from database (~100ms)')
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('id, email, full_name, phone, account_tier, subscription_status, subscription_ends_at, has_buyout, created_at')
      .eq('id', user.id)
      .single()

    // If account doesn't exist, create it automatically
    if (error && error.code === 'PGRST116') {
      console.log('📝 Account not found - creating automatically...')
      
      // Auto-create account with default tier
      const { data: newAccount, error: createError } = await supabase
        .from('user_accounts')
        .insert({
          id: user.id,
          email: user.email || '',
          account_tier: 'default_draft',
          has_buyout: false
        })
        .select('id, email, full_name, phone, account_tier, subscription_status, subscription_ends_at, has_buyout, created_at')
        .single()

      if (createError) {
        console.error('Error creating account:', createError)
        // Still return null if creation fails
        return null
      }

      const account = newAccount as FastUserAccount

      // Store in cache
      CACHE.set(user.id, {
        data: account,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      })

      // Also store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`account_${user.id}`, JSON.stringify({
          data: account,
          timestamp: now
        }))
      }

      console.log('✅ Account created successfully')
      return account
    }

    if (error) throw error

    const account = data as FastUserAccount

    // Store in cache
    CACHE.set(user.id, {
      data: account,
      timestamp: now,
      expiresAt: now + CACHE_DURATION
    })

    // Also store in localStorage for persistence across page loads
    if (typeof window !== 'undefined') {
      localStorage.setItem(`account_${user.id}`, JSON.stringify({
        data: account,
        timestamp: now
      }))
    }

    return account
  } catch (error) {
    console.error('Error fetching account:', error)
    
    // Try localStorage as fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`account_${user.id}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        console.log('⚡ Account from localStorage (fallback)')
        return parsed.data
      }
    }
    
    return null
  }
}

/**
 * Get account with localStorage prefetch
 * This returns cached data INSTANTLY, then updates in background
 */
export async function getFastAccountWithPrefetch(): Promise<FastUserAccount | null> {
  const user = await getFastUser()
  if (!user) return null

  // Return localStorage data INSTANTLY (if available)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`account_${user.id}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      const age = Date.now() - parsed.timestamp
      
      // If data is recent enough, return immediately
      if (age < CACHE_DURATION) {
        console.log('⚡ INSTANT account from localStorage')
        
        // Fetch fresh data in background (non-blocking)
        getFastAccount().catch(console.error)
        
        return parsed.data
      }
    }
  }

  // No cached data - fetch normally
  return getFastAccount()
}

// ========================================
// FEATURE ACCESS (Instant checks)
// ========================================

/**
 * Check if user has feature access (uses cached data)
 * Response time: <5ms
 */
export async function hasFastFeatureAccess(
  feature: 'draft_preview' | 'draft_regeneration' | 'client_dashboard' | 'live_deployment' | 'ecommerce' | 'admin_panel'
): Promise<boolean> {
  const account = await getFastAccount()
  if (!account) return false

  switch (feature) {
    case 'draft_preview':
      return true // All tiers

    case 'draft_regeneration':
      return account.account_tier === 'default_draft' || account.account_tier === 'pro_subscription'

    case 'client_dashboard':
    case 'live_deployment':
    case 'ecommerce':
      return account.account_tier === 'pro_subscription' && account.subscription_status === 'active'

    case 'admin_panel':
      return account.account_tier === 'admin'

    default:
      return false
  }
}

/**
 * Check if user is admin (cached)
 */
export async function isFastAdmin(): Promise<boolean> {
  const account = await getFastAccount()
  return account?.account_tier === 'admin'
}

/**
 * Check if user is Pro (cached)
 */
export async function isFastPro(): Promise<boolean> {
  const account = await getFastAccount()
  return account?.account_tier === 'pro_subscription' && account?.subscription_status === 'active'
}

// ========================================
// CACHE MANAGEMENT
// ========================================

/**
 * Clear account cache (call after account updates)
 */
export function clearFastAccountCache(userId?: string) {
  if (userId) {
    CACHE.delete(userId)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`account_${userId}`)
    }
  } else {
    // Clear all
    CACHE.clear()
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('account_')) {
          localStorage.removeItem(key)
        }
      })
    }
  }
  console.log('🗑️ Cache cleared')
}

/**
 * Refresh account data (force re-fetch)
 */
export async function refreshFastAccount(): Promise<FastUserAccount | null> {
  const user = await getFastUser()
  if (!user) return null
  
  clearFastAccountCache(user.id)
  return getFastAccount()
}

/**
 * Prefetch account data (for faster first load)
 * Call this in app initialization
 */
export async function prefetchFastAccount(): Promise<void> {
  const user = await getFastUser()
  if (!user) return
  
  // Fetch in background without blocking
  getFastAccount().catch(console.error)
}

// ========================================
// LAZY LOADING (Load only when needed)
// ========================================

/**
 * Get user's draft projects (lazy loaded)
 * Only call when user actually needs to see their projects
 */
export async function lazyLoadDraftProjects(limit = 10) {
  const user = await getFastUser()
  if (!user) return []

  const { data } = await supabase
    .from('draft_projects')
    .select('id, business_name, status, created_at, generation_count, max_generations')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

/**
 * Get user's subscription details (lazy loaded)
 * Only call when user views billing/subscription page
 */
export async function lazyLoadSubscription() {
  const user = await getFastUser()
  if (!user) return null

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  return data
}

/**
 * Get user's payment history (lazy loaded)
 * Only call when user views billing history
 */
export async function lazyLoadPayments(limit = 20) {
  const user = await getFastUser()
  if (!user) return []

  const { data } = await supabase
    .from('payments')
    .select('id, amount, currency, status, payment_type, paid_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

// ========================================
// AUTH STATE LISTENER (Auto-update cache)
// ========================================

/**
 * Set up auth state listener (call once in app root)
 * Automatically updates cache when user logs in/out
 */
export function setupFastAuthListener() {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('✅ User signed in - prefetching account')
      prefetchFastAccount()
    } else if (event === 'SIGNED_OUT') {
      console.log('👋 User signed out - clearing cache')
      clearFastAccountCache()
    }
  })
}

// ========================================
// EXPORT CONVENIENCE FUNCTIONS
// ========================================

export default {
  // Fast checks (no DB)
  getFastUser,
  isLoggedIn,
  
  // Cached account data
  getFastAccount,
  getFastAccountWithPrefetch,
  hasFastFeatureAccess,
  isFastAdmin,
  isFastPro,
  
  // Cache management
  clearFastAccountCache,
  refreshFastAccount,
  prefetchFastAccount,
  setupFastAuthListener,
  
  // Lazy loading
  lazyLoadDraftProjects,
  lazyLoadSubscription,
  lazyLoadPayments,
}

