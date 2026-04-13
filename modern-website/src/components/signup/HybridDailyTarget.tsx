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
    <>
      {/* Header Section */}
      <div className="text-center mb-8 fade-in">
        <h2 className="text-xl font-bold text-[var(--text-1)] mb-4">
          What is your daily goal?
        </h2>
        <p className="text-[var(--text-3)] text-xs">
          Set a target to help track your progress
        </p>
      </div>

        {/* Quick Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleQuickOptionSelect(option.value)}
              className={`p-4 rounded-lg border-2 transition-all animate-fade-in ${
                selectedTarget === option.value.toString() && !showCustomInput
                  ? 'border-[var(--powder-dark)] bg-[var(--powder-light)]/20'
                  : 'border-[var(--border)] hover:border-[var(--powder-mid)]'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--text-1)] mb-2">
                  {formatOptionDisplay(option.value)}
                </div>
                <div className="text-sm font-medium text-[var(--text-1)]">{option.label}</div>
                <div className="text-xs text-[var(--text-3)]">{option.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Input Option */}
        <div className="space-y-4">
          {!showCustomInput && !quickOptions.some(option => option.value.toString() === selectedTarget) && selectedTarget ? (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between p-3 bg-[var(--powder-light)]/20 rounded-lg border border-[var(--powder-dark)]/30">
              <div>
                <div className="text-xs xs:text-sm sm:text-base lg:text-lg text-[var(--text-2)] mb-1">Your custom daily target</div>
                <div className="text-xl font-bold text-[var(--text-1)]">
                  {selectedTarget}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--powder-dark)] text-white flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
            </div>
            <div className="text-sm text-[var(--powder-dark)] hover:text-[var(--powder-darker)] transition-colors mt-2">
              Change amount
            </div>
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
              <div className="text-xs xs:text-sm sm:text-base lg:text-lg text-[var(--powder-dark)] hover:text-[var(--powder-darker)] transition-colors">
                Save
              </div>
              <div className="text-sm text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">
                Cancel
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-8">
          <button
            onClick={onPrev}
            className="flex-1 px-4 py-2.5 bg-[var(--glass-bg)] text-black font-medium rounded-lg hover:bg-[var(--glass-bg)] transition-all text-sm"
          >
            Back
          </button>
          <button
            onClick={handleComplete}
            disabled={!selectedTarget}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[var(--powder-dark)] to-[var(--powder-mid)] text-white font-medium rounded-lg hover:from-[var(--powder-mid)] hover:to-[var(--powder-dark)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
    </>
  );
}
