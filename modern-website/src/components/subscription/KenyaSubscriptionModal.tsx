'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionAPI } from '@/lib/subscription-api';
import { useToastContext } from '@/providers/ToastProvider';
import { useLanguage } from '@/hooks/LanguageContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const MpesaColors = {
  primary: '#1B5E20',
  secondary: '#4CAF50',
  text: '#FFFFFF'
};

interface KenyaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function KenyaSubscriptionModal({ isOpen, onClose, onSuccess }: KenyaSubscriptionModalProps) {
  const { t } = useLanguage();
  const { showSuccess, showError } = useToastContext();
  const { user } = useUnifiedAuth();
  const amount = 200;
  const currency = 'KES';
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'form' | 'waiting' | 'success'>('form');
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [planId, setPlanId] = useState<string | null>(null);

  const userName = user?.business_name || 'Customer';

  const texts = {
    en: {
      title: 'Lipa na M-Pesa',
      subtitle: 'Powered by Kyshi',
      price: 'KES 200',
      period: 'weekly subscription auto-renews every 7 days',
      emailLabel: 'Email Address',
      emailPlaceholder: 'john@example.com',
      emailHint: 'We\'ll send your subscription confirmation here',
      phoneLabel: 'M-Pesa Phone Number',
      phonePlaceholder: '712 345 678',
      phoneHint: 'You will receive an STK Push on this number',
      button: 'Pay KES 200',
      waiting: 'Check your phone',
      waitingHint: 'Enter your M-Pesa PIN to complete',
      success: 'Weekly subscription activated!',
      successHint: 'You will be charged KES 200 every 7 days',
      footer: 'Secured by Kyshi Protected by Safaricom'
    },
    sw: {
      title: 'Lipa kwa M-Pesa',
      subtitle: 'Inaendeshwa na Kyshi',
      price: 'KES 200',
      period: 'usajili wa kila wiki hujirudia kila siku 7',
      emailLabel: 'Anwani ya Barua pepe',
      emailPlaceholder: 'john@example.com',
      emailHint: 'Tutakutumia thibitisho ya usajili hapa',
      phoneLabel: 'Nambari ya Simu ya M-Pesa',
      phonePlaceholder: '712 345 678',
      phoneHint: 'Utapokea STK Push kwenye nambari hii',
      button: 'Lipia KES 200',
      waiting: 'Angalia simu yako',
      waitingHint: 'Weka PIN yako ya M-Pesa kukamilisha',
      success: 'Usajili wa wiki umeanzishwa!',
      successHint: 'Utatozwa KES 200 kila baada ya siku 7',
      footer: 'Imelindwa na Kyshi Safaricom'
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
      const plans = await SubscriptionAPI.getPlans('KE');
      if (plans && plans.length > 0) {
        setPlanId(plans[0].id);
        console.log(' Kenya plan loaded:', plans[0]);
      }
    } catch (error) {
      console.error('Failed to load plan:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        countryCode: 'KE',
        planId: planId,
        paymentMethod: 'mpesa',
        phone: `254${phoneNumber}`,
      });

      console.log('Kyshi payment initiated:', result);

      if (result.authorizationUrl) {
        // Open payment URL in new tab (PWA-safe)
        window.open(result.authorizationUrl, '_blank', 'noopener,noreferrer');
        setStep('waiting');
        showSuccess('Payment opened in new tab. Complete payment and return here.');
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
      console.error('M-Pesa payment error:', error);
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
        
        <div style={{ backgroundColor: MpesaColors.primary }} className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{currentTexts.title}</h2>
              <p className="text-sm text-green-200">{currentTexts.subtitle}</p>
            </div>
            <button 
              onClick={() => setLanguage(l => l === 'en' ? 'sw' : 'en')}
              className="text-sm bg-white/20 px-3 py-1 rounded-full text-white"
            >
              {language === 'en' ? 'Kiswahili' : 'English'}
            </button>
          </div>
        </div>

        <div className="bg-green-50 p-3 text-center border-b border-green-100">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl"></span>
            <span className="font-semibold text-green-800">Lipa na M-Pesa</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Weekly</span>
          </div>
        </div>

        <div className="p-6 text-center border-b">
          <div className="text-3xl font-bold">{currentTexts.price}</div>
          <div className="text-sm text-gray-500 mt-1">{currentTexts.period}</div>
          <div className="text-xs text-green-600 mt-2"> VAT included No hidden fees</div>
          <div className="text-xs text-gray-400 mt-1"> Billed every 7 days Cancel anytime</div>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">{currentTexts.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={currentTexts.emailPlaceholder}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">{currentTexts.emailHint}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">{currentTexts.phoneLabel}</label>
              <div className="flex">
                <span className="bg-gray-100 px-4 py-3 rounded-l-xl border border-r-0 text-gray-600">+254</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder={currentTexts.phonePlaceholder}
                  className="flex-1 px-4 py-3 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{currentTexts.phoneHint}</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: MpesaColors.primary }}
              className="w-full hover:opacity-90 text-white py-3 rounded-xl font-semibold text-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : currentTexts.button}
            </button>
          </form>
        )}

        {step === 'waiting' && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="font-medium text-gray-900">{currentTexts.waiting}</p>
            <p className="text-sm text-gray-500 mt-1">{currentTexts.waitingHint}</p>
            <p className="text-xs text-gray-400 mt-4">Request sent to +254 {phoneNumber}</p>
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
