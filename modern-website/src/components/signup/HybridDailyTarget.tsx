"use client";

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Edit3 } from 'lucide-react';
import { validateDailyTarget, formatCurrencyWithSymbol } from '@/utils/currency';

interface HybridDailyTargetProps {
  country: string;
  selectedTarget: string;
  onSelect: (target: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function HybridDailyTarget({ 
  country, 
  selectedTarget, 
  onSelect, 
  onNext, 
  onPrev 
}: HybridDailyTargetProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [customError, setCustomError] = useState('');

  // Quick options based on country
  const quickOptions = [
    { value: 500, label: 'Starter', description: 'Great for beginning' },
    { value: 800, label: 'Growing', description: 'For expanding business' },
    { value: 1000, label: 'Established', description: 'Steady daily target' },
    { value: 1500, label: 'Ambitious', description: 'High growth goal' }
  ];

  const handleQuickOptionSelect = (value: number) => {
    setShowCustomInput(false);
    setCustomError('');
    onSelect(value.toString());
  };

  const handleCustomInputClick = () => {
    setShowCustomInput(true);
    setCustomValue(selectedTarget || '');
    setCustomError('');
  };

  const handleCustomValueChange = (value: string) => {
    setCustomValue(value);
    setCustomError('');
  };

  const handleCustomValueSubmit = () => {
    const numValue = parseInt(customValue);
    
    if (!numValue || numValue <= 0) {
      setCustomError('Please enter a valid amount');
      return;
    }

    if (!validateDailyTarget(numValue, country)) {
      setCustomError('Amount seems unusual for your country');
      return;
    }

    onSelect(numValue.toString());
    setShowCustomInput(false);
    setCustomError('');
  };

  const handleCustomValueSave = () => {
    const numValue = parseInt(customValue);
    
    if (!numValue || numValue <= 0) {
      setCustomError('Please enter a valid amount');
      return false;
    }

    if (!validateDailyTarget(numValue, country)) {
      setCustomError('Amount seems unusual for your country');
      return false;
    }

    onSelect(numValue.toString());
    setCustomError('');
    return true;
  };

  const handleComplete = () => {
    // If custom input is open and has a value, save it first
    if (showCustomInput && customValue) {
      const saved = handleCustomValueSave();
      if (!saved) return; // Don't proceed if save failed
    }
    
    if (!selectedTarget) return;
    onNext();
  };

  const formatOptionDisplay = (value: number) => {
    return formatCurrencyWithSymbol(value, country);
  };

  return (
    <div className="py-6 sm:py-8 max-h-screen overflow-y-auto">
      <div className="animate-fade-in">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--powder-light)]/30 rounded-3xl flex items-center justify-center text-[var(--powder-dark)] mx-auto mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl font-bold">$</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-1)] mb-3 sm:mb-4 tracking-[-0.02em]">
          What is your daily goal?
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-2)] max-w-md mx-auto mb-6 sm:mb-8">
          Set a target to help track your progress
        </p>
      </div>

      {/* Quick Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        {quickOptions.map((option, index) => (
          <button
            key={option.value}
            onClick={() => handleQuickOptionSelect(option.value)}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all animate-fade-in ${
              selectedTarget === option.value.toString() && !showCustomInput
                ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]/20'
                : 'border-[var(--border)] hover:border-[var(--powder-mid)]'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-[var(--powder-dark)] font-bold">?</span>
              <div className="text-xl sm:text-2xl font-bold text-[var(--text-1)]">
                {option.value}
              </div>
            </div>
            <div className="text-sm sm:text-base font-medium text-[var(--text-1)] mb-1">{option.label}</div>
            <div className="text-xs sm:text-sm text-[var(--text-2)]">{option.description}</div>
            {selectedTarget === option.value.toString() && !showCustomInput && (
              <div className="flex justify-center mt-2 animate-fade-in">
                <span className="text-[var(--powder-dark)] font-bold">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Input Option */}
      <div className="mb-8">
        {!showCustomInput && !quickOptions.some(option => option.value.toString() === selectedTarget) && selectedTarget ? (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[var(--text-2)] mb-1">Your custom daily target</div>
                <div className="text-xl font-bold text-[var(--text-1)]">
                  {selectedTarget}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--powder-dark)] text-white flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
            </div>
            <button
              onClick={handleCustomInputClick}
              className="text-sm text-[var(--powder-dark)] hover:text-[var(--powder-darker)] transition-colors mt-2"
            >
              Change amount
            </button>
          </div>
        ) : !showCustomInput ? (
          <button
            onClick={handleCustomInputClick}
            className="w-full p-4 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--powder-mid)] transition-all flex items-center justify-center gap-3 text-[var(--text-2)] hover:text-[var(--text-1)] animate-fade-in"
          >
            <span className="font-medium">Enter custom amount</span>
          </button>
        ) : (
          <div className="animate-fade-in">
            <div className="mb-3">
              <label className="block text-sm font-medium text-[var(--text-1)] mb-2">
                Custom daily target
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={customValue}
                  onChange={(e) => handleCustomValueChange(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-3 bg-[var(--glass-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--powder-dark)]/20 focus:border-[var(--powder-dark)] transition-all"
                  autoFocus
                />
                <button
                  onClick={handleCustomValueSubmit}
                  className="px-6 py-3 bg-[var(--powder-dark)] text-white font-medium rounded-xl hover:bg-[var(--powder-mid)] transition-all"
                >
                  Set
                </button>
              </div>
              {customError && (
                <div className="mt-2 text-sm text-red-500">
                  {customError}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCustomValueSave}
                className="text-sm text-[var(--powder-dark)] hover:text-[var(--powder-darker)] transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowCustomInput(false)}
                className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={onPrev}
          className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--glass-bg)] text-black font-medium rounded-xl hover:bg-[var(--glass-bg)] transition-all active:scale-[0.98] text-sm sm:text-base"
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          disabled={!selectedTarget}
          className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--powder-dark)] text-white font-bold rounded-xl hover:bg-[var(--powder-mid)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-[var(--powder-dark)]/20 text-sm sm:text-base"
        >
          START USING BEEZEE
        </button>
      </div>
    </div>
  );
}
