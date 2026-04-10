"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, User, Phone, DollarSign, Building, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SignupData } from '@/types/signup';
import { BusinessProfileProvider, useBusinessProfile } from '@/contexts/BusinessProfileContext';
import { CombinedSelectionsStep } from '@/components/signup/CombinedSelectionsStep';
import { CombinedSecurityStep } from '@/components/signup/CombinedSecurityStep';
import { LiveAccountSummary } from '@/components/signup/LiveAccountSummary';
import { HybridDailyTarget } from '@/components/signup/HybridDailyTarget';
import { AccountSummaryPreview } from '@/components/signup/AccountSummaryPreview';
import { storage } from '@/utils/performance';
import { getCurrency, countryConfigs } from '@/utils/currency';
import { industries } from '@/data/industries';
import { localStorageManager } from '@/utils/localStorageManager';
import { setBusinessContext } from '@/lib/supabaseContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useSignup } from '@/hooks/useSignup';
import PINSetup from '@/components/auth/PINSetup';
import SignupPWAInstallModal from '@/components/auth/SignupPWAInstallModal';
import SecurityQuestionsSetup from '@/components/auth/SecurityQuestionsSetup';

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
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', flagAlt: 'TZ' },
  { code: 'CI', name: "Cote d'Ivoire", flag: '🇨🇮', flagAlt: 'CI' }
];

function BeezeeSignupContent() {
  const router = useRouter();
  const { setProfile } = useBusinessProfile();
  const { } = useUnifiedAuth();
  
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
        return <CombinedSelectionsStep 
          selectedCountry={formData.country || ''}
          selectedIndustry={formData.industry || ''}
          selectedSector={formData.industrySector || ''}
          onCountrySelect={(country) => updateFormData('country', country)}
          onIndustrySelect={(industry) => updateFormData('industry', industry)}
          onSectorSelect={(sector: string) => updateFormData('industrySector', sector)}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 3:
        return <BasicInfo 
          formData={formData}
          onChange={updateFormData}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 4:
        return (
          <CombinedSecurityStep
            onPINComplete={handlePINSetup}
            onSecurityQuestionsComplete={(data) => {
              console.log('Security question data received:', data);
              signup.updateSecurityQuestions(data);
            }}
            onCombinedComplete={(pin: string, securityData: any) => {
              // Handle PIN setup
              handlePINSetup(pin);
              // Store security questions data
              signup.updateSecurityQuestions(securityData);
              // Move to next step
              setTimeout(() => {
                nextStep();
              }, 500);
            }}
            onCancel={prevStep}
            isLoading={signup.creationState.loading}
            error={signup.creationState.error || undefined}
          />
        );
      case 5:
        return <HybridDailyTarget 
          country={formData.country || ''}
          selectedTarget={formData.dailyTarget?.toString() || ''}
          onSelect={(target) => updateFormData('dailyTarget', Number(target))}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 6:
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
        isVisible={currentStep >= 2 && currentStep <= 9} 
      />

      <div className="flex-1 container mx-auto px-6 py-8">
        <div
          key={currentStep}
          className="max-w-4xl mx-auto fade-in"
        >
          {renderStep()}
        </div>
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
    <div className="h-screen flex flex-col text-center">
      {/* Logo at the top */}
      <div className="pt-8 pb-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto">
          <Image 
            src="/beezee-logo.png" 
            alt="BeeZee Logo" 
            width={96} 
            height={96}
            className="h-full w-auto"
          />
        </div>
      </div>

      {/* Content centered in the middle */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div
          className="max-w-2xl mx-auto fade-in-up"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-1)] mb-4 sm:mb-6 leading-tight">
            Welcome to BeeZee
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-2)] mb-6 sm:mb-8 leading-relaxed">
            Join thousands of African entrepreneurs managing their business with ease.
          </p>
        </div>
      </div>

      {/* Buttons at the very bottom */}
      <div className="pb-6 sm:pb-8 px-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm mx-auto sm:max-w-none">
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all flex items-center justify-center gap-3 text-sm sm:text-base"
          >
            Sign Up
            <ArrowRight size={18} className="sm:size-20" />
          </button>
          
          <Link
            href="/Beezee-App/auth/login"
            className="bg-[var(--glass-bg)] border border-[var(--border)] text-[var(--text-1)] py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold hover:bg-[var(--border)] transition-all flex items-center justify-center gap-3 text-sm sm:text-base"
          >
            <LogIn size={18} className="sm:size-20" />
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
  const selectedCountry = countries.find(c => c.code === selected);
  
  return (
    <div className="py-6 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] mb-3 sm:mb-4 text-center">
        Select Your Country
      </h2>
      <p className="text-sm sm:text-base text-[var(--text-2)] text-center mb-6 sm:mb-8">
        Choose where your business operates
      </p>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <select
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] appearance-none cursor-pointer"
          >
            <option value="" disabled>Select a country...</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-[var(--text-2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Selected country display */}
        {selectedCountry && (
          <div className="mt-4 flex items-center justify-center p-3 bg-[var(--powder-light)] rounded-xl border border-[var(--powder-dark)]/30">
            <span className="text-2xl mr-3">{selectedCountry.flag}</span>
            <span className="font-medium text-[var(--text-1)]">{selectedCountry.name}</span>
          </div>
        )}
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
    <div className="py-6 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] mb-3 sm:mb-4 text-center">
        Choose Your Industry
      </h2>
      <p className="text-sm sm:text-base text-[var(--text-2)] text-center mb-6 sm:mb-8">
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
    <div className="py-6 sm:py-8 max-h-screen overflow-y-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] mb-3 sm:mb-4 text-center">
        Tell us about yourself
      </h2>
      <p className="text-sm sm:text-base text-[var(--text-2)] text-center mb-6 sm:mb-8">
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
