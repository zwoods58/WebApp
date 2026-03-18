"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, Timer } from 'lucide-react';

interface PINVerificationProps {
  onPINSubmit: (pin: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
  remainingAttempts?: number;
  lockoutTime?: number;
}

export default function PINVerification({ 
  onPINSubmit, 
  onCancel, 
  isLoading = false, 
  error, 
  remainingAttempts = 3,
  lockoutTime = 0
}: PINVerificationProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(lockoutTime);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  useEffect(() => {
    // Focus first input on mount
    if (!lockoutTime) {
      inputRefs.current[0]?.focus();
    }
  }, [lockoutTime]);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when PIN is complete
    if (newPin.every(digit => digit !== '')) {
      const pinString = newPin.join('');
      onPINSubmit(pinString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.replace(/\D/g, '');
    
    const newPin = digits.split('').concat(Array(6 - digits.length).fill(''));
    setPin(newPin);
    
    // Focus last filled input
    const lastIndex = Math.min(digits.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();

    // Auto-submit if complete
    if (digits.length === 6) {
      onPINSubmit(digits);
    }
  };

  const handleClear = () => {
    setPin(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isLocked = timeRemaining > 0;
  const isPinComplete = pin.every(digit => digit !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isLocked 
            ? 'bg-gradient-to-br from-red-500 to-orange-600' 
            : 'bg-gradient-to-br from-blue-500 to-purple-600'
        }`}>
          {isLocked ? (
            <Timer size={32} className="text-white animate-pulse" />
          ) : (
            <Lock size={32} className="text-white" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isLocked ? 'Account Temporarily Locked' : 'Enter Your PIN'}
        </h2>
        
        <p className="text-gray-600">
          {isLocked 
            ? `Too many failed attempts. Try again in ${formatTime(timeRemaining)}`
            : 'Enter your 6-digit PIN to access your account'
          }
        </p>
      </div>

      {!isLocked && (
        <>
          {/* PIN Input */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Enter 6-digit PIN</label>
              <div className="flex items-center gap-2">
                {remainingAttempts < 3 && (
                  <span className={`text-sm font-medium ${
                    remainingAttempts === 1 ? 'text-red-600' : 'text-orange-600'
                  }`}>
                    {remainingAttempts} attempts left
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 justify-center">
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
                  onPaste={handlePaste}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 transition-colors ${
                    digit 
                      ? error 
                        ? 'border-red-500 ring-2 ring-red-200' 
                        : 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                />
              ))}
            </div>

            {isPinComplete && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center text-blue-600"
              >
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-sm font-medium">Verifying...</span>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </>
      )}

      {/* Error Message */}
      {error && !isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700 mb-4"
        >
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Lockout Warning */}
      {remainingAttempts <= 1 && !isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center text-orange-700 mb-4"
        >
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">
            {remainingAttempts === 1 
              ? 'Last attempt before account lockout!'
              : 'One more failed attempt will lock your account for 30 minutes.'
            }
          </span>
        </motion.div>
      )}

      {/* Help Text */}
      {!isLocked && (
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Forgot your PIN? Contact support for assistance.
          </p>
        </div>
      )}
    </motion.div>
  );
}
