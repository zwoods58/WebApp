"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';
import { industries } from '@/data/industries';

const countries = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'CI', name: "Cote d'Ivoire", flag: '🇨🇮' },
];

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900 placeholder-gray-400 outline-none transition-all focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-200'
      : 'border-gray-200 focus:border-[#4A8DB8] focus:ring-[#4A8DB8]/20'
  }`;

const selectClass = (hasError: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-sm bg-white text-gray-900 outline-none transition-all focus:ring-2 appearance-none cursor-pointer ${
    hasError
      ? 'border-red-400 focus:ring-red-200'
      : 'border-gray-200 focus:border-[#4A8DB8] focus:ring-[#4A8DB8]/20'
  }`;

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

  // If already authenticated, go straight to the app
  useEffect(() => {
    if (!loading && isAuthenticated && business && !isRedirecting) {
      setIsRedirecting(true);
      const country = business.country.toLowerCase();
      const industry = business.industry.toLowerCase();
      const t = setTimeout(() => router.push(`/Beezee-App/app/${country}/${industry}`), 150);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, business, loading, isRedirecting, router]);

  // If this is a direct/fresh load (PWA reopen, bookmark, etc.) and the user
  // is not authenticated, send them to Get Started instead of leaving them on
  // the signup page they may have accidentally landed on.
  useEffect(() => {
    if (loading) return; // wait for auth resolution
    if (isAuthenticated) return; // already handled above

    // Detect a fresh load: no referrer, or referrer is outside this app
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    const host = typeof window !== 'undefined' ? window.location.host : '';
    const isFreshLoad = !referrer || !referrer.includes(host);

    if (isFreshLoad) {
      router.replace('/Beezee-App/get-started');
    }
  }, [loading, isAuthenticated, router]);

  const validateForm = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = "What's your first name?";
    else if (formData.firstName.length < 2) e.firstName = 'At least 2 characters please';

    if (!formData.lastName.trim()) e.lastName = "What's your last name?";
    else if (formData.lastName.length < 2) e.lastName = 'At least 2 characters please';

    if (!formData.email.trim()) e.email = 'We need your email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "That email doesn't look right";

    if (!formData.phone.trim()) e.phone = "Don't forget your phone number";
    else if (formData.phone.length < 10) e.phone = 'Phone number too short';

    if (!formData.businessName.trim()) e.businessName = "What's your business called?";
    if (!formData.country) e.country = 'Pick your country';
    if (!formData.industry) e.industry = 'What type of business do you run?';

    if (!formData.password) e.password = 'You need a password';
    else if (formData.password.length < 8) e.password = 'Password needs at least 8 characters';

    if (!formData.confirmPassword) e.confirmPassword = 'Type your password again';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords don't match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Almost there — check a few things above');
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
        setTimeout(() => router.push('/Beezee-App/auth/confirmation'), 2000);
      }
    } catch {
      showError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="w-10 h-10 border-2 border-[#4A8DB8]/30 border-t-[#4A8DB8] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">One second...</p>
        </div>
      </div>
    );
  }

  return (
    // Explicit scroll container — overrides globals.css height:100% body constraint
    <div
      style={{
        minHeight: '100vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        background: '#F9FAFB',
      }}
    >
      {/* ── Top Bar ── */}
      <div
        style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #F3F4F6' }}
      >
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center gap-3">
          <Link
            href="/Beezee-App/get-started"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-800">Create your account</span>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-lg mx-auto px-5 py-8 pb-20">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Let&apos;s get you set up 👋</h1>
          <p className="text-gray-500 text-sm">Takes less than 2 minutes. No credit card needed.</p>
        </div>

        {/* Error Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
            Almost there — check the highlighted fields above.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* ── About You ── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About you</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={inputClass(!!errors.firstName)}
                    disabled={isSubmitting}
                    autoComplete="given-name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className={inputClass(!!errors.lastName)}
                    disabled={isSubmitting}
                    autoComplete="family-name"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className={inputClass(!!errors.email)}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number (e.g. +254 700 000 000)"
                  className={inputClass(!!errors.phone)}
                  disabled={isSubmitting}
                  autoComplete="tel"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* ── Your Business ── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your business</p>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="What's your business called?"
                  className={inputClass(!!errors.businessName)}
                  disabled={isSubmitting}
                  autoComplete="organization"
                />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={selectClass(!!errors.country)}
                    disabled={isSubmitting}
                  >
                    <option value="">Your country</option>
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
                <div>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={selectClass(!!errors.industry)}
                    disabled={isSubmitting}
                  >
                    <option value="">Type of business</option>
                    {industries.map(i => (
                      <option key={i.id} value={i.id}>{i.icon} {i.name}</option>
                    ))}
                  </select>
                  {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
                </div>
              </div>

              <div>
                <input
                  type="number"
                  name="dailyTarget"
                  value={formData.dailyTarget}
                  onChange={handleChange}
                  placeholder="Daily sales goal — optional (e.g. 5000)"
                  className={inputClass(false)}
                  disabled={isSubmitting}
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* ── Password ── */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Set a password</p>
            <div className="space-y-3">
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Choose a password (8+ characters)"
                    className={`${inputClass(!!errors.password)} pr-11`}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Type your password again"
                    className={`${inputClass(!!errors.confirmPassword)} pr-11`}
                    disabled={isSubmitting}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A2332] text-white font-bold py-4 rounded-2xl text-base active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting things up...
              </>
            ) : (
              'Create my account →'
            )}
          </button>
        </form>

        {/* ── Login Link ── */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/Beezee-App/auth/login" className="text-[#4A8DB8] font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
