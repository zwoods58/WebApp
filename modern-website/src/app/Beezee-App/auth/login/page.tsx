"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Briefcase, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import PINVerification from '@/components/auth/PINVerification';
import PINLockout from '@/components/auth/PINLockout';

export default function Login() {
  const [formData, setFormData] = useState({
    phone: '',
    pin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingSignup, setPendingSignup] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'pin' | 'locked'>('phone');
  const [businessData, setBusinessData] = useState<any>(null);
  const [pinError, setPinError] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [showPin, setShowPin] = useState(false);
  
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  
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
    console.log('🎯 handleLoginSuccess called with:', business);
    
    if (!business) {
      console.error('❌ No business data provided to handleLoginSuccess');
      setError('Login failed: No business data received');
      return;
    }
    
    // Route to user's actual country and industry from database
    const country = (business?.country || business?.business?.country || 'ke').toLowerCase();
    const industry = (business?.industry || business?.business?.industry || 'retail').toLowerCase();
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

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const currentPin = formData.pin || '';
    const newPin = currentPin.split('');
    newPin[index] = value;
    const updatedPin = newPin.join('');
    
    setFormData(prev => ({
      ...prev,
      pin: updatedPin
    }));
    
    // Auto-focus next input
    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const currentPin = formData.pin || '';
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      pinRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move to previous input on arrow left
      pinRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      // Move to next input on arrow right
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate phone number
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    // Validate PIN is 6 digits
    if (formData.pin.length !== 6) {
      setError('Please enter a 6-digit PIN');
      setIsLoading(false);
      return;
    }

    // Format phone number with country code if needed
    let phoneNumber = formData.phone;
    if (!phoneNumber.startsWith('+')) {
      // Add Kenya country code as default (can be improved)
      phoneNumber = '+254' + phoneNumber.replace(/^0/, '');
    }
    
    // Use the verify-pin API with both phone and PIN
    try {
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: phoneNumber, 
          pin: formData.pin 
        })
      });
      
      const result = await response.json();
      
      if (result.error) {
        if (result.error.message === 'ACCOUNT_LOCKED') {
          setLockoutTime(result.error.lockoutTime || 0);
          setRemainingAttempts(result.error.remainingAttempts || 0);
          setLoginStep('locked');
        } else {
          setError(result.error.message);
          setRemainingAttempts(result.error.remainingAttempts || 3);
        }
      } else if (result.data && result.data.business) {
        // Login successful - handle success
        console.log('✅ Login successful, business data:', result.data.business);
        
        // Set authentication state manually since we're not using signInDirect
        const business = result.data.business;
        const sessionData = {
          phone: phoneNumber,
          businessId: business.id,
          timestamp: Date.now()
        };

        console.log('💾 Storing session data:', sessionData);

        // Store in localStorage for persistence
        const authData = {
          session: sessionData,
          business: business
        };
        
        localStorage.setItem('beezee_business_auth', JSON.stringify(authData));
        console.log('✅ Stored to localStorage:', authData);

        // Verify it was stored
        const stored = localStorage.getItem('beezee_business_auth');
        console.log('🔍 Verification - stored data:', stored);

        // Set auth state
        const userData = {
          id: business.id,
          phone_number: phoneNumber,
          business_name: business.business_name,
          country: business.country,
          default_industry: business.industry,
          auth_method: 'pin_direct',
          business: business
        };

        console.log('👤 User data prepared:', userData);

        // This should trigger the auth state change and redirect
        const redirectUrl = `/Beezee-App/app/${business.country.toLowerCase()}/${business.industry.toLowerCase()}`;
        console.log('🔄 Redirecting to:', redirectUrl);
        
        window.location.href = redirectUrl;
      } else {
        console.error('❌ Unexpected response structure:', result);
        setError('Login failed: Invalid response from server');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handlePINSubmit = async (pin: string) => {
    setIsLoading(true);
    setPinError('');

    const { error, data } = await signInDirect(pin);
    
    if (error) {
      if (error.message === 'ACCOUNT_LOCKED') {
        setLockoutTime(error.lockoutTime || 0);
        setRemainingAttempts(error.remainingAttempts || 0);
        setLoginStep('locked');
      } else {
        setPinError(error.message);
        setRemainingAttempts(error.remainingAttempts || 3);
      }
    } else {
      // PIN verification successful
      handleLoginSuccess(data?.business || data);
    }
    
    setIsLoading(false);
  };

  const handleBackToPhone = () => {
    setLoginStep('phone');
    setBusinessData(null);
    setPinError('');
    setError('');
  };

  const handleLockoutExpired = () => {
    setLoginStep('pin');
    setLockoutTime(0);
    setRemainingAttempts(3);
    setPinError('');
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
      {/* Header removed - no back navigation */}

      <div className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* Phone Step */}
          {loginStep === 'phone' && (
            <>
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
                  Enter your phone number and PIN to access your business
                </p>
                <p className="text-[var(--text-3)] text-sm mt-2">
                  Just like mobile banking - secure and simple
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
                      placeholder="Enter phone number (e.g., 0712345678 or +254712345678)"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <Lock size={16} />
                      Enter Your PIN
                    </label>
                    <div className="flex justify-center gap-2 mb-4">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <input
                          key={index}
                          type={showPin ? "text" : "password"}
                          maxLength={1}
                          value={formData.pin[index] || ''}
                          onChange={(e) => handlePinChange(e, index)}
                          onKeyDown={(e) => handlePinKeyDown(e, index)}
                          className="w-12 h-12 text-center text-lg font-semibold bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] transition-all"
                          disabled={isLoading}
                          ref={(input) => {
                            if (input) pinRefs.current[index] = input;
                          }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-sm text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                    >
                      {showPin ? 'Hide' : 'Show'} PIN
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !formData.phone || formData.pin.length !== 6}
                    className="w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      'Access Business'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-[var(--text-3)] text-sm">
                    Don't have an account?{' '}
                    <Link href="/Beezee-App/auth/signup" className="text-[var(--powder-dark)] hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </motion.div>
            </>
          )}

          {/* PIN Step */}
          {loginStep === 'pin' && (
            <PINVerification
              onPINSubmit={handlePINSubmit}
              onCancel={handleBackToPhone}
              isLoading={isLoading}
              error={pinError}
              remainingAttempts={remainingAttempts}
              lockoutTime={lockoutTime}
            />
          )}

          {/* Lockout Step */}
          {loginStep === 'locked' && (
            <PINLockout
              lockoutTime={lockoutTime}
              onTimeExpired={handleLockoutExpired}
              onContactSupport={() => window.open('mailto:support@beezee.app')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
