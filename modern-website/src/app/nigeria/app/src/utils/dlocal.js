/**
 * D-Local Payment Integration Utility
 * Supports Kenya, Nigeria, and South Africa
 */

const DLOCAL_CONFIG = {
  test: {
    apiKey: process.env.NEXT_PUBLIC_DLOCAL_TEST_KEY,
    secretKey: process.env.NEXT_PUBLIC_DLOCAL_TEST_SECRET,
    baseUrl: 'https://sandbox.dlocal.com'
  },
  live: {
    apiKey: process.env.NEXT_PUBLIC_DLOCAL_LIVE_KEY,
    secretKey: process.env.NEXT_PUBLIC_DLOCAL_LIVE_SECRET,
    baseUrl: 'https://api.dlocal.com'
  }
};

const COUNTRY_CONFIG = {
  KE: {
    country: 'KE',
    currency: 'KES',
    paymentMethods: {
      CARD: { id: 'CARD', type: 'CARD', flow: 'DIRECT' },
      MOBILE_MONEY: { id: 'MW', type: 'AN', flow: 'DIRECT' },
      BANK_TRANSFER: { id: 'BANK_TRANSFER', type: 'BANK_TRANSFER', flow: 'DIRECT' }
    }
  },
  ZA: {
    country: 'ZA',
    currency: 'ZAR',
    paymentMethods: {
      CARD: { id: 'CARD', type: 'CARD', flow: 'DIRECT' },
      BANK_TRANSFER: { id: 'ZT', type: 'BANK_TRANSFER', flow: 'REDIRECT' },
      CAPITEC_PAY: { id: 'ZC', type: 'BANK_TRANSFER', flow: 'REDIRECT' }
    }
  },
  NG: {
    country: 'NG',
    currency: 'NGN',
    paymentMethods: {
      CARD: { id: 'CARD', type: 'CARD', flow: 'DIRECT' },
      OPAY: { id: 'OW', type: 'WALLET', flow: 'REDIRECT' },
      PAGA: { id: 'GW', type: 'WALLET', flow: 'REDIRECT' },
      BANK_TRANSFER: { id: 'IO', type: 'BANK_TRANSFER', flow: 'REDIRECT' }
    }
  }
};

class DLocalPaymentProcessor {
  constructor(countryCode, isTest = true) {
    this.config = DLOCAL_CONFIG[isTest ? 'test' : 'live'];
    this.countryConfig = COUNTRY_CONFIG[countryCode];
    this.countryCode = countryCode;
    
    if (!this.countryConfig) {
      throw new Error(`Unsupported country code: ${countryCode}`);
    }
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(amount, description, paymentMethod = 'CARD', customerInfo = {}) {
    try {
      const methodConfig = this.countryConfig.paymentMethods[paymentMethod];
      if (!methodConfig) {
        throw new Error(`Payment method ${paymentMethod} not supported for ${this.countryCode}`);
      }

      const payload = {
        amount: amount.toFixed(2),
        currency: this.countryConfig.currency,
        country: this.countryConfig.country,
        payment_method_id: methodConfig.id,
        payment_method_flow: methodConfig.flow,
        description,
        order_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        notification_url: `${window.location.origin}/api/dlocal-webhook`,
        redirect_url: `${window.location.origin}/payment/success`,
        ...customerInfo
      };

      const response = await this.makeRequest('/payments', payload);
      return response;
    } catch (error) {
      console.error('D-Local payment creation failed:', error);
      throw error;
    }
  }

  /**
   * Get available payment methods for the country
   */
  getAvailablePaymentMethods() {
    return Object.entries(this.countryConfig.paymentMethods).map(([key, config]) => ({
      key,
      id: config.id,
      type: config.type,
      flow: config.flow,
      name: this.getPaymentMethodName(key)
    }));
  }

  /**
   * Get user-friendly payment method name
   */
  getPaymentMethodName(methodKey) {
    const names = {
      CARD: 'Credit/Debit Card',
      MOBILE_MONEY: 'Mobile Money',
      BANK_TRANSFER: 'Bank Transfer',
      OPAY: 'OPay Wallet',
      PAGA: 'Paga Wallet',
      CAPITEC_PAY: 'Capitec Pay'
    };
    return names[methodKey] || methodKey;
  }

  /**
   * Make API request to D-Local
   */
  async makeRequest(endpoint, payload) {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.secretKey}`,
        'X-Date': new Date().toISOString(),
        'X-Login': this.config.apiKey,
        'X-Trans-Key': '7UUZzwt8tg'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`D-Local API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Process payment based on flow type
   */
  async processPayment(amount, description, paymentMethod, customerInfo) {
    const paymentIntent = await this.createPaymentIntent(amount, description, paymentMethod, customerInfo);
    
    if (paymentIntent.payment_method_flow === 'REDIRECT') {
      // Redirect user to payment page
      window.location.href = paymentIntent.redirect_url;
      return { requiresRedirect: true, redirectUrl: paymentIntent.redirect_url };
    } else {
      // Direct payment processing
      return { requiresRedirect: false, paymentIntent };
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId, amount = null) {
    try {
      const payload = {
        payment_id: paymentId,
        ...(amount && { amount: amount.toFixed(2) })
      };

      const response = await this.makeRequest('/refunds', payload);
      return response;
    } catch (error) {
      console.error('D-Local refund failed:', error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.config.baseUrl}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'X-Date': new Date().toISOString(),
          'X-Login': this.config.apiKey,
          'X-Trans-Key': '7UUZzwt8tg'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('D-Local status check failed:', error);
      throw error;
    }
  }
}

export default DLocalPaymentProcessor;
export { COUNTRY_CONFIG, DLOCAL_CONFIG };
