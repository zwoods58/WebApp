import { useState, useCallback } from 'react';

export interface PINVerificationState {
  loading: boolean;
  error: string | null;
  isValid: boolean | null;
  business: any | null;
}

export interface PINVerificationActions {
  verifyPIN: (phoneNumber: string, pin: string) => Promise<boolean>;
  reset: () => void;
  clearError: () => void;
}

export function usePINVerification(): PINVerificationState & PINVerificationActions {
  const [state, setState] = useState<PINVerificationState>({
    loading: false,
    error: null,
    isValid: null,
    business: null,
  });

  const verifyPIN = useCallback(async (phoneNumber: string, pin: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null, isValid: null }));

    try {
      console.log('🔐 Verifying PIN for phone:', { 
        phoneNumber, 
        pinLength: pin.length,
        pinValue: pin ? '***' : 'none'
      });

      // Validate inputs
      if (!phoneNumber || !pin) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Phone number and PIN are required',
          isValid: false
        }));
        return false;
      }

      // Validate PIN format
      if (!/^\d{6}$/.test(pin)) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Invalid PIN format. PIN must be exactly 6 digits.',
          isValid: false
        }));
        return false;
      }

      // Call PIN verification API
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, pin }),
      });

      const result = await response.json();

      if (!result.success) {
        console.log('❌ PIN verification failed:', result.error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || 'PIN verification failed',
          isValid: false,
          business: null
        }));
        return false;
      }

      const business = result.business;
      console.log('✅ PIN verification successful for:', business.business_name);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        isValid: true,
        business: business
      }));

      return true;

    } catch (error) {
      console.error('💥 PIN verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error during PIN verification';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        isValid: false,
        business: null
      }));
      
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      isValid: null,
      business: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    verifyPIN,
    reset,
    clearError,
  };
}
