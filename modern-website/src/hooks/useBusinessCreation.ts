import { useState, useCallback } from 'react';
import { SignupData } from '@/types/signup';
import { setBusinessContext } from '@/lib/supabaseContext';

export interface BusinessCreationResult {
  success: boolean;
  existingUser: boolean;
  error: string | null;
  data: {
    business: any;
    userId: string;
  } | null;
}

export interface BusinessCreationState {
  loading: boolean;
  error: string | null;
  result: BusinessCreationResult | null;
}

export function useBusinessCreation() {
  const [state, setState] = useState<BusinessCreationState>({
    loading: false,
    error: null,
    result: null
  });

  const createBusinessWithPIN = useCallback(async (signupData: Omit<SignupData, 'isDataSynced' | 'lastSyncTime'>): Promise<BusinessCreationResult> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔧 Creating business with PIN in database:', { 
        ...signupData, 
        pinLength: signupData.pin?.length,
        pinSet: !!signupData.pin,
        pinValue: signupData.pin ? '***' : 'none'
      });
      
      // Prepare business data with PIN for server-side hashing
      const businessData = {
        phoneNumber: signupData.phoneNumber,
        businessName: signupData.businessName || signupData.name + "'s Business",
        country: signupData.country.toUpperCase(),
        industry: signupData.industry,
        industrySector: signupData.industrySector,
        dailyTarget: signupData.dailyTarget,
        currency: signupData.currency,
        inviteCode: signupData.inviteCode,
        name: signupData.name,
        pin: signupData.pin // PIN will be hashed server-side
      };

      // Call server-side API endpoint to create business with PIN hashing
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      const result = await response.json();

      if (!result.success) {
        console.error('❌ API error:', result.error);
        const errorResult: BusinessCreationResult = {
          success: false,
          existingUser: result.existingUser || false,
          error: result.error || 'Failed to create business',
          data: null
        };
        setState(prev => ({ ...prev, loading: false, error: result.error, result: errorResult }));
        return errorResult;
      }

      const business = result.data.business;

      console.log('✅ Business created successfully with PIN hash:', {
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

      const successResult: BusinessCreationResult = {
        success: true,
        existingUser: false,
        error: null,
        data: {
          business: business,
          userId: business.id
        }
      };

      setState(prev => ({ ...prev, loading: false, result: successResult }));
      return successResult;

    } catch (err) {
      console.error('💥 Unexpected error:', err);
      const errorResult: BusinessCreationResult = {
        success: false,
        existingUser: false,
        error: err instanceof Error ? err.message : 'Unexpected error occurred',
        data: null
      };
      setState(prev => ({ ...prev, loading: false, error: err instanceof Error ? err.message : 'Unexpected error occurred', result: errorResult }));
      return errorResult;
    }
  }, []);

  const checkDuplicatePhone = useCallback(async (phoneNumber: string): Promise<{ exists: boolean; error?: string }> => {
    try {
      console.log('🔍 Checking for duplicate phone:', phoneNumber);
      
      const response = await fetch('/api/auth/check-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Error checking phone:', result.error);
        return { exists: false, error: result.error || 'Failed to check phone number' };
      }

      console.log('✅ Phone check result:', result);
      return { exists: result.exists };

    } catch (err) {
      console.error('💥 Error checking phone:', err);
      return { exists: false, error: 'Network error while checking phone number' };
    }
  }, []);

  const verifyPINForLogin = useCallback(async (phoneNumber: string, pin: string): Promise<{ success: boolean; business?: any; error?: string }> => {
    try {
      console.log('🔐 Verifying PIN for login:', { phoneNumber, pinLength: pin.length });
      
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, pin }),
      });

      const result = await response.json();

      if (!result.success) {
        console.error('❌ PIN verification failed:', result.error);
        return { success: false, error: result.error || 'Invalid PIN' };
      }

      console.log('✅ PIN verification successful');
      return { success: true, business: result.business };

    } catch (err) {
      console.error('💥 Error verifying PIN:', err);
      return { success: false, error: 'Network error during PIN verification' };
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      result: null
    });
  }, []);

  return {
    state,
    createBusinessWithPIN,
    checkDuplicatePhone,
    verifyPINForLogin,
    resetState
  };
}
