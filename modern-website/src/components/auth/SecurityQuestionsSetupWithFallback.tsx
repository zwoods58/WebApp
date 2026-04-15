"use client";

import React, { useState, useEffect } from 'react';
import { Shield, ChevronDown, AlertCircle } from 'lucide-react';

interface SecurityQuestionsSetupProps {
  onComplete: (data: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

// Fallback security questions for when API fails
const FALLBACK_QUESTIONS = [
  {
    id: "1",
    question_text: "What was the name of your first pet?",
    category: "childhood"
  },
  {
    id: "2", 
    question_text: "What was the name of your first school?",
    category: "childhood"
  },
  {
    id: "3",
    question_text: "What was your childhood nickname?",
    category: "childhood"
  },
  {
    id: "4",
    question_text: "What was the name of your elementary school teacher?",
    category: "education"
  },
  {
    id: "5",
    question_text: "What was your favorite subject in school?",
    category: "education"
  },
  {
    id: "6",
    question_text: "What is your father's middle name?",
    category: "family"
  },
  {
    id: "7",
    question_text: "What is your oldest sibling's name?",
    category: "family"
  },
  {
    id: "8",
    question_text: "What is your favorite book or movie?",
    category: "favorites"
  },
  {
    id: "9",
    question_text: "What is your favorite color?",
    category: "favorites"
  },
  {
    id: "10",
    question_text: "What is your favorite food?",
    category: "favorites"
  },
  {
    id: "11",
    question_text: "In what city were you born?",
    category: "personal"
  },
  {
    id: "12",
    question_text: "What is your mother's maiden name?",
    category: "personal"
  }
];

export default function SecurityQuestionsSetupWithFallback({ 
  onComplete, 
  onCancel, 
  isLoading = false, 
  error 
}: SecurityQuestionsSetupProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setFetchError(null);
      
      try {
        console.log('🔄 [Fallback] Fetching security questions from API...');
        
        const response = await fetch('/api/auth/security-questions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ [Fallback] API success - questions loaded:', data.questions?.length || 0);
          setQuestions(data.questions || []);
        } else {
          console.warn('⚠️ [Fallback] API failed, using fallback questions');
          setQuestions(FALLBACK_QUESTIONS);
          setFetchError('Using temporary security questions due to API issue');
        }
      } catch (error) {
        console.error('❌ [Fallback] Fetch error:', error);
        setQuestions(FALLBACK_QUESTIONS);
        setFetchError('Failed to load security questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionChange = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, selected: true }
        : { ...q, selected: false }
    ));
    setFetchError(null);
  };

  const handleAnswerChange = (answer: string) => {
    setQuestions(prev => prev.map(q => 
      q.selected 
        ? { ...q, answer }
        : q
    ));
  };

  const validateForm = (): boolean => {
    const selectedQuestion = questions.find(q => q.selected);
    if (!selectedQuestion) {
      setFetchError('Please select a security question');
      return false;
    }
    
    if (!selectedQuestion.answer || selectedQuestion.answer.trim() === '') {
      setFetchError('Please provide an answer to the selected question');
      return false;
    }
    
    setFetchError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const selectedQuestion = questions.find(q => q.selected);
    if (!selectedQuestion) return;
    
    const formData = {
      questionId: selectedQuestion.id,
      answer: selectedQuestion.answer
    };
    
    console.log('🔐 [Fallback] Submitting security questions:', formData);
    onComplete(formData);
  };

  return (
    <div className="space-y-4">
      {fetchError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-sm text-red-800">{fetchError}</span>
        </div>
      )}
      
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[var(--text-1)] mb-4">
          <Shield size={20} className="mr-2" />
          Security Questions
        </h3>
        
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)]">
              <input
                type="radio"
                name={`question-${index}`}
                checked={question.selected}
                onChange={() => handleQuestionChange(question.id)}
                className="mr-2"
              />
              <span className="flex-1">{question.question_text}</span>
              {question.selected && (
                <input
                  type="text"
                  value={question.answer || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)]"
                />
              )}
            </label>
          </div>
        ))}
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all text-sm"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !validateForm()}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
