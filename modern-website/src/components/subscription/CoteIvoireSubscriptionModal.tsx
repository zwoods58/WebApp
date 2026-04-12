'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionAPI } from '@/lib/subscription-api';
import { useToastContext } from '@/providers/ToastProvider';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const OrangeColors = {
  primary: '#FF6600',
  secondary: '#FF8533'
};

interface CoteIvoireSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CoteIvoireSubscriptionModal({ isOpen, onClose, onSuccess }: CoteIvoireSubscriptionModalProps) {
  const { showSuccess, showError } = useToastContext();
  const { user } = useUnifiedAuth();
  const amount = 1000;
  
  const [provider, setProvider] = useState<'orange' | 'mtn'>('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [planId, setPlanId] = useState<string | null>(null);

  const userName = user?.business_name || 'Customer';

  const texts = {
    fr: {
      title: 'Orange Money',
      subtitle: 'Propulsé par Kyshi',
      price: '1000 FCFA',
      period: 'abonnement hebdomadaire renouvellement automatique tous les 7 jours',
      emailLabel: 'Adresse e-mail',
      emailPlaceholder: 'john@example.com',
      emailHint: 'Nous vous enverrons la confirmation ici',
      providerLabel: 'Choisissez votre opérateur',
      phoneLabel: 'Numéro Mobile Money',
      phonePlaceholder: '07 12 34 56 78',
      phoneHint: 'Vous recevrez une demande de paiement',
      button: 'Payer 1000 FCFA',
      waiting: 'Vérifiez votre téléphone',
      waitingHint: 'Entrez votre code PIN',
      success: 'Abonnement hebdomadaire activé !',
      successHint: 'Vous serez débité de 1000 FCFA toutes les 7 jours',
      footer: 'Sécurisé par Kyshi Transactions instantanées'
    },
    en: {
      title: 'Orange Money',
      subtitle: 'Powered by Kyshi',
      price: '1000 FCFA',
      period: 'weekly subscription auto-renews every 7 days',
      emailLabel: 'Email Address',
      emailPlaceholder: 'john@example.com',
      emailHint: 'We\'ll send your subscription confirmation here',
      providerLabel: 'Choose your network',
      phoneLabel: 'Mobile Money Number',
      phonePlaceholder: '07 12 34 56 78',
      phoneHint: 'You will receive a payment request',
      button: 'Pay 1000 FCFA',
      waiting: 'Check your phone',
      waitingHint: 'Enter your PIN',
      success: 'Weekly subscription activated!',
      successHint: 'You will be charged 1000 FCFA every 7 days',
      footer: 'Secured by Kyshi Instant transactions'
    }
  };

  const currentTexts = texts[language];

  useEffect(() => {
    if (isOpen) {
      fetchPlanId();
    }
  }, [isOpen]);

  const fetchPlanId = async () => {
    try {
      const plans = await SubscriptionAPI.getPlans('CI');
      if (plans && plans.length > 0) {
        setPlanId(plans[0].id);
        console.log(' Côte d\'Ivoire plan loaded:', plans[0]);
      }
    } catch (error) {
      console.error('Failed to load plan:', error);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      showError(currentTexts === texts.fr ? 'Veuillez entrer un numéro valide' : 'Please enter a valid number');
      return;
    }

    if (!planId) {
      showError('Loading subscription plan. Please try again.');
      return;
    }

    if (!email || !email.includes('@')) {
      showError(currentTexts === texts.fr ? 'Veuillez entrer une adresse e-mail valide' : 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setStep('waiting');

    try {
      const result = await SubscriptionAPI.createSubscription({
        email: email,
        firstName: userName,
        lastName: 'Customer',
        countryCode: 'CI',
        planId: planId,
        paymentMethod: 'mobile_money',
        phone: `225${phoneNumber.replace(/\s/g, '')}`,
      });

      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      } else if (result.success) {
        setStep('success');
        showSuccess(currentTexts.success);
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
        
        <div style={{ backgroundColor: OrangeColors.primary }} className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{currentTexts.title}</h2>
              <p className="text-sm text-orange-100">{currentTexts.subtitle}</p>
            </div>
            <button 
              onClick={() => setLanguage(l => l === 'fr' ? 'en' : 'fr')}
              className="text-sm bg-white/20 px-3 py-1 rounded-full text-white"
            >
              {language === 'fr' ? 'English' : 'Français'}
            </button>
          </div>
        </div>

        <div className="bg-orange-50 p-3 text-center border-b border-orange-100">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl"></span>
            <span className="font-semibold text-orange-800">Orange Money</span>
            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Hebdomadaire</span>
          </div>
        </div>

        <div className="p-6 text-center border-b">
          <div className="text-3xl font-bold">{currentTexts.price}</div>
          <div className="text-sm text-gray-500 mt-1">{currentTexts.period}</div>
          <div className="text-xs text-green-600 mt-2"> Frais inclus</div>
          <div className="text-xs text-gray-400 mt-1"> Facturé chaque semaine Annulez à tout moment</div>
        </div>

        {step === 'form' && (
          <>
            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-2">{currentTexts.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentTexts.emailPlaceholder}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-2">{currentTexts.emailHint}</p>
            </div>

            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-3">{currentTexts.providerLabel}</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setProvider('orange')}
                  className={`flex-1 p-4 border rounded-xl text-center transition ${
                    provider === 'orange' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1"></div>
                  <div className="font-semibold">Orange Money</div>
                  <div className="text-xs text-gray-500">Jusqu'à 1M FCFA</div>
                </button>
                <button
                  onClick={() => setProvider('mtn')}
                  className={`flex-1 p-4 border rounded-xl text-center transition ${
                    provider === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1"></div>
                  <div className="font-semibold">MTN MoMo</div>
                  <div className="text-xs text-gray-500">Paiement instantané</div>
                </button>
              </div>
            </div>

            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-2">{currentTexts.phoneLabel}</label>
              <div className="flex">
                <span className="bg-gray-100 px-4 py-3 rounded-l-xl border text-gray-600">+225</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={currentTexts.phonePlaceholder}
                  className="flex-1 px-4 py-3 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isLoading}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{currentTexts.phoneHint}</p>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{ backgroundColor: OrangeColors.primary }}
                className="w-full hover:opacity-90 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : currentTexts.button}
              </button>
            </div>
          </>
        )}

        {step === 'waiting' && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="font-medium text-gray-900">{currentTexts.waiting}</p>
            <p className="text-sm text-gray-500 mt-1">{currentTexts.waitingHint}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4"></div>
            <p className="font-medium text-gray-900">{currentTexts.success}</p>
            <p className="text-sm text-gray-500 mt-1">{currentTexts.successHint}</p>
          </div>
        )}

        <div className="p-4 text-center text-xs text-gray-400 border-t">
          {currentTexts.footer}
        </div>
      </div>
    </div>
  );
}
