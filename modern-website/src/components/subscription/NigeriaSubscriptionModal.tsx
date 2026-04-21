'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToastContext } from '@/providers/ToastProvider';

interface NigeriaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface BankDetails {
  accountNumber: string;
  accountName: string;
  bankName: string;
  amount: number;
  reference: string;
}

export default function NigeriaSubscriptionModal({ isOpen, onClose, onSuccess }: NigeriaSubscriptionModalProps) {
  const { user } = useSupabaseAuth();
  const { showSuccess, showError } = useToastContext();
  
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'bank_details' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      showError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setStep('waiting');

    try {
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user?.id,
          user_email: email,
          user_name: user?.business_name || 'Customer',
          country: 'NG'
        })
      });

      const result = await res.json();

      if (result.accountNumber) {
        setBankDetails({
          accountNumber: result.accountNumber,
          accountName: result.accountName,
          bankName: result.bankName,
          amount: result.amount,
          reference: result.reference
        });
        setStep('bank_details');
        showSuccess('Transfer details ready');
      } else {
        showError(result.message || 'Failed to generate account');
        setStep('form');
      }
    } catch (error) {
      showError('Failed to generate account. Please try again.');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const copyAccountNumber = () => {
    if (bankDetails) {
      navigator.clipboard.writeText(bankDetails.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    
    setEmail('');
    setStep('form');
    setIsLoading(false);
    setBankDetails(null);
    setCopied(false);
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
        <div style={{ backgroundColor: '#F26522' }} className="p-6 rounded-t-2xl -mx-6 -mt-6 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Nigeria Bank Transfer</h2>
            <p className="text-orange-100">₦500 per week • Cancel anytime</p>
          </div>
        </div>

        {step === 'form' && (
          <>
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ backgroundColor: '#F26522' }}
              className="w-full py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Generating Account...' : 'Generate Transfer Details'}
            </button>
          </>
        )}

        {step === 'waiting' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Account...</h3>
            <p className="text-gray-600">Please wait while we create your temporary account.</p>
          </div>
        )}

        {step === 'bank_details' && bankDetails && (
          <>
            {/* Bank Details Card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bank</span>
                  <span className="font-medium">{bankDetails.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Name</span>
                  <span className="font-medium">{bankDetails.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-bold text-lg" 
                      style={{ letterSpacing: '4px' }}
                    >
                      {bankDetails.accountNumber}
                    </span>
                    <button
                      onClick={copyAccountNumber}
                      className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded hover:bg-orange-200 transition-colors"
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount</span>
                  <div>
                    <span className="font-bold" style={{ color: '#F26522' }}>
                      ₦{bankDetails.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 block">(exact amount including fees)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Transfer the exact amount shown. This account number expires in 3 days. Do not use it after expiry.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setStep('success')}
                className="w-full py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: '#F26522' }}
              >
                I've Made the Transfer
              </button>
              <button
                onClick={handleClose}
                className="w-full py-3 rounded-lg font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close (details emailed to you)
              </button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer Submitted</h3>
            <p className="text-gray-600">
              Your subscription activates once payment clears. We will email you at {email} to confirm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
