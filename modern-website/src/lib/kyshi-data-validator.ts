// Kyshi Data Flow Validator
// Ensures all required data flows correctly from Supabase to Kyshi API and Webhooks

import { supabase } from './supabase';

export interface KyshiSubscriptionRequest {
  planCode: string;
  customer: string; // email
  paymentMethod: string;
  redirectUrl?: string;
  mobileMoneyProvider?: string; // Required for mobile money payments
}

export interface SupabaseUserData {
  user_id: string;
  user_email: string;
  user_phone?: string;
  user_name: string;
  country: string;
  business_id?: string;
  industry?: string;
}

export interface KyshiWebhookEvent {
  event: string;
  data: {
    id: string;
    code: string;
    status: string;
    amount?: number;
    currency?: string;
    paymentMethod?: string;
    customer?: {
      email: string;
      phone?: string;
      name?: string;
    };
    plan?: {
      id: string;
      name: string;
      amount: number;
      currency: string;
      interval: string;
    };
    startDate?: string;
    nextPaymentDate?: string;
    endDate?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    authorizationUrl?: string;
    checkoutUrl?: string;
    processedAt?: string;
    reference?: string;
    subscriptionId?: string;
  };
}

export class KyshiDataValidator {
  
  // Validate and prepare data for Kyshi subscription creation
  static async validateSubscriptionData(userData: SupabaseUserData): Promise<{
    isValid: boolean;
    errors: string[];
    kyshiPayload: KyshiSubscriptionRequest;
    dbRecord: any;
  }> {
    const errors: string[] = [];
    
    // 1. Validate required fields
    if (!userData.user_email) errors.push('User email is required');
    if (!userData.country) errors.push('Country is required');
    if (!userData.user_name) errors.push('User name is required');
    
    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.user_email && !emailRegex.test(userData.user_email)) {
      errors.push('Invalid email format');
    }
    
    // 3. Validate country
    const supportedCountries = ['Kenya', 'Nigeria', 'Ghana', 'CoteDIvoire', 'CotedIvoire'];
    if (userData.country && !supportedCountries.includes(userData.country)) {
      errors.push(`Unsupported country: ${userData.country}`);
    }
    
    // 4. Get country configuration
    const countryConfig = this.getCountryConfig(userData.country);
    if (!countryConfig) {
      errors.push(`No configuration found for country: ${userData.country}`);
    }
    
    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        kyshiPayload: {} as KyshiSubscriptionRequest,
        dbRecord: null
      };
    }
    
    // 5. Prepare Kyshi payload
    const kyshiPayload: KyshiSubscriptionRequest = {
      planCode: countryConfig.planCode,
      customer: userData.user_email,
      paymentMethod: countryConfig.paymentMethod,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/callback?user_id=${userData.user_id}&country=${userData.country}`
    };
    
    // Add mobile money provider if required
    if (countryConfig.paymentMethod === 'mobile_money' && countryConfig.mobileMoneyProvider) {
      kyshiPayload.mobileMoneyProvider = countryConfig.mobileMoneyProvider;
    }
    
    // 6. Prepare database record
    const dbRecord = {
      user_id: userData.user_id,
      user_email: userData.user_email,
      user_phone: userData.user_phone,
      user_name: userData.user_name,
      country: userData.country,
      business_id: userData.business_id,
      industry: userData.industry,
      amount: countryConfig.amount,
      currency: countryConfig.currency,
      payment_method: countryConfig.paymentMethod,
      kyshi_plan_code: countryConfig.planCode,
      status: 'pending',
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return {
      isValid: true,
      errors: [],
      kyshiPayload,
      dbRecord
    };
  }
  
  // Get country-specific configuration
  private static getCountryConfig(country: string) {
    type CountryConfig = {
      amount: number;
      currency: string;
      paymentMethod: string;
      planCode: string;
      mobileMoneyProvider?: string;
      requiresBankSelection?: boolean;
    };
    
    const configs: Record<string, CountryConfig> = {
      Kenya: {
        amount: 200,
        currency: 'KES',
        paymentMethod: 'mobile_money',
        planCode: process.env.KYSHI_PLAN_CODE_KENYA || 'PLN_MVyWThBVJ1Np0IB',
        mobileMoneyProvider: 'm-pesa'
      },
      Nigeria: {
        amount: 500,
        currency: 'NGN',
        paymentMethod: 'bank_transfer',
        planCode: process.env.KYSHI_PLAN_CODE_NIGERIA || 'PLN_iiRmmGJcnQy5paj',
        requiresBankSelection: true
      },
      Ghana: {
        amount: 20,
        currency: 'GHS',
        paymentMethod: 'mobile_money',
        planCode: process.env.KYSHI_PLAN_CODE_GHANA || 'PLN_WQN3ZhV2AX-knWQ',
        mobileMoneyProvider: 'mtn'
      },
      CoteDIvoire: {
        amount: 1000,
        currency: 'XOF',
        paymentMethod: 'mobile_money',
        planCode: process.env.KYSHI_PLAN_CODE_CIV || 'PLN_XdMwJ8jf8qeHhi0',
        mobileMoneyProvider: 'orange-money'
      },
      CotedIvoire: {
        amount: 1000,
        currency: 'XOF',
        paymentMethod: 'mobile_money',
        planCode: process.env.KYSHI_PLAN_CODE_CIV || 'PLN_XdMwJ8jf8qeHhi0',
        mobileMoneyProvider: 'orange-money'
      }
    };
    
    return configs[country];
  }
  
  // Validate webhook event data
  static validateWebhookEvent(event: KyshiWebhookEvent): {
    isValid: boolean;
    errors: string[];
    eventType: string;
  } {
    const errors: string[] = [];
    
    // 1. Validate event structure
    if (!event.event) errors.push('Event type is required');
    if (!event.data) errors.push('Event data is required');
    if (!event.data.id) errors.push('Subscription ID is required');
    if (!event.data.code) errors.push('Subscription code is required');
    if (!event.data.status) errors.push('Status is required');
    
    // 2. Validate event type
    const validEvents = [
      'subscription.created',
      'subscription.activated',
      'subscription.cancelled',
      'subscription.payment.succeeded',
      'subscription.payment.failed'
    ];
    
    if (event.event && !validEvents.includes(event.event)) {
      errors.push(`Invalid event type: ${event.event}`);
    }
    
    // 3. Validate status
    const validStatuses = ['pending', 'active', 'cancelled', 'expired', 'failed'];
    if (event.data.status && !validStatuses.includes(event.data.status)) {
      errors.push(`Invalid status: ${event.data.status}`);
    }
    
    // 4. Event-specific validation
    if (event.event === 'subscription.payment.succeeded' || event.event === 'subscription.payment.failed') {
      if (!event.data.amount) errors.push('Amount is required for payment events');
      if (!event.data.currency) errors.push('Currency is required for payment events');
      if (!event.data.subscriptionId) errors.push('Subscription ID is required for payment events');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      eventType: event.event
    };
  }
  
  // Extract and map webhook data to database format
  static mapWebhookToDatabase(event: KyshiWebhookEvent): {
    subscriptionUpdates: any;
    transactionRecord?: any;
    userUpdates?: any;
  } {
    const { data } = event;
    
    const subscriptionUpdates: any = {
      status: data.status,
      is_active: data.isActive || false,
      current_period_start: data.startDate,
      current_period_end: data.nextPaymentDate,
      kyshi_subscription_id: data.id,
      kyshi_subscription_code: data.code,
      updated_at: new Date().toISOString()
    };
    
    let transactionRecord;
    let userUpdates;
    
    // Handle payment events
    if (event.event === 'subscription.payment.succeeded' || event.event === 'subscription.payment.failed') {
      transactionRecord = {
        kyshi_transaction_id: data.id,
        kyshi_reference: data.reference,
        subscription_id: data.subscriptionId,
        amount: data.amount,
        currency: data.currency,
        status: data.status === 'succeeded' ? 'success' : 'failed',
        payment_method: data.paymentMethod,
        processed_at: data.processedAt || new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      // Update subscription charge dates
      if (data.nextPaymentDate) {
        subscriptionUpdates.next_charge_date = data.nextPaymentDate;
      }
      if (event.event === 'subscription.payment.succeeded') {
        subscriptionUpdates.last_charge_date = new Date().toISOString();
      }
    }
    
    // Handle activation
    if (event.event === 'subscription.activated') {
      userUpdates = {
        subscription_status: 'active',
        access_granted_at: new Date().toISOString()
      };
    }
    
    // Handle cancellation
    if (event.event === 'subscription.cancelled') {
      userUpdates = {
        subscription_status: 'inactive',
        access_revoked_at: new Date().toISOString()
      };
      subscriptionUpdates.cancelled_at = new Date().toISOString();
    }
    
    return {
      subscriptionUpdates,
      transactionRecord,
      userUpdates
    };
  }
  
  // Validate and enhance user data from Supabase
  static async enhanceUserData(userId: string): Promise<SupabaseUserData | null> {
    try {
      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError || !user) {
        console.error('User not found:', userError);
        return null;
      }
      
      // Get business data if available
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id, industry, country')
        .eq('user_id', userId)
        .single();
      
      // Combine data
      const userData: SupabaseUserData = {
        user_id: user.id,
        user_email: user.email,
        user_phone: user.phone,
        user_name: `${user.first_name} ${user.last_name}`.trim(),
        country: business?.country || user.country,
        business_id: business?.id,
        industry: business?.industry
      };
      
      return userData;
    } catch (error) {
      console.error('Error enhancing user data:', error);
      return null;
    }
  }
  
  // Complete data flow validation
  static async validateCompleteFlow(userId: string): Promise<{
    isValid: boolean;
    errors: string[];
    userData?: SupabaseUserData;
    kyshiPayload?: KyshiSubscriptionRequest;
    dbRecord?: any;
  }> {
    const errors: string[] = [];
    
    // 1. Get and enhance user data
    const userData = await this.enhanceUserData(userId);
    if (!userData) {
      errors.push('Failed to retrieve user data');
      return { isValid: false, errors };
    }
    
    // 2. Validate subscription data
    const validation = await this.validateSubscriptionData(userData);
    if (!validation.isValid) {
      return {
        isValid: false,
        errors: validation.errors,
        userData
      };
    }
    
    return {
      isValid: true,
      errors: [],
      userData,
      kyshiPayload: validation.kyshiPayload,
      dbRecord: validation.dbRecord
    };
  }
}

// Export utility functions
export const validateKyshiData = {
  subscription: KyshiDataValidator.validateSubscriptionData,
  webhook: KyshiDataValidator.validateWebhookEvent,
  enhanceUser: KyshiDataValidator.enhanceUserData,
  completeFlow: KyshiDataValidator.validateCompleteFlow,
  mapWebhookToDb: KyshiDataValidator.mapWebhookToDatabase
};

