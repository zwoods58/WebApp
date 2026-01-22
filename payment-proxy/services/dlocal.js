const axios = require('axios');
const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * dLocal Service for Smart Checkout API integration
 */

class DLocalService {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production'
      ? 'https://api.dlocal.com'
      : 'https://api-sandbox.dlocal.com';

    this.xLogin = process.env.DLOCAL_X_LOGIN;
    this.xTransKey = process.env.DLOCAL_X_TRANS_KEY;
    this.secretKey = process.env.DLOCAL_SECRET_KEY;
  }

  /**
   * Generate HMAC-SHA256 signature for dLocal API requests
   */
  generateSignature(payload, timestamp) {
    const stringToSign = `${payload}${timestamp}`;
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(stringToSign, 'utf8')
      .digest('hex');
  }

  /**
   * Generate required headers for dLocal API calls
   */
  generateHeaders(timestamp, signature) {
    return {
      'X-Login': this.xLogin,
      'X-Trans-Key': this.xTransKey,
      'X-Date': timestamp,
      'Authorization': `HMAC-SHA256 ${signature}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Create a payment intent using dLocal Smart Checkout
   */
  async createPaymentIntent({
    amount,
    currency,
    country,
    orderId,
    userId,
    description,
    customerEmail,
    customerName,
    ipAddress
  }) {
    try {
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      // Log decision context
      logger.info('Evaluating Execution Mode:', {
        env: process.env.NODE_ENV,
        hasCredentials: !!this.xLogin,
        mockPaymentsFlag: process.env.MOCK_PAYMENTS,
        timestamp
      });

      // MOCK MODE: If explicitly enabled, OR (dev mode AND credentials missing)
      const shouldMock = process.env.MOCK_PAYMENTS === 'true' ||
        (process.env.NODE_ENV === 'development' && !this.xLogin);

      if (shouldMock) {
        logger.warn('⚠️ MOCK MODE ACTIVATED: Skipping real dLocal API call');

        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency

        return {
          success: true,
          paymentId: `MOCK_${crypto.randomBytes(8).toString('hex')}`,
          orderId: orderId,
          checkoutUrl: `${process.env.REDIRECT_BASE_URL || 'http://localhost:3000'}/payment/success?payment=success&mock=true`,
          amount,
          currency,
          country,
          status: 'PENDING'
        };
      }

      // Prepare request payload
      const payload = {
        amount: amount.toFixed(2),
        currency,
        country,
        order_id: orderId,
        description,
        payer: {
          name: customerName || 'BeeZee User',
          email: customerEmail,
          ip: ipAddress
        },
        redirect_url: `${process.env.REDIRECT_BASE_URL || 'https://beezee-finance.vercel.app'}/payment/success`,
        callback_url: `${process.env.CALLBACK_BASE_URL || 'https://beezee-finance.vercel.app'}/api/webhooks/dlocal`
      };

      // Generate signature
      const signature = this.generateSignature(JSON.stringify(payload), timestamp);
      const headers = this.generateHeaders(timestamp, signature);

      logger.info('Creating dLocal payment intent:', {
        payload,
        headers: {
          'X-Login': this.xLogin,
          'X-Trans-Key': this.xTransKey,
          'X-Date': timestamp
        },
        timestamp: new Date().toISOString()
      });

      // Make API request
      const response = await axios.post(`${this.baseURL}/payments`, payload, {
        headers,
        timeout: 30000 // 30 seconds timeout
      });

      if (response.status === 200 || response.status === 201) {
        const paymentData = response.data;

        logger.info('dLocal payment intent created:', {
          paymentId: paymentData.id,
          status: paymentData.status,
          checkoutUrl: paymentData.checkout_url,
          amount,
          currency,
          country,
          timestamp: new Date().toISOString()
        });

        return {
          success: true,
          paymentId: paymentData.id,
          orderId: paymentData.order_id,
          checkoutUrl: paymentData.checkout_url,
          amount: paymentData.amount,
          currency: paymentData.currency,
          country: paymentData.country,
          status: paymentData.status
        };
      } else {
        const error = response.data?.message || 'Failed to create payment intent';

        logger.error('dLocal API error:', {
          status: response.status,
          statusText: response.statusText,
          error,
          response: response.data,
          timestamp: new Date().toISOString()
        });

        return {
          success: false,
          error,
          details: response.data
        };
      }

    } catch (error) {
      logger.error('dLocal service error:', {
        error: error.message,
        stack: error.stack,
        amount,
        currency,
        country,
        timestamp: new Date().toISOString()
      });

      if (error.response) {
        return {
          success: false,
          error: 'API Request Failed',
          details: {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          }
        };
      }

      return {
        success: false,
        error: 'Network Error',
        message: error.message
      };
    }
  }

  /**
   * Get payment status from dLocal
   */
  async getPaymentStatus(paymentId) {
    try {
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const payload = { payment_id: paymentId };
      const signature = this.generateSignature(JSON.stringify(payload), timestamp);
      const headers = this.generateHeaders(timestamp, signature);

      const response = await axios.get(`${this.baseURL}/payments/${paymentId}`, {
        headers,
        timeout: 15000
      });

      if (response.status === 200) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: 'Failed to fetch payment status',
          details: response.data
        };
      }

    } catch (error) {
      logger.error('Error fetching dLocal payment status:', {
        error: error.message,
        paymentId,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel payment in dLocal
   */
  async cancelPayment(paymentId) {
    try {
      const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const payload = {
        payment_id: paymentId,
        status: 'CANCELLED'
      };
      const signature = this.generateSignature(JSON.stringify(payload), timestamp);
      const headers = this.generateHeaders(timestamp, signature);

      const response = await axios.put(`${this.baseURL}/payments/${paymentId}`, payload, {
        headers,
        timeout: 15000
      });

      if (response.status === 200) {
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: 'Failed to cancel payment',
          details: response.data
        };
      }

    } catch (error) {
      logger.error('Error cancelling dLocal payment:', {
        error: error.message,
        paymentId,
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Verify webhook signature from dLocal
 */
function verifyWebhookSignature(payload, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.DLOCAL_SECRET_KEY)
    .update(payload, 'utf8')
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Create singleton instance
const dlocalService = new DLocalService();

module.exports = {
  createPaymentIntent: dlocalService.createPaymentIntent.bind(dlocalService),
  getPaymentStatus: dlocalService.getPaymentStatus.bind(dlocalService),
  cancelPayment: dlocalService.cancelPayment.bind(dlocalService),
  verifyWebhookSignature: verifyWebhookSignature
};
