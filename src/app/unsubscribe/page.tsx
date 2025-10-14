'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if email is provided in URL params
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
      handleUnsubscribe(emailParam)
    }
  }, [searchParams])

  const handleUnsubscribe = async (emailToUnsubscribe?: string) => {
    const emailToUse = emailToUnsubscribe || email
    
    if (!emailToUse) {
      setMessage('Please enter your email address')
      setIsSuccess(false)
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToUse }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setIsSuccess(true)
        setEmail('')
      } else {
        setMessage(data.error || 'Failed to unsubscribe')
        setIsSuccess(false)
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.')
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleUnsubscribe()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Unsubscribe
            </h1>
            <p className="text-slate-300">
              We're sorry to see you go. You can unsubscribe from our emails below.
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {isLoading ? 'Processing...' : 'Unsubscribe'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Unsubscribed Successfully</h2>
              <p className="text-slate-300 mb-6">{message}</p>
              <a
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Return to Home
              </a>
            </div>
          )}

          {message && !isSuccess && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{message}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-xs text-slate-400 text-center">
              If you have any questions, please contact us at{' '}
              <a href="mailto:admin@atarwebb.com" className="text-blue-400 hover:text-blue-300">
                admin@atarwebb.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
