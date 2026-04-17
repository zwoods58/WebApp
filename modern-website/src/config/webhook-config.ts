// Webhook Configuration for Hybrid Payment System
export const WEBHOOK_CONFIG = {
  // Kyshi Webhook Configuration
  kyshi: {
    url: 'https://atarwebb.com/api/webhooks/kyshi',
    secret: 'c4accdbb6b2f49608ef729cd9afed411',
    events: [
      'subscription.created',
      'subscription.activated',
      'subscription.cancelled',
      'subscription.payment.succeeded',
      'subscription.payment.failed'
    ]
  },

  // Polling Configuration (backup to webhooks)
  polling: {
    enabled: true,
    intervalMinutes: 10, // Check every 10 minutes
    retryAttempts: 3,
    timeoutMs: 30000
  },

  // Business Logic Configuration
  business: {
    // Grant access immediately when subscription is activated
    instantAccess: true,
    
    // Send notifications for events
    notifications: {
      subscription_activated: true,
      subscription_cancelled: true,
      payment_failed: true,
      payment_succeeded: true
    },

    // Retry failed payments
    retryFailedPayments: true,
    maxRetries: 3,

    // Grace period before revoking access
    gracePeriodDays: 3
  },

  // Monitoring Configuration
  monitoring: {
    // Log all webhook events
    logAllEvents: true,
    
    // Track webhook delivery
    trackDelivery: true,
    
    // Alert on failures
    alertOnFailures: true,
    
    // Health check interval
    healthCheckMinutes: 5
  }
};

// Environment-specific overrides
export const getWebhookConfig = () => {
  const config = { ...WEBHOOK_CONFIG };

  if (process.env.NODE_ENV === 'development') {
    // Development overrides
    config.polling.intervalMinutes = 2; // More frequent in dev
    config.monitoring.logAllEvents = true;
  } else if (process.env.NODE_ENV === 'production') {
    // Production overrides
    config.polling.intervalMinutes = 10; // Less frequent in prod
    config.monitoring.alertOnFailures = true;
  }

  return config;
};

export default WEBHOOK_CONFIG;

