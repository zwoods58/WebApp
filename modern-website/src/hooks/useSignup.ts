import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignupData } from '@/types/signup';
import { useSignupValidation } from './useSignupValidation';
import { useBusinessCreation } from './useBusinessCreation';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { getCurrency } from '@/utils/currency';
import { useToast } from './useToast';
import { notifyServiceWorker } from '@/lib/serviceWorker';

// Helper function to detect standalone mode and navigate accordingly
function navigatePWAAware(path: string, router: any) {
  const isStandalone = typeof window !== 'undefined' && 
                       window.matchMedia('(display-mode: standalone)').matches;
  
  if (isStandalone) {
    // In standalone PWA mode, use window.location.href
    console.log('[Auth] Standalone mode detected, using window.location.href');
    window.location.href = path;
  } else {
    // In browser mode, use Next.js router
    console.log('[Auth] Browser mode detected, using router.push');
    router.push(path);
  }
}

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
  updateSecurityQuestions: (securityQuestions: any) => void;
  handlePINSetup: (pin: string) => void;
  handlePINConfirmation: (pin: string, confirmPin: string) => void;
  handleComplete: () => Promise<void>;
  reset: () => void;
  validateCurrentStep: () => boolean;
  creationState: any;
}

export function useSignup(): SignupState & SignupActions {
  const router = useRouter();
  const { signInAfterSignup } = useUnifiedAuth();
  const { showInfo, showSuccess } = useToast();
  const [signupState, setSignupState] = useState<SignupState>({
    currentStep: 1,
    formData: {
      country: '',
      industry: '',
      industrySector: '',
      name: '',
      businessName: '',
      phoneNumber: '',
      email: '',
      dailyTarget: 0,
      currency: 'KES',
      pin: '',
      securityQuestions: undefined,
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
    if (signupState.currentStep < 7) {
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
    if (step >= 1 && step <= 7) {
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

  const updateSecurityQuestions = useCallback((securityQuestions: any) => {
    console.log('🔐 [useSignup] Updating security questions:', securityQuestions);
    setSignupState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        securityQuestions
      }
    }));
    console.log('✅ [useSignup] Security questions stored in state');
  }, []);

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
    const validation = validateStep(6, signupState.formData);
    if (!validation.isValid) {
      console.error('Final validation failed:', validation.errors);
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
      email: signupState.formData.email || '',
      dailyTarget: Number(signupState.formData.dailyTarget) || 0,
      currency: getCurrency(signupState.formData.country || ''),
      pin: signupState.formData.pin || '',
      securityQuestions: signupState.formData.securityQuestions,
    };

    try {
      console.log('🚀 Starting signup process with PIN:', { 
        pinLength: completeProfile.pin?.length, 
        pinSet: !!completeProfile.pin,
        pinHash: completeProfile.pin ? '***' : 'none',
        hasSecurityQuestions: !!completeProfile.securityQuestions,
        securityQuestionId: completeProfile.securityQuestions?.questionId
      });
      const result = await createBusinessWithPIN(completeProfile);

      if (result.success && result.data?.business && result.data?.session) {
        console.log('✅ Business created successfully');
        const business = result.data.business;
        const session = result.data.session;
        
        setSignupState(prev => ({
          ...prev,
          isComplete: true,
          businessId: business.id
        }));

        // Establish authentication state immediately
        const authResult = await signInAfterSignup(business, session);
        
        if (authResult.error) {
          console.error('❌ Failed to establish auth state after signup:', authResult.error);
          return;
        }

        // Cache user routes before redirecting
        const country = business.country.toLowerCase();
        const industry = business.industry.toLowerCase();
        
        // Show caching progress indicator
        showInfo('📦 Preparing for offline use...');
        
        try {
          // Notify service worker to cache user routes
          await notifyServiceWorker(country, industry);
          
          // Wait a bit for caching to start (non-blocking)
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Show success message
          showSuccess('✅ Ready for offline use!');
          
          console.log('🎯 Navigating to dashboard:', { country, industry });
          
          // Navigate to dashboard with PWA-aware navigation
          navigatePWAAware(`/Beezee-App/app/${country}/${industry}`, router);
        } catch (error) {
          console.error('⚠️ Failed to cache user routes:', error);
          // Still navigate even if caching fails
          navigatePWAAware(`/Beezee-App/app/${country}/${industry}`, router);
        }
      } else {
        console.error('❌ Business creation failed:', result.error);
        // Error will be handled by the creation state
      }
    } catch (error) {
      console.error('💥 Signup error:', error);
      // Error will be handled by the creation state
    }
  }, [signupState.formData, createBusinessWithPIN, validateStep, signInAfterSignup, router, showInfo, showSuccess]);

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
        pin: '',
        securityQuestions: undefined,
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
    updateSecurityQuestions,
    handlePINSetup,
    handlePINConfirmation,
    handleComplete,
    reset,
    validateCurrentStep,
    creationState
  };
}
