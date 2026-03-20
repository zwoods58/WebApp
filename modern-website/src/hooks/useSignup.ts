import { useState, useCallback, useEffect } from 'react';
import { SignupData } from '@/types/signup';
import { useSignupValidation } from './useSignupValidation';
import { useBusinessCreation } from './useBusinessCreation';
import { getCurrency } from '@/utils/currency';

export interface SignupState {
  currentStep: number;
  formData: Partial<SignupData>;
  isComplete: boolean;
  businessId: string | null;
  pinSetupStep: 'create' | 'confirm' | 'complete';
}

export interface SignupActions {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateFormData: (field: keyof SignupData, value: string | number) => void;
  handlePINSetup: (pin: string) => void;
  handlePINConfirmation: (pin: string, confirmPin: string) => void;
  handleComplete: () => Promise<void>;
  reset: () => void;
  validateCurrentStep: () => boolean;
  creationState: any;
}

export function useSignup(): SignupState & SignupActions {
  const [signupState, setSignupState] = useState<SignupState>({
    currentStep: 1,
    formData: {
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
    },
    isComplete: false,
    businessId: null,
    pinSetupStep: 'create'
  });

  const { validateStep, validatePINConfirmation, getFieldError, clearFieldError } = useSignupValidation();
  const { state: creationState, createBusinessWithPIN, checkDuplicatePhone } = useBusinessCreation();

  // Auto-update currency when country changes
  const updateFormData = useCallback((field: keyof SignupData, value: string | number) => {
    setSignupState(prev => {
      const updated = { ...prev, formData: { ...prev.formData, [field]: value } };
      
      // Auto-update currency when country changes
      if (field === 'country' && value) {
        updated.formData.currency = getCurrency(value as string);
      }
      
      return updated;
    });

    // Clear field error when user starts typing
    if (getFieldError(field)) {
      clearFieldError(field);
    }
  }, [getFieldError, clearFieldError]);

  const nextStep = useCallback(() => {
    if (signupState.currentStep < 8) {
      setSignupState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  }, [signupState.currentStep]);

  const prevStep = useCallback(() => {
    if (signupState.currentStep > 1) {
      setSignupState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
      
      // Reset PIN setup step when going back from PIN confirmation
      if (signupState.currentStep === 6 && signupState.pinSetupStep === 'confirm') {
        setSignupState(prev => ({ ...prev, pinSetupStep: 'create' }));
      }
    }
  }, [signupState.currentStep, signupState.pinSetupStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 8) {
      setSignupState(prev => ({ ...prev, currentStep: step }));
    }
  }, []);

  const handlePINSetup = useCallback((pin: string) => {
    console.log('🔐 PIN setup completed - storing PIN and advancing to next step:', pin);
    updateFormData('pin', pin);
    setSignupState(prev => ({ ...prev, pinSetupStep: 'complete' }));
    
    // Auto-advance to next step after successful PIN setup
    setTimeout(() => {
      nextStep();
    }, 500);
  }, [updateFormData, nextStep]);

  const handlePINConfirmation = useCallback((pin: string, confirmPin: string) => {
    const error = validatePINConfirmation(pin, confirmPin);
    
    if (error) {
      // PIN doesn't match or is invalid
      console.error('❌ PIN confirmation failed:', error);
      return false;
    }

    // PINs match and are valid
    updateFormData('pin', pin);
    setSignupState(prev => ({ ...prev, pinSetupStep: 'complete' }));
    
    // Auto-advance to next step after successful PIN confirmation
    setTimeout(() => {
      nextStep();
    }, 500);
    
    return true;
  }, [validatePINConfirmation, updateFormData, nextStep]);

  const validateCurrentStep = useCallback((): boolean => {
    const validation = validateStep(signupState.currentStep, signupState.formData);
    return validation.isValid;
  }, [signupState.currentStep, signupState.formData, validateStep]);

  const handleComplete = useCallback(async () => {
    // Validate final step
    const validation = validateStep(8, signupState.formData);
    if (!validation.isValid) {
      console.error('❌ Final validation failed:', validation.errors);
      return;
    }

    // Create complete profile
    const completeProfile: Omit<SignupData, 'isDataSynced' | 'lastSyncTime'> = {
      country: signupState.formData.country || '',
      industry: signupState.formData.industry || '',
      industrySector: signupState.formData.industrySector || '',
      name: signupState.formData.name || '',
      businessName: signupState.formData.businessName || '',
      phoneNumber: signupState.formData.phoneNumber || '',
      dailyTarget: Number(signupState.formData.dailyTarget) || 0,
      currency: getCurrency(signupState.formData.country || ''),
      inviteCode: signupState.formData.inviteCode,
      pin: signupState.formData.pin || '',
    };

    try {
      console.log('🚀 Starting signup process with PIN:', { 
        pinLength: completeProfile.pin?.length, 
        pinSet: !!completeProfile.pin,
        pinHash: completeProfile.pin ? '***' : 'none'
      });
      const result = await createBusinessWithPIN(completeProfile);

      if (result.success && result.data?.business) {
        console.log('✅ Business created successfully');
        const business = result.data.business;
        
        setSignupState(prev => ({
          ...prev,
          isComplete: true,
          businessId: business.id
        }));

        // Auto-redirect after successful signup
        setTimeout(() => {
          const country = signupState.formData.country?.toLowerCase() || 'ke';
          const industry = signupState.formData.industry?.toLowerCase() || 'retail';
          console.log('🎯 Auto-redirecting to dashboard:', { country, industry });
          window.location.href = `/Beezee-App/app/${country}/${industry}`;
        }, 1000);
      } else {
        console.error('❌ Business creation failed:', result.error);
        // Error will be handled by the creation state
      }
    } catch (error) {
      console.error('💥 Signup error:', error);
      // Error will be handled by the creation state
    }
  }, [signupState.formData, createBusinessWithPIN, validateStep]);

  const reset = useCallback(() => {
    setSignupState({
      currentStep: 1,
      formData: {
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
      },
      isComplete: false,
      businessId: null,
      pinSetupStep: 'create'
    });
  }, []);

  // Check for duplicate phone when phone number is entered
  useEffect(() => {
    const phoneNumber = signupState.formData.phoneNumber;
    if (phoneNumber && phoneNumber.length >= 12) { // Minimum length for international format
      const timer = setTimeout(async () => {
        const result = await checkDuplicatePhone(phoneNumber);
        if (result.exists) {
          console.log('⚠️ Phone number already exists:', phoneNumber);
          // Could show a warning or prevent progression
        }
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timer);
    }
  }, [signupState.formData.phoneNumber, checkDuplicatePhone]);

  return {
    ...signupState,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    handlePINSetup,
    handlePINConfirmation,
    handleComplete,
    reset,
    validateCurrentStep,
    creationState
  };
}
