"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';

// Helper function to detect standalone mode and navigate accordingly
function navigatePWAAware(path: string, router: any) {
  const isStandalone = typeof window !== 'undefined' && 
                       window.matchMedia('(display-mode: standalone)').matches;
  
  if (isStandalone) {
    console.log('[Auth] Standalone mode detected, using window.location.href');
    window.location.href = path;
  } else {
    console.log('[Auth] Browser mode detected, using router.push');
    router.push(path);
  }
}

export default function Login() {
  const { t } = useLanguage();
  const { signIn, isAuthenticated, user, business, loading, error } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const router = useRouter();

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (!loading && isAuthenticated && business && !isRedirecting) {
      console.log('🔄 User already authenticated, redirecting to dashboard...');
      setIsRedirecting(true);
      
      // Route through the setup page which detects business data 
      // and redirects to the correct country/industry dashboard
      const redirectTimer = setTimeout(() => {
        navigatePWAAware('/Beezee-App/route', router);
      }, 150);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, business, loading, isRedirecting, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.email || !formData.password) {
      showError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      showError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.error) {
        showError(result.error.message);
      } else {
        showSuccess('Login successful!');
        setIsRedirecting(true);
        setTimeout(() => {
          navigatePWAAware('/Beezee-App/route', router);
        }, 800);
      }
    } catch (error) {
      showError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[var(--powder-dark)]/30 border-t-[var(--powder-dark)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-2)]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Main content */}
      <div className="flex-1 container mx-auto px-6 pb-6 flex flex-col pt-12">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-6 fade-in">
            <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
              {t('auth.welcome_back', 'Welcome Back')}
            </h1>
            <p className="text-[var(--text-3)] text-xs">
              Sign in to manage your business
            </p>
          </div>

          <div className="fade-in-up bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5">
            {/* Error Display */}
            {(error || (typeof window !== 'undefined' && window.location.search.includes('error'))) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-3 rounded-lg text-xs mb-4 flex items-start gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Authentication Error</p>
                  <p className="text-red-600 mt-1">
                    {error || 'Please check your email and password and try again.'}
                  </p>
                </div>
              </div>
            )}

            {/* Success Message for Email Confirmation */}
            {typeof window !== 'undefined' && window.location.search.includes('confirmed') && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-3 rounded-lg text-xs mb-4">
                <p className="font-medium">Email Confirmed!</p>
                <p className="text-green-600 mt-1">
                  Your email has been confirmed. You can now sign in.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5">
                  <Mail size={14} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
                  disabled={isSubmitting}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5">
                  <Lock size={14} />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm pr-10"
                    disabled={isSubmitting}
                    autoComplete="current-password"
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

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-[var(--powder-dark)] bg-[var(--glass-bg)] border-[var(--border)] rounded focus:ring-[var(--powder-dark)]"
                />
                <label htmlFor="rememberMe" className="text-xs text-[var(--text-2)]">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.email || !formData.password}
                className="w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-4 text-center space-y-2">
              <p className="text-[var(--text-3)] text-xs">
                <Link
                  href="/Beezee-App/auth/forgot-password"
                  className="text-[var(--powder-dark)] hover:underline font-medium"
                >
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

