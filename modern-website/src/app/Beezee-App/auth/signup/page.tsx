"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Globe, User, Phone, DollarSign, Building, LogIn, Mail, Lock, Shield } from 'lucide-react';
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
import SecurityQuestionsSetup from '@/components/auth/SecurityQuestionsSetup';
import CombinedSecurityStepWithFallback from '@/components/auth/CombinedSecurityStepWithFallback';
import SecurityQuestionsSetupWithFallback from '@/components/auth/SecurityQuestionsSetupWithFallback';

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
          <CombinedSecurityStepWithFallback
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
    <div className="flex-1 flex flex-col">
      {/* Compact progress bar - only show for steps 2-6 */}
      {currentStep >= 2 && currentStep <= 6 && (
        <div className="flex-shrink-0 px-6 pb-2">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-[var(--text-2)]">
                Step {currentStep - 1} of 5
              </div>
              <div className="text-xs font-medium text-[var(--powder-dark)]">
                {Math.round(((currentStep - 1) / 5) * 100)}%
              </div>
            </div>
            <div className="w-full h-1.5 bg-[var(--glass-bg)] rounded-full">
              <div
                className="h-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] transition-all duration-300 ease-out"
                style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content - allow full height */}
      <div className="flex-1 container mx-auto px-6 py-6 flex flex-col">
        <div className="max-w-md mx-auto w-full">
          <div
            key={currentStep}
            className="w-full overflow-y-auto max-h-[calc(100vh-250px)]"
          >
            {renderStep()}
          </div>
        </div>
      </div>

    </div>
  );
}

// Welcome Step Component - MATCHING LOGIN PAGE UI
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="fade-in-up bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl px-5 pt-5 mx-auto max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-1)] mb-2">
            Welcome to BeeZee
          </h1>
          <p className="text-[var(--text-3)] text-xs">
            Join thousands of African entrepreneurs managing their business with ease.
          </p>
        </div>
        <div className="space-y-4">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white py-3 px-6 rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
          >
            Sign Up
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <Link
            href="/Beezee-App/auth/login"
            className="w-full bg-[var(--glass-bg)] border-2 border-[var(--border)] text-[var(--text-1)] py-3 px-6 rounded-xl hover:bg-[var(--border)] hover:border-[var(--powder-mid)] transition-all duration-300 font-medium text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
          >
            <LogIn size={18} />
            Login
          </Link>
        </div>
    </div>
  );
}

// Country Selection Component - MATCHING LOGIN PAGE UI
function CountrySelection({ selected, onSelect, onNext, onPrev }: { 
  selected: string; 
  onSelect: (country: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  const selectedCountry = countries.find(c => c.code === selected);
  
  return (
    <div className="fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-1)] mb-2">
          Select Your Country
        </h2>
        <p className="text-[var(--text-3)] text-xs">
          Choose where your business operates
        </p>
      </div>

      <div className="fade-in-up bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5">
        <div className="space-y-4">
          <div className="relative">
            <select
              value={selected}
              onChange={(e) => onSelect(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] appearance-none cursor-pointer text-sm"
            >
              <option value="" disabled>Select a country...</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-40 h-40 text-[var(--text-2)]" fill="none" stroke="currentColor" viewBox="0 0 240 240">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {selectedCountry && (
            <div className="flex items-center justify-center p-3 bg-[var(--powder-light)] rounded-lg border border-[var(--powder-dark)]/30">
              <span className="text-lg mr-2">{selectedCountry.flag}</span>
              <span className="font-medium text-[var(--text-1)] text-sm">{selectedCountry.name}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onPrev}
            className="flex-1 px-4 py-2.5 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all text-sm"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!selected}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Industry Selection Component - MATCHING LOGIN PAGE UI
function IndustrySelection({ selected, onSelect, onNext, onPrev }: { 
  selected: string; 
  onSelect: (industry: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-1)] mb-2">
          Choose Your Industry
        </h2>
        <p className="text-[var(--text-3)] text-xs">
          Select category that best describes your business
        </p>
      </div>

      <div className="fade-in-up bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5">
        <div className="space-y-2">
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => onSelect(industry.id)}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                selected === industry.id
                  ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]'
                  : 'border-[var(--border)] hover:border-[var(--powder-mid)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-xl">{industry.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-[var(--text-1)] text-sm">{industry.name}</div>
                  <div className="text-xs text-[var(--text-3)]">Manage your {industry.name.toLowerCase()} business</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onPrev}
            className="flex-1 px-4 py-2.5 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all text-sm"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!selected}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

// Basic Info Component - MATCHING LOGIN PAGE UI
function BasicInfo({ formData, onChange, onNext, onPrev }: { 
  formData: Partial<SignupData>; 
  onChange: (field: keyof SignupData, value: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-1)] mb-2">
          Tell us about yourself
        </h2>
        <p className="text-[var(--text-3)] text-xs">
          Basic information to set up your account
        </p>
      </div>

      <div className="fade-in-up bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5">
        <form className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5">
              <User size={14} />
              Your name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5">
              <Building size={14} />
              Business name (optional)
            </label>
            <input
              type="text"
              value={formData.businessName || ''}
              onChange={(e) => onChange('businessName', e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
              placeholder="Acme Corporation"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5">
              <Phone size={14} />
              Phone number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => onChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
              placeholder="+254 700 000 000"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[var(--text-2)] mb-1.5">
              <Mail size={14} />
              Email address
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] placeholder-[var(--text-3)] transition-all text-sm"
              placeholder="john@example.com"
            />
          </div>
        </form>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 px-4 py-2.5 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all text-sm"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!formData.name || !formData.phoneNumber || !formData.email}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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