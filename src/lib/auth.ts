import crypto from 'crypto'
import jwt from 'jsonwebtoken'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'SALES'
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':')
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === verifyHash
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // For mock, just check if email and password match the expected values
  const isValid = (email === 'admin@atarwebb.com' && password === 'admin123') ||
                  (email === 'sales@atarwebb.com' && password === 'sales123')
  
  if (!isValid) return null

  // Return the user data directly
  if (email === 'admin@atarwebb.com') {
    return {
      id: '1',
      email: 'admin@atarwebb.com',
      name: 'Admin User',
      role: 'ADMIN'
    }
  } else if (email === 'sales@atarwebb.com') {
    return {
      id: '2',
      email: 'sales@atarwebb.com',
      name: 'Sales Rep',
      role: 'SALES'
    }
  }
  return null
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}