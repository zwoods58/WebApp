"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';

interface PINSetupProps {
  onPINComplete: (pin: string) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function PINSetup({ onPINComplete, onCancel, isLoading = false, error }: PINSetupProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'create' && pin.every(digit => digit !== '')) {
      setStep('confirm');
    }
  }, [pin, step]);

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

  const handleSubmit = () => {
    const pinString = pin.join('');
    const confirmPinString = confirmPin.join('');
    
    if (pinString.length !== 6) {
      return;
    }
    
    if (confirmPinString.length !== 6) {
      return;
    }
    
    if (pinString !== confirmPinString) {
      return;
    }
    
    console.log('🔐 PIN setup completed - triggering business creation:', pinString);
    // PIN setup is now functional - call the callback to trigger signup process
    onPINComplete(pinString);
  };

  const handleClear = (isConfirm: boolean = false) => {
    const targetSet = isConfirm ? setConfirmPin : setPin;
    targetSet(['', '', '', '', '', '']);
    
    const refs = isConfirm ? confirmInputRefs : inputRefs;
    refs.current[0]?.focus();
  };

  const isPinComplete = pin.every(digit => digit !== '');
  const isConfirmPinComplete = confirmPin.every(digit => digit !== '');
  const pinsMatch = isPinComplete && isConfirmPinComplete && pin.join('') === confirmPin.join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      {/* PIN Creation Step */}
      {step === 'create' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your PIN</h2>
            <p className="text-gray-600">Choose a 6-digit PIN for secure access to your account</p>
          </div>

          {/* PIN Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Enter 6-digit PIN</label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
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
                  onPaste={(e) => handlePaste(e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  disabled={isLoading}
                />
              ))}
            </div>

            {isPinComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center text-green-600"
              >
                <Check size={20} className="mr-2" />
                <span className="text-sm font-medium">PIN entered</span>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
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
              onClick={() => handleClear(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700"
            >
              <X size={16} className="mr-2" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* PIN Confirmation Step */}
      {step === 'confirm' && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your PIN</h2>
            <p className="text-gray-600">Re-enter your PIN to confirm</p>
          </div>

          {/* Confirm PIN Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Confirm 6-digit PIN</label>
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showConfirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="flex gap-2 justify-center">
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
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 transition-colors ${
                    digit ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                  } ${!pinsMatch && isConfirmPinComplete ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                  disabled={isLoading}
                />
              ))}
            </div>

            {isConfirmPinComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center justify-center ${
                  pinsMatch ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {pinsMatch ? (
                  <>
                    <Check size={20} className="mr-2" />
                    <span className="text-sm font-medium">PINs match!</span>
                  </>
                ) : (
                  <>
                    <X size={20} className="mr-2" />
                    <span className="text-sm font-medium">PINs don't match</span>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('create')}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!pinsMatch || isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Create PIN'
              )}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-700"
            >
              <X size={16} className="mr-2" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
