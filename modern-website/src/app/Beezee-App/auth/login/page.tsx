"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [formData, setFormData] = useState({
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingSignup, setPendingSignup] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const router = useRouter();
  const { signInDirect, isAuthenticated, user, loading: authLoading } = useAuth();

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (!authLoading && !isRedirecting) {
      setIsCheckingAuth(false);
      
      // Only redirect if user intentionally navigated to login while authenticated
      // Don't redirect during the brief moment when ProtectedRoute is checking auth
      // This prevents the redirect loop: Dashboard -> Login -> Dashboard
      if (isAuthenticated && user && !window.location.pathname.includes('/app/')) {
        // Add a small delay to ensure this isn't just a transient state during page refresh
        const redirectTimer = setTimeout(() => {
          console.log('🔄 User already authenticated, redirecting to dashboard...');
          setIsRedirecting(true);
          handleLoginSuccess(user);
        }, 150); // Small delay to avoid race condition with ProtectedRoute
        
        return () => clearTimeout(redirectTimer);
      }
    }
  }, [isAuthenticated, user, authLoading, isRedirecting]);

  const handleLoginSuccess = (business: any) => {
    // Route to user's actual country and industry from database
    const country = business?.country?.toLowerCase() || 'ke';
    const industry = business?.industry?.toLowerCase() || 'retail';
    console.log('🎯 Redirecting to:', { country, industry, business });
    console.log('🔍 Business data check:', { 
      businessIndustry: business?.industry, 
      businessCountry: business?.country
    });
    
    // Add a small delay to ensure auth state is set before redirect
    setTimeout(() => {
      router.push(`/Beezee-App/app/${country}/${industry}`);
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error, data } = await signInDirect(formData.phone);
    
    if (error) {
      setError(error.message);
    } else {
      // Redirect to dashboard after successful login with business data
      handleLoginSuccess(data?.business || data);
    }
    
    setIsLoading(false);
  };

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex flex-col">
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/beezee"
            className="inline-flex items-center gap-2 text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
          >
            <ArrowLeft size={18} />
            Back to BeeZee
          </Link>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-[var(--powder-light)] rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6">
              <Briefcase size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-1)] mb-4 tracking-[-0.02em]">
              Welcome Back
            </h1>
            <p className="text-[var(--text-2)]">
              Enter your phone number for instant access
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-3xl p-8"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="^\+(254|27|234|233|256|250|255)\d{9,10}$"
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]"
                  placeholder="+254712345678"
                  title="Enter phone for Kenya, South Africa, Nigeria, Ghana, Uganda, Rwanda, or Tanzania"
                />
                <p className="text-xs text-[var(--text-3)] mt-2">
                  Supported: 🇰🇪 Kenya • 🇿🇦 South Africa • 🇳🇬 Nigeria • 🇬🇭 Ghana • 🇺🇬 Uganda • 🇷🇼 Rwanda • 🇹🇿 Tanzania
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-[var(--powder-dark)] text-white font-bold rounded-2xl hover:bg-[var(--powder-mid)] transition-all active:scale-[0.98] shadow-lg shadow-[var(--powder-dark)]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <Phone size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[var(--text-2)]">
                Need an account? Contact support to get started.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
