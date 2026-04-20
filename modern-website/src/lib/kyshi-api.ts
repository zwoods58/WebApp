import crypto from 'crypto';

export interface KyshiTransactionRequest {
  email: string;
  amount: number;
  amountCurrency?: 'local' | 'settlement';
  localCurrency: string;
  reference: string;
  channels: string[];
  redirectUrl?: string;
  phoneNumber?: string;
  feeBearer?: 'MERCHANT' | 'CUSTOMER';
}

export interface KyshiTransactionResponse {
  status: boolean;
  code: number;
  message: string;
  data?: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
    rate: number;
  };
}

export interface KyshiWebhookEvent {
  event: string;
  data: {
    reference: string;
    amount: number;
    customer: {
      id?: string;
      firstName?: string;
      lastName?: string;
      email: string;
      phone?: string;
    };
    authorization?: {
      authorizationCode?: string;
    };
    meta?: {
      localCurrency: string;
      localAmount: number;
      feeBreakdown?: {
        vat: number;
        fee: number;
      };
    };
  };
}

const COUNTRY_CONFIG: Record<string, {
  amount: number;
  currency: string;
  channels: string[];
}> = {
  KEN: { amount: 200,  currency: 'KES', channels: ['mobileMoney'] },
  NGA: { amount: 500,  currency: 'NGN', channels: ['bankTransfer'] },
  GHA: { amount: 20,   currency: 'GHS', channels: ['mobileMoney'] },
  CIV: { amount: 1000, currency: 'XOF', channels: ['mobileMoney'] },
  // 2-letter aliases
  KE:  { amount: 200,  currency: 'KES', channels: ['mobileMoney'] },
  NG:  { amount: 500,  currency: 'NGN', channels: ['bankTransfer'] },
  GH:  { amount: 20,   currency: 'GHS', channels: ['mobileMoney'] },
  CI:  { amount: 1000, currency: 'XOF', channels: ['mobileMoney'] },
};

class KyshiAPIClient {
  private get baseUrl(): string {
    return process.env.KYSHI_BASE_URL ?? 'https://api.kyshi.co/v1';
  }

  private get secretKey(): string {
    return process.env.KYSHI_SECRET_KEY ?? '';
  }

  private get webhookSecret(): string {
    return process.env.KYSHI_WEBHOOK_SECRET ?? '';
  }

  getCountryConfig(countryCode: string) {
    return COUNTRY_CONFIG[countryCode?.toUpperCase()] ?? null;
  }

  async initializeTransaction(params: KyshiTransactionRequest): Promise<KyshiTransactionResponse> {
    const res = await fetch(`${this.baseUrl}/transactions/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.secretKey,
      },
      body: JSON.stringify(params),
    });
    return res.json();
  }

  async verifyTransaction(reference: string): Promise<KyshiTransactionResponse> {
    const res = await fetch(`${this.baseUrl}/transactions/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.secretKey,
      },
    });
    return res.json();
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    try {
      if (!this.webhookSecret || !signature) return false;
      const expected = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');
      // Safe string comparison without timingSafeEqual length requirement
      return expected === signature;
    } catch {
      return false;
    }
  }
}

const KyshiAPI = new KyshiAPIClient();
export default KyshiAPI;