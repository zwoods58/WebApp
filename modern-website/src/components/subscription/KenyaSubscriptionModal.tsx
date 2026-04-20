'use client';

import { useState } from 'react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToastContext } from '@/providers/ToastProvider';

interface KenyaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function KenyaSubscriptionModal({ isOpen, onClose, onSuccess }: KenyaSubscriptionModalProps) {
  const { user } = useUnifiedAuth();
  const { showSuccess, showError } = useToastContext();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      showError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user?.id,
          user_email: email,
          user_phone: '254' + phoneNumber,
          user_name: user?.business_name || 'Customer',
          country: 'KE'
        })
      });

      const result = await res.json();

      if (result.authorizationUrl) {
        setStep('waiting');
        window.location.href = result.authorizationUrl;
      } else {
        showError(result.message || 'Payment failed');
        setIsLoading(false);
      }
    } catch (error) {
      showError('Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    
    setPhoneNumber('');
    setEmail('');
    setStep('form');
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div style={{ backgroundColor: '#1B5E20' }} className="p-6 rounded-t-2xl -mx-6 -mt-6 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Lipa na M-Pesa</h2>
            <p className="text-green-100">KES 200 per week • Cancel anytime</p>
          </div>
        </div>

        {step === 'form' && (
          <>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">M-Pesa Number</label>
              <div className="flex">
                <div className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                  +254
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="712345678"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">You will receive an STK Push to enter your PIN</p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ backgroundColor: '#4CAF50' }}
              className="w-full py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Pay KES 200 with M-Pesa'}
            </button>
          </>
        )}

        {step === 'waiting' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your phone</h3>
            <p className="text-gray-600">A prompt has been sent to your M-Pesa number +254{phoneNumber}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Active!</h3>
            <p className="text-gray-600">You now have full access to Beezee features.</p>
          </div>
        )}
      </div>
    </div>
  );
}
