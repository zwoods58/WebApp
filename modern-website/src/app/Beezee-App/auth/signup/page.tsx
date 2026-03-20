"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Globe, User, Phone, DollarSign, Building, Mail, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SignupData } from '@/types/signup';
import { BusinessProfileProvider, useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { IndustrySectorStep } from '@/components/signup/IndustrySectorStep';
import { LiveAccountSummary } from '@/components/signup/LiveAccountSummary';
import { HybridDailyTarget } from '@/components/signup/HybridDailyTarget';
import { AccountSummaryPreview } from '@/components/signup/AccountSummaryPreview';
import { storage } from '@/utils/performance';
import { getCurrency, countryConfigs } from '@/utils/currency';
import { industries } from '@/data/industries';
import { localStorageManager } from '@/utils/localStorageManager';
import { setBusinessContext } from '@/lib/supabaseContext';
import { useAuth } from '@/hooks/useAuth';
import { useSignup } from '@/hooks/useSignup';
import PINSetup from '@/components/auth/PINSetup';
import SignupPWAInstallModal from '@/components/auth/SignupPWAInstallModal';

// Helper function to get flag emoji or fallback
const getFlagDisplay = (country: { code: string; name: string; flag: string }) => {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-xl border-2 border-blue-500/30">
      <span className="text-5xl leading-none" role="img" aria-label={`${country.name} flag`}>
        {country.flag}
      </span>
      <span className="absolute bottom-1 right-1 text-xs font-bold text-blue-600 bg-white/80 px-1 rounded">
        {country.code}
      </span>
    </div>
  );
};

// Country data with enhanced configuration
const countries = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', flagAlt: 'KE' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', flagAlt: 'ZA' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', flagAlt: 'NG' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', flagAlt: 'GH' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', flagAlt: 'UG' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', flagAlt: 'RW' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', flagAlt: 'TZ' }
];

function BeezeeSignupContent() {
  const router = useRouter();
  const { setProfile } = useBusinessProfile();
  const { } = useAuth();
  
  // Use the new signup hook
  const signup = useSignup();
  
  // PWA Install Modal State
  const [showPWAInstallModal, setShowPWAInstallModal] = useState(false);
  const [hasSeenPWAInstallModal, setHasSeenPWAInstallModal] = useState(false);

  // Check if user has already seen the PWA install modal
  useEffect(() => {
    const seenModal = localStorage.getItem('beezee_seen_pwa_install_modal');
    if (seenModal) {
      setHasSeenPWAInstallModal(true);
    }
  }, []);

  const {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    handlePINSetup,
    handlePINConfirmation,
    handleComplete,
    validateCurrentStep
  } = signup;

  const handleNextStep = () => {
    // Show PWA install modal after welcome step (step 1) if not seen before
    if (currentStep === 1 && !hasSeenPWAInstallModal) {
      setShowPWAInstallModal(true);
      localStorage.setItem('beezee_seen_pwa_install_modal', 'true');
      setHasSeenPWAInstallModal(true);
    } else {
      nextStep();
    }
  };

  const handleContinueAfterPWA = () => {
    setShowPWAInstallModal(false);
    nextStep();
  };
  
  const handleFinalComplete = async () => {
    // Redirect to dashboard after successful signup
    if (signup.isComplete && signup.businessId) {
      const country = formData.country?.toLowerCase() || 'ke';
      const industry = formData.industry?.toLowerCase() || 'retail';
      
      console.log('🎯 Redirecting to dashboard:', { country, industry });
      router.push(`/Beezee-App/app/${country}/${industry}`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNextStep} />;
      case 2:
        return <CountrySelection 
          selected={formData.country || ''}
          onSelect={(country) => updateFormData('country', country)}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 3:
        return <IndustrySelection 
          selected={formData.industry || ''}
          onSelect={(industry) => updateFormData('industry', industry)}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 4:
        return <IndustrySectorStep 
          industry={formData.industry || ''}
          selectedSector={formData.industrySector || ''}
          onSelect={(sector) => updateFormData('industrySector', sector)}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 5:
        return <BasicInfo 
          formData={formData}
          onChange={updateFormData}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 6:
        return (
          <div className="py-12">
            <PINSetup
              onPINComplete={handlePINSetup}
              onCancel={prevStep}
              isLoading={signup.creationState.loading}
              error={signup.creationState.error || undefined}
            />
          </div>
        );
      case 7:
        return <HybridDailyTarget 
          country={formData.country || ''}
          selectedTarget={formData.dailyTarget?.toString() || ''}
          onSelect={(target) => updateFormData('dailyTarget', Number(target))}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 8:
        return <AccountSummaryPreview 
          formData={formData}
          onComplete={handleComplete}
          onPrev={prevStep}
          isLoading={signup.creationState.loading}
          error={signup.creationState.error}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex flex-col">
      {/* Header removed - no back navigation */}

      {/* Top progress summary */}
      <LiveAccountSummary 
        data={formData} 
        currentStep={currentStep} 
        isVisible={currentStep >= 2 && currentStep <= 8} 
      />

      <div className="flex-1 container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PWA Install Modal */}
      <SignupPWAInstallModal
        isOpen={showPWAInstallModal}
        onClose={() => setShowPWAInstallModal(false)}
        onContinue={handleContinueAfterPWA}
      />
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="py-12 text-center min-h-screen flex flex-col">
      {/* Logo at the top */}
      <div className="w-24 h-24 flex items-center justify-center mx-auto mb-8">
        <Image 
          src="/beezee-logo.png" 
          alt="BeeZee Logo" 
          width={96} 
          height={96}
          className="h-24 w-auto"
        />
      </div>

      {/* Content centered in the middle */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-[var(--text-1)] mb-6 tracking-[-0.02em]">
            Get Started
          </h1>
          
          <p className="text-xl text-[var(--text-2)] mb-8 leading-relaxed">
            Join thousands of African entrepreneurs managing their business with ease.
          </p>
        </motion.div>
      </div>

      {/* Buttons at the very bottom */}
      <div className="pb-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-4 px-8 rounded-xl font-semibold hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all flex items-center justify-center gap-3"
          >
            Sign Up
            <ArrowRight size={20} />
          </button>
          
          <Link
            href="/Beezee-App/auth/login"
            className="bg-[var(--glass-bg)] border border-[var(--border)] text-[var(--text-1)] py-4 px-8 rounded-xl font-semibold hover:bg-[var(--border)] transition-all flex items-center justify-center gap-3"
          >
            <LogIn size={20} />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// Country Selection Component
function CountrySelection({ selected, onSelect, onNext, onPrev }: { 
  selected: string; 
  onSelect: (country: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-[var(--text-1)] mb-4 text-center">
        Select Your Country
      </h2>
      <p className="text-[var(--text-2)] text-center mb-8">
        Choose where your business operates
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {countries.map((country) => (
          <button
            key={country.code}
            onClick={() => onSelect(country.code)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selected === country.code
                ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]'
                : 'border-[var(--border)] hover:border-[var(--powder-mid)]'
            }`}
          >
            {getFlagDisplay(country)}
            <div className="mt-2 text-sm font-medium text-[var(--text-1)]">
              {country.name}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Industry Selection Component
function IndustrySelection({ selected, onSelect, onNext, onPrev }: { 
  selected: string; 
  onSelect: (industry: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-[var(--text-1)] mb-4 text-center">
        Choose Your Industry
      </h2>
      <p className="text-[var(--text-2)] text-center mb-8">
        Select the category that best describes your business
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => onSelect(industry.id)}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selected === industry.id
                ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]'
                : 'border-[var(--border)] hover:border-[var(--powder-mid)]'
            }`}
          >
            <div className="text-2xl mb-2">{industry.icon}</div>
            <div className="font-semibold text-[var(--text-1)] mb-1">{industry.name}</div>
            <div className="text-sm text-[var(--text-3)]">Manage your {industry.name.toLowerCase()} business efficiently</div>
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Basic Info Component
function BasicInfo({ formData, onChange, onNext, onPrev }: { 
  formData: Partial<SignupData>; 
  onChange: (field: keyof SignupData, value: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-[var(--text-1)] mb-4 text-center">
        Tell us about yourself
      </h2>
      <p className="text-[var(--text-2)] text-center mb-8">
        Basic information to set up your account
      </p>

      <div className="space-y-6 mb-8">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
            <User size={16} />
            Your name
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
            <Building size={16} />
            Business name (optional)
          </label>
          <input
            type="text"
            value={formData.businessName || ''}
            onChange={(e) => onChange('businessName', e.target.value)}
            className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]"
            placeholder="Acme Corporation"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
            <Phone size={16} />
            Phone number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber || ''}
            onChange={(e) => onChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]"
            placeholder="+254 700 000 000"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
            <Mail size={16} />
            Invite code (optional)
          </label>
          <input
            type="text"
            value={formData.inviteCode || ''}
            onChange={(e) => onChange('inviteCode', e.target.value)}
            className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]"
            placeholder="Enter invite code if you have one"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!formData.name || !formData.phoneNumber}
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <BusinessProfileProvider>
      <BeezeeSignupContent />
    </BusinessProfileProvider>
  );
}
