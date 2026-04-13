'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionAPI } from '@/lib/subscription-api';
import { useToastContext } from '@/providers/ToastProvider';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const MtnColors = { primary: '#EAB308', secondary: '#000000' };
const VodafoneColors = { primary: '#DC2626', secondary: '#FFFFFF' };
const AirtelTigoColors = { primary: '#DC2626', secondary: '#FFFFFF' };

interface GhanaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GhanaSubscriptionModal({ isOpen, onClose, onSuccess }: GhanaSubscriptionModalProps) {
  const { showSuccess, showError } = useToastContext();
  const { user } = useUnifiedAuth();
  const amount = 20;
  
  const [provider, setProvider] = useState<'mtn' | 'vodafone' | 'airteltigo'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);

  const userName = user?.business_name || 'Customer';

  const providers = {
    mtn: { name: 'MTN Mobile Money', short: 'MTN MoMo', color: MtnColors.primary, textColor: 'black', prefix: '24' },
    vodafone: { name: 'Vodafone Cash', short: 'Vodafone Cash', color: VodafoneColors.primary, textColor: 'white', prefix: '30' },
    airteltigo: { name: 'AirtelTigo Money', short: 'AirtelTigo', color: AirtelTigoColors.primary, textColor: 'white', prefix: '27' }
  };

  const currentProvider = providers[provider];

  useEffect(() => {
    if (isOpen) {
      fetchPlanId();
    }
  }, [isOpen]);

  const fetchPlanId = async () => {
    try {
      const plans = await SubscriptionAPI.getPlans('GH');
      if (plans && plans.length > 0) {
        setPlanId(plans[0].id);
        console.log(' Ghana plan loaded:', plans[0]);
      }
    } catch (error) {
      console.error('Failed to load plan:', error);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      showError('Please enter a valid phone number');
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
        lastName: 'Customer',
        countryCode: 'GH',
        planId: planId,
        paymentMethod: 'mobile_money',
        phone: `233${phoneNumber}`,
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
          setPhoneNumber('');
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
        
        <div style={{ backgroundColor: currentProvider.color }} className="p-5">
          <h2 className={`text-xl font-bold ${currentProvider.textColor === 'white' ? 'text-white' : 'text-black'}`}>
            {currentProvider.name}
          </h2>
          <p className={`text-sm ${currentProvider.textColor === 'white' ? 'text-white/70' : 'text-black/70'}`}>
            Powered by Kyshi MoMo approved
          </p>
        </div>

        <div className="bg-yellow-50 p-3 text-center border-b border-yellow-100">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl"></span>
            <span className="font-semibold text-yellow-800">Mobile Money</span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">Weekly</span>
          </div>
        </div>

        <div className="p-6 text-center border-b">
          <div className="text-3xl font-bold">#{amount}</div>
          <div className="text-sm text-gray-500 mt-1">weekly subscription auto-renews every 7 days</div>
          <div className="text-xs text-gray-500 mt-2">E-Levy included in price</div>
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
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-2">We'll send your subscription confirmation here</p>
            </div>

            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-3">Choose your network</label>
              <div className="space-y-3">
                <button
                  onClick={() => setProvider('mtn')}
                  className={`w-full p-4 border rounded-xl flex items-center gap-4 transition ${
                    provider === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">M</div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">MTN Mobile Money</div>
                    <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                  </div>
                  {provider === 'mtn' && <div className="text-yellow-600"></div>}
                </button>

                <button
                  onClick={() => setProvider('vodafone')}
                  className={`w-full p-4 border rounded-xl flex items-center gap-4 transition ${
                    provider === 'vodafone' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">V</div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Vodafone Cash</div>
                    <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                  </div>
                  {provider === 'vodafone' && <div className="text-red-600"></div>}
                </button>

                <button
                  onClick={() => setProvider('airteltigo')}
                  className={`w-full p-4 border rounded-xl flex items-center gap-4 transition ${
                    provider === 'airteltigo' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">AirtelTigo Money</div>
                    <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                  </div>
                  {provider === 'airteltigo' && <div className="text-red-600"></div>}
                </button>
              </div>
            </div>

            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-2">Mobile Money Number</label>
              <div className="flex">
                <span className="bg-gray-100 px-4 py-3 rounded-l-xl border text-gray-600">+233</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder={currentProvider.prefix}
                  className="flex-1 px-4 py-3 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  disabled={isLoading}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You'll receive a payment request on your {currentProvider.name}
              </p>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{ backgroundColor: currentProvider.color }}
                className={`w-full hover:opacity-90 py-3 rounded-xl font-semibold transition disabled:opacity-50 ${
                  currentProvider.textColor === 'white' ? 'text-white' : 'text-black'
                }`}
              >
                {isLoading ? 'Processing...' : `Pay #${amount} via ${currentProvider.short}`}
              </button>
            </div>
          </>
        )}

        {step === 'waiting' && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="font-medium text-gray-900">Check your phone</p>
            <p className="text-sm text-gray-500 mt-1">Enter your MoMo PIN to complete payment</p>
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
          Secured by Kyshi Ghana MoMo approved
        </div>
      </div>
    </div>
  );
}
