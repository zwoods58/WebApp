'use client';

import { useState } from 'react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToastContext } from '@/providers/ToastProvider';

const T = {
  fr: { 
    title:"Abonnement Hebdomadaire", 
    perWeek:"par semaine", 
    emailLabel:"Adresse e-mail", 
    emailPlaceholder:"vous@exemple.com", 
    emailHint:"Rappels de paiement envoyés ici", 
    networkLabel:"Choisissez votre réseau", 
    phoneLabel:"Numéro Mobile Money", 
    phoneHint:"Vous serez redirigé vers la page de paiement", 
    payButton:"Payer 1 000 FCFA", 
    initializing:"Initialisation...", 
    redirecting:"Redirection...", 
    successTitle:"Abonnement Activé!", 
    emailError:"Email invalide", 
    phoneError:"Numéro invalide" 
  },
  en: { 
    title:"Weekly Subscription", 
    perWeek:"per week", 
    emailLabel:"Email Address", 
    emailPlaceholder:"you@example.com", 
    emailHint:"Payment reminders sent here", 
    networkLabel:"Choose your network", 
    phoneLabel:"Mobile Money Number", 
    phoneHint:"You will be redirected to complete payment", 
    payButton:"Pay 1,000 FCFA", 
    initializing:"Initializing...", 
    redirecting:"Redirecting...", 
    successTitle:"Subscription Activated!", 
    emailError:"Invalid email", 
    phoneError:"Invalid phone number" 
  }
};

interface CoteIvoireSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Provider {
  name: string;
  color: string;
  textColor: string;
}

const providers: Record<string, Provider> = {
  orange: {
    name: 'Orange Money',
    color: '#FF6600',
    textColor: 'white'
  },
  mtn: {
    name: 'MTN MoMo',
    color: '#EAB308',
    textColor: 'black'
  }
};

export default function CoteIvoireSubscriptionModal({ isOpen, onClose, onSuccess }: CoteIvoireSubscriptionModalProps) {
  const { user } = useUnifiedAuth();
  const { showSuccess, showError } = useToastContext();
  
  const [provider, setProvider] = useState<'orange' | 'mtn'>('orange');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);

  const t = T[language];

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      showError(t.emailError);
      return;
    }

    if (!phoneNumber || phoneNumber.length < 8) {
      showError(t.phoneError);
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
          user_phone: '225' + phoneNumber,
          user_name: user?.business_name || 'Customer',
          country: 'CI'
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
    
    setProvider('orange');
    setLanguage('fr');
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
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          className="absolute top-4 right-4 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
        >
          {language === 'fr' ? 'EN' : 'FR'}
        </button>

        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-gray-600">1 000 FCFA {t.perWeek} • Cancel anytime</p>
        </div>

        {step === 'form' && (
          <>
            {/* Provider Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.networkLabel}</label>
              <div className="space-y-2">
                {Object.entries(providers).map(([key, prov]) => (
                  <button
                    key={key}
                    onClick={() => setProvider(key as 'orange' | 'mtn')}
                    className="w-full p-3 border rounded-lg flex items-center justify-between transition-colors"
                    style={{
                      borderColor: provider === key ? prov.color : '#e5e7eb',
                      backgroundColor: provider === key ? prov.color + '10' : 'white'
                    }}
                  >
                    <span className="font-medium">{prov.name}</span>
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{
                        borderColor: prov.color,
                        backgroundColor: provider === key ? prov.color : 'transparent'
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">{t.emailHint}</p>
            </div>

            {/* Phone Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.phoneLabel}</label>
              <div className="flex">
                <div className="px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                  +225
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="0700000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{t.phoneHint}</p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: providers[provider].color }}
            >
              {isLoading ? t.initializing : t.payButton}
            </button>
          </>
        )}

        {step === 'waiting' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.redirecting}</h3>
            <p className="text-gray-600">You will be redirected to {providers[provider].name} to complete your payment.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.successTitle}</h3>
            <p className="text-gray-600">Your subscription is now active.</p>
          </div>
        )}
      </div>
    </div>
  );
}
