"use client";

import React, { useState, useEffect } from 'react';
import { Shield, ChevronDown, AlertCircle } from 'lucide-react';
import { useSecurityQuestions } from '@/hooks/useSecurityQuestions';
import { SecurityQuestionsSetup as SecurityQuestionsSetupType } from '@/types/security';

interface SecurityQuestionsSetupProps {
  onComplete: (data: SecurityQuestionsSetupType) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function SecurityQuestionsSetup({ 
  onComplete, 
  onCancel, 
  isLoading = false, 
  error 
}: SecurityQuestionsSetupProps) {
  const { questions, loading: questionsLoading } = useSecurityQuestions();
  
  const [formData, setFormData] = useState({
    questionId: '',
    answer: ''
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleQuestionChange = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questionId
    }));
    setValidationError(null);
  };

  const handleAnswerChange = (answer: string) => {
    setFormData(prev => ({
      ...prev,
      answer
    }));
    setValidationError(null);
  };

  const validateForm = (): boolean => {
    // Check question is selected
    if (!formData.questionId) {
      setValidationError('Please select a security question');
      return false;
    }

    // Check answer is filled
    if (!formData.answer.trim()) {
      setValidationError('Please provide an answer to the security question');
      return false;
    }

    // Check answer length
    if (formData.answer.length > 100) {
      setValidationError('Answer must not exceed 100 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    console.log('🔒 [SecurityQuestionsSetup] Submitting security question:', {
      questionId: formData.questionId,
      hasAnswer: !!formData.answer,
      answerLength: formData.answer.length
    });
    onComplete(formData);
  };

  const isFormComplete = 
    formData.questionId && 
    formData.answer.trim();


  return (
    <div className="max-w-2xl mx-auto">
      <div className="fade-in">
        <div className="w-20 h-20 bg-[var(--powder-light)] rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6">
          <Shield size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-bold text-[var(--text-1)] mb-4">
          Set Up Security Questions
        </h2>
        <p className="text-[var(--text-2)] mb-2">
          Choose a security question to help recover your account
        </p>
        <p className="text-[var(--text-3)] text-sm">
          You'll need to answer this question to reset your PIN
        </p>
      </div>

      <div className="fade-in">
        {(error || validationError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error || validationError}</span>
          </div>
        )}

        {questionsLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-[var(--powder-dark)]/30 border-t-[var(--powder-dark)] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--text-2)]">Loading security questions...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-2)] mb-2">
                Security Question
              </label>
              <div className="relative">
                <select
                  value={formData.questionId}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] appearance-none pr-10"
                  disabled={isLoading}
                >
                  <option value="">Select a question...</option>
                  {questions.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.question_text}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none" size={20} />
              </div>
              {formData.questionId && (
                <input
                  type="text"
                  value={formData.answer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Your answer"
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)] mt-3"
                  disabled={isLoading}
                  maxLength={100}
                />
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-[var(--text-1)] font-medium rounded-xl hover:bg-[var(--border)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete || isLoading || questionsLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
