"use client";

import { useState } from 'react';
import { SubscriptionAPI, COUNTRY_PAYMENT_METHODS, getPlanIdForCountry } from '@/lib/subscription-api';
import { X } from 'lucide-react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const OrangeColors = {
  primary: '#FF6600',   // Orange - Official Orange Money color
  secondary: '#FF8533'
};

interface CoteDIvoireSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CoteDIvoireSubscriptionModal({ isOpen, onClose, onSuccess }: CoteDIvoireSubscriptionModalProps) {
  const { business } = useUnifiedAuth();
  const amount = COUNTRY_PAYMENT_METHODS.CI.defaultAmount;
  const currency = COUNTRY_PAYMENT_METHODS.CI.currency;
  
  const [provider, setProvider] = useState('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('form');
  const [language, setLanguage] = useState('fr');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');

  const texts = {
    fr: {
      title: 'Orange Money',
      subtitle: 'Propulsé par Kyshi',
      price: '1000 FCFA',
      period: 'abonnement hebdomadaire \u2022 renouvellement automatique tous les 7 jours',
      providerLabel: 'Choisissez votre opérateur',
      phoneLabel: 'Numéro Mobile Money',
      phonePlaceholder: '07 12 34 56 78',
      phoneHint: 'Vous recevrez une demande de paiement',
      button: 'Payer 1000 FCFA',
      waiting: 'Vérifiez votre téléphone',
      waitingHint: 'Entrez votre code PIN Orange Money',
      success: 'Abonnement hebdomadaire activé !',
      successHint: 'Vous serez débité de 1000 FCFA toutes les 7 jours',
      footer: 'Sécurisé par Kyshi \u2022 Transactions instantanées'
    },
    en: {
      title: 'Orange Money',
      subtitle: 'Powered by Kyshi',
      price: '1000 FCFA',
      period: 'weekly subscription \u2022 auto-renews every 7 days',
      providerLabel: 'Choose your network',
      phoneLabel: 'Mobile Money Number',
      phonePlaceholder: '07 12 34 56 78',
      phoneHint: 'You will receive a payment request',
      button: 'Pay 1000 FCFA',
      waiting: 'Check your phone',
      waitingHint: 'Enter your Orange Money PIN',
      success: 'Weekly subscription activated!',
      successHint: 'You will be charged 1000 FCFA every 7 days',
      footer: 'Secured by Kyshi \u2022 Instant transactions'
    }
  };

  const t = texts[language as keyof typeof texts];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email exists in business data
    if (!business?.email) {
      console.warn('No email found in business profile:', { business });
      alert(language === 'fr' ? 'Veuillez ajouter un e-mail à votre profil avant de vous abonner.' : 'Please add an email to your profile in Settings before subscribing.');
      return;
    }
    
    setStep('waiting');
    
    try {
      console.log(`Starting subscription for CI`);
      
      // Defensive check - ensure plans are loaded
      const plans = await SubscriptionAPI.getPlans('CI');
      if (!plans || plans.length === 0) {
        console.error('No plans available. Plans data:', plans);
        alert(language === 'fr' ? 'Aucun plan d\'abonnement disponible. Veuillez rafraîchir et réessayer.' : 'No subscription plans available. Please refresh and try again.');
        setStep('form');
        return;
      }
      
      console.log(`Available plans:`, plans.map(p => ({ id: p.id, country: p.country_code, amount: p.amount })));
      
      // Get plan ID for the country
      const planId = await getPlanIdForCountry('CI', amount);
      
      if (!planId) {
        console.error(`No plan ID found for CI`);
        alert(language === 'fr' ? 'Plan d\'abonnement non disponible pour la Côte d\'Ivoire. Veuillez contacter le support.' : 'Subscription plan not available for Côte d\'Ivoire. Please contact support.');
        setStep('form');
        return;
      }
      
      console.log(`Found plan ID: ${planId}`);
      
      // Extract user name from business settings or business name
      const userName = business.settings?.user_name || business.business_name || 'Customer';
      
      // Create subscription request
      const subscriptionRequest = {
        email: business.email,
        firstName: userName,
        lastName: '', // Not stored in our current schema
        phone: phoneNumber,
        countryCode: 'CI',
        planId,
        paymentMethod: paymentMethod === 'mobile_money' ? provider : paymentMethod
      };

      console.log('Creating subscription with email:', {
        email: business.email,
        businessName: business.business_name,
        userName,
        phone: phoneNumber
      });

      const response = await SubscriptionAPI.createSubscription(subscriptionRequest);
      
      if (response.success && response.authorizationUrl) {
        // Redirect to payment URL
        window.location.href = response.authorizationUrl;
      } else {
        setTimeout(() => setStep('success'), 2000);
        setTimeout(() => { 
          onSuccess?.(); 
          onClose(); 
          setStep('form'); 
          setPhoneNumber(''); 
        }, 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(language === 'fr' ? 'Paiement échoué. Veuillez réessayer.' : 'Payment failed. Please try again.');
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Full-screen Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden">
          
          {/* Header */}
          <div style={{ backgroundColor: OrangeColors.primary }} className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">{t.title}</h2>
                <p className="text-xs text-orange-100">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setLanguage(l => l === 'fr' ? 'en' : 'fr')}
                  className="text-xs bg-white/20 px-2 py-1 rounded-full text-white"
                >
                  {language === 'fr' ? 'GB' : 'FR'}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Provider Badge */}
          <div className="bg-orange-50 py-3 px-4 border-b border-orange-100">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg"></span>
              <span className="text-sm font-semibold text-orange-800">Orange Money</span>
              <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Hebdomadaire</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="py-4 text-center border-b">
            <div className="text-2xl font-bold">{t.price}</div>
            <div className="text-sm text-gray-500 mt-1">{t.period}</div>
            <div className="text-sm text-green-600 mt-2"> Frais inclus</div>
          </div>

          {/* Content */}
          <div className="p-4">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">{t.providerLabel}</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setProvider('orange')}
                      className={`flex-1 p-4 border rounded-lg text-center transition ${
                        provider === 'orange' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-2"></div>
                      <div className="text-sm font-semibold">Orange</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProvider('mtn')}
                      className={`flex-1 p-4 border rounded-lg text-center transition ${
                        provider === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-2"></div>
                      <div className="text-sm font-semibold">MTN</div>
                    </button>
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.phoneLabel}</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-3 rounded-l-lg border text-gray-600 text-sm">+225</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="flex-1 px-3 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t.phoneHint}</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{ backgroundColor: OrangeColors.primary }}
                  className="w-full hover:opacity-90 text-white py-3 rounded-lg font-semibold transition"
                >
                  {t.button}
                </button>
              </form>
            )}

            {/* Waiting State */}
            {step === 'waiting' && (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-900">{t.waiting}</p>
                <p className="text-sm text-gray-500 mt-2">{t.waitingHint}</p>
              </div>
            )}

            {/* Success State */}
            {step === 'success' && (
              <div className="py-8 text-center">
                <div className="text-4xl mb-4"></div>
                <p className="text-lg font-medium text-gray-900">{t.success}</p>
                <p className="text-sm text-gray-500 mt-2">{t.successHint}</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="py-3 text-center text-xs text-gray-400 border-t">
            {t.footer}
          </div>
        </div>
      </div>
    </>
  );
}
