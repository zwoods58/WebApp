// Subscription API integration with Kyshi
import { kyshiAPI, COUNTRY_CONFIGS } from './kyshi';
import { supabase } from './supabase';

export interface SubscriptionRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  countryCode: string;
  planId?: string;
  paymentMethod?: string;
  industry?: string;
  provider?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  subscription?: any;
  authorizationUrl?: string;
  paymentUrl?: string;
  checkoutUrl?: string;
  subscriptionId?: string;
  amount?: number;
  currency?: string;
  redirectBehavior?: 'modal' | 'external';
  mobileMoneyProvider?: string;
}

export class SubscriptionAPI {
  // Get available plans for a country
  static async getPlans(countryCode: string): Promise<any[]> {
    try {
      console.log(`Getting plans for country: ${countryCode}`);
      const plans = await kyshiAPI.listPlans(countryCode);
      console.log(`Found ${plans.length} plans from Kyshi API`);
      
      const mappedPlans = plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        country_code: plan.country,
        amount: plan.amount,
        currency: plan.currency,
        interval: plan.interval,
        planCode: plan.planCode,
        isActive: plan.isActive,
      }));
      
      console.log(`Mapped ${mappedPlans.length} plans`);
      return mappedPlans;
    } catch (error) {
      console.error('Failed to get plans from Kyshi API:', error);
      console.log('Falling back to default plans');
      
      // Return default plans if Kyshi API fails
      const config = COUNTRY_CONFIGS[countryCode as keyof typeof COUNTRY_CONFIGS];
      if (config) {
        const defaultPlan = {
          id: `default-${countryCode}`,
          name: `Weekly ${countryCode} Plan`,
          country_code: countryCode,
          amount: config.amount,
          currency: config.currency,
          interval: 'weekly',
          planCode: config.planCode,
          isActive: true,
        };
        console.log('Returning default plan:', defaultPlan);
        return [defaultPlan];
      }
      return [];
    }
  }

  // Get plan by country code
  static async getPlanByCountry(countryCode: string): Promise<any | null> {
    const plans = await this.getPlans(countryCode);
    
    if (!plans.length) {
      console.error(`No plans available for ${countryCode}`);
      return null;
    }
    
    const plan = plans.find(p => p.country_code === countryCode.toUpperCase());
    
    if (!plan) {
      console.error(`Plan not found for ${countryCode}. Available:`, 
        plans.map(p => p.country_code));
      return null;
    }
    
    return plan;
  }

  // Helper function to get plan ID for country
  static async getPlanIdForCountry(countryCode: string, amount?: number): Promise<string | null> {
    const plan = await this.getPlanByCountry(countryCode);
    return plan ? plan.id : null;
  }

  // Helper function to get plan code for country
  static async getPlanCodeForCountry(countryCode: string): Promise<string | null> {
    const config = COUNTRY_CONFIGS[countryCode as keyof typeof COUNTRY_CONFIGS];
    return config ? config.planCode : null;
  }

  // Helper function to get banks for Nigeria
  static async getBanksForNigeria(): Promise<any[]> {
    try {
      const response = await kyshiAPI.getBanks('Nigeria');
      return response || [];
    } catch (error) {
      console.error('Error fetching Nigeria banks:', error);
      return [];
    }
  }

  // Create subscription
  static async createSubscription(request: SubscriptionRequest): Promise<SubscriptionResponse> {
    try {
      const config = COUNTRY_CONFIGS[request.countryCode as keyof typeof COUNTRY_CONFIGS];
      
      if (!config) {
        throw new Error(`Unsupported country: ${request.countryCode}`);
      }

      // Get plan code
      const planCode = await this.getPlanCodeForCountry(request.countryCode);
      if (!planCode) {
        throw new Error(`No plan available for ${request.countryCode}`);
      }

      // Create subscription request for Kyshi
      const subscriptionData = {
        planCode,
        customer: request.email,
        paymentMethod: config.paymentMethod,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/callback?user_email=${request.email}&country=${request.countryCode}`,
      };

      // Add mobile money provider for specific countries
      if ('mobileMoneyProvider' in config && config.mobileMoneyProvider) {
        (subscriptionData as any).mobileMoneyProvider = config.mobileMoneyProvider;
      }

      // Call Supabase Edge Function instead of direct Kyshi API
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          user_id: 'temp-user-id', // This should come from auth context
          user_email: request.email,
          user_phone: request.phone,
          country: request.countryCode,
          full_name: `${request.firstName} ${request.lastName}`.trim(),
          mobile_money_provider: request.provider
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Log activity
      console.log('Subscription created via Edge Function:', {
        email: request.email,
        country: request.countryCode,
        planCode,
        subscriptionId: data.subscriptionId,
      });

      return {
        success: true,
        message: 'Subscription created successfully',
        subscription: data.subscription,
        authorizationUrl: data.paymentUrl,
        paymentUrl: data.paymentUrl,
        checkoutUrl: data.paymentUrl,
        subscriptionId: data.subscriptionId,
        amount: data.amount,
        currency: data.currency,
        redirectBehavior: data.redirectBehavior,
        mobileMoneyProvider: data.mobileMoneyProvider,
      };
    } catch (error) {
      console.error('Failed to create subscription:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create subscription',
      };
    }
  }

  // Get subscription status
  static async getSubscriptionStatus(subscriptionId: string): Promise<any> {
    try {
      const subscription = await kyshiAPI.getSubscription(subscriptionId);
      return {
        success: true,
        subscription,
        isActive: subscription.isActive,
        status: subscription.status,
        nextPaymentDate: subscription.nextPaymentDate,
      };
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get subscription status',
      };
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<any> {
    try {
      const subscription = await kyshiAPI.manageSubscription(subscriptionId, 'cancel');
      return {
        success: true,
        message: 'Subscription cancelled successfully',
        subscription,
      };
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel subscription',
      };
    }
  }

  // Charge subscription (manual charge)
  static async chargeSubscription(subscriptionId: string, amount?: number): Promise<any> {
    try {
      const transaction = await kyshiAPI.chargeSubscription({
        subscriptionId,
        amount,
      });
      
      return {
        success: true,
        message: 'Subscription charged successfully',
        transaction,
      };
    } catch (error) {
      console.error('Failed to charge subscription:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to charge subscription',
      };
    }
  }

  // Verify transaction
  static async verifyTransaction(reference: string): Promise<any> {
    try {
      const transaction = await kyshiAPI.verifyTransaction(reference);
      return {
        success: true,
        transaction,
        status: transaction.status,
      };
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify transaction',
      };
    }
  }
}

// Country-specific payment methods configuration
export const COUNTRY_PAYMENT_METHODS = {
  KE: {
    methods: ['card', 'mobile_money', 'bank_transfer'],
    mobileProviders: ['m-pesa', 'airtel_money', 't-kash'],
    currency: 'KES',
    defaultAmount: 200
  },
  GH: {
    methods: ['card', 'mobile_money', 'bank_transfer'],
    mobileProviders: ['mtn_momo', 'vodafone_cash', 'airteltigo_money'],
    currency: 'GHS',
    defaultAmount: 20
  },
  NG: {
    methods: ['card', 'bank_transfer', 'ussd'],
    mobileProviders: ['paga', 'opay'],
    currency: 'NGN',
    defaultAmount: 500
  },
  CI: {
    methods: ['card', 'mobile_money', 'bank_transfer'],
    mobileProviders: ['orange_money', 'mtn_momo', 'moov_money'],
    currency: 'XOF',
    defaultAmount: 1000
  },
  // ZA: {
  //   methods: ['card', 'bank_transfer'],
  //   mobileProviders: [],
  //   currency: 'ZAR',
  //   defaultAmount: 30
  // }
};

// Kyshi plan functions removed - no longer available
// Use StartButton payment system instead

