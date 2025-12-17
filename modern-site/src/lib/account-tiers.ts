/**
 * Account Tiers Management
 * Handles user account tier logic and permissions
 */

import { supabase } from './supabase'

export type AccountTier = 'default_draft' | 'pro_subscription' | 'admin'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'expired'

export interface UserAccount {
  id: string
  email: string
  full_name?: string
  phone?: string
  account_tier: AccountTier
  subscription_status?: SubscriptionStatus
  subscription_started_at?: string
  subscription_ends_at?: string
  has_buyout: boolean
  buyout_purchased_at?: string
  created_at: string
  updated_at: string
}

/**
 * Get current user's account information
 */
export async function getCurrentUserAccount(): Promise<UserAccount | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    
    const account = data as UserAccount
    
    // Check subscription expiry and auto-downgrade if expired
    if (account.account_tier === 'pro_subscription' && account.subscription_ends_at) {
      const expiryDate = new Date(account.subscription_ends_at)
      const now = new Date()
      
      if (expiryDate < now && account.subscription_status === 'active') {
        // Subscription expired, downgrade user
        await checkAndDowngradeExpiredSubscription(user.id)
        // Refetch account after downgrade
        const { data: updatedData } = await supabase
          .from('user_accounts')
          .select('*')
          .eq('id', user.id)
          .single()
        return updatedData as UserAccount
      }
    }
    
    return account
  } catch (error) {
    console.error('Error fetching user account:', error)
    return null
  }
}

/**
 * Check and downgrade expired subscriptions
 */
export async function checkAndDowngradeExpiredSubscription(userId: string): Promise<boolean> {
  try {
    const { data: account } = await supabase
      .from('user_accounts')
      .select('subscription_ends_at, subscription_status, account_tier')
      .eq('id', userId)
      .single()

    if (!account || account.account_tier !== 'pro_subscription') {
      return false
    }

    if (account.subscription_ends_at) {
      const expiryDate = new Date(account.subscription_ends_at)
      const now = new Date()

      if (expiryDate < now && account.subscription_status === 'active') {
        // Downgrade user
        const { error } = await supabase
          .from('user_accounts')
          .update({
            account_tier: 'default_draft',
            subscription_status: 'expired',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (error) throw error

        // Update subscriptions table
        await supabase
          .from('subscriptions')
          .update({
            status: 'expired',
            ended_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('status', 'active')

        return true
      }
    }

    return false
  } catch (error) {
    console.error('Error checking subscription expiry:', error)
    return false
  }
}

/**
 * Check if user has access to a feature based on their tier
 */
export function hasFeatureAccess(
  account: UserAccount | null,
  feature: 'draft_preview' | 'draft_regeneration' | 'client_dashboard' | 'live_deployment' | 'ecommerce' | 'admin_panel'
): boolean {
  if (!account) return false

  switch (feature) {
    case 'draft_preview':
      // All tiers can preview drafts
      return true

    case 'draft_regeneration':
      // Only default_draft and pro_subscription can regenerate (with limits)
      return account.account_tier === 'default_draft' || account.account_tier === 'pro_subscription'

    case 'client_dashboard':
    case 'live_deployment':
    case 'ecommerce':
      // Only pro_subscription has access
      return account.account_tier === 'pro_subscription' && account.subscription_status === 'active'

    case 'admin_panel':
      // Only admin tier
      return account.account_tier === 'admin'

    default:
      return false
  }
}

/**
 * Check if user has code access (Pro subscription or project buyout)
 */
export async function hasCodeAccess(userId: string, draftProjectId: string): Promise<boolean> {
  try {
    const account = await getCurrentUserAccount()
    if (!account) return false

    // Pro subscription has full code access
    if (account.account_tier === 'pro_subscription' && account.subscription_status === 'active') {
      return true
    }

    // Check if project has buyout
    const { data, error } = await supabase
      .from('draft_projects')
      .select('has_buyout')
      .eq('id', draftProjectId)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data?.has_buyout === true
  } catch (error) {
    console.error('Error checking code access:', error)
    return false
  }
}

/**
 * Check if user can regenerate draft (FREE tier has limit of 3)
 */
export async function canRegenerateDraft(userId: string, draftProjectId: string): Promise<boolean> {
  try {
    const account = await getCurrentUserAccount()
    if (!account) return false

    // Pro subscription has unlimited regenerations
    if (account.account_tier === 'pro_subscription' && account.subscription_status === 'active') {
      return true
    }

    // FREE tier: check generation count
    const { data, error } = await supabase
      .from('draft_projects')
      .select('generation_count, max_generations')
      .eq('id', draftProjectId)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return (data.generation_count || 0) < (data.max_generations || 3)
  } catch (error) {
    console.error('Error checking regeneration limit:', error)
    return false
  }
}

/**
 * Upgrade user to Pro subscription
 */
export async function upgradeToPro(
  userId: string,
  subscriptionId: string,
  paymentId: string
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('upgrade_to_pro', {
      p_user_id: userId,
      p_subscription_id: subscriptionId,
      p_payment_id: paymentId
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error upgrading to Pro:', error)
    return false
  }
}

/**
 * Downgrade user from Pro (missed payment or cancellation)
 */
export async function downgradeFromPro(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('downgrade_from_pro', {
      p_user_id: userId
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error downgrading from Pro:', error)
    return false
  }
}

/**
 * Process buyout purchase
 */
export async function processBuyout(
  userId: string,
  draftProjectId: string,
  buyoutId: string,
  paymentId: string
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('process_buyout', {
      p_user_id: userId,
      p_draft_project_id: draftProjectId,
      p_buyout_id: buyoutId,
      p_payment_id: paymentId
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error processing buyout:', error)
    return false
  }
}

/**
 * Create draft project from form data
 */
export async function createDraftProject(formData: {
  businessName: string
  businessLocation: string
  businessDescription: string
  email: string
  phoneNumber?: string
  businessType?: string
  idealCustomer?: string
  keyDifferentiator?: string
  targetKeywords?: string
  toneOfVoice?: string
  preferredColors?: string
  aestheticStyle?: string
  mustHavePages?: string[]
  existingLinks?: string
  logoUrl?: string | null
  facebookLink?: string
  instagramLink?: string
  twitterLink?: string
  linkedinLink?: string
  needsEcommerce: boolean
  needsCRM: boolean
  conversionGoal?: string
}): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('draft_projects')
      .insert({
        user_id: user.id,
        business_name: formData.businessName,
        business_location: formData.businessLocation,
        business_description: formData.businessDescription,
        email: formData.email,
        phone_number: formData.phoneNumber || null,
        business_type: formData.businessType || null,
        ideal_customer: formData.idealCustomer,
        key_differentiator: formData.keyDifferentiator,
        target_keywords: formData.targetKeywords,
        tone_of_voice: formData.toneOfVoice,
        preferred_colors: formData.preferredColors,
        aesthetic_style: formData.aestheticStyle,
        must_have_pages: [], // Removed - AI will determine pages based on industry standards
        existing_links: formData.existingLinks,
        logo_url: formData.logoUrl || null,
        facebook_link: formData.facebookLink || null,
        instagram_link: formData.instagramLink || null,
        twitter_link: formData.twitterLink || null,
        linkedin_link: formData.linkedinLink || null,
        needs_ecommerce: formData.needsEcommerce,
        needs_crm: formData.needsCRM,
        conversion_goal: formData.conversionGoal,
        generation_count: 0,
        max_generations: 3, // Default for FREE tier
        status: 'draft'
      })
      .select('id')
      .single()

    if (error) throw error
    return data.id
  } catch (error) {
    console.error('Error creating draft project:', error)
    return null
  }
}

