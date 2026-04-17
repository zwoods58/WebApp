// Kyshi API Client
// Documentation: https://docs.kyshi.co

export interface KyshiConfig {
  secretKey: string;
  publicKey: string;
  baseUrl: string;
}

export interface KyshiPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: 'weekly' | 'monthly' | 'yearly';
  country: string;
  planCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KyshiCustomer {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  country?: string;
  createdAt: string;
}

export interface KyshiSubscription {
  id: string;
  code: string;
  plan: KyshiPlan;
  customer: KyshiCustomer;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  isActive: boolean;
  startDate: string;
  nextPaymentDate: string;
  endDate?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  authorizationUrl?: string;
  checkoutUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KyshiTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  paymentMethod: string;
  customer: KyshiCustomer;
  subscription?: KyshiSubscription;
  createdAt: string;
  processedAt?: string;
}

export interface CreatePlanRequest {
  name: string;
  amount: number;
  currency: string;
  interval: 'weekly' | 'monthly' | 'yearly';
  country: string;
  description?: string;
}

export interface CreateSubscriptionRequest {
  planCode: string;
  customer: string; // email
  paymentMethod: string;
  redirectUrl?: string;
  mobileMoneyProvider?: string;
}

export interface ChargeSubscriptionRequest {
  subscriptionId: string;
  amount?: number; // optional, uses plan amount if not provided
}

export interface CreateCustomerRequest {
  email: string;
  phone?: string;
  name?: string;
  country?: string;
}

export interface InitiateTransferRequest {
  amount: number;
  currency: string;
  recipientAccountNumber: string;
  recipientBankCode: string;
  recipientName: string;
  narration?: string;
}

export interface CreateBeneficiaryRequest {
  accountNumber: string;
  bankCode: string;
  accountName: string;
  narration?: string;
}

export class KyshiAPI {
  private config: KyshiConfig;

  constructor(config: KyshiConfig) {
    this.config = config;
  }

  private async makeRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.secretKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Plans Management
  async createPlan(planData: CreatePlanRequest): Promise<KyshiPlan> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiPlan }>('/v1/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
    
    if (!response.status) {
      throw new Error('Failed to create plan');
    }
    
    return response.data;
  }

  async listPlans(countryCode?: string): Promise<KyshiPlan[]> {
    const params = countryCode ? `?country=${countryCode}` : '';
    const response = await this.makeRequest<{ status: boolean; data: { data: KyshiPlan[] } }>(`/v1/plans${params}`);
    
    if (!response.data || !response.data.data) {
      return [];
    }
    
    return response.data.data.map((plan: any) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      amount: parseFloat(plan.amount),
      currency: plan.localCurrency || this.getCurrencyFromPlanName(plan.name),
      interval: plan.interval,
      country: this.getCountryFromPlanName(plan.name),
      planCode: plan.code,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));
  }

  private getCurrencyFromPlanName(name: string): string {
    if (name.toLowerCase().includes('kenya') || name.toLowerCase().includes('kes')) return 'KES';
    if (name.toLowerCase().includes('nigeria') || name.toLowerCase().includes('naira') || name.toLowerCase().includes('ngn')) return 'NGN';
    if (name.toLowerCase().includes('ghana') || name.toLowerCase().includes('ghs')) return 'GHS';
    if (name.toLowerCase().includes('côte') || name.toLowerCase().includes('cote') || name.toLowerCase().includes('xof')) return 'XOF';
    return 'USD'; // Default fallback
  }

  private getCountryFromPlanName(name: string): string {
    if (name.toLowerCase().includes('kenya')) return 'Kenya';
    if (name.toLowerCase().includes('nigeria')) return 'Nigeria';
    if (name.toLowerCase().includes('ghana')) return 'Ghana';
    if (name.toLowerCase().includes('côte') || name.toLowerCase().includes('cote') || name.toLowerCase().includes('ivoire')) return 'Côte d\'Ivoire';
    return 'Unknown'; // Default fallback
  }

  async getPlan(planId: string): Promise<KyshiPlan> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiPlan }>(`/v1/plans/${planId}`);
    
    if (!response.status) {
      throw new Error('Failed to get plan');
    }
    
    return response.data;
  }

  // Customers Management
  async createCustomer(customerData: CreateCustomerRequest): Promise<KyshiCustomer> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiCustomer }>('/v1/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
    
    if (!response.status) {
      throw new Error('Failed to create customer');
    }
    
    return response.data;
  }

  // Subscriptions Management
  async createSubscription(subscriptionData: CreateSubscriptionRequest): Promise<KyshiSubscription> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiSubscription }>('/v1/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
    
    if (!response.status) {
      throw new Error('Failed to create subscription');
    }
    
    return response.data;
  }

  async listSubscriptions(customerEmail?: string): Promise<KyshiSubscription[]> {
    const params = customerEmail ? `?customer=${customerEmail}` : '';
    const response = await this.makeRequest<{ status: boolean; data: KyshiSubscription[] }>(`/v1/subscriptions${params}`);
    
    if (!response.status) {
      throw new Error('Failed to list subscriptions');
    }
    
    return response.data;
  }

  async getSubscription(subscriptionId: string): Promise<KyshiSubscription> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiSubscription }>(`/v1/subscriptions/${subscriptionId}`);
    
    if (!response.status) {
      throw new Error('Failed to get subscription');
    }
    
    return response.data;
  }

  async chargeSubscription(chargeData: ChargeSubscriptionRequest): Promise<KyshiTransaction> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiTransaction }>('/v1/subscriptions/charge', {
      method: 'POST',
      body: JSON.stringify(chargeData),
    });
    
    if (!response.status) {
      throw new Error('Failed to charge subscription');
    }
    
    return response.data;
  }

  async manageSubscription(subscriptionId: string, action: 'cancel' | 'pause' | 'resume'): Promise<KyshiSubscription> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiSubscription }>('/v1/subscriptions', {
      method: 'PATCH',
      body: JSON.stringify({
        subscriptionId,
        action,
      }),
    });
    
    if (!response.status) {
      throw new Error(`Failed to ${action} subscription`);
    }
    
    return response.data;
  }

  // Transactions
  async verifyTransaction(reference: string): Promise<KyshiTransaction> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiTransaction }>(`/v1/transactions/${reference}/verify`);
    
    if (!response.status) {
      throw new Error('Failed to verify transaction');
    }
    
    return response.data;
  }

  async chargeTransaction(chargeData: ChargeSubscriptionRequest): Promise<KyshiTransaction> {
    const response = await this.makeRequest<{ status: boolean; data: KyshiTransaction }>('/v1/transactions/charge', {
      method: 'POST',
      body: JSON.stringify(chargeData),
    });
    
    if (!response.status) {
      throw new Error('Failed to charge transaction');
    }
    
    return response.data;
  }

  // Transfers
  async initiateTransfer(transferData: InitiateTransferRequest): Promise<{ reference: string; status: string }> {
    const response = await this.makeRequest<{ status: boolean; data: { reference: string; status: string } }>('/v1/transfers/initiate', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
    
    if (!response.status) {
      throw new Error('Failed to initiate transfer');
    }
    
    return response.data;
  }

  async confirmTransfer(reference: string, otp: string): Promise<{ status: string; transactionId: string }> {
    const response = await this.makeRequest<{ status: boolean; data: { status: string; transactionId: string } }>(`/v1/transfers/${reference}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
    
    if (!response.status) {
      throw new Error('Failed to confirm transfer');
    }
    
    return response.data;
  }

  // Beneficiaries
  async createBeneficiary(beneficiaryData: CreateBeneficiaryRequest): Promise<{ id: string; accountNumber: string; accountName: string; bankCode: string }> {
    const response = await this.makeRequest<{ status: boolean; data: { id: string; accountNumber: string; accountName: string; bankCode: string } }>('/v1/beneficiaries', {
      method: 'POST',
      body: JSON.stringify(beneficiaryData),
    });
    
    if (!response.status) {
      throw new Error('Failed to create beneficiary');
    }
    
    return response.data;
  }

  async listBeneficiaries(): Promise<Array<{ id: string; accountNumber: string; accountName: string; bankCode: string }>> {
    const response = await this.makeRequest<{ status: boolean; data: Array<{ id: string; accountNumber: string; accountName: string; bankCode: string }> }>('/v1/beneficiaries');
    
    if (!response.status) {
      throw new Error('Failed to list beneficiaries');
    }
    
    return response.data;
  }

  async getBeneficiary(beneficiaryId: string): Promise<{ id: string; accountNumber: string; accountName: string; bankCode: string }> {
    const response = await this.makeRequest<{ status: boolean; data: { id: string; accountNumber: string; accountName: string; bankCode: string } }>(`/v1/beneficiaries/${beneficiaryId}`);
    
    if (!response.status) {
      throw new Error('Failed to get beneficiary');
    }
    
    return response.data;
  }

  // Rates
  async getRates(baseCurrency: string = 'USD'): Promise<{ base: string; rates: Record<string, number> }> {
    const response = await this.makeRequest<{ status: boolean; data: { base: string; rates: Record<string, number> } }>(`/v1/rates?base=${baseCurrency}`);
    
    if (!response.status) {
      throw new Error('Failed to get rates');
    }
    
    return response.data;
  }

  // Banks
  async getBanks(country: string): Promise<Array<{ code: string; name: string; country: string }>> {
    const response = await this.makeRequest<{ status: boolean; data: Array<{ code: string; name: string; country: string }> }>(`/v1/banks?country=${country}`);
    
    if (!response.status) {
      throw new Error('Failed to get banks');
    }
    
    return response.data || [];
  }
}

// Initialize Kyshi API configuration
const kyshiConfig = {
  baseUrl: process.env.KYSHI_API_URL || 'https://api.kyshi.co',
  secretKey: process.env.KYSHI_SECRET_KEY || 'sk_test_3dd6532c95634d1da5888520b9bf96c8',
  publicKey: process.env.KYSHI_PUBLIC_KEY || 'pk_test_da16574203b943fd82c04964eeffa7d5',
};

// Initialize Kyshi API with test environment
export const kyshiAPI = new KyshiAPI(kyshiConfig);

// Country-specific configurations
export const COUNTRY_CONFIGS = {
  Kenya: {
    currency: 'KES',
    amount: 200,
    paymentMethod: 'mobile_money',
    planCode: process.env.KYSHI_PLAN_CODE_KENYA || 'PLN_MVyWThBVJ1Np0IB',
    mobileMoneyProvider: 'm-pesa',
    redirectBehavior: 'modal' as const,
  },
  Nigeria: {
    currency: 'NGN',
    amount: 500,
    paymentMethod: 'bank_transfer',
    planCode: process.env.KYSHI_PLAN_CODE_NIGERIA || 'PLN_iiRmmGJcnQy5paj',
    redirectBehavior: 'external' as const,
  },
  Ghana: {
    currency: 'GHS',
    amount: 20,
    paymentMethod: 'mobile_money',
    planCode: process.env.KYSHI_PLAN_CODE_GHANA || 'PLN_WQN3ZhV2AX-knWQ',
    mobileMoneyProvider: 'mtn',
    redirectBehavior: 'modal' as const,
  },
  CoteDIvoire: {
    currency: 'XOF',
    amount: 1000,
    paymentMethod: 'mobile_money',
    planCode: process.env.KYSHI_PLAN_CODE_CIV || 'PLN_XdMwJ8jf8qeHhi0',
    mobileMoneyProvider: 'orange-money',
    redirectBehavior: 'modal' as const,
  },
};

export type CountryConfig = typeof COUNTRY_CONFIGS[keyof typeof COUNTRY_CONFIGS];

export default kyshiAPI;

