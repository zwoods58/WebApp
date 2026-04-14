// Kyshi API Client for subscription management
export interface KyshiPlan {
  id: string;
  name: string;
  description: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually';
  amount: number;
  localCurrency: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KyshiCustomer {
  id: string;
  email: string;
  currencyCode: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  customerCode?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KyshiSubscription {
  id: string;
  code: string;
  customer: KyshiCustomer;
  plan: KyshiPlan;
  startDate: string;
  nextPaymentDate: string;
  isActive: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually';
  amount: number;
  localCurrency: string;
}

export interface CreateSubscriptionRequest {
  customer: string; // customer email
  planCode: string; // plan code from Kyshi
  paymentMethod?: string; // 'card', 'mobile_money', 'bank_transfer', 'ussd'
  country?: string; // customer country code (e.g., 'KE', 'GH', 'NG', 'CI')
  callback_url?: string; // webhook callback URL
  metadata?: {
    country?: string;
    payment_channels?: string[];
    mobile_money_providers?: string[];
    currency?: string;
    return_url?: string;
    is_mobile_money_subscription?: boolean;
    [key: string]: any;
  };
}

export interface KyshiApiResponse<T> {
  status: boolean;
  message: string;
  code: number;
  data: T;
}

class KyshiApiClient {
  private baseUrl: string;
  private secretKey: string;

  constructor() {
    // Official Kyshi API endpoint
    this.baseUrl = process.env.KYSHI_BASE_URL || 'https://api.kyshi.co/v1';
    this.secretKey = process.env.KYSHI_SECRET_KEY || '';
    
    // Only throw error in runtime, not during build
    if (typeof window !== 'undefined' && !this.secretKey) {
      throw new Error('KYSHI_SECRET_KEY environment variable is not set');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<KyshiApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Debug logging for authentication issues
    if (process.env.NODE_ENV === 'development') {
      console.log('[Kyshi API] Request:', {
        url,
        method: options.method || 'GET',
        hasApiKey: !!this.secretKey,
        apiKeyLength: this.secretKey?.length || 0,
        apiKeyPrefix: this.secretKey?.substring(0, 8) || 'MISSING'
      });
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.secretKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Kyshi API] Error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        errorText
      });
      throw new Error(`Kyshi API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  // Test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      // Try to list plans as a simple connectivity test
      await this.listPlans();
      return true;
    } catch (error) {
      console.error('Kyshi API connection failed:', error);
      return false;
    }
  }

  // Plan Management
  async createPlan(planData: CreatePlanRequest): Promise<KyshiPlan> {
    const response = await this.makeRequest<KyshiPlan>('/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
    return response.data;
  }

  async listPlans(): Promise<KyshiPlan[]> {
    const response = await this.makeRequest<KyshiPlan[]>('/plans');
    return response.data;
  }

  async getPlan(planId: string): Promise<KyshiPlan> {
    const response = await this.makeRequest<KyshiPlan>(`/plans/${planId}`);
    return response.data;
  }

  // Customer Management (if needed for future use)
  async createCustomer(customerData: {
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    currencyCode?: string;
    country?: string; // Add country field
    metadata?: {
      country?: string;
      [key: string]: any;
    };
  }): Promise<KyshiCustomer> {
    const response = await this.makeRequest<KyshiCustomer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    return response.data;
  }

  // Subscription Management
  async createSubscription(subscriptionData: CreateSubscriptionRequest): Promise<KyshiSubscription> {
    const response = await this.makeRequest<KyshiSubscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
    return response.data;
  }

  async listSubscriptions(): Promise<KyshiSubscription[]> {
    const response = await this.makeRequest<KyshiSubscription[]>('/subscriptions');
    return response.data;
  }

  async getSubscription(subscriptionId: string): Promise<KyshiSubscription> {
    const response = await this.makeRequest<KyshiSubscription>(`/subscriptions/${subscriptionId}`);
    return response.data;
  }

  async getSubscriptionByCode(subscriptionCode: string): Promise<KyshiSubscription> {
    const response = await this.makeRequest<KyshiSubscription>(`/subscriptions/${subscriptionCode}`);
    return response.data;
  }

  async verifyTransaction(reference: string): Promise<any> {
    const response = await this.makeRequest<any>(`/subscriptions/${reference}`);
    return response.data;
  }

  async getTransactionStatus(reference: string): Promise<{ status: string; paid: boolean; data?: any }> {
    try {
      const subscriptionData = await this.verifyTransaction(reference);
      return {
        status: subscriptionData.isActive ? 'success' : 'pending',
        paid: subscriptionData.isActive || false,
        data: subscriptionData
      };
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return {
        status: 'error',
        paid: false,
        data: null
      };
    }
  }

  async chargeSubscription(subscriptionId: string, paymentMethod?: string, amount?: number, reference?: string): Promise<any> {
    const payload: any = {};
    if (paymentMethod) payload.paymentMethod = paymentMethod;
    if (amount) payload.amount = amount;
    if (reference) payload.reference = reference;
    
    const response = await this.makeRequest<any>(`/subscriptions/${subscriptionId}/charge`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data;
  }
}

// Lazy initialization to avoid build-time errors
let kyshiApiInstance: KyshiApiClient | null = null;

export const kyshiApi = (): KyshiApiClient => {
  if (!kyshiApiInstance) {
    kyshiApiInstance = new KyshiApiClient();
  }
  return kyshiApiInstance;
};

// Utility functions for country-specific weekly subscriptions
export const createKenyaWeeklyPlan = async (): Promise<KyshiPlan> => {
  const planData: CreatePlanRequest = {
    name: 'Kenya Weekly Premium',
    description: 'Weekly subscription for BeeZee premium features in Kenya',
    interval: 'weekly',
    amount: 200,
    localCurrency: 'KES',
  };

  return kyshiApi().createPlan(planData);
};

export const createCoteDIvoireWeeklyPlan = async (): Promise<KyshiPlan> => {
  const planData: CreatePlanRequest = {
    name: 'Cote D\'Ivoire Weekly Premium',
    description: 'Weekly subscription for BeeZee premium features in Cote D\'Ivoire',
    interval: 'weekly',
    amount: 1000,
    localCurrency: 'XOF',
  };

  return kyshiApi().createPlan(planData);
};

export const testKyshiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const isConnected = await kyshiApi().testConnection();
    return {
      success: isConnected,
      message: isConnected ? 'Kyshi API connection successful' : 'Kyshi API connection failed',
    };
  } catch (error) {
    return {
      success: false,
      message: `Kyshi API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
