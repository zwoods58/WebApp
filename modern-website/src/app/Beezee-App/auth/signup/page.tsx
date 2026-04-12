"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, User, Phone, DollarSign, Building, LogIn, Mail } from 'lucide-react';
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
    <div className="flex-1 flex flex-col overflow-hidden max-h-[780px]">

      {/* Compact progress bar - only show for steps 2-6 */}
      {currentStep >= 2 && currentStep <= 6 && (
        <div className="flex-shrink-0 px-3 pb-1">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-medium text-[var(--text-2)]">
                Step {currentStep - 1} of 5
              </div>
              <div className="text-xs font-medium text-[var(--powder-dark)]">
                {Math.round(((currentStep - 1) / 5) * 100)}%
              </div>
            </div>
            <div className="w-full h-1.5 bg-[var(--glass-bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] transition-all duration-300 ease-out"
                style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content - optimized for 780px height */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="container mx-auto px-3 py-0 flex-1">
          <div
            key={currentStep}
            className="max-w-md mx-auto w-full h-full"
          >
            {renderStep()}
          </div>
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

// Welcome Step Component - COMPACT LAYOUT VERSION (Buttons at bottom)
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full max-h-[780px]">
      {/* Top spacer - minimal to center content */}
      <div className="flex-1"></div>
      
      {/* Welcome content - centered with reduced spacing */}
      <div className="text-center px-4">
        <div className="mb-4">
          {/* Bee logo/icon - slightly smaller */}
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--powder-dark)] to-[var(--powder-mid)] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-2xl">{'\ud83d\udc1d'}</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
          Welcome to BeeZee
        </h1>
        <p className="text-[var(--text-2)] text-sm leading-relaxed max-w-sm mx-auto">
          Join thousands of African entrepreneurs managing their business with ease.
        </p>
      </div>

      {/* Spacer to push buttons to bottom */}
      <div className="flex-1"></div>

      {/* Buttons fixed at very bottom of screen */}
      <div className="px-4 pb-4">
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-2xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
          >
            Sign Up
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <Link
            href="/Beezee-App/auth/login"
            className="w-full bg-[var(--glass-bg)] border-2 border-[var(--border)] text-[var(--text-1)] py-3 px-6 rounded-2xl hover:bg-[var(--border)] hover:border-[var(--powder-mid)] transition-all duration-300 font-semibold text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
          >
            <LogIn size={20} />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// Country Selection Component - COMPACT LAYOUT VERSION
function CountrySelection({ selected, onSelect, onNext, onPrev }: { 
  selected: string; 
  onSelect: (country: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  const selectedCountry = countries.find(c => c.code === selected);
  
  return (
    <div className="flex flex-col h-full max-h-[780px]">
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold text-[var(--text-1)] mb-1">
          Select Your Country
        </h2>
        <p className="text-[var(--text-3)] text-xs">
          Choose where your business operates
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-3 mb-3">
          <div className="space-y-2">
            <div className="relative">
              <select
                value={selected}
                onChange={(e) => onSelect(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] appearance-none cursor-pointer text-sm"
              >
                <option value="" disabled>Select a country...</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-[var(--text-2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {selectedCountry && (
              <div className="flex items-center justify-center p-2 bg-[var(--powder-light)] rounded-lg border border-[var(--powder-dark)]/30">
                <span className="text-lg mr-2">{selectedCountry.flag}</span>
                <span className="font-medium text-[var(--text-1)] text-sm">{selectedCountry.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons fixed at bottom */}
      <div className="px-3 pb-4">
        <div className="flex gap-3">
          <button
            onClick={onPrev}
            className="flex-1 px-4 py-2 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all text-sm"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!selected}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Industry Selection Component - COMPACT LAYOUT VERSION
function IndustrySelection({ selected, onSelect, onNext, onPrev }: { 
  selected: string; 
  onSelect: (industry: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="flex flex-col h-full max-h-[780px]">
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold text-[var(--text-1)] mb-1">
          Choose Your Industry
        </h2>
        <p className="text-[var(--text-3)] text-xs">
          Select category that best describes your business
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-3 mb-3">
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-1 max-h-[240px] overflow-y-auto">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => onSelect(industry.id)}
                  className={`p-2 rounded-lg border-2 transition-all text-left ${
                    selected === industry.id
                      ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]'
                      : 'border-[var(--border)] hover:border-[var(--powder-mid)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="text-lg">{industry.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-1)] text-sm">{industry.name}</div>
                      <div className="text-xs text-[var(--text-3)]">Manage your {industry.name.toLowerCase()} business</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons fixed at bottom */}
      <div className="px-3 pb-4">
        <div className="flex gap-3">
          <button
            onClick={onPrev}
            className="flex-1 px-4 py-2 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all text-sm"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!selected}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Basic Info Component - COMPACT LAYOUT VERSION
function BasicInfo({ formData, onChange, onNext, onPrev }: { 
  formData: Partial<SignupData>; 
  onChange: (field: keyof SignupData, value: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="flex flex-col h-full max-h-[780px]">
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold text-[var(--text-1)] mb-1">
          Tell us about yourself
        </h2>
        <p className="text-[var(--text-3)] text-xs">
          Basic information to set up your account
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-3 mb-3">
          <form className="space-y-2">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1">
                <User size={14} />
                Your name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => onChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1">
                <Building size={14} />
                Business name (optional)
              </label>
              <input
                type="text"
                value={formData.businessName || ''}
                onChange={(e) => onChange('businessName', e.target.value)}
                className="w-full px-3 py-2 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
                placeholder="Acme Corporation"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1">
                <Phone size={14} />
                Phone number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber || ''}
                onChange={(e) => onChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
                placeholder="+254 700 000 000"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1">
                <Mail size={14} />
                Email address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
                placeholder="john@example.com"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Buttons fixed at bottom */}
      <div className="px-3 pb-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 px-4 py-2 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all text-sm"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!formData.name || !formData.phoneNumber || !formData.email}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
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