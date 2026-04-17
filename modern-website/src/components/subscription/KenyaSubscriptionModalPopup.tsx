'use client';

import React, { useState } from 'react';
import { useToastContext } from '@/providers/ToastProvider';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
// Kyshi payment removed

const MpesaColors = {
  primary: '#1B5E20',
  secondary: '#4CAF50',
  text: '#FFFFFF'
};

interface KenyaSubscriptionModalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function KenyaSubscriptionModalPopup({ isOpen, onClose, onSuccess }: KenyaSubscriptionModalPopupProps) {
  const { showSuccess, showError } = useToastContext();
  const { user } = useUnifiedAuth();
  const amount = 200;
  const currency = 'KES';
  
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userName = user?.business_name || 'Customer';

  const handlePaymentSuccess = () => {
    showSuccess('Payment successful! Your subscription is now active.');
    onSuccess?.();
    onClose();
  };

  const handlePaymentError = (error: string) => {
    showError(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form validation handled by the payment button
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-green-600">M</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lipa na M-Pesa</h2>
          <p className="text-sm text-gray-600">Secure payment processing</p>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-800">KES {amount}</p>
            <p className="text-xs text-green-600">Weekly subscription • Auto-renews every 7 days</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <p className="text-xs text-gray-500 mt-2">We'll send your subscription confirmation here</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">M-Pesa Phone Number</label>
            <div className="flex">
              <span className="bg-gray-100 px-4 py-3 rounded-l-xl border border-r-0 text-gray-600">+254</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder="712 345 678"
                className="flex-1 px-4 py-3 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">You will receive payment prompt on this number</p>
          </div>

          {/* Payment Button - Kyshi removed */}
          <button
            type="submit"
            disabled
            className="w-full py-3 bg-gray-400 text-white rounded-xl font-semibold text-lg cursor-not-allowed"
          >
            Payment System Unavailable
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>How it works:</strong> Click "Pay" to open secure payment window. 
            Complete payment in the popup, then return here automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

