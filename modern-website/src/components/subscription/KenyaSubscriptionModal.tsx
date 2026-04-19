'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionAPI, COUNTRY_PAYMENT_METHODS } from '@/lib/subscription-api';
import { useToastContext } from '@/providers/ToastProvider';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

/**
 * KenyaSubscriptionModal
 * Optimized for PWA with same-tab redirection and secure server-side verification.
 */

const MpesaColors = {
  primary: '#1B5E20', // Safaricom Green
  secondary: '#4CAF50',
  accent: '#EAB308', // Gold
  glass: 'rgba(255, 255, 255, 0.9)',
};

interface KenyaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function KenyaSubscriptionModal({ isOpen, onClose, onSuccess }: KenyaSubscriptionModalProps) {
  const { showSuccess, showError } = useToastContext();
  const { business } = useUnifiedAuth();
  const amount = COUNTRY_PAYMENT_METHODS.KE.defaultAmount;
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [isLoading, setIsLoading] = useState(false);

  const businessName = business?.business_name || 'Beezee Customer';

  const texts = {
    en: {
      title: 'Lipa na M-Pesa',
      subtitle: 'Powered by Kyshi Secure',
      price: 'KES 200',
      period: 'Weekly subscription auto-renews every 7 days',
      emailLabel: 'Email Address',
      emailPlaceholder: 'your@email.com',
      emailHint: 'Confirmation will be sent here',
      phoneLabel: 'M-Pesa Number',
      phonePlaceholder: '712 345 678',
      phoneHint: 'You will receive an STK Push to enter your PIN',
      button: 'Subscribe Now',
      waiting: 'Check your phone',
      waitingHint: 'A prompt has been sent to your M-Pesa',
      success: 'Subscription Active!',
      successHint: 'You now have full access to Beezee features',
      footer: 'Secured by Kyshi • Fast & Encrypted'
    },
    sw: {
      title: 'Lipa kwa M-Pesa',
      subtitle: 'Inaendeshwa na Kyshi',
      price: 'KES 200',
      period: 'Usajili wa kila wiki hujirudia kila siku 7',
      emailLabel: 'Barua pepe',
      emailPlaceholder: 'yako@email.com',
      emailHint: 'Thibitisho itatumwa hapa',
      phoneLabel: 'Nambari ya M-Pesa',
      phonePlaceholder: '712 345 678',
      phoneHint: 'Utapokea STK Push kuweka PIN yako',
      button: 'Jisajili Sasa',
      waiting: 'Angalia simu yako',
      waitingHint: 'Ombi limetumwa kwa M-Pesa yako',
      success: 'Usajili Umekamilika!',
      successHint: 'Sasa una ufikiaji kamili wa huduma za Beezee',
      footer: 'Imelindwa na Kyshi • Haraka na Siri'
    }
  };

  const t = texts[language];

  // Set default email from business if available
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

    if (!phoneNumber || phoneNumber.length < 9) {
      showError('Please enter a valid M-Pesa number');
      return;
    }

    setIsLoading(true);
    setStep('waiting');
    
    try {
      // Use 'Kenya' as country string to match Edge Function COUNTRY_CONFIG keys
      const response = await SubscriptionAPI.createSubscription({
        email: email,
        firstName: businessName,
        lastName: 'Customer',
        phone: `254${phoneNumber.replace(/^0/, '')}`, // Ensure format 254...
        countryCode: 'Kenya', // <--- Matches Edge Function map
        paymentMethod: 'mobile_money'
      });
      
      if (response.success && (response.paymentUrl || response.authorizationUrl)) {
        const url = response.paymentUrl || response.authorizationUrl;
        // PWA Safe: Redirect in same tab
        window.location.href = url!;
      } else {
        throw new Error(response.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Kenya subscription error:', error);
      showError(error instanceof Error ? error.message : 'Something went wrong');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-white/20"
        style={{ 
          background: `linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)`,
        }}
      >
        {/* Header Section */}
        <div style={{ backgroundColor: MpesaColors.primary }} className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/20 rounded-full blur-2xl -ml-12 -mb-12"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{t.title}</h2>
              <p className="text-green-100 text-sm font-medium opacity-90">{t.subtitle}</p>
            </div>
            <button 
              onClick={() => setLanguage(l => l === 'en' ? 'sw' : 'en')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all transform active:scale-95 border border-white/10"
            >
              {language === 'en' ? 'SWAHILI' : 'ENGLISH'}
            </button>
          </div>
        </div>

        {/* Pricing Badge */}
        <div className="py-8 text-center bg-white/50 backdrop-blur-sm border-b border-green-50">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-green-100 rounded-full text-green-700 text-xs font-bold mb-3">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            WEEKLY PLAN
          </div>
          <div className="text-5xl font-black text-gray-900 tracking-tighter">
            {t.price}
          </div>
          <p className="text-sm text-gray-500 mt-2 font-medium max-w-[250px] mx-auto leading-tight">
            {t.period}
          </p>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.emailLabel}</label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full bg-gray-50 px-5 py-4 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-300 shadow-sm"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <span className="text-green-500 font-bold">✓</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{t.phoneLabel}</label>
                <div className="flex gap-2">
                  <div className="bg-gray-100 px-4 py-4 rounded-2xl border-2 border-transparent font-bold text-gray-600 flex items-center shadow-sm">
                    +254
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={t.phonePlaceholder}
                    className="flex-1 bg-gray-50 px-5 py-4 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-500 transition-all outline-none text-gray-900 placeholder:text-gray-300 shadow-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic px-1">{t.phoneHint}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: MpesaColors.primary }}
                className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Processing...</span>
                  </div>
                ) : t.button}
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
              >
                NOT NOW
              </button>
            </div>
          </form>
        )}

        {step === 'waiting' && (
          <div className="p-12 text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">📱</span>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{t.waiting}</p>
              <p className="text-sm text-gray-500 mt-2">{t.waitingHint}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl">
              <p className="text-xs font-medium text-green-700">Request sent to +254 {phoneNumber}</p>
            </div>
          </div>
        )}

        <div className="p-6 text-center border-t border-gray-100 bg-gray-50/50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
}
