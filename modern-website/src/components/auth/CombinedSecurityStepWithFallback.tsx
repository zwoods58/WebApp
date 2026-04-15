"use client";

import React, { useState, useEffect } from 'react';
import { Shield, ChevronDown, AlertCircle } from 'lucide-react';
import { useSignup } from '@/hooks/useSignup';
import SecurityQuestionsSetup from '@/components/auth/SecurityQuestionsSetup';
import SecurityQuestionsSetupWithFallback from '@/components/auth/SecurityQuestionsSetupWithFallback';

interface CombinedSecurityStepProps {
  onPINComplete: (pin: string) => void;
  onSecurityQuestionsComplete: (data: any) => void;
  onCombinedComplete: (pin: string, securityData: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function CombinedSecurityStepWithFallback({ 
  onPINComplete, 
  onSecurityQuestionsComplete, 
  onCombinedComplete, 
  onCancel, 
  isLoading = false, 
  error 
}: CombinedSecurityStepProps) {
  const { questions, loading: questionsLoading, error: questionsError } = useSignup();
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Try to fetch security questions from API
    const fetchQuestions = async () => {
      setUseFallback(false);
      onSecurityQuestionsComplete({ questionId: '', answer: '' });
    };

    const testAPI = async () => {
      try {
        console.log('🔄 [Fallback] Testing security questions API...');
        
        const response = await fetch('/api/auth/security-questions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ [Fallback] API working - questions loaded:', data.questions?.length || 0);
          onSecurityQuestionsComplete({ questionId: '', answer: '' });
          setUseFallback(false);
        } else {
          console.warn('⚠️ [Fallback] API failed, using fallback questions');
          setUseFallback(true);
          // Load fallback questions using the regular component
          SecurityQuestionsSetup({ 
            onComplete: onSecurityQuestionsComplete,
            isLoading: questionsLoading,
            error: questionsError
          });
        }
      } catch (error) {
        console.error('❌ [Fallback] API test failed:', error);
        setUseFallback(true);
        SecurityQuestionsSetup({ 
          onComplete: onSecurityQuestionsComplete,
          isLoading: false,
          error: 'Failed to load security questions'
        });
      }
    };

    // Initial attempt to fetch questions
    fetchQuestions();
  }, []);

  const handleCombinedComplete = (pin: string, securityData: any) => {
    console.log('🔐 [Fallback] Submitting combined security data:', { pin, securityData });
    onCombinedComplete(pin, securityData);
  };

  // Show loading state while fetching
  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--powder-mid)]"></div>
      </div>
    );
  }

  // Show error state
  if (questionsError) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle size={16} className="text-red-600" />
        <span className="text-sm text-red-800">{questionsError}</span>
      </div>
    );
  }

  // Show fallback UI when API fails
  if (useFallback) {
    return (
      <SecurityQuestionsSetupWithFallback
        onComplete={onSecurityQuestionsComplete}
        isLoading={false}
        error={null}
      />
    );
  }

  // Show normal security questions setup when API works
  return (
    <SecurityQuestionsSetup
      onComplete={onSecurityQuestionsComplete}
      isLoading={questionsLoading}
      error={questionsError}
    />
  );
}
