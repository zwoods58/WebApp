import { useState, useEffect, useCallback } from 'react';
import { SecurityQuestion } from '@/types/security';

interface UseSecurityQuestionsState {
  questions: SecurityQuestion[];
  loading: boolean;
  error: string | null;
}

export function useSecurityQuestions() {
  const [state, setState] = useState<UseSecurityQuestionsState>({
    questions: [],
    loading: false,
    error: null
  });

  const fetchQuestions = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/auth/security-questions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch security questions');
      }

      setState({
        questions: data.questions || [],
        loading: false,
        error: null
      });

      return { success: true, questions: data.questions };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch security questions';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const validateAnswers = useCallback((answers: { questionId: string; answer: string }[]) => {
    // Client-side validation
    if (answers.length < 2) {
      return { valid: false, error: 'Please answer at least 2 security questions' };
    }

    if (answers.length > 3) {
      return { valid: false, error: 'Maximum 3 answers allowed' };
    }

    for (const answer of answers) {
      if (!answer.answer || answer.answer.trim().length === 0) {
        return { valid: false, error: 'All answers must be filled in' };
      }

      if (answer.answer.length > 100) {
        return { valid: false, error: 'Answers must not exceed 100 characters' };
      }
    }

    return { valid: true };
  }, []);

  return {
    ...state,
    fetchQuestions,
    validateAnswers
  };
}
