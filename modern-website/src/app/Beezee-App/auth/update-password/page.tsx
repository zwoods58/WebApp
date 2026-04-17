"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';

export default function UpdatePassword() {
  const { t } = useLanguage();
  const { updatePassword } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Check if we have a valid token
    if (!token) {
      setError('Invalid or missing reset token');
      setIsLoading(false);
      return;
    }

    // For simplicity, we'll assume the token is valid if present
    // In a real implementation, you might want to verify the token with Supabase
    setIsValidToken(true);
    setIsLoading(false);
  }, [token]);

  const validateForm = (): boolean => {
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (!confirmPassword.trim()) {
      setError('Please confirm your password');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await updatePassword(password);
      
      if (result.error) {
        setError(result.error.message);
        showError(result.error.message);
      } else {
        showSuccess('Password updated successfully!');
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/Beezee-App/auth/login?reset=success');
        }, 2000);
      }
    } catch (error) {
      setError('Failed to update password');
      showError('Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking token
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[var(--powder-dark)]/30 border-t-[var(--powder-dark)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-2)]">Validating reset token...</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
            Invalid Reset Link
          </h1>
          
          <p className="text-[var(--text-2)] text-sm mb-6">
            {error || 'This password reset link is invalid or has expired.'}
          </p>

          <div className="space-y-3">
            <Link
              href="/Beezee-App/auth/forgot-password"
              className="inline-block w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium text-sm text-center"
            >
              Request New Reset Link
            </Link>
            
            <Link
              href="/Beezee-App/auth/login"
              className="inline-block w-full bg-[var(--glass-bg)] border-2 border-[var(--border)] text-[var(--text-1)] py-3 px-6 rounded-xl hover:bg-[var(--border)] hover:border-[var(--powder-mid)] transition-all font-medium text-sm text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
              Create New Password
            </h1>
            <p className="text-[var(--text-3)] text-xs">
              Enter your new password below
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
                  <Lock size={16} />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm pr-10 ${
                      error && error.toLowerCase().includes('password') ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                    }`}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                  <Lock size={16} />
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm pr-10 ${
                      error && error.toLowerCase().includes('match') ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                    }`}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !password || !confirmPassword}
                className="w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Update Password'
                )}
              </button>
            </form>

            {/* Success Message */}
            {!error && password && confirmPassword && password === confirmPassword && password.length >= 8 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-green-700 text-sm">Passwords match and meet requirements</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

