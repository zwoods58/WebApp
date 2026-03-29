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
  customer: string; // customer ID or email
  plan: string; // plan ID
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
    this.baseUrl = process.env.KYSHI_BASE_URL || 'https://kyshi-mor-dev-qkuod6snia-nw.a.run.app/api/v1';
    this.secretKey = process.env.KYSHI_SECRET_KEY || '';
    
    if (!this.secretKey) {
      throw new Error('KYSHI_SECRET_KEY environment variable is not set');
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<KyshiApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
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

  async chargeSubscription(subscriptionId: string): Promise<any> {
    const response = await this.makeRequest<any>(`/subscriptions/${subscriptionId}/charge`, {
      method: 'POST',
    });
    return response.data;
  }
}

// Singleton instance
export const kyshiApi = new KyshiApiClient();

// Utility functions for Kenya weekly subscription
export const createKenyaWeeklyPlan = async (): Promise<KyshiPlan> => {
  const planData: CreatePlanRequest = {
    name: 'Kenya Weekly Premium',
    description: 'Weekly subscription for BeeZee premium features in Kenya',
    interval: 'weekly',
    amount: 200,
    localCurrency: 'KES',
  };

  return kyshiApi.createPlan(planData);
};

export const testKyshiConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const isConnected = await kyshiApi.testConnection();
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
