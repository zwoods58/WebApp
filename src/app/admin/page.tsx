'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in (only on client side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      if (token && userData) {
        const user = JSON.parse(userData)
        setUser(user)
        setIsLoggedIn(true)
        
        // Redirect sales users to sales dashboard
        if (user.role === 'SALES') {
          window.location.href = '/admin/sales'
        } else {
          // Redirect admin users to dashboard
          window.location.href = '/admin/dashboard'
        }
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('Submitting login form:', { email, password: password ? '***' : 'empty' })
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        console.log('Login successful, storing token and redirecting...')
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setIsLoggedIn(true)
        
        if (data.user.role === 'SALES') {
          window.location.href = '/admin/sales'
        } else {
          window.location.href = '/admin/dashboard'
        }
      } else {
        console.log('Login failed:', data.error)
        setError(data.error || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLoggedIn(false)
  }

  // If logged in, show loading while redirecting
  if (isLoggedIn && user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
            <img
              src="/Logo.png"
              alt="AtarWebb CRM"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AtarWebb CRM</h1>
          <p className="text-slate-400">Admin Management System</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Admin Login</h2>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">        
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> 
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">     
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> 
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Access restricted to authorized personnel only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}