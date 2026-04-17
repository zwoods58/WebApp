"use client";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const { resetPassword } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await resetPassword(email);
      
      if (result.error) {
        setError(result.error.message);
        showError(result.error.message);
      } else {
        setIsSubmitted(true);
        showSuccess('Password reset instructions have been sent to your email');
      }
    } catch (error) {
      setError('Failed to send password reset email');
      showError('Failed to send password reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-6 pt-6">
        <div className="max-w-md mx-auto">
          <Link
            href="/Beezee-App/auth/login"
            className="inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container mx-auto px-6 pb-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
                  Reset Your Password
                </h1>
                <p className="text-[var(--text-3)] text-xs">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-6">
                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm ${
                        error ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                      }`}
                      disabled={isSubmitting}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      'Send Reset Instructions'
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-[var(--text-3)] text-sm">
                    Remember your password?{' '}
                    <Link
                      href="/Beezee-App/auth/login"
                      className="text-[var(--powder-dark)] hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-[var(--text-1)] mb-2">
                Check Your Email
              </h2>
              
              <p className="text-[var(--text-2)] text-sm mb-6">
                We've sent password reset instructions to:<br />
                <span className="font-medium text-[var(--text-1)]">{email}</span>
              </p>

              <div className="space-y-3 text-sm text-[var(--text-2)]">
                <p>• Check your spam folder if you don't see the email</p>
                <p>• The reset link will expire in 24 hours</p>
                <p>• Follow the link in the email to create a new password</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <p className="text-[var(--text-3)] text-sm">
                  Didn't receive the email?{' '}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="text-[var(--powder-dark)] hover:underline font-medium bg-transparent border-none cursor-pointer"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

