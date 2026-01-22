import { supabase } from './supabase';
import { formatCurrency, getSubscriptionPricing, getCurrentCountry } from './currency';
import { formatDate, getRelativeTime } from './dateTime';

/**
 * Unified Subscription Management System
 * Handles subscription logic across all countries with auto-renewal
 */

export class SubscriptionManager {
  constructor() {
    this.storageKey = 'beezee_subscription_data';
    this.gracePeriodDays = 3;
    this.maxRetryAttempts = 3;
    this.retryDelayHours = 24;
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        return this.getDefaultSubscriptionStatus();
      }

      return {
        ...data,
        isActive: this.isSubscriptionActive(data),
        inGracePeriod: this.isInGracePeriod(data),
        needsRenewal: this.needsRenewal(data),
        nextBillingDate: this.getNextBillingDate(data),
        formattedPrice: formatCurrency(data.amount, data.country),
        timeUntilRenewal: getRelativeTime(data.next_billing_date)
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return this.getDefaultSubscriptionStatus();
    }
  }

  /**
   * Get default subscription status for new users
   */
  getDefaultSubscriptionStatus() {
    const country = getCurrentCountry();
    const pricing = getSubscriptionPricing();
    
    return {
      id: null,
      user_id: null,
      plan_type: pricing.period === 'weekly' ? 'weekly' : 'monthly',
      amount: pricing.amount,
      currency: pricing.currency,
      country: country.code,
      status: 'trial',
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      next_billing_date: null,
      auto_renewal: true,
      payment_method_id: null,
      retry_count: 0,
      last_retry_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isActive: true,
      inGracePeriod: false,
      needsRenewal: false,
      formattedPrice: formatCurrency(pricing.amount),
      timeUntilRenewal: '7 days remaining in trial'
    };
  }

  /**
   * Check if subscription is active
   */
  isSubscriptionActive(subscription) {
    if (subscription.status === 'cancelled' || subscription.status === 'expired') {
      return false;
    }

    const now = new Date();
    
    if (subscription.status === 'trial') {
      return new Date(subscription.trial_ends_at) > now;
    }

    if (subscription.status === 'active') {
      return new Date(subscription.next_billing_date) > now || this.isInGracePeriod(subscription);
    }

    return false;
  }

  /**
   * Check if subscription is in grace period
   */
  isInGracePeriod(subscription) {
    if (subscription.status !== 'active') return false;
    
    const nextBillingDate = new Date(subscription.next_billing_date);
    const gracePeriodEnd = new Date(nextBillingDate.getTime() + this.gracePeriodDays * 24 * 60 * 60 * 1000);
    
    return new Date() > nextBillingDate && new Date() < gracePeriodEnd;
  }

  /**
   * Check if subscription needs renewal
   */
  needsRenewal(subscription) {
    if (subscription.status === 'trial') {
      return new Date(subscription.trial_ends_at) <= new Date();
    }
    
    if (subscription.status === 'active') {
      return new Date(subscription.next_billing_date) <= new Date();
    }
    
    return false;
  }

  /**
   * Get next billing date
   */
  getNextBillingDate(subscription) {
    if (subscription.status === 'trial') {
      return subscription.trial_ends_at;
    }
    
    return subscription.next_billing_date;
  }

  /**
   * Create new subscription
   */
  async createSubscription(userId, paymentMethodId, planType = null) {
    try {
      const country = getCurrentCountry();
      const pricing = getSubscriptionPricing();
      
      const subscriptionData = {
        user_id: userId,
        plan_type: planType || (pricing.period === 'weekly' ? 'weekly' : 'monthly'),
        amount: pricing.amount,
        currency: pricing.currency,
        country: country.code,
        status: 'active',
        trial_ends_at: null,
        next_billing_date: this.calculateNextBillingDate(pricing.period),
        auto_renewal: true,
        payment_method_id: paymentMethodId,
        retry_count: 0,
        last_retry_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single();

      if (error) throw error;

      // Store locally for offline access
      this.storeSubscriptionLocally(data);

      return {
        success: true,
        subscription: data
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        error: 'Failed to create subscription'
      };
    }
  }

  /**
   * Calculate next billing date based on plan type
   */
  calculateNextBillingDate(planType) {
    const now = new Date();
    
    if (planType === 'weekly') {
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return nextWeek.toISOString();
    } else {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      return nextMonth.toISOString();
    }
  }

  /**
   * Process subscription renewal
   */
  async processRenewal(subscriptionId) {
    try {
      const subscription = await this.getSubscriptionById(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Check if auto-renewal is enabled
      if (!subscription.auto_renewal) {
        await this.updateSubscriptionStatus(subscriptionId, 'expired');
        return {
          success: false,
          error: 'Auto-renewal disabled'
        };
      }

      // Check retry count
      if (subscription.retry_count >= this.maxRetryAttempts) {
        await this.updateSubscriptionStatus(subscriptionId, 'expired');
        return {
          success: false,
          error: 'Max retry attempts reached'
        };
      }

      // Process payment through payment proxy
      const paymentResult = await this.processPayment(subscription);
      
      if (paymentResult.success) {
        // Update subscription with new billing date
        const nextBillingDate = this.calculateNextBillingDate(subscription.plan_type);
        
        await supabase
          .from('subscriptions')
          .update({
            next_billing_date: nextBillingDate,
            retry_count: 0,
            last_retry_at: null,
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionId);

        return {
          success: true,
          nextBillingDate
        };
      } else {
        // Increment retry count
        const retryCount = subscription.retry_count + 1;
        
        await supabase
          .from('subscriptions')
          .update({
            retry_count: retryCount,
            last_retry_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriptionId);

        return {
          success: false,
          error: paymentResult.error,
          retryCount,
          maxRetries: this.maxRetryAttempts
        };
      }
    } catch (error) {
      console.error('Error processing renewal:', error);
      return {
        success: false,
        error: 'Failed to process renewal'
      };
    }
  }

  /**
   * Process payment through payment proxy
   */
  async processPayment(subscription) {
    try {
      const paymentData = {
        amount: subscription.amount,
        currency: subscription.currency,
        country: subscription.country,
        user_id: subscription.user_id,
        description: `BeeZee Finance ${subscription.plan_type} subscription`,
        payment_method_id: subscription.payment_method_id,
        order_id: `sub_${subscription.id}_${Date.now()}`
      };

      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-SUPABASE-SECRET': process.env.NEXT_PUBLIC_SUPABASE_SECRET
        },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          paymentId: result.payment_id
        };
      } else {
        return {
          success: false,
          error: result.error || 'Payment failed'
        };
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: 'Payment service unavailable'
      };
    }
  }

  /**
   * Update subscription status
   */
  async updateSubscriptionStatus(subscriptionId, status) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating subscription status:', error);
      return { success: false, error: 'Failed to update status' };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'cancelled',
          auto_renewal: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { success: false, error: 'Failed to cancel subscription' };
    }
  }

  /**
   * Toggle auto-renewal
   */
  async toggleAutoRenewal(subscriptionId, enabled) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          auto_renewal: enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error updating auto-renewal:', error);
      return { success: false, error: 'Failed to update auto-renewal' };
    }
  }

  /**
   * Get subscription by ID
   */
  async getSubscriptionById(subscriptionId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  }

  /**
   * Store subscription locally for offline access
   */
  storeSubscriptionLocally(subscription) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(subscription));
    } catch (error) {
      console.error('Error storing subscription locally:', error);
    }
  }

  /**
   * Get subscription from local storage
   */
  getLocalSubscription() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading local subscription:', error);
      return null;
    }
  }

  /**
   * Check for pending renewals and process them
   */
  async processPendingRenewals() {
    try {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'active')
        .lte('next_billing_date', new Date().toISOString());

      if (error) throw error;

      const renewalPromises = subscriptions.map(sub => this.processRenewal(sub.id));
      const results = await Promise.allSettled(renewalPromises);

      return {
        processed: subscriptions.length,
        successful: results.filter(r => r.status === 'fulfilled' && r.value.success).length,
        failed: results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length
      };
    } catch (error) {
      console.error('Error processing pending renewals:', error);
      return {
        processed: 0,
        successful: 0,
        failed: 0
      };
    }
  }

  /**
   * Get subscription analytics
   */
  async getSubscriptionAnalytics(userId) {
    try {
      const { data, error } = await supabase
        .from('subscription_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('period_start', { ascending: false })
        .limit(12);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return {
        success: true,
        analytics: data || []
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        success: false,
        analytics: []
      };
    }
  }
}

// Create singleton instance
export const subscriptionManager = new SubscriptionManager();
