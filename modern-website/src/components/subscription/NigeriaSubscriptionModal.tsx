'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionAPI } from '@/lib/subscription-api';
import { useToastContext } from '@/providers/ToastProvider';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const PagaColors = {
  primary: '#F26522',
  secondary: '#F7931E',
  accent: '#FFC20E'
};

interface NigeriaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NigeriaSubscriptionModal({ isOpen, onClose, onSuccess }: NigeriaSubscriptionModalProps) {
  const { showSuccess, showError } = useToastContext();
  const { user } = useUnifiedAuth();
  const amount = 500;
  
  const [paymentMethod, setPaymentMethod] = useState('paga');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);

  const userName = user?.business_name || 'Customer';

  const paymentMethods = [
    { id: 'paga', name: 'Paga', icon: '', description: 'Paga ID or phone number', color: PagaColors.primary },
    { id: 'opay', name: 'OPay', icon: '', description: 'OPay account number', color: '#4CAF50' },
    { id: 'bank', name: 'Bank Transfer', icon: '', description: 'Instant NIBSS payment', color: '#3B82F6' },
    { id: 'card', name: 'Card', icon: '', description: 'Visa, Mastercard, Verve', color: '#1E3A5F' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchPlanId();
    }
  }, [isOpen]);

  const fetchPlanId = async () => {
    try {
      const plans = await SubscriptionAPI.getPlans('NG');
      if (plans && plans.length > 0) {
        setPlanId(plans[0].id);
        console.log(' Nigeria plan loaded:', plans[0]);
      }
    } catch (error) {
      console.error('Failed to load plan:', error);
    }
  };

  const handleSubmit = async () => {
    if (!identifier) {
      showError('Please enter your payment identifier');
      return;
    }

    if (!planId) {
      showError('Loading subscription plan. Please try again.');
      return;
    }

    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setStep('waiting');

    try {
      const result = await SubscriptionAPI.createSubscription({
        email: email,
        firstName: userName,
        countryCode: 'NG',
        planId: planId,
        paymentMethod: paymentMethod,
        phone: identifier,
        lastName: 'Customer',
      });

      if (result.authorizationUrl) {
        // Open payment URL in new tab (PWA-safe)
        window.open(result.authorizationUrl, '_blank', 'noopener,noreferrer');
        setStep('waiting');
        showSuccess('Payment opened in new tab. Complete payment and return here.');
      } else if (result.success) {
        setStep('success');
        showSuccess('Weekly subscription activated!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
          setStep('form');
          setIdentifier('');
        }, 3000);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      showError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
        
        <div style={{ backgroundColor: PagaColors.primary }} className="p-5">
          <h2 className="text-xl font-bold text-white">Subscribe with Paga</h2>
          <p className="text-sm text-orange-100">Powered by Kyshi NIBSS Instant</p>
        </div>

        <div className="bg-orange-50 p-3 text-center border-b border-orange-100">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl"></span>
            <span className="font-semibold text-orange-800">Paga Instant Payment</span>
            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Weekly</span>
          </div>
        </div>

        <div className="p-6 text-center border-b">
          <div className="text-3xl font-bold">#{amount.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">weekly subscription auto-renews every 7 days</div>
          <div className="text-xs text-green-600 mt-2"> 7.5% VAT included</div>
          <div className="text-xs text-gray-400 mt-1"> Billed weekly Cancel anytime</div>
        </div>

        {step === 'form' && (
          <>
            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-2">We'll send your subscription confirmation here</p>
            </div>

            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-3">Select payment method</label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 border rounded-xl text-left transition ${
                      paymentMethod === method.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="text-xl mb-1">{method.icon}</div>
                    <div className="font-medium text-sm">{method.name}</div>
                    <div className="text-xs text-gray-400">{method.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-2">
                {paymentMethod === 'paga' && 'Paga ID or Phone Number'}
                {paymentMethod === 'opay' && 'OPay Account Number'}
                {paymentMethod === 'bank' && 'Bank Account Number'}
                {paymentMethod === 'card' && 'Card Number'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  paymentMethod === 'paga' ? '0801 234 5678 or Paga ID' :
                  paymentMethod === 'opay' ? '8123456789' :
                  paymentMethod === 'bank' ? '0123456789' :
                  '1234 5678 9012 3456'
                }
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
                required
              />
              {paymentMethod === 'bank' && (
                <p className="text-xs text-blue-600 mt-2"> You will be redirected to your banking app</p>
              )}
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{ backgroundColor: selectedMethod?.color || PagaColors.primary }}
                className="w-full hover:opacity-90 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : `Pay #${amount} via ${selectedMethod?.name}`}
              </button>
            </div>
          </>
        )}

        {step === 'waiting' && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="font-medium text-gray-900">Check your phone</p>
            <p className="text-sm text-gray-500 mt-1">Approve payment on your {selectedMethod?.name} app</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4"></div>
            <p className="font-medium text-gray-900">Weekly subscription activated!</p>
            <p className="text-sm text-gray-500 mt-1">You will be charged #{amount} every 7 days</p>
          </div>
        )}

        <div className="p-4 text-center text-xs text-gray-400 border-t">
          Secured by Kyshi NIBSS Instant Payment Network
        </div>
      </div>
    </div>
  );
}

