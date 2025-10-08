import Joi from 'joi'

// Payment validation schemas
export const paymentSchemas = {
  createPaymentIntent: Joi.object({
    amount: Joi.number().positive().max(1000000).required(), // Max $10,000
    currency: Joi.string().length(3).uppercase().valid('USD', 'EUR', 'GBP').required(),
    serviceId: Joi.string().min(1).max(100).required(), // More flexible service ID
    customerEmail: Joi.string().email().max(254).required(),
    customerName: Joi.string().min(2).max(100).required(),
    metadata: Joi.object().pattern(Joi.string(), Joi.alternatives().try(Joi.string().max(500), Joi.number())).max(20).optional()
  }),

  confirmPayment: Joi.object({
    paymentIntentId: Joi.string().startsWith('pi_').required(),
    paymentMethodId: Joi.string().startsWith('pm_').required()
  }),

  webhook: Joi.object({
    type: Joi.string().required(),
    data: Joi.object().required(),
    id: Joi.string().required(),
    created: Joi.number().integer().positive().required()
  }),

  customer: Joi.object({
    email: Joi.string().email().max(254).required(),
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
    address: Joi.object({
      line1: Joi.string().max(100).required(),
      line2: Joi.string().max(100).optional(),
      city: Joi.string().max(50).required(),
      state: Joi.string().max(50).required(),
      postal_code: Joi.string().max(20).required(),
      country: Joi.string().length(2).uppercase().required()
    }).optional()
  })
}

// Validation middleware
export function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    })
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }))
      
      return res.status(400).json({
        error: 'Validation failed',
        details: errorDetails
      })
    }
    
    // Replace req.body with validated and sanitized data
    req.body = value
    next()
  }
}

// Sanitize input to prevent XSS
export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .substring(0, 1000) // Limit length
  }
  return input
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Validate amount (in cents)
export function isValidAmount(amount) {
  return Number.isInteger(amount) && amount > 0 && amount <= 100000000 // Max $1M
}

// Validate currency code
export function isValidCurrency(currency) {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  return validCurrencies.includes(currency?.toUpperCase())
}
