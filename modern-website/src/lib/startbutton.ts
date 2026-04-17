// StartButton API Service
export interface StartButtonPaymentRequest {
  email: string;
  amount: number; // in fractional units (kobo for NGN, pesewas for GHS)
  currency: 'NGN' | 'GHS' | 'KES' | 'ZAR' | 'UGX' | 'TZS' | 'RWF' | 'XOF' | 'XAF' | 'ZMW';
  reference?: string;
  metadata?: Record<string, any>;
  redirectUrl?: string;
  webhookUrl?: string;
  paymentMethods?: string[];
  partner?: string;
}

export interface StartButtonTransferRequest {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number; // in fractional units
  currency: 'NGN' | 'GHS' | 'ZAR' | 'KES' | 'UGX' | 'TZS' | 'RWF' | 'XOF' | 'ZMW';
  reference?: string;
  narration?: string;
  metadata?: Record<string, any>;
  webhookUrl?: string;
}

export interface StartButtonResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url?: string;
    reference?: string;
    transactionReference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    customerEmail?: string;
    createdAt?: string;
  };
}

export interface StartButtonTransactionStatus {
  status: boolean;
  message: string;
  data?: {
    _id: string;
    transType: 'collection' | 'transfer';
    status: 'initiated' | 'pending' | 'ongoing' | 'verified' | 'successful' | 'abandoned' | 'failed' | 'reversed';
    merchantId: string;
    transactionReference: string;
    userTransactionReference?: string;
    customerEmail?: string;
    amount: number;
    currency: string;
    feeAmount?: number;
    narration?: string;
    createdAt: string;
    updatedAt: string;
  };
}

class StartButtonService {
  private baseUrl: string;
  publicKey: string;
  secretKey: string;

  constructor() {
    this.baseUrl = process.env.STARTBUTTON_BASE_URL || 'https://api.startbutton.tech';
    this.publicKey = process.env.STARTBUTTON_PUBLIC_KEY || '';
    this.secretKey = process.env.STARTBUTTON_SECRET_KEY || '';
  }

  private getPaymentHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.secretKey}`,
    };
  }

  private getTransferHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.secretKey}`,
    };
  }

  // Initialize Payment Collection
  async initializePayment(paymentData: StartButtonPaymentRequest): Promise<StartButtonResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
        method: 'POST',
        headers: this.getPaymentHeaders(),
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Payment initialization failed');
      }

      return result;
    } catch (error) {
      console.error('StartButton payment initialization error:', error);
      throw error;
    }
  }

  // Initialize Transfer
  async initializeTransfer(transferData: StartButtonTransferRequest): Promise<StartButtonResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/transfer`, {
        method: 'POST',
        headers: this.getTransferHeaders(),
        body: JSON.stringify(transferData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Transfer initialization failed');
      }

      return result;
    } catch (error) {
      console.error('StartButton transfer initialization error:', error);
      throw error;
    }
  }

  // Verify Transaction Status
  async verifyTransaction(reference: string): Promise<StartButtonTransactionStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/${reference}/verify`, {
        method: 'GET',
        headers: this.getTransferHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Transaction verification failed');
      }

      return result;
    } catch (error) {
      console.error('StartButton transaction verification error:', error);
      throw error;
    }
  }

  // Get Transaction Status
  async getTransactionStatus(reference: string): Promise<StartButtonTransactionStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/status/${reference}`, {
        method: 'GET',
        headers: this.getTransferHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get transaction status');
      }

      return result;
    } catch (error) {
      console.error('StartButton transaction status error:', error);
      throw error;
    }
  }

  // Get Balance
  async getBalance(currency?: string): Promise<any> {
    try {
      const url = currency 
        ? `${this.baseUrl}/balance?currency=${currency}`
        : `${this.baseUrl}/balance`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getTransferHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get balance');
      }

      return result;
    } catch (error) {
      console.error('StartButton balance error:', error);
      throw error;
    }
  }

  // Get FX Rate
  async getFXRate(fromCurrency: string, toCurrency: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/fx-rate?from=${fromCurrency}&to=${toCurrency}`, {
        method: 'GET',
        headers: this.getTransferHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get FX rate');
      }

      return result;
    } catch (error) {
      console.error('StartButton FX rate error:', error);
      throw error;
    }
  }
}

export const startButtonService = new StartButtonService();

