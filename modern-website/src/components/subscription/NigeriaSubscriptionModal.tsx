'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionAPI } from '@/lib/subscription-api';
import { useToastContext } from '@/providers/ToastProvider';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

/**
 * NigeriaSubscriptionModal
 * Optimized for PWA with same-tab redirection and secure server-side verification.
 * Supports Paga, OPay, and Bank Transfer.
 */

const PagaColors = {
  primary: '#F26522', // Paga Orange
  secondary: '#F7931E',
  accent: '#FFC20E',
  dark: '#1E3A5F', // Deep Navy
};

interface NigeriaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NigeriaSubscriptionModal({ isOpen, onClose, onSuccess }: NigeriaSubscriptionModalProps) {
  const { showSuccess, showError } = useToastContext();
  const { business } = useUnifiedAuth();
  const amount = 500;
  
  const [paymentMethod, setPaymentMethod] = useState('paga');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const businessName = business?.business_name || 'Beezee Customer';

  const paymentMethods = [
    { id: 'paga', name: 'Paga', icon: '🟠', description: 'Paga ID or phone', color: PagaColors.primary },
    { id: 'opay', name: 'OPay', icon: '🟢', description: 'OPay account', color: '#05AC72' },
    { id: 'bank_transfer', name: 'Transfer', icon: '🏦', description: 'NIBSS Instant', color: '#3B82F6' },
  ];

  useEffect(() => {
    if (isOpen && business?.email && !email) {
      setEmail(business.email);
    }
  }, [isOpen, business, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      showError('Please enter a valid email');
      return;
    }

    if (!identifier && paymentMethod !== 'card') {
      showError('Please enter your account details');
      return;
    }

    setIsLoading(true);
    setStep('waiting');

    try {
      const response = await SubscriptionAPI.createSubscription({
        email: email,
        firstName: businessName,
        lastName: 'Customer',
        phone: identifier,
        countryCode: 'Nigeria', // <--- Matches Edge Function map
        paymentMethod: paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'mobile_money',
      });

      if (response.success && (response.paymentUrl || response.authorizationUrl)) {
        const url = response.paymentUrl || response.authorizationUrl;
        // PWA Safe Redirect
        window.location.href = url!;
      } else {
        throw new Error(response.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Nigeria subscription error:', error);
      showError(error instanceof Error ? error.message : 'Something went wrong');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-white/20"
        style={{ 
          background: `linear-gradient(135deg, #ffffff 0%, #fff7f5 100%)`,
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: PagaColors.primary }} className="p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl -ml-16 -mb-16"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">Nigeria Checkout</h2>
            <p className="text-orange-100 text-xs font-bold tracking-widest mt-1 opacity-80">POWERED BY KYSHI SECURE</p>
          </div>
        </div>

        {/* Price Tag */}
        <div className="px-8 pt-8 pb-4 text-center">
          <div className="inline-block px-4 py-1.5 bg-orange-50 rounded-2xl text-orange-600 text-[10px] font-black tracking-[0.2em] mb-4">
            WEEKLY SUBSCRIPTION
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-bold text-gray-400">₦</span>
            <span className="text-6xl font-black text-gray-900 tracking-tighter">{amount}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3 font-medium">Billed every 7 days. Cancel anytime.</p>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-50 px-5 py-4 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 transition-all outline-none text-gray-900 font-medium"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Method Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setProviderSelection(method.id)}
                      className={`py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === method.id 
                          ? 'border-orange-500 bg-orange-50/50 shadow-sm' 
                          : 'border-gray-100 bg-gray-50/30'
                      }`}
                    >
                      <span className="text-lg">{method.icon}</span>
                      <span className="text-[9px] font-black uppercase text-gray-600">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Identifier */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  {paymentMethod === 'paga' ? 'Paga ID or Phone' : 
                   paymentMethod === 'opay' ? 'OPay Account No' : 
                   'Bank Account Number'}
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={paymentMethod === 'paga' ? '080...' : '1234567890'}
                  className="w-full bg-gray-50 px-5 py-4 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-500 transition-all outline-none text-gray-900 font-medium"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: selectedMethod?.color || PagaColors.primary }}
                className="w-full py-5 rounded-[1.25rem] text-white font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-orange-900/10 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Wait...' : `Pay ₦${amount}`}
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full mt-6 text-[10px] font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-[0.25em]"
              >
                NOT NOW
              </button>
            </div>
          </form>
        )}

        {step === 'waiting' && (
          <div className="p-16 text-center space-y-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 border-[10px] border-orange-50 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">🇳🇬</div>
            </div>
            <div>
              <p className="text-xl font-black text-gray-900 uppercase italic">Confirming...</p>
              <p className="text-sm text-gray-500 mt-2 font-medium">Please check your {selectedMethod?.name} app or phone for the prompt.</p>
            </div>
          </div>
        )}

        {/* Security Footer */}
        <div className="p-6 text-center bg-gray-50/80 border-t border-gray-100">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
            Secured by Kyshi • NIBSS Compliant
          </p>
        </div>
      </div>
    </div>
  );

  function setProviderSelection(id: string) {
    setPaymentMethod(id);
    // Visual feedback
    const vibrate = window.navigator.vibrate;
    if (vibrate) vibrate(10);
  }
}
