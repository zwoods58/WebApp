// Environment configuration and validation
export const config = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
  },
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
  }
}

// Validate required environment variables
export function validateEnvironment() {
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'JWT_SECRET',
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

// Call validation on import
validateEnvironment()
