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
import PINSetup from '@/components/auth/PINSetup';

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
  const { setupBusinessPIN } = useAuth();
  
  // Real signup state management
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null);
  const [pinSetupError, setPinSetupError] = useState<string | undefined>(undefined);
  
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
    dailyTarget: 0,
    currency: 'KES',
    inviteCode: '',
    pin: '',
  });

  const updateFormData = (field: keyof SignupData, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-update currency when country changes
      if (field === 'country' && value) {
        updated.currency = getCurrency(value as string);
      }
      
      return updated;
    });
  };

  const nextStep = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePINSetup = async (pin: string) => {
    if (!createdBusinessId) {
      setPinSetupError('Business not created yet');
      return;
    }

    setSignupLoading(true);
    setPinSetupError(undefined);

    try {
      const { error } = await setupBusinessPIN(createdBusinessId, pin);
      
      if (error) {
        setPinSetupError(error.message);
      } else {
        console.log('✅ PIN setup successful');
        // Continue to final step
        nextStep();
      }
    } catch (error) {
      console.error('💥 PIN setup error:', error);
      setPinSetupError('Failed to set PIN. Please try again.');
    } finally {
      setSignupLoading(false);
    }
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
      currency: getCurrency(formData.country || ''),
      inviteCode: formData.inviteCode,
      pin: formData.pin,
    };

    setSignupLoading(true);
    setSignupError(null);

    try {
      console.log('🚀 Starting signup process...');
      const result = await createBusinessInDatabase(completeProfile);

      if (result.success && result.data?.business) {
        console.log('✅ Business created successfully');
        const business = result.data.business;
        setCreatedBusinessId(business.id);
        
        // Set up PIN if provided
        if (formData.pin && formData.pin.length === 6) {
          console.log('🔐 Setting up PIN for business');
          try {
            const pinResponse = await fetch('/api/auth/setup-pin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                businessId: business.id, 
                pin: formData.pin 
              })
            });
            
            const pinResult = await pinResponse.json();
            
            if (pinResult.error) {
              console.error('❌ PIN setup failed:', pinResult.error);
              setSignupError('Business created but PIN setup failed: ' + pinResult.error.message);
              setSignupLoading(false);
              return;
            }
            
            console.log('✅ PIN setup successful');
          } catch (pinError) {
            console.error('💥 PIN setup error:', pinError);
            setSignupError('Business created but PIN setup failed');
            setSignupLoading(false);
            return;
          }
        }
        
        // Route directly to dashboard (skip completion page)
        handleFinalComplete();
      } else {
        console.error('❌ Business creation failed:', result.error);
        setSignupError(result.error || 'Failed to create business');
      }
    } catch (error) {
      console.error('💥 Signup error:', error);
      setSignupError('An unexpected error occurred during signup');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleFinalComplete = async () => {
    // Set up authentication state before redirecting
    if (createdBusinessId && formData.phoneNumber) {
      try {
        console.log('🔐 Setting up authentication after signup...');
        
        // Fetch the created business with PIN hash
        const response = await fetch('/api/auth/verify-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: formData.phoneNumber, 
            pin: formData.pin 
          })
        });
        
        const result = await response.json();
        
        if (result.error) {
          console.error('❌ Failed to verify PIN after signup:', result.error);
          // Still redirect, but user will need to login
        } else {
          console.log('✅ Authentication setup successful');
          
          // Store authentication data
          const business = result.data.business;
          const sessionData = {
            phone: formData.phoneNumber,
            businessId: business.id,
            timestamp: Date.now()
          };

          const authData = {
            session: sessionData,
            business: business
          };
          
          localStorage.setItem('beezee_business_auth', JSON.stringify(authData));
          console.log('✅ Stored authentication data after signup');
        }
      } catch (error) {
        console.error('💥 Error setting up authentication:', error);
      }
    }
    
    // Redirect to dashboard
    const country = formData.country?.toLowerCase() || 'ke';
    const industry = formData.industry?.toLowerCase() || 'retail';
    
    console.log('🎯 Redirecting to dashboard:', { country, industry });
    router.push(`/Beezee-App/app/${country}/${industry}`);
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
        return (
          <div className="py-12">
            <PINSetup
              onPINComplete={(pin) => {
                // Store PIN in form data for later use
                updateFormData('pin', pin);
                nextStep();
              }}
              onCancel={prevStep}
              isLoading={signupLoading}
              error={signupError || undefined}
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
          isLoading={signupLoading}
          error={signupError}
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
