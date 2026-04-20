// Subscription Monitor - Transaction-based (no recurring subscriptions)
// Monitors payment_transactions and updates businesses table
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

  startPolling(intervalMinutes: number = 10) {
    if (this.isPolling) {
      console.log('🔄 Subscription monitoring already active');
      return;
    }
    console.log(`🚀 Starting subscription monitoring (every ${intervalMinutes} minutes)`);
    this.isPolling = true;
    this.pollingInterval = setInterval(async () => {
      await this.checkExpiredSubscriptions();
    }, intervalMinutes * 60 * 1000);

    // Run immediately on start
    this.checkExpiredSubscriptions();
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log('⏹️ Subscription monitoring stopped');
  }

  // Check for businesses whose subscription has expired and mark them inactive
  private async checkExpiredSubscriptions() {
    try {
      console.log('🔍 Checking for expired subscriptions...');

      const now = new Date().toISOString();

      // Find businesses that are marked active but have expired
      const { data: expiredBusinesses, error } = await supabase
        .from('businesses')
        .select('id, email, subscription_status, subscription_expires_at')
        .eq('subscription_status', 'active')
        .lt('subscription_expires_at', now);

      if (error) {
        console.error('❌ Error fetching expired businesses:', error);
        return;
      }

      if (!expiredBusinesses || expiredBusinesses.length === 0) {
        console.log('✅ No expired subscriptions found');
        return;
      }

      console.log(`📊 Found ${expiredBusinesses.length} expired subscriptions`);

      for (const business of expiredBusinesses) {
        await this.expireBusiness(business);
      }

    } catch (error) {
      console.error('❌ Error in subscription monitoring:', error);
    }
  }

  private async expireBusiness(business: any) {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          subscription_status: 'inactive',
          updated_at: new Date().toISOString(),
        })
        .eq('id', business.id);

      if (error) {
        console.error(`❌ Failed to expire business ${business.id}:`, error);
      } else {
        console.log(`⏰ Subscription expired for business: ${business.id}`);
        await this.logActivity(business.id, 'subscription_expired', {
          expiredAt: business.subscription_expires_at,
        });
      }
    } catch (error) {
      console.error('❌ Error expiring business:', error);
    }
  }

  // Check status of a specific pending payment transaction
  async checkPendingTransaction(reference: string) {
    try {
      const { data: txn } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('reference', reference)
        .single();

      if (!txn) {
        console.error('❌ Transaction not found:', reference);
        return null;
      }

      // Verify with Kyshi API
      const kyshiRes = await fetch(
        `${process.env.KYSHI_BASE_URL ?? 'https://api.kyshi.co/v1'}/transactions/verify/${reference}`,
        {
          headers: { 'x-api-key': process.env.KYSHI_SECRET_KEY ?? '' },
        }
      );

      const kyshiData = await kyshiRes.json();

      if (kyshiData?.data?.status === 'SUCCESS' && txn.status !== 'SUCCESS') {
        // Payment confirmed — activate business
        await supabase
          .from('payment_transactions')
          .update({ status: 'SUCCESS', paid_at: new Date().toISOString() })
          .eq('reference', reference);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await supabase
          .from('businesses')
          .update({
            subscription_status: 'active',
            subscription_expires_at: expiresAt.toISOString(),
            last_payment_reference: reference,
            last_payment_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', txn.business_id);

        console.log(`✅ Manually activated business ${txn.business_id} via polling`);

        await this.logActivity(txn.business_id, 'subscription_activated_via_polling', {
          reference,
          expiresAt: expiresAt.toISOString(),
        });
      }

      return txn;
    } catch (error) {
      console.error('❌ Error checking transaction:', error);
      return null;
    }
  }

  private async logActivity(businessId: string, action: string, data: any) {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          business_id: businessId,
          action,
          data,
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      // Non-critical — don't throw
      console.error('❌ Error logging activity:', error);
    }
  }
}

export const subscriptionMonitor = SubscriptionMonitor.getInstance();

// Only start polling on server side in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  subscriptionMonitor.startPolling(10);
}

export const webhookConfig = {
  url: 'https://atarwebb.com/api/webhooks/kyshi',
  secret: process.env.KYSHI_WEBHOOK_SECRET ?? '',
};