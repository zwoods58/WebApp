// Kyshi Subscription API integration for modals

export interface SubscriptionRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  countryCode: string;
  planId: string;
  paymentMethod?: string;
  industry?: string;
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

  // Helper function to validate plan data
  private static validatePlans(plans: any[]): plans is any[] {
    if (!Array.isArray(plans)) return false;
    
    for (const plan of plans) {
      if (!plan.id || !plan.country_code || !plan.amount) {
        console.warn('Invalid plan structure:', plan);
        return false;
      }
    }
    
    return true;
  }

  // Helper function to get plan by country with fallback
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
      // Build URL with optional country filter
      const url = countryCode 
        ? `${this.baseUrl}/plans?country=${countryCode}` 
        : `${this.baseUrl}/plans`;
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      console.log('Plans API response:', data); // Debug log
      
      // Handle your API's response format: { success: true, plans: [...] }
      let plansArray: any[] = [];
      
      if (data.success && Array.isArray(data.plans)) {
        // Format 1: { success: true, plans: [...] }
        plansArray = data.plans;
        console.log(`Retrieved ${plansArray.length} plans from success.plans format`);
      } 
      else if (Array.isArray(data)) {
        // Format 2: Direct array
        plansArray = data;
        console.log(`Retrieved ${plansArray.length} plans from direct array format`);
      } 
      else if (data.data && Array.isArray(data.data)) {
        // Format 3: { data: [...] }
        plansArray = data.data;
        console.log(`Retrieved ${plansArray.length} plans from data.data format`);
      } 
      else if (data.plans && Array.isArray(data.plans)) {
        // Format 4: { plans: [...] } without success flag
        plansArray = data.plans;
        console.log(`Retrieved ${plansArray.length} plans from plans field`);
      } 
      else {
        console.error('Unexpected plans response format:', data);
        throw new Error('Invalid plans response format');
      }
      
      // Optional: Filter by country if not already filtered by API
      if (countryCode && !url.includes('country=')) {
        const beforeCount = plansArray.length;
        plansArray = plansArray.filter(plan => plan.country_code === countryCode.toUpperCase());
        console.log(`Filtered plans by country ${countryCode}: ${beforeCount} -> ${plansArray.length}`);
      }
      
      if (plansArray.length === 0) {
        console.warn('No plans found for country:', countryCode || 'all');
      }
      
      return plansArray;
      
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
  // ZA: {
  //   methods: ['card', 'bank_transfer'],
  //   mobileProviders: [],
  //   currency: 'ZAR',
  //   defaultAmount: 30
  // }
};

// Helper function to get plan ID based on country and amount
export async function getPlanIdForCountry(countryCode: string, amount: number): Promise<string> {
  try {
    const plans = await SubscriptionAPI.getPlans(countryCode);
    
    console.log(`Found ${plans.length} plans for ${countryCode}:`, plans);
    
    // Find plan by amount and country_code (database now includes country_code)
    const plan = plans.find((p: any) => {
      const planAmount = p.amount || 0;
      const planCountry = (p.country_code || '').toUpperCase();
      const expectedCountry = countryCode.toUpperCase();
      
      return planAmount === amount && planCountry === expectedCountry;
    });
    
    if (!plan) {
      console.warn(`No plan found for ${countryCode} with amount ${amount}`, { 
        availablePlans: plans.map(p => ({ 
          id: p.id, 
          amount: p.amount, 
          country_code: p.country_code,
          currency: p.localCurrency || p.currency,
          code: p.code,
          name: p.name
        }))
      });
      throw new Error(`No plan found for ${countryCode} with amount ${amount}`);
    }
    
    console.log(`Found plan for ${countryCode}:`, { 
      planId: plan.id, 
      amount: plan.amount, 
      country_code: plan.country_code,
      name: plan.name
    });
    return plan.id;
  } catch (error) {
    console.error('Error finding plan:', error);
    throw error;
  }
}

// Enhanced version: Get plan ID by country only (as specified in the plan)
export async function getPlanIdForCountryOnly(country: string): Promise<string | null> {
  try {
    console.log(`Looking for plan ID for country: ${country}`);
    
    // Use the static method from SubscriptionAPI
    const plans = await SubscriptionAPI.getPlans(country);
    
    if (!plans || plans.length === 0) {
      console.error(`No plans found for country: ${country}`);
      return null;
    }
    
    // Find the plan matching the country
    const plan = plans.find(p => p.country_code === country.toUpperCase());
    
    if (!plan) {
      console.error(`No plan found with country_code: ${country}`, { 
        availableCountries: plans.map(p => p.country_code) 
      });
      return null;
    }
    
    console.log(`Found plan for ${country}:`, { 
      id: plan.id, 
      name: plan.name, 
      amount: plan.amount,
      currency: plan.localCurrency || plan.currency 
    });
    
    return plan.id;
    
  } catch (error) {
    console.error(`Error finding plan for ${country}:`, error);
    return null;
  }
}
