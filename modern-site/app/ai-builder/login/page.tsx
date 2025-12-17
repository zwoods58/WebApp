'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '../../../src/components/sections/PageHeader'
import { CTAWithFooter } from '../../../src/components/sections/CTAWithFooter'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '../../../src/lib/supabase'
import { useRouter } from 'next/navigation'
import { getFastUser } from '../../../src/lib/fast-auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // FAST - Check if user is already logged in (non-blocking)
    const checkUser = async () => {
      const fastUser = await getFastUser()
      if (fastUser) {
        // If logged in, redirect to builder with saved form data
        const savedFormData = localStorage.getItem('ai_builder_form_data')
        if (savedFormData) {
          router.replace('/ai-builder?restore=true')
        } else {
          router.replace('/ai-builder')
        }
      }
    }
    // Run in background, don't block render
    checkUser()

    // Listen for auth state changes to clear loading state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('⚡ Login: Auth state changed - user signed in, clearing loading state')
        setIsLoggingIn(false)
        // Redirect if still on login page
        const savedFormData = localStorage.getItem('ai_builder_form_data')
        if (savedFormData) {
          router.replace('/ai-builder?restore=true')
        } else {
          router.replace('/ai-builder')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)

    try {
      console.log('⚡ Login: Starting authentication...')
      const startTime = Date.now()
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log(`⚡ Login: Auth completed in ${Date.now() - startTime}ms`)

      if (loginError) throw loginError

      if (!data.user) {
        throw new Error('Login failed - no user returned')
      }

      if (!data.session) {
        throw new Error('Login failed - no session created')
      }

      console.log('✅ Login successful:', data.user.email)
      console.log('✅ Session created:', !!data.session.access_token)
      
      // CRITICAL: Wait for session to be saved to localStorage
      await new Promise(resolve => setTimeout(resolve, 150))
      
      // Verify session is actually saved
      const { data: { session: savedSession } } = await supabase.auth.getSession()
      if (!savedSession) {
        throw new Error('Session not persisted to localStorage')
      }
      
      console.log('✅ Session verified in storage')
      
      // Prefetch account data in background (non-blocking)
      const { prefetchFastAccount } = await import('../../../src/lib/fast-auth')
      prefetchFastAccount().then(() => {
        console.log('✅ Account prefetched')
      }).catch(err => {
        console.warn('⚠️ Account prefetch failed (will retry):', err)
      })
      
      // Wait a bit more to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 50))
      
      console.log('⚡ Login: Redirecting to dashboard...')
      
      // Clear loading state
      setIsLoggingIn(false)
      
      // Redirect using replace for faster navigation
      router.replace('/ai-builder?restore=true')
    } catch (err: any) {
      console.error('❌ Login error:', err)
      setError(err.message || 'Failed to log in. Please check your credentials.')
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PageHeader />
      
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
              <p className="text-gray-600">Log in to continue building your website</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder="Enter your password"
                    required
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
                disabled={isLoggingIn}
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
                {!isLoggingIn && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/ai-builder/signup')}
                  className="text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Sign Up
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>

      <CTAWithFooter />
    </div>
  )
}