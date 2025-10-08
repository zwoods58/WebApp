import jwt from 'jsonwebtoken'
import { config } from './config'

// Generate JWT token for authenticated user
export function generateToken(userId, userRole = 'customer') {
  const payload = {
    userId,
    userRole,
    iat: Math.floor(Date.now() / 1000),
  }
  
  return jwt.sign(payload, config.auth.jwtSecret, { 
    expiresIn: '24h',
    issuer: 'atarweb',
    audience: 'atarweb-customers'
  })
}

// Verify JWT token
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret, {
      issuer: 'atarweb',
      audience: 'atarweb-customers'
    })
    return { valid: true, payload: decoded }
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return { valid: false, error: error.message }
  }
}

// Extract token from request headers
export function extractTokenFromRequest(req) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

// Middleware to protect API routes
export function requireAuth(handler) {
  return async (req, res) => {
    try {
      const token = extractTokenFromRequest(req)
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }
      
      const { valid, payload, error } = verifyToken(token)
      
      if (!valid) {
        return res.status(401).json({ error: 'Invalid token', details: error })
      }
      
      // Add user info to request
      req.user = payload
      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ error: 'Authentication error' })
    }
  }
}

// Check if user has required role
export function requireRole(requiredRole) {
  return (handler) => {
    return async (req, res) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      
      if (req.user.userRole !== requiredRole && req.user.userRole !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }
      
      return handler(req, res)
    }
  }
}
