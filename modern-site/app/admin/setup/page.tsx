'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../src/lib/supabase'
import { CheckCircle2, XCircle, Loader2, Shield } from 'lucide-react'

export default function AdminSetupPage() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'creating' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [step, setStep] = useState('')
  const [verification, setVerification] = useState<any>(null)

  const checkAndSetup = async () => {
    setStatus('creating')
    setMessage('Setting up admin user...')
    setStep('Creating admin user in Supabase Auth...')
    
    try {
      // Call the API route to set up admin user
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Setup failed')
      }

      setStatus('success')
      setMessage(data.message || 'Admin user setup complete!')
      setStep(`Email: ${data.details?.email || 'admin@atarwebb.com'}, Password: Royalblue#28`)
      
      // Verify the setup
      await verifyAdmin()
      
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message || 'Setup failed. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local')
      setStep('')
    }
  }

  const verifyAdmin = async () => {
    try {
      const response = await fetch('/api/admin/verify')
      const data = await response.json()
      setVerification(data)
    } catch (error) {
      console.error('Verification failed:', error)
    }
  }

  useEffect(() => {
    // Check admin status on mount
    verifyAdmin()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Setup</h1>
        
        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            This page helps you verify and set up the admin user. The admin user should be created first.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Go to Supabase Dashboard → Authentication → Users</li>
              <li>Click "Add User" or "Invite User"</li>
              <li>Email: <code className="bg-blue-100 px-1 rounded">admin@atarwebb.com</code></li>
              <li>Password: <code className="bg-blue-100 px-1 rounded">Royalblue#28</code></li>
              <li>Enable "Auto Confirm" to skip email verification</li>
              <li>Click "Create User"</li>
              <li>Then click the button below to set the admin tier</li>
            </ol>
          </div>
        </div>

        <button
          onClick={checkAndSetup}
          disabled={status === 'checking' || status === 'creating'}
          className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'checking' || status === 'creating' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{step || 'Processing...'}</span>
            </>
          ) : (
            'Check & Setup Admin Account'
          )}
        </button>

        {status === 'success' && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{message}</span>
          </div>
        )}

        {/* Verification Status */}
        {verification && (
          <div className={`mt-4 border rounded-lg p-4 ${
            verification.verified 
              ? 'bg-green-50 border-green-200' 
              : verification.exists 
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className={`w-5 h-5 ${
                verification.verified ? 'text-green-600' : 'text-yellow-600'
              }`} />
              <h3 className="font-semibold">Admin Status Verification</h3>
            </div>
            {verification.verified ? (
              <div className="text-sm text-green-800">
                <p className="font-medium">✓ Admin user is properly configured!</p>
                {verification.details && (
                  <div className="mt-2 space-y-1">
                    <p>Email: <strong>{verification.details.account?.email}</strong></p>
                    <p>Account Tier: <strong>{verification.details.account?.accountTier}</strong></p>
                    <p>Email Confirmed: <strong>{verification.details.auth?.emailConfirmed ? 'Yes' : 'No'}</strong></p>
                  </div>
                )}
              </div>
            ) : verification.exists ? (
              <div className="text-sm text-yellow-800">
                <p className="font-medium">⚠ Admin user exists but needs configuration:</p>
                {verification.issues && verification.issues.length > 0 && (
                  <ul className="mt-2 list-disc list-inside">
                    {verification.issues.map((issue: string, idx: number) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-2">Click "Check & Setup Admin Account" to fix this.</p>
              </div>
            ) : (
              <div className="text-sm text-gray-800">
                <p>Admin user not found. Click "Check & Setup Admin Account" to create it.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600">
            <strong>Alternative:</strong> Run the setup script from the terminal:
          </p>
          <code className="block mt-2 bg-gray-100 p-3 rounded text-sm">
            node scripts/setup-admin.js
          </code>
        </div>
      </div>
    </div>
  )
}


