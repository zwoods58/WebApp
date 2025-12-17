'use client'

import { useState, useEffect, Suspense } from 'react'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import { Mail, Lock, ArrowRight, X } from 'lucide-react'
import { supabase } from '../../../src/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // If logged in, redirect back to builder form
        router.push('/ai-builder?restore=true')
      }
    }
    checkUser()
  }, [router])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSigningUp(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/ai-builder?restore=true`,
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Check if we have an active session (email confirmation might be disabled)
        if (data.session) {
          // User is immediately authenticated (email confirmation disabled)
          // Wait for auth state to update
          await new Promise(resolve => setTimeout(resolve, 1000))
          // Force refresh auth state
          const { data: { user: refreshedUser } } = await supabase.auth.getUser()
          if (refreshedUser) {
            router.push('/ai-builder?restore=true')
            return
          }
        } else {
          // Email confirmation required
          setError('Please check your email to confirm your account. After confirming, you can sign in and continue building.')
          setIsSigningUp(false)
          return
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.')
      setIsSigningUp(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageHeader />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Sign up to continue building your website</p>
            </div>

            <>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        required
                        minLength={8}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSigningUp}
                    className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    {isSigningUp ? 'Creating Account...' : 'Sign Up'}
                    {!isSigningUp && <ArrowRight className="w-5 h-5" />}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => router.push('/ai-builder?login=true')}
                      className="text-teal-600 hover:text-teal-700 font-semibold"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
            </>
          </div>
        </div>
      </div>

      <CTAWithFooter />
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  )
}

