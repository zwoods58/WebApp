"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Lock, Shield, Eye, EyeOff, Check, X, AlertCircle, ChevronDown } from 'lucide-react';
import { useSecurityQuestions } from '@/hooks/useSecurityQuestions';
import { SecurityQuestionsSetup as SecurityQuestionsSetupType } from '@/types/security';

interface CombinedSecurityStepProps {
  onPINComplete: (pin: string) => void;
  onSecurityQuestionsComplete: (data: SecurityQuestionsSetupType) => void;
  onCombinedComplete: (pin: string, securityData: SecurityQuestionsSetupType) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

export function CombinedSecurityStep({ 
  onPINComplete,
  onSecurityQuestionsComplete,
  onCombinedComplete,
  onCancel,
  isLoading = false,
  error 
}: CombinedSecurityStepProps) {
  const { questions, loading: questionsLoading } = useSecurityQuestions();
  
  // PIN State
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Security Questions State
  const [securityData, setSecurityData] = useState({
    questionId: '',
    answer: ''
  });
  const [securityValidationError, setSecurityValidationError] = useState<string | null>(null);

  // Progress tracking
  const [pinComplete, setPinComplete] = useState(false);
  const [securityComplete, setSecurityComplete] = useState(false);
  const [allComplete, setAllComplete] = useState(false);

  // PIN Handlers
  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (value.length > 1) return; // Only allow single digit
    
    const targetArray = isConfirm ? confirmPin : pin;
    const targetSet = isConfirm ? setConfirmPin : setPin;
    
    const newPin = [...targetArray];
    newPin[index] = value;
    targetSet(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const refs = isConfirm ? confirmInputRefs : inputRefs;
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
    const targetArray = isConfirm ? confirmPin : pin;
    if (e.key === 'Backspace' && !targetArray[index] && index > 0) {
      const refs = isConfirm ? confirmInputRefs : inputRefs;
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent, isConfirm: boolean = false) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.replace(/\D/g, '');
    
    const targetSet = isConfirm ? setConfirmPin : setPin;
    const newPin = digits.split('').concat(Array(6 - digits.length).fill(''));
    targetSet(newPin);
    
    // Focus last filled input
    const refs = isConfirm ? confirmInputRefs : inputRefs;
    const lastIndex = Math.min(digits.length - 1, 5);
    refs.current[lastIndex]?.focus();
  };

  const clearPin = (isConfirm: boolean = false) => {
    const targetSet = isConfirm ? setConfirmPin : setPin;
    targetSet(['', '', '', '', '', '']);
    
    const refs = isConfirm ? confirmInputRefs : inputRefs;
    refs.current[0]?.focus();
  };

  // Security Questions Handlers
  const handleQuestionChange = (questionId: string) => {
    setSecurityData(prev => ({ ...prev, questionId }));
    setSecurityValidationError(null);
  };

  const handleAnswerChange = (answer: string) => {
    setSecurityData(prev => ({ ...prev, answer }));
    setSecurityValidationError(null);
  };

  const validateSecurityForm = (): boolean => {
    if (!securityData.questionId) {
      setSecurityValidationError('Please select a security question');
      return false;
    }
    if (!securityData.answer.trim()) {
      setSecurityValidationError('Please provide an answer to the security question');
      return false;
    }
    if (securityData.answer.length > 100) {
      setSecurityValidationError('Answer must not exceed 100 characters');
      return false;
    }
    return true;
  };

  // Progress tracking
  useEffect(() => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');
    const pinsMatch = pinString.length === 6 && pinString === confirmPinString;
    setPinComplete(pinsMatch);

    const securityValid = Boolean(securityData.questionId && securityData.answer.trim() && securityData.answer.length <= 100);
    setSecurityComplete(securityValid);

    setAllComplete(Boolean(pinsMatch && securityValid));
  }, [pin, confirmPin, securityData]);

  // Combined completion handler
  const handleCombinedComplete = () => {
    if (!allComplete) return;

    const pinString = pin.join('');
    
    // Validate security form one more time
    if (!validateSecurityForm()) return;

    console.log('Combined security setup complete:', {
      pinLength: pinString.length,
      questionId: securityData.questionId,
      hasAnswer: !!securityData.answer
    });

    // Call combined completion handler
    onCombinedComplete(pinString, securityData);
  };

  const isPinFilled = pin.every(digit => digit !== '');
  const isConfirmPinFilled = confirmPin.every(digit => digit !== '');
  const pinsMatch = isPinFilled && isConfirmPinFilled && pin.join('') === confirmPin.join('');

  return (
    <>
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
          pinComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {pinComplete ? <Check size={16} /> : '1'}
        </div>
        <div className="w-16 h-1 bg-gray-200"></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
          securityComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {securityComplete ? <Check size={16} /> : '2'}
        </div>
      </div>

      <div
        className="fade-in-up bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-2xl p-5 max-h-80 overflow-y-auto"
        style={{ animationDelay: '0.1s' }}
      >
        {/* PIN Setup Section */}
        <div className="animate-fade-in">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Lock size={24} className="sm:size-32 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-1)] mb-2">Create Your PIN</h2>
            <p className="text-sm sm:text-base text-[var(--text-2)]">Choose a 6-digit PIN for secure access to your account</p>
          </div>

          {/* PIN Input Fields */}
          <div className="space-y-4">
            <div className="space-y-3">
              {/* PIN Creation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-2)]">Enter 6-digit PIN</label>
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                  >
                    {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex gap-2 sm:gap-3 justify-center">
                  {pin.map((digit, index) => (
                    <input
                      key={`pin-${index}`}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type={showPin ? 'text' : 'password'}
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => handlePaste(e)}
                      className="w-11 h-11 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-[var(--border)] rounded-lg focus:border-[var(--powder-dark)] focus:ring-2 focus:ring-[var(--powder-dark)]/20 transition-colors"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              {/* PIN Confirmation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[var(--text-2)]">Confirm PIN</label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                  >
                    {showConfirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex gap-2 sm:gap-3 justify-center">
                  {confirmPin.map((digit, index) => (
                    <input
                      key={`confirm-${index}`}
                      ref={(el) => { confirmInputRefs.current[index] = el; }}
                      type={showConfirmPin ? 'text' : 'password'}
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value, true)}
                      onKeyDown={(e) => handleKeyDown(index, e, true)}
                      onPaste={(e) => handlePaste(e, true)}
                      className={`w-11 h-11 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-lg focus:ring-2 transition-colors ${
                        digit ? 'border-[var(--powder-dark)] ring-2 ring-[var(--powder-dark)]/20' : 'border-[var(--border)]'
                      } ${!pinsMatch && isConfirmPinFilled ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              {/* PIN Status */}
              {isConfirmPinFilled && (
                <div className="flex items-center justify-center gap-2 animate-fade-in">
                  {pinsMatch ? (
                    <>
                      <Check size={20} className="text-green-600" />
                      <span className="text-sm font-medium text-green-600">PINs match!</span>
                    </>
                  ) : (
                    <>
                      <X size={20} className="text-red-600" />
                      <span className="text-sm font-medium text-red-600">PINs don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Questions Section */}
        <div className="animate-fade-in">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-16 h-16 bg-[var(--powder-light)] rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-4">
              <Shield size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-1)] mb-2">Security Question</h2>
            <p className="text-sm text-[var(--text-2)] mb-2">Choose a security question to help recover your account</p>
            <p className="text-sm text-[var(--text-3)]">You'll need to answer this question to reset your PIN</p>
          </div>

          {/* Error Display */}
          {(error || securityValidationError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error || securityValidationError}</span>
            </div>
          )}

          {/* Security Questions Form */}
          {questionsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-[var(--powder-dark)]/30 border-t-[var(--powder-dark)] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[var(--text-2)]">Loading security questions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--text-2)]">
                  Security Question
                </label>
                <div className="relative">
                  <select
                    value={securityData.questionId}
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
              </div>

              {securityData.questionId && (
                <div className="space-y-2 animate-fade-in">
                  <label className="block text-sm font-medium text-[var(--text-2)]">
                    Your Answer
                  </label>
                  <input
                    type="text"
                    value={securityData.answer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Your answer"
                    className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]"
                    disabled={isLoading}
                    maxLength={100}
                  />
                  <p className="text-sm text-[var(--text-3)]">
                    {securityData.answer.length}/100 characters
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all disabled:opacity-50 text-sm"
          >
            Back
          </button>
        )}
        <button
          onClick={handleCombinedComplete}
          disabled={!allComplete || isLoading || questionsLoading}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Complete Setup
              <Check size={16} />
            </>
          )}
        </button>
      </div>
    </>
  );
}
