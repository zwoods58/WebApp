"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Shield, Lock, CheckCircle, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useForgotPIN } from '@/hooks/useForgotPIN';
import { formatPhoneNumber } from '@/utils/phoneUtils';

interface ForgotPINFlowProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ForgotPINFlow({ onSuccess, onCancel }: ForgotPINFlowProps) {
  const forgotPIN = useForgotPIN();
  const [phoneInput, setPhoneInput] = useState('');
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [newPin, setNewPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinError, setPinError] = useState('');
  
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize answers when questions are loaded
  useEffect(() => {
    if (forgotPIN.questions && forgotPIN.questions.length === 1) {
      setAnswers(forgotPIN.questions.map(q => ({ questionId: q.id, answer: '' })));
    }
  }, [forgotPIN.questions]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = formatPhoneNumber(phoneInput);
    await forgotPIN.verifyPhone(formattedPhone);
  };

  const handleAnswersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Answer is required
    const filledAnswers = answers.filter(a => a.answer.trim() !== '');
    
    if (filledAnswers.length !== 1) {
      return;
    }

    await forgotPIN.verifyAnswers(filledAnswers);
  };

  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (value.length > 1) return;
    
    const targetArray = isConfirm ? confirmPin : newPin;
    const targetSet = isConfirm ? setConfirmPin : setNewPin;
    
    const newPinArray = [...targetArray];
    newPinArray[index] = value;
    targetSet(newPinArray);
    setPinError('');

    if (value && index < 5) {
      const refs = isConfirm ? confirmPinRefs : pinRefs;
      refs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent, isConfirm: boolean = false) => {
    const targetArray = isConfirm ? confirmPin : newPin;
    if (e.key === 'Backspace' && !targetArray[index] && index > 0) {
      const refs = isConfirm ? confirmPinRefs : pinRefs;
      refs.current[index - 1]?.focus();
    }
  };

  const handleNewPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPinString = newPin.join('');
    const confirmPinString = confirmPin.join('');
    
    if (newPinString.length !== 6) {
      setPinError('Please enter a 6-digit PIN');
      return;
    }
    
    if (confirmPinString.length !== 6) {
      setPinError('Please confirm your PIN');
      return;
    }
    
    if (newPinString !== confirmPinString) {
      setPinError('PINs do not match');
      return;
    }
    
    const result = await forgotPIN.resetPIN(newPinString);
    
    if (result.success && onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => prev.map(a => 
      a.questionId === questionId ? { ...a, answer } : a
    ));
  };

  const filledAnswersCount = answers.filter(a => a.answer.trim() !== '').length;
  const isPinComplete = newPin.every(digit => digit !== '');
  const isConfirmPinComplete = confirmPin.every(digit => digit !== '');

  // Lockout timer
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  
  useEffect(() => {
    if (forgotPIN.lockoutTime) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((forgotPIN.lockoutTime! - Date.now()) / 1000));
        setLockoutRemaining(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [forgotPIN.lockoutTime]);

  const formatLockoutTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] flex flex-col">
      <div className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Phone Number */}
            {forgotPIN.step === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-[var(--powder-light)] rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6">
                    <Phone size={40} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl font-bold text-[var(--text-1)] mb-4">
                    Forgot Your PIN?
                  </h1>
                  <p className="text-[var(--text-2)]">
                    Enter your phone number to begin recovery
                  </p>
                </div>

                <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-3xl p-8">
                  {forgotPIN.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{forgotPIN.error}</span>
                    </div>
                  )}

                  {lockoutRemaining > 0 && (
                    <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg mb-6">
                      <p className="text-sm font-medium">Account temporarily locked</p>
                      <p className="text-sm mt-1">Try again in {formatLockoutTime(lockoutRemaining)}</p>
                    </div>
                  )}

                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-2)] mb-2">
                        <Phone size={16} />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+254712345678"
                        className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]"
                        disabled={forgotPIN.loading || lockoutRemaining > 0}
                      />
                    </div>

                    <div className="flex gap-4">
                      {onCancel && (
                        <button
                          type="button"
                          onClick={onCancel}
                          className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-[var(--text-1)] font-medium rounded-xl hover:bg-[var(--border)] transition-all"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!phoneInput || forgotPIN.loading || lockoutRemaining > 0}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {forgotPIN.loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          'Continue'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Step 2: Security Questions */}
            {forgotPIN.step === 'questions' && forgotPIN.questions && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-[var(--powder-light)] rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6">
                    <Shield size={40} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl font-bold text-[var(--text-1)] mb-4">
                    Answer Security Questions
                  </h1>
                  <p className="text-[var(--text-2)] mb-2">
                    Answer the security question to verify your identity
                  </p>
                  <p className="text-[var(--text-3)] text-sm">
                    {forgotPIN.remainingAttempts} attempt(s) remaining
                  </p>
                </div>

                <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-3xl p-8">
                  {forgotPIN.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{forgotPIN.error}</span>
                    </div>
                  )}

                  <form onSubmit={handleAnswersSubmit} className="space-y-6">
                    {forgotPIN.questions.map((question, index) => (
                      <div key={question.id}>
                        <label className="block text-sm font-medium text-[var(--text-2)] mb-2">
                          Question {index + 1}
                        </label>
                        <p className="text-[var(--text-1)] mb-2 font-medium">
                          {question.question_text}
                        </p>
                        <input
                          type="text"
                          value={answers.find(a => a.questionId === question.id)?.answer || ''}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Your answer"
                          className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all text-[var(--text-1)] placeholder-[var(--text-3)]"
                          disabled={forgotPIN.loading}
                          maxLength={100}
                        />
                      </div>
                    ))}

                    {filledAnswersCount === 0 && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                        <p className="text-sm">
                          Please answer the security question above
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => forgotPIN.goToStep('phone')}
                        className="flex-1 px-6 py-3 bg-[var(--glass-bg)] text-[var(--text-1)] font-medium rounded-xl hover:bg-[var(--border)] transition-all"
                      >
                        <ArrowLeft size={20} className="inline mr-2" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={filledAnswersCount !== 1 || forgotPIN.loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {forgotPIN.loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                        ) : (
                          'Verify Answers'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Step 3: New PIN */}
            {forgotPIN.step === 'newPin' && (
              <motion.div
                key="newPin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-[var(--powder-light)] rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-6">
                    <Lock size={40} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl font-bold text-[var(--text-1)] mb-4">
                    Create New PIN
                  </h1>
                  <p className="text-[var(--text-2)]">
                    Enter a new 6-digit PIN for your account
                  </p>
                </div>

                <div className="bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--border)] rounded-3xl p-8">
                  {(forgotPIN.error || pinError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{forgotPIN.error || pinError}</span>
                    </div>
                  )}

                  <form onSubmit={handleNewPinSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-2)] mb-2">
                        New PIN
                      </label>
                      <div className="flex justify-center gap-2 mb-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            type={showPin ? "text" : "password"}
                            maxLength={1}
                            value={newPin[index] || ''}
                            onChange={(e) => handlePinChange(index, e.target.value, false)}
                            onKeyDown={(e) => handlePinKeyDown(index, e, false)}
                            className="w-12 h-12 text-center text-lg font-semibold bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] transition-all"
                            disabled={forgotPIN.loading}
                            ref={(input) => {
                              if (input) pinRefs.current[index] = input;
                            }}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="text-sm text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors flex items-center gap-1"
                      >
                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                        {showPin ? 'Hide' : 'Show'} PIN
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-2)] mb-2">
                        Confirm PIN
                      </label>
                      <div className="flex justify-center gap-2 mb-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            type={showConfirmPin ? "text" : "password"}
                            maxLength={1}
                            value={confirmPin[index] || ''}
                            onChange={(e) => handlePinChange(index, e.target.value, true)}
                            onKeyDown={(e) => handlePinKeyDown(index, e, true)}
                            className="w-12 h-12 text-center text-lg font-semibold bg-[var(--glass-bg)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--powder-dark)] focus:border-[var(--powder-mid)] text-[var(--text-1)] transition-all"
                            disabled={forgotPIN.loading}
                            ref={(input) => {
                              if (input) confirmPinRefs.current[index] = input;
                            }}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                        className="text-sm text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors flex items-center gap-1"
                      >
                        {showConfirmPin ? <EyeOff size={16} /> : <Eye size={16} />}
                        {showConfirmPin ? 'Hide' : 'Show'} PIN
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!isPinComplete || !isConfirmPinComplete || forgotPIN.loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotPIN.loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        'Reset PIN'
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {forgotPIN.step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 mx-auto mb-6">
                    <CheckCircle size={40} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl font-bold text-[var(--text-1)] mb-4">
                    PIN Reset Successful!
                  </h1>
                  <p className="text-[var(--text-2)] mb-8">
                    You can now sign in with your new PIN
                  </p>
                  
                  <button
                    onClick={onSuccess}
                    className="px-8 py-3 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-xl hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all"
                  >
                    Go to Login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
