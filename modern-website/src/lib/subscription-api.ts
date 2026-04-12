// Kyshi Subscription API integration for modals

export interface SubscriptionRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  countryCode: string;
  planId: string;
  paymentMethod?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  subscription?: any;
  kyshiSubscriptionId?: string;
  authorizationUrl?: string;
}

export class SubscriptionAPI {
  private static baseUrl = '/api/kyshi';

  static async createSubscription(request: SubscriptionRequest): Promise<SubscriptionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription API Error:', error);
      throw error;
    }
  }

  static async getPlans(countryCode?: string): Promise<any[]> {
    try {
      const url = countryCode ? `${this.baseUrl}/plans?country=${countryCode}` : `${this.baseUrl}/plans`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }

      return await response.json();
    } catch (error) {
      console.error('Plans API Error:', error);
      throw error;
    }
  }

  static async getSubscriptionStatus(subscriptionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/subscription-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get subscription status');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription Status API Error:', error);
      throw error;
    }
  }

  static async cancelSubscription(subscriptionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel Subscription API Error:', error);
      throw error;
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
  ZA: {
    methods: ['card', 'bank_transfer'],
    mobileProviders: [],
    currency: 'ZAR',
    defaultAmount: 30
  }
};

// Helper function to get plan ID based on country and amount
export async function getPlanIdForCountry(countryCode: string, amount: number): Promise<string> {
  try {
    const plans = await SubscriptionAPI.getPlans(countryCode);
    const plan = plans.find((p: any) => p.amount === amount && p.country_code === countryCode);
    
    if (!plan) {
      throw new Error(`No plan found for ${countryCode} with amount ${amount}`);
    }
    
    return plan.id;
  } catch (error) {
    console.error('Error finding plan:', error);
    throw error;
  }
}
