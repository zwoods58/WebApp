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
  
  // Real signup state management
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  
  const createBusinessInDatabase = async (userData: any) => {
    console.log('🔧 Creating business in database:', userData);
    
    try {
      // Call server-side API endpoint to create business (bypasses RLS)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!result.success) {
        console.error('❌ API error:', result.error);
        return {
          success: false,
          existingUser: result.existingUser || false,
          error: result.error || 'Failed to create business',
          data: null
        };
      }

      const business = result.data.business;

      console.log('✅ Business created successfully:', {
        id: business.id,
        business_name: business.business_name,
        country: business.country,
        industry: business.industry,
        home_currency: business.home_currency
      });

      // Create session data for immediate login
      const sessionData = {
        businessId: business.id,
        businessName: business.business_name,
        country: business.country,
        industry: business.industry,
        phone: business.phone_number
      };

      // Store authentication data
      const authData = {
        business: business,
        session: sessionData
      };

      console.log('💾 Storing auth data to localStorage:', authData);
      localStorage.setItem('beezee_business_auth', JSON.stringify(authData));
      
      // Verify it was stored correctly
      const storedData = localStorage.getItem('beezee_business_auth');
      console.log('✅ Verification - stored data:', storedData ? JSON.parse(storedData) : 'null');

      // Set business context for RLS policies
      try {
        await setBusinessContext(business.id, business.country, business.industry);
        console.log('✅ Business context set during signup');
      } catch (contextError) {
        console.error('⚠️ Failed to set business context during signup:', contextError);
        // Don't fail signup if context setting fails - it will be set on redirect
      }

      return {
        success: true,
        existingUser: false,
        error: null,
        data: {
          user: { 
            ...userData, 
            id: business.id,
            business: business
          },
          business: business,
          userId: business.id,
        }
      };

    } catch (err) {
      console.error('💥 Unexpected error:', err);
      return {
        success: false,
        existingUser: false,
        error: err instanceof Error ? err.message : 'Unexpected error occurred',
        data: null
      };
    }
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<SignupData>>({
    country: '',
    industry: '',
    industrySector: '',
    name: '',
    businessName: '',
    phoneNumber: '',
    inviteCode: '',
    dailyTarget: 0,
    currency: '',
    isDataSynced: false,
    lastSyncTime: Date.now()
  });

  const updateFormData = (field: keyof SignupData, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-set currency when country is selected
      if (field === 'country' && value) {
        updated.currency = getCurrency(value as string);
      }
      
            
      return updated;
    });
  };

  const nextStep = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleComplete = async () => {
    // Create complete profile
    const completeProfile: Omit<SignupData, 'isDataSynced' | 'lastSyncTime'> = {
      country: formData.country || '',
      industry: formData.industry || '',
      industrySector: formData.industrySector || '',
      name: formData.name || '',
      businessName: formData.businessName || '',
      phoneNumber: formData.phoneNumber || '',
      dailyTarget: Number(formData.dailyTarget) || 0,
      currency: formData.currency || getCurrency(formData.country || ''),
      inviteCode: formData.inviteCode,
    };

    try {
      // Clear previous errors and set loading
      setSignupError(null);
      setSignupLoading(true);
      
      // Use the real database signup implementation
      const result = await createBusinessInDatabase(completeProfile);
      
      if (result.success) {
        console.log('User created successfully:', result.data);
        
        // Save to context for immediate use
        const profileForContext: SignupData = {
          ...completeProfile,
          isDataSynced: true,
          lastSyncTime: Date.now()
        };
        setProfile(profileForContext);
        
        // Also save to legacy storage for compatibility
        storage.setUserData({
          country: formData.country,
          industry: formData.industry,
          name: formData.name,
          businessName: formData.businessName,
          phoneNumber: formData.phoneNumber,
          inviteCode: formData.inviteCode,
          dailyTarget: formData.dailyTarget
        });
        
        // Force a page refresh to ensure auth context picks up the new session
        // This ensures useAuth and TenantContext properly recognize the authentication
        const country = formData.country?.toLowerCase() || 'ke';
        const industry = formData.industry?.toLowerCase() || 'retail';
        
        // Add a longer delay to ensure localStorage is set and auth context can initialize
        setTimeout(() => {
          console.log('🚀 Redirecting to dashboard after signup:', `/Beezee-App/app/${country}/${industry}`);
          window.location.href = `/Beezee-App/app/${country}/${industry}`;
        }, 500);
        return; // Stop execution here since we're doing a full page redirect
      } else if (result.existingUser) {
        console.log('User already exists, redirecting to login');
        setSignupError('A business with this phone number already exists. Please login instead.');
        
        // Store the form data so we can pre-fill login if needed
        localStorageManager.set('pendingSignup', {
          phoneNumber: formData.phoneNumber,
          country: formData.country,
          industry: formData.industry,
        });
        
        // Don't auto-redirect, let user see the error and decide
        return;
      } else {
        console.error('Signup failed:', result.error);
        setSignupError(result.error || 'Failed to create business. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setSignupLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
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
        return <HybridDailyTarget 
          country={formData.country || ''}
          selectedTarget={formData.dailyTarget?.toString() || ''}
          onSelect={(target) => updateFormData('dailyTarget', Number(target))}
          onNext={nextStep}
          onPrev={prevStep}
        />;
      case 7:
        return <AccountSummaryPreview 
          formData={formData}
          onComplete={handleComplete}
          onPrev={prevStep}
          isLoading={signupLoading}
          error={signupError}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex flex-col">
      {/* Top progress summary */}
      <LiveAccountSummary 
        data={formData} 
        currentStep={currentStep} 
        isVisible={currentStep >= 2 && currentStep <= 6} 
      />

      <div className="flex-1 container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BeezeeSignup() {
  return (
    <BusinessProfileProvider>
      <BeezeeSignupContent />
    </BusinessProfileProvider>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen flex flex-col text-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <Image 
            src="/beezee-logo.png" 
            alt="BeeZee Logo" 
            width={128} 
            height={128}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-1)] mb-6 tracking-[-0.02em]">
          BeeZee
        </h1>
        <p className="text-xl text-[var(--text-2)] max-w-md mx-auto">
          Your business notebook that knows your business
        </p>
      </motion.div>

      <div className="flex flex-col gap-4 max-w-xs mx-auto w-full px-6 pb-8">
        <button
          onClick={onNext}
          className="px-8 py-4 bg-[var(--powder-dark)] text-white font-bold rounded-2xl hover:bg-[var(--powder-mid)] transition-all active:scale-[0.98] shadow-lg shadow-[var(--powder-dark)]/20 flex items-center justify-center gap-2"
        >
          Get Started
        </button>
        
        <Link
          href="/Beezee-App/auth/login"
          className="px-8 py-4 border border-[var(--border)] text-[var(--text-1)] font-medium rounded-2xl hover:bg-[var(--glass-bg)] transition-all flex items-center justify-center"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

function CountrySelection({ selected, onSelect, onNext, onPrev }: { 
  selected: string; 
  onSelect: (country: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-[var(--text-1)] mb-4 text-center">
        Where is your business located?
      </h2>
      <p className="text-[var(--text-2)] text-center mb-8">
        Select your country to continue
      </p>

      <div className="grid gap-4 mb-8">
        {countries.map((country) => (
          <button
            key={country.code}
            onClick={() => onSelect(country.code)}
            className={`p-6 rounded-xl border-2 transition-all flex items-center gap-4 ${
              selected === country.code
                ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]'
                : 'border-[var(--border)] hover:border-[var(--powder-mid)]'
            }`}
          >
            {getFlagDisplay(country)}
            <div className="flex-1 text-left">
              <div className="text-xl font-bold text-[var(--text-1)]">{country.name}</div>
              <div className="text-lg text-[var(--text-2)]">{country.code}</div>
            </div>
            {selected === country.code && (
              <span className="text-[var(--powder-dark)] font-bold text-xl">✓</span>
            )}
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
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function IndustrySelection({ selected, onSelect, onNext, onPrev }: { 
  selected: string; 
  onSelect: (industry: string) => void; 
  onNext: () => void; 
  onPrev: () => void; 
}) {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-[var(--text-1)] mb-4 text-center">
        What type of business do you run?
      </h2>
      <p className="text-[var(--text-2)] text-center mb-8">
        Choose your industry to personalize your experience
      </p>

      <div className="grid gap-6 mb-8">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => onSelect(industry.id)}
            className={`p-6 rounded-xl border-2 transition-all flex items-center gap-4 ${
              selected === industry.id
                ? 'border-[var(--powder-dark)] bg-[var(--powder-light)] shadow-lg'
                : 'border-[var(--border)] hover:border-[var(--powder-mid)] hover:shadow-md'
            }`}
          >
            <div className="w-12 h-12 bg-[var(--powder-light)] rounded-xl flex items-center justify-center text-2xl">
              {industry.icon === 'Store' && '🏪'}
              {industry.icon === 'Food' && '🍽️'}
              {industry.icon === 'Car' && '🚗'}
              {industry.icon === 'Salon' && '💇'}
              {industry.icon === 'Thread' && '🧵'}
              {industry.icon === 'Tools' && '🔧'}
              {industry.icon === 'Computer' && '💻'}
            </div>
            <div className="flex-1 text-left">
              <div className="text-xl font-bold text-[var(--text-1)]">{industry.name}</div>
              <div className="text-sm text-[var(--text-2)] mt-1">
                {industry.sectors.length} sectors available
              </div>
            </div>
            {selected === industry.id && (
              <span className="text-[var(--powder-dark)] font-bold text-xl">✓</span>
            )}
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
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

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
          className="flex-1 px-6 py-3 bg-[var(--powder-dark)] text-black font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
