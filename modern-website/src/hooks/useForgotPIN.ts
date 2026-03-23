import { useState, useCallback } from 'react';
import { SecurityQuestion, SecurityAnswer } from '@/types/security';

type ForgotPINStep = 'phone' | 'questions' | 'newPin' | 'success';

interface UseForgotPINState {
  step: ForgotPINStep;
  phoneNumber: string;
  questions: SecurityQuestion[] | null;
  businessId: string | null;
  resetToken: string | null;
  loading: boolean;
  error: string | null;
  remainingAttempts: number;
  lockoutTime: number | null;
}

export function useForgotPIN() {
  const [state, setState] = useState<UseForgotPINState>({
    step: 'phone',
    phoneNumber: '',
    questions: null,
    businessId: null,
    resetToken: null,
    loading: false,
    error: null,
    remainingAttempts: 3,
    lockoutTime: null
  });

  const verifyPhone = useCallback(async (phoneNumber: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/forgot-pin/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Failed to verify phone number',
          lockoutTime: data.lockoutTime || null
        }));

        return { success: false, error: data.error };
      }

      setState(prev => ({
        ...prev,
        phoneNumber,
        questions: data.questions,
        businessId: data.businessId,
        remainingAttempts: data.remainingAttempts || 3,
        step: 'questions',
        loading: false,
        error: null
      }));

      return { success: true, questions: data.questions };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify phone number';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  const verifyAnswers = useCallback(async (answers: SecurityAnswer[]) => {
    if (!state.phoneNumber) {
      return { success: false, error: 'Phone number not set' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/forgot-pin/verify-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: state.phoneNumber,
          answers
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Failed to verify answers',
          remainingAttempts: data.remainingAttempts ?? prev.remainingAttempts,
          lockoutTime: data.lockoutTime || null
        }));

        return { success: false, error: data.error, remainingAttempts: data.remainingAttempts };
      }

      setState(prev => ({
        ...prev,
        resetToken: data.resetToken,
        step: 'newPin',
        loading: false,
        error: null,
        remainingAttempts: 3
      }));

      return { success: true, resetToken: data.resetToken };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify answers';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      return { success: false, error: errorMessage };
    }
  }, [state.phoneNumber]);

  const resetPIN = useCallback(async (newPin: string) => {
    if (!state.resetToken || !state.businessId) {
      return { success: false, error: 'Reset token not available' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/pin-reset/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resetToken: state.resetToken,
          businessId: state.businessId,
          newPin
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Failed to reset PIN'
        }));

        return { success: false, error: data.error };
      }

      setState(prev => ({
        ...prev,
        step: 'success',
        loading: false,
        error: null
      }));

      return { success: true, message: data.message };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset PIN';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      return { success: false, error: errorMessage };
    }
  }, [state.resetToken, state.businessId]);

  const reset = useCallback(() => {
    setState({
      step: 'phone',
      phoneNumber: '',
      questions: null,
      businessId: null,
      resetToken: null,
      loading: false,
      error: null,
      remainingAttempts: 3,
      lockoutTime: null
    });
  }, []);

  const goToStep = useCallback((step: ForgotPINStep) => {
    setState(prev => ({ ...prev, step, error: null }));
  }, []);

  return {
    ...state,
    verifyPhone,
    verifyAnswers,
    resetPIN,
    reset,
    goToStep
  };
}
