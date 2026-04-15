// Subscription Monitor - Hybrid Approach (Webhooks + API Polling)
import { kyshiAPI } from './kyshi';
import { supabase } from './supabase';

export class SubscriptionMonitor {
  private static instance: SubscriptionMonitor;
  private pollingInterval: NodeJS.Timeout | null = null;
  private isPolling = false;

  static getInstance(): SubscriptionMonitor {
    if (!SubscriptionMonitor.instance) {
      SubscriptionMonitor.instance = new SubscriptionMonitor();
    }
    return SubscriptionMonitor.instance;
  }

  // Start monitoring subscriptions (backup to webhooks)
  startPolling(intervalMinutes: number = 5) {
    if (this.isPolling) {
      console.log('🔄 Subscription monitoring already active');
      return;
    }

    console.log(`🚀 Starting subscription monitoring (every ${intervalMinutes} minutes)`);
    this.isPolling = true;

    this.pollingInterval = setInterval(async () => {
      await this.checkPendingSubscriptions();
    }, intervalMinutes * 60 * 1000);

    // Check immediately on start
    this.checkPendingSubscriptions();
  }

  // Stop monitoring
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log('⏹️ Subscription monitoring stopped');
  }

  // Check pending subscriptions via API
  private async checkPendingSubscriptions() {
    try {
      console.log('🔍 Checking pending subscriptions...');

      // Get pending subscriptions from database
      const { data: pendingSubs, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('status', 'pending')
        .or('status.eq.failed')
        .lt('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Older than 5 minutes
        .limit(50);

      if (error) {
        console.error('❌ Error fetching pending subscriptions:', error);
        return;
      }

      if (!pendingSubs || pendingSubs.length === 0) {
        console.log('✅ No pending subscriptions to check');
        return;
      }

      console.log(`📊 Found ${pendingSubs.length} pending subscriptions`);

      // Check each subscription with Kyshi API
      for (const sub of pendingSubs) {
        if (sub.kyshi_subscription_id) {
          await this.checkSubscriptionStatus(sub);
        }
      }

    } catch (error) {
      console.error('❌ Error in subscription monitoring:', error);
    }
  }

  // Check individual subscription status
  private async checkSubscriptionStatus(subscription: any) {
    try {
      console.log(`🔍 Checking subscription: ${subscription.kyshi_subscription_id}`);

      // Get current status from Kyshi
      const kyshiSub = await kyshiAPI.getSubscription(subscription.kyshi_subscription_id);

      if (!kyshiSub) {
        console.error(`❌ Failed to fetch subscription ${subscription.kyshi_subscription_id}`);
        return;
      }

      console.log(`📊 Kyshi status: ${kyshiSub.status}, Active: ${kyshiSub.isActive}`);

      // Update database if status changed
      if (kyshiSub.status !== subscription.status || kyshiSub.isActive !== subscription.is_active) {
        await this.updateSubscriptionStatus(subscription.id, kyshiSub);
        
        // Trigger business logic based on status change
        await this.handleStatusChange(subscription, kyshiSub);
      }

    } catch (error) {
      console.error(`❌ Error checking subscription ${subscription.kyshi_subscription_id}:`, error);
    }
  }

  // Update subscription status in database
  private async updateSubscriptionStatus(subscriptionId: string, kyshiSub: any) {
    try {
      const updateData = {
        status: kyshiSub.status,
        is_active: kyshiSub.isActive,
        current_period_start: kyshiSub.startDate,
        current_period_end: kyshiSub.nextPaymentDate,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', subscriptionId);

      if (error) {
        console.error('❌ Error updating subscription:', error);
      } else {
        console.log(`✅ Updated subscription ${subscriptionId} to status: ${kyshiSub.status}`);
      }

    } catch (error) {
      console.error('❌ Error in updateSubscriptionStatus:', error);
    }
  }

  // Handle business logic for status changes
  private async handleStatusChange(oldSubscription: any, newKyshiSub: any) {
    const oldStatus = oldSubscription.status;
    const newStatus = newKyshiSub.status;

    console.log(`🔄 Status change: ${oldStatus} → ${newStatus}`);

    // Handle different status transitions
    switch (newStatus) {
      case 'active':
        await this.handleActivation(oldSubscription, newKyshiSub);
        break;
      
      case 'cancelled':
        await this.handleCancellation(oldSubscription, newKyshiSub);
        break;
      
      case 'expired':
        await this.handleExpiration(oldSubscription, newKyshiSub);
        break;
      
      case 'pending':
        // Still pending, no action needed
        break;
      
      default:
        console.log(`ℹ️  Unknown status: ${newStatus}`);
    }
  }

  // Handle subscription activation
  private async handleActivation(subscription: any, kyshiSub: any) {
    console.log(`🎉 Subscription activated: ${subscription.user_email}`);

    // Grant user access
    await this.grantUserAccess(subscription.user_id);

    // Send welcome/notification
    await this.sendNotification(subscription.user_email, 'subscription_activated', {
      planName: kyshiSub.plan?.name || 'Your plan',
      nextPaymentDate: kyshiSub.nextPaymentDate
    });

    // Log activation
    await this.logActivity(subscription.user_id, 'subscription_activated', {
      subscriptionId: kyshiSub.id,
      amount: kyshiSub.amount,
      currency: kyshiSub.currency
    });
  }

  // Handle subscription cancellation
  private async handleCancellation(subscription: any, kyshiSub: any) {
    console.log(`🚫 Subscription cancelled: ${subscription.user_email}`);

    // Revoke user access
    await this.revokeUserAccess(subscription.user_id);

    // Send cancellation notification
    await this.sendNotification(subscription.user_email, 'subscription_cancelled', {
      cancelledAt: new Date().toISOString()
    });

    // Log cancellation
    await this.logActivity(subscription.user_id, 'subscription_cancelled', {
      subscriptionId: kyshiSub.id
    });
  }

  // Handle subscription expiration
  private async handleExpiration(subscription: any, kyshiSub: any) {
    console.log(`⏰ Subscription expired: ${subscription.user_email}`);

    // Revoke user access
    await this.revokeUserAccess(subscription.user_id);

    // Send expiration notification
    await this.sendNotification(subscription.user_email, 'subscription_expired', {
      expiredAt: new Date().toISOString()
    });

    // Log expiration
    await this.logActivity(subscription.user_id, 'subscription_expired', {
      subscriptionId: kyshiSub.id
    });
  }

  // Grant user access (implement based on your business logic)
  private async grantUserAccess(userId: string) {
    try {
      // Update user's subscription status
      await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          access_granted_at: new Date().toISOString()
        })
        .eq('id', userId);

      console.log(`✅ Access granted to user: ${userId}`);
    } catch (error) {
      console.error('❌ Error granting user access:', error);
    }
  }

  // Revoke user access (implement based on your business logic)
  private async revokeUserAccess(userId: string) {
    try {
      // Update user's subscription status
      await supabase
        .from('users')
        .update({
          subscription_status: 'inactive',
          access_revoked_at: new Date().toISOString()
        })
        .eq('id', userId);

      console.log(`🚫 Access revoked from user: ${userId}`);
    } catch (error) {
      console.error('❌ Error revoking user access:', error);
    }
  }

  // Send notification (implement based on your notification system)
  private async sendNotification(email: string, type: string, data: any) {
    try {
      // Implement your notification logic here
      // Email, SMS, push notification, etc.
      console.log(`📧 Sending ${type} notification to ${email}:`, data);
      
      // Example: Send email via your email service
      // await emailService.send(email, type, data);
      
    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }

  // Log activity for audit trail
  private async logActivity(userId: string, action: string, data: any) {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action: action,
          data: data,
          created_at: new Date().toISOString()
        });

      console.log(`📝 Logged activity: ${action} for user: ${userId}`);
    } catch (error) {
      console.error('❌ Error logging activity:', error);
    }
  }

  // Manual check for specific subscription
  async checkSpecificSubscription(subscriptionId: string) {
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single();

      if (subscription && subscription.kyshi_subscription_id) {
        await this.checkSubscriptionStatus(subscription);
        return subscription;
      }

      return null;
    } catch (error) {
      console.error('❌ Error checking specific subscription:', error);
      return null;
    }
  }
}

// Export singleton instance
export const subscriptionMonitor = SubscriptionMonitor.getInstance();

// Auto-start monitoring in production
if (process.env.NODE_ENV === 'production') {
  // Start polling every 10 minutes as backup to webhooks
  subscriptionMonitor.startPolling(10);
}

// Export configuration for webhook setup
export const webhookConfig = {
  url: 'https://atarwebb.com/api/webhooks/kyshi',
  secret: 'c4accdbb6b2f49608ef729cd9afed411'
};
