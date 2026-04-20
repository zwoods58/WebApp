// Correct Kyshi API Integration - Using Transaction Endpoints (NOT Subscriptions)
// Mobile money is manual - no recurring support

export interface KyshiTransactionRequest {
  email: string;
  amount: number;
  currency: string;
  country: string;
  channel: string[];
  paymentMethod: string;
  customerName: string;
  customerPhone?: string;
  redirectUrl?: string;
  chargeType?: string; // For Nigeria bank transfers
}

export interface KyshiTransactionResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    authorizationUrl: string;
    checkoutUrl: string;
    accessCode?: string;
    transactionId?: string;
  };
  error?: string;
}

export interface KyshiWebhookEvent {
  event: string;
  data: {
    transactionId: string;
    reference: string;
    status: string;
    amount: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    createdAt: string;
    paidAt?: string;
  };
  signature: string;
}

export class KyshiAPI {
  private static readonly BASE_URL = 'https://api.kyshi.co';
  private static readonly SECRET_KEY = 'sk_test_3dd6532c95634d1da5888520b9bf96c8';
  private static readonly PUBLIC_KEY = 'pk_test_da16574203b943fd82c04964eeffa7d5';
  private static readonly WEBHOOK_SECRET = 'c4accdbb6b2f49608ef729cd9afed411';

  // Initialize mobile money transaction (Kenya, Ghana, Côte d'Ivoire)
  static async initializeMobileMoneyTransaction(request: {
    email: string;
    amount: number;
    currency: string;
    country: string;
    customerName: string;
    customerPhone?: string;
    redirectUrl?: string;
  }): Promise<KyshiTransactionResponse> {
    try {
      const requestBody: KyshiTransactionRequest = {
        email: request.email,
        amount: request.amount,
        currency: request.currency,
        country: request.country,
        channel: ['mobileMoney'],
        paymentMethod: 'mobileMoney',
        customerName: request.customerName,
        customerPhone: request.customerPhone,
        redirectUrl: request.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`
      };

      const response = await fetch(`${this.BASE_URL}/v1/transactions/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize transaction');
      }

      return {
        success: true,
        message: 'Transaction initialized successfully',
        data: {
          reference: data.reference,
          authorizationUrl: data.authorizationUrl,
          checkoutUrl: data.checkoutUrl,
          accessCode: data.accessCode,
          transactionId: data.transactionId
        }
      };
    } catch (error) {
      console.error('Kyshi mobile money transaction error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initialize transaction',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Initialize bank transfer transaction (Nigeria)
  static async initializeBankTransferTransaction(request: {
    email: string;
    amount: number;
    currency: string;
    country: string;
    customerName: string;
    redirectUrl?: string;
  }): Promise<KyshiTransactionResponse> {
    try {
      const requestBody: KyshiTransactionRequest = {
        email: request.email,
        amount: request.amount,
        currency: request.currency,
        country: request.country,
        channel: ['bank_transfer'],
        paymentMethod: 'bank_transfer',
        customerName: request.customerName,
        redirectUrl: request.redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
        chargeType: 'BANK_TRANSFER'
      };

      const response = await fetch(`${this.BASE_URL}/v1/transactions/charge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initialize bank transfer');
      }

      return {
        success: true,
        message: 'Bank transfer initialized successfully',
        data: {
          reference: data.reference,
          authorizationUrl: data.authorizationUrl,
          checkoutUrl: data.checkoutUrl,
          accessCode: data.accessCode,
          transactionId: data.transactionId
        }
      };
    } catch (error) {
      console.error('Kyshi bank transfer error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to initialize bank transfer',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Verify webhook signature (SHA512)
  static verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha512', this.WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  // Get transaction status
  static async getTransactionStatus(reference: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/v1/transactions/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.SECRET_KEY}`,
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get transaction status');
      }

      return data;
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      throw error;
    }
  }

  // Country-specific configurations
  static readonly COUNTRY_CONFIG = {
    KE: {
      currency: 'KES',
      amount: 200,
      name: 'Kenya',
      method: 'mobileMoney'
    },
    GH: {
      currency: 'GHS',
      amount: 20,
      name: 'Ghana',
      method: 'mobileMoney'
    },
    CI: {
      currency: 'XOF',
      amount: 1000,
      name: 'Côte d\'Ivoire',
      method: 'mobileMoney'
    },
    NG: {
      currency: 'NGN',
      amount: 500,
      name: 'Nigeria',
      method: 'bank_transfer'
    }
  };

  // Get country config
  static getCountryConfig(countryCode: string) {
    return this.COUNTRY_CONFIG[countryCode as keyof typeof this.COUNTRY_CONFIG];
  }
}

export default KyshiAPI;
