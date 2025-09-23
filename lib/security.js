import crypto from 'crypto'

// CSRF Protection
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(token, sessionToken) {
  if (!token || !sessionToken) return false
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  )
}

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map()

export function rateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, [])
  }
  
  const requests = rateLimitStore.get(identifier).filter(time => time > windowStart)
  
  if (requests.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(requests[0] + windowMs)
    }
  }
  
  requests.push(now)
  rateLimitStore.set(identifier, requests)
  
  return {
    allowed: true,
    remaining: limit - requests.length,
    resetTime: new Date(now + windowMs)
  }
}

// IP-based rate limiting
export function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         'unknown'
}

// Sanitize data for logging (remove sensitive info)
export function sanitizeForLogging(data) {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'card', 'ssn', 'cvv']
  const sanitized = { ...data }
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]'
    }
  }
  
  return sanitized
}

// Generate secure random string
export function generateSecureRandom(length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

// Hash sensitive data
export function hashData(data, salt = null) {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.createHash('sha256')
  hash.update(data + actualSalt)
  return {
    hash: hash.digest('hex'),
    salt: actualSalt
  }
}

// Verify hashed data
export function verifyHash(data, hash, salt) {
  const { hash: computedHash } = hashData(data, salt)
  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(computedHash, 'hex')
  )
}

// Content Security Policy
export function getCSPHeader() {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.stripe.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
}
