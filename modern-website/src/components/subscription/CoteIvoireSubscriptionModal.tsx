'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionAPI, COUNTRY_PAYMENT_METHODS } from '@/lib/subscription-api';
import { useToastContext } from '@/providers/ToastProvider';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

/**
 * CoteIvoireSubscriptionModal
 * Optimized for PWA with same-tab redirection and secure server-side verification.
 * Supports both Orange Money and MTN MoMo.
 */

const CI_Colors = {
  orange: '#FF6600', // Orange Money Color
  mtn: '#FFCC00',   // MTN Yellow
  dark: '#1A1A1A',
  glass: 'rgba(255, 255, 255, 0.95)',
};

interface CoteIvoireSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CoteIvoireSubscriptionModal({ isOpen, onClose, onSuccess }: CoteIvoireSubscriptionModalProps) {
  const { showSuccess, showError } = useToastContext();
  const { business } = useUnifiedAuth();
  const amount = COUNTRY_PAYMENT_METHODS.CI.defaultAmount;
  
  const [provider, setProvider] = useState<'orange' | 'mtn'>('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  const businessName = business?.business_name || 'Beezee Customer';

  const texts = {
    fr: {
      title: 'Côte d\'Ivoire Pay',
      subtitle: 'Sécurisé par Kyshi',
      price: '1 000 FCFA',
      period: 'Abonnement hebdomadaire (chaque 7 jours)',
      emailLabel: 'Adresse E-mail',
      emailPlaceholder: 'votre@email.com',
      emailHint: 'Confirmation envoyée ici',
      providerLabel: 'Opérateur',
      phoneLabel: 'Numéro Mobile Money',
      phonePlaceholder: '07 00 00 00 00',
      phoneHint: 'Vous recevrez une demande de validation sur votre mobile',
      button: 'S\'abonner Maintenant',
      waiting: 'Validation en cours',
      waitingHint: 'Veuillez vérifier votre téléphone pour confirmer le paiement',
      footer: 'Transactions sécurisées et cryptées'
    },
    en: {
      title: 'Côte d\'Ivoire Pay',
      subtitle: 'Powered by Kyshi Secure',
      price: '1,000 FCFA',
      period: 'Weekly subscription auto-renews every 7 days',
      emailLabel: 'Email Address',
      emailPlaceholder: 'your@email.com',
      emailHint: 'Confirmation will be sent here',
      providerLabel: 'Network Provider',
      phoneLabel: 'Mobile Money Number',
      phonePlaceholder: '07 00 00 00 00',
      phoneHint: 'You will receive a prompt on your phone to confirm',
      button: 'Subscribe Now',
      waiting: 'Validating Payment',
      waitingHint: 'Please check your phone to authorize the transaction',
      footer: 'Secure & Encrypted Transactions'
    }
  };

  const t = texts[language];

  useEffect(() => {
    if (isOpen && business?.email && !email) {
      setEmail(business.email);
    }
  }, [isOpen, business, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      showError(language === 'fr' ? 'Email invalide' : 'Invalid email');
      return;
    }

    if (!phoneNumber || phoneNumber.replace(/\s/g, '').length < 8) {
      showError(language === 'fr' ? 'Numéro invalide' : 'Invalid number');
      return;
    }

    setIsLoading(true);
    setStep('waiting');
    
    try {
      // Use 'CoteDIvoire' to match Edge Function keys
      const response = await SubscriptionAPI.createSubscription({
        email: email,
        firstName: businessName,
        lastName: 'Customer',
        phone: `225${phoneNumber.replace(/\s/g, '')}`, 
        countryCode: 'CoteDIvoire', // <--- Matches Edge Function map
        paymentMethod: 'mobile_money',
        provider: provider === 'orange' ? 'orange-money' : 'mtn'
      });
      
      if (response.success && (response.paymentUrl || response.authorizationUrl)) {
        const url = response.paymentUrl || response.authorizationUrl;
        // PWA Safe Redirect
        window.location.href = url!;
      } else {
        throw new Error(response.message || 'Error initialized payment');
      }
    } catch (error) {
      console.error('CI subscription error:', error);
      showError(error instanceof Error ? error.message : 'Something went wrong');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentProviderColor = provider === 'orange' ? CI_Colors.orange : CI_Colors.mtn;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-white/20"
        style={{ 
          background: `linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)`,
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: CI_Colors.dark }} className="p-8 relative overflow-hidden">
          <div 
            className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 transition-colors duration-500"
            style={{ backgroundColor: currentProviderColor }}
          ></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight italic uppercase">Beezee <span style={{ color: currentProviderColor }}>Pro</span></h2>
              <p className="text-gray-400 text-xs font-bold tracking-widest mt-1">{t.subtitle}</p>
            </div>
            <button 
              onClick={() => setLanguage(l => l === 'fr' ? 'en' : 'fr')}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black text-white transition-all border border-white/5 active:scale-95"
            >
              {language === 'fr' ? 'ENGLISH' : 'FRANÇAIS'}
            </button>
          </div>
        </div>

        {/* Amount Card */}
        <div className="mx-6 -mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 flex items-center justify-between relative z-20">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.title}</p>
            <h3 className="text-3xl font-black text-gray-900">{t.price}</h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block mb-1">AUTOMATIQUE</p>
            <p className="text-[10px] text-gray-400 font-bold">CHAQUE 7 JOURS</p>
          </div>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
            {/* Provider Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setProvider('orange')}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                  provider === 'orange' ? 'bg-white shadow-sm text-[#FF6600]' : 'text-gray-400'
                }`}
              >
                ORANGE MONEY
              </button>
              <button
                type="button"
                onClick={() => setProvider('mtn')}
                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                  provider === 'mtn' ? 'bg-[#FFCC00] shadow-sm text-black' : 'text-gray-400'
                }`}
              >
                MTN MoMo
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.emailLabel}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-gray-50/50 px-5 py-4 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 transition-all outline-none text-gray-900 font-medium"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{t.phoneLabel}</label>
                <div className="flex gap-2">
                  <div className="bg-gray-100/80 px-4 py-4 rounded-2xl font-bold text-gray-500 flex items-center">
                    +225
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="07 -- -- -- --"
                    className="flex-1 bg-gray-50/50 px-5 py-4 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 transition-all outline-none text-gray-900 font-medium"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: currentProviderColor, color: provider === 'mtn' ? 'black' : 'white' }}
                className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className={`w-4 h-4 border-2 ${provider === 'mtn' ? 'border-black/20 border-t-black' : 'border-white/20 border-t-white'} rounded-full animate-spin`}></span>
                    CHARGEMENT...
                  </span>
                ) : t.button}
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="w-full mt-6 text-[10px] font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-[0.2em]"
              >
                ANNULER
              </button>
            </div>
          </form>
        )}

        {step === 'waiting' && (
          <div className="p-12 text-center space-y-8">
            <div className="relative inline-flex items-center justify-center">
              <div 
                className="w-24 h-24 border-8 border-gray-50 rounded-full animate-spin"
                style={{ borderTopColor: currentProviderColor }}
              ></div>
              <div className="absolute font-black text-xl animate-pulse">🇨🇮</div>
            </div>
            <div>
              <p className="text-xl font-black text-gray-900 tracking-tight">{t.waiting}</p>
              <p className="text-sm text-gray-500 mt-3 font-medium px-6">{t.waitingHint}</p>
            </div>
          </div>
        )}

        <div className="p-6 text-center bg-gray-50/50">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
}
