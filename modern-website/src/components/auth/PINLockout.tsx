"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Timer, AlertCircle, Mail } from 'lucide-react';

interface PINLockoutProps {
  lockoutTime: number;
  onContactSupport?: () => void;
  onTimeExpired?: () => void;
}

export default function PINLockout({ lockoutTime, onContactSupport, onTimeExpired }: PINLockoutProps) {
  const [timeRemaining, setTimeRemaining] = useState(lockoutTime);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        const newTime = timeRemaining - 1;
        setTimeRemaining(newTime);
        
        if (newTime === 0 && onTimeExpired) {
          onTimeExpired();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, onTimeExpired]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getLockoutMessage = () => {
    if (timeRemaining > 1800) { // More than 30 minutes
      return "Too many failed attempts. For security reasons, your account has been temporarily locked.";
    } else if (timeRemaining > 300) { // More than 5 minutes
      return "Too many failed attempts. Your account is temporarily locked for security.";
    } else {
      return "Too many failed attempts. Please wait before trying again.";
    }
  };

  return (
    <div className="fade-in">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in"
        >
          <Lock size={40} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Account Temporarily Locked
        </h2>
        
        <p className="text-gray-600 mb-4">
          {getLockoutMessage()}
        </p>

        {/* Countdown Timer */}
        <div className="scale-in">
          <div className="flex items-center justify-center gap-3 text-red-700">
            <Timer size={24} className="animate-pulse" />
            <div>
              <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
              <div className="text-sm">remaining</div>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3 text-orange-700">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="text-left">
              <h3 className="font-semibold mb-2">Security Notice</h3>
              <ul className="text-sm space-y-1">
                <li>• This lockout protects your account from unauthorized access</li>
                <li>• The timer will count down automatically</li>
                <li>• You can try again when the timer reaches zero</li>
                <li>• Consider contacting support if you forgot your PIN</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onContactSupport && (
            <button
              onClick={onContactSupport}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Contact Support
            </button>
          )}
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Check our FAQ or contact support for assistance.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeRemaining / lockoutTime) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            Lockout progress
          </div>
        </div>
      </div>
    </div>
  );
}
