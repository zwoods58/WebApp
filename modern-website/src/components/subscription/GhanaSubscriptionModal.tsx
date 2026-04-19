'use client';

import React, { useState, useEffect } from 'react';
import { useToastContext } from '@/providers/ToastProvider';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { SubscriptionAPI } from '@/lib/subscription-api';

/**
 * GhanaSubscriptionModal
 * Optimized for PWA with same-tab redirection and secure server-side verification.
 * Supports MTN MoMo, Vodafone Cash, and AirtelTigo.
 */

const GH_Colors = {
  mtn: '#FFCC00',
  vodafone: '#E60000',
  airteltigo: '#004C91',
  dark: '#121212',
};

interface GhanaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Provider = 'mtn' | 'vodafone' | 'airteltigo';

const PROVIDERS = {
  mtn:        { name: 'MTN Mobile Money',  short: 'MTN MoMo',      color: GH_Colors.mtn,      textColor: 'black', icon: '🟡' },
  vodafone:   { name: 'Vodafone Cash',     short: 'Vodafone Cash', color: GH_Colors.vodafone, textColor: 'white', icon: '🔴' },
  airteltigo: { name: 'AirtelTigo Money',  short: 'AirtelTigo',   color: GH_Colors.airteltigo, textColor: 'white', icon: '🔵' },
} as const;

export function GhanaSubscriptionModal({ isOpen, onClose, onSuccess }: GhanaSubscriptionModalProps) {
  const { showSuccess, showError } = useToastContext();
  const { business } = useUnifiedAuth();

  const [provider, setProvider]     = useState<Provider>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail]           = useState('');
  const [step, setStep]             = useState<'form' | 'waiting' | 'success'>('form');
  const [isLoading, setIsLoading]   = useState(false);

  const amount = 20;
  const currentProvider = PROVIDERS[provider];
  const businessName = business?.business_name || 'Beezee Customer';

  useEffect(() => {
    if (isOpen && business?.email && !email) {
      setEmail(business.email);
    }
  }, [isOpen, business, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 9) {
      showError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setStep('waiting');

    try {
      // Use 'Ghana' to match Edge Function keys
      const response = await SubscriptionAPI.createSubscription({
        email: email,
        firstName: businessName,
        lastName: 'Customer',
        phone: `233${phoneNumber.replace(/^0/, '')}`,
        countryCode: 'Ghana', // <--- Matches Edge Function map
        paymentMethod: 'mobile_money',
        provider: provider // 'mtn', 'vodafone', or 'airteltigo'
      });

      if (response.success && (response.paymentUrl || response.authorizationUrl)) {
        const url = response.paymentUrl || response.authorizationUrl;
        // PWA Safe Redirect
        window.location.href = url!;
      } else {
        throw new Error(response.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('[GhanaModal] Error:', error);
      showError(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/10"
        style={{ 
          background: `linear-gradient(135deg, #ffffff 0%, #fefce8 100%)`,
        }}
      >
        {/* Animated Background Element */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-20 animate-pulse transition-colors duration-700"
          style={{ backgroundColor: currentProvider.color }}
        ></div>

        {/* Brand Header */}
        <div style={{ backgroundColor: GH_Colors.dark }} className="p-8 pb-12 relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Ghana <span style={{ color: currentProvider.color }}>Pay</span></h2>
              <p className="text-gray-400 text-[10px] font-black tracking-[0.3em] mt-1">KYSHI SECURE NETWORK</p>
            </div>
            <div className="text-4xl">{currentProvider.icon}</div>
          </div>
        </div>

        {/* Plan Details Card */}
        <div className="mx-8 -mt-8 bg-white/80 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-white/50 relative z-20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Weekly Plan</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[9px] font-black rounded-full">RECOMMENDED</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-gray-900 tracking-tighter">GHS {amount}</span>
            <span className="text-xs text-gray-400 font-bold mb-2">/ week</span>
          </div>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
            {/* Provider Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-2xl">
              {(Object.keys(PROVIDERS) as Provider[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setProvider(key)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                    provider === key 
                      ? 'bg-white shadow-md text-gray-900' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-white/50 px-6 py-4 border-2 border-gray-50 rounded-2xl focus:border-yellow-400 transition-all outline-none text-sm font-bold shadow-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="flex gap-2">
                  <div className="bg-white/50 px-5 py-4 rounded-2xl border-2 border-gray-50 font-black text-gray-400 text-sm shadow-sm">
                    +233
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="24 000 0000"
                    className="flex-1 bg-white/50 px-6 py-4 border-2 border-gray-50 rounded-2xl focus:border-yellow-400 transition-all outline-none text-sm font-bold shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: currentProvider.color, color: currentProvider.textColor }}
                className="w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? 'Processing...' : `Subscribe Now`}
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full mt-6 text-[10px] font-black text-gray-300 hover:text-gray-500 transition-colors uppercase tracking-[0.3em]"
              >
                CLOSE
              </button>
            </div>
          </form>
        )}

        {step === 'waiting' && (
          <div className="p-16 text-center space-y-8">
            <div className="relative inline-flex items-center justify-center">
              <div 
                className="w-24 h-24 border-8 border-gray-50 rounded-full animate-spin"
                style={{ borderTopColor: currentProvider.color }}
              ></div>
              <div className="absolute text-4xl animate-bounce">🇬🇭</div>
            </div>
            <div>
              <p className="text-xl font-black text-gray-900 uppercase">Redirecting...</p>
              <p className="text-xs text-gray-500 mt-2 font-bold px-8">Completing your connection to the {currentProvider.short} network.</p>
            </div>
          </div>
        )}

        <div className="p-6 text-center bg-gray-50/50">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">
            Fully Secure · Kyshi Ghana
          </p>
        </div>
      </div>
    </div>
  );
}
