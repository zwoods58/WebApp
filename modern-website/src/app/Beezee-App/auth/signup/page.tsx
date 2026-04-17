"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, User, UserPlus, Mail, Phone, Building, Globe, Lock, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';
import { getCurrency, countryConfigs } from '@/utils/currency';
import { industries } from '@/data/industries';

// Country data with enhanced configuration
const countries = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', flagAlt: 'KE' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', flagAlt: 'ZA' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', flagAlt: 'NG' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', flagAlt: 'GH' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', flagAlt: 'UG' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', flagAlt: 'RW' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', flagAlt: 'TZ' },
  { code: 'CI', name: "Cote d'Ivoire", flag: '🇨🇮', flagAlt: 'CI' }
];

export default function Signup() {
  const { t } = useLanguage();
  const { signUp, isAuthenticated, business, loading } = useSupabaseAuth();
  const { showError, showSuccess } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    country: '',
    industry: '',
    dailyTarget: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const router = useRouter();

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (!loading && isAuthenticated && business && !isRedirecting) {
      setIsRedirecting(true);
      const country = business.country.toLowerCase();
      const industry = business.industry.toLowerCase();
      
      const redirectTimer = setTimeout(() => {
        router.push(`/Beezee-App/app/${country}/${industry}`);
      }, 150);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, business, loading, isRedirecting, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // First name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    // Business name
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    // Country
    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    // Industry
    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        businessName: formData.businessName,
        country: formData.country,
        industry: formData.industry,
        dailyTarget: formData.dailyTarget ? Number(formData.dailyTarget) : undefined,
      });

      if (result.error) {
        showError(result.error.message);
      } else if (result.data?.message) {
        showSuccess(result.data.message);
        // Redirect to confirmation page
        setTimeout(() => {
          router.push('/Beezee-App/auth/confirmation');
        }, 2000);
      }
    } catch (error) {
      showError('Sign up failed. Please try again.');
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)]" style={{ scrollBehavior: 'smooth' }}>
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="container mx-auto px-6 pt-6 pb-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
                Create Your Business Account
              </h1>
              <p className="text-[var(--text-3)] text-xs">
                Join thousands of African entrepreneurs managing their business with ease.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Main content */}
      <div 
        className="container mx-auto px-6 pb-8 scroll-smooth" 
        style={{ 
          maxHeight: 'calc(100vh - 140px)', 
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch' // for iOS momentum scrolling
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-6">
            {/* General Error */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                <p className="font-medium">Please fix the following errors:</p>
                <ul className="mt-2 space-y-1">
                  {Object.values(errors).map((error, index) => (
                    <li key={index} className="text-red-600">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form id="signup-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-1)] mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <User size={16} />
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm ${
                        errors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                      }`}
                      disabled={isSubmitting}
                      autoComplete="given-name"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <User size={16} />
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm ${
                        errors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                      }`}
                      disabled={isSubmitting}
                      autoComplete="family-name"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm ${
                        errors.email ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                      }`}
                      disabled={isSubmitting}
                      autoComplete="email"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

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
                      placeholder="+254 700 000 000"
                      className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm ${
                        errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                      }`}
                      disabled={isSubmitting}
                      autoComplete="tel"
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-1)] mb-4">Business Information</h3>
                
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                    <Building size={16} />
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm ${
                      errors.businessName ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                    }`}
                    disabled={isSubmitting}
                    autoComplete="organization"
                    required
                  />
                  {errors.businessName && (
                    <p className="text-red-600 text-xs mt-1">{errors.businessName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <Globe size={16} />
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] transition-all text-sm appearance-none cursor-pointer ${
                        errors.country ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                      }`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Select a country...</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                    {errors.country && (
                      <p className="text-red-600 text-xs mt-1">{errors.country}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <Building size={16} />
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] transition-all text-sm appearance-none cursor-pointer ${
                        errors.industry ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
                      }`}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">Select an industry...</option>
                      {industries.map((industry) => (
                        <option key={industry.id} value={industry.id}>
                          {industry.icon} {industry.name}
                        </option>
                      ))}
                    </select>
                    {errors.industry && (
                      <p className="text-red-600 text-xs mt-1">{errors.industry}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-2)] mb-2">
                    Daily Target (Optional)
                  </label>
                  <input
                    type="number"
                    name="dailyTarget"
                    value={formData.dailyTarget}
                    onChange={handleChange}
                    placeholder="Enter your daily sales target"
                    className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
                    disabled={isSubmitting}
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[var(--text-1)] mb-4">Security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <Lock size={16} />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm pr-10 ${
                          errors.password ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
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
                    {errors.password && (
                      <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                      <Lock size={16} />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`w-full px-3 py-2.5 bg-[var(--glass-bg)] border rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm pr-10 ${
                          errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-[var(--border)]'
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
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-[var(--text-3)] text-sm">
                Already have an account?{' '}
                <Link
                  href="/Beezee-App/auth/login"
                  className="text-[var(--powder-dark)] hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Create Account and Go Back buttons */}
      <div className="container mx-auto px-6 py-8 mt-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Go Back Button */}
            <Link 
              href="/Beezee-App/get-started"
              className="group bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-xl p-4 hover:shadow-xl hover:shadow-[var(--border)]/20 transition-all duration-300"
            >
              <div className="flex items-center gap-2 text-[var(--text-1)] font-semibold group-hover:gap-3 transition-all">
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                Go Back
              </div>
            </Link>

            {/* Create Account Button */}
            <button
              type="button"
              onClick={() => {
                const element = document.getElementById('signup-form');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="group bg-gradient-to-r from-[var(--powder-light)]/20 to-[var(--powder-mid)]/20 to-[var(--powder-dark)]/20 border border-[var(--border)]/30 rounded-xl p-4 hover:shadow-xl hover:shadow-[var(--powder-mid)]/20 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2 text-[var(--text-1)] font-semibold">
                <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                Create Account
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

