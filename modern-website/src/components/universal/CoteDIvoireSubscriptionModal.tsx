"use client";

import { useState } from 'react';

const OrangeColors = {
  primary: '#FF6600',   // Orange - Official Orange Money color
  secondary: '#FF8533'
};

interface CoteDIvoireSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (phoneNumber: string, paymentMethod: string, country: string, frequency: string, amount: number, provider?: string) => Promise<void>;
}

export default function CoteDIvoireSubscriptionModal({ isOpen, onClose, onSubscribe }: CoteDIvoireSubscriptionModalProps) {
  const amount = 1000;
  const currency = 'XOF';
  
  const [provider, setProvider] = useState('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('form');
  const [language, setLanguage] = useState('fr');

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

  const handleSubmit = async () => {
    setStep('waiting');
    try {
      await onSubscribe(`225${phoneNumber.replace(/\s/g, '')}`, 'mobile_money', 'CI', 'weekly', amount, provider);
      setTimeout(() => setStep('success'), 2000);
      setTimeout(() => { onClose(); setStep('form'); setPhoneNumber(''); }, 5000);
    } catch (error) {
      alert(language === 'fr' ? 'Paiement échoué. Veuillez réessayer.' : 'Payment failed. Please try again.');
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
        
        <div style={{ backgroundColor: OrangeColors.primary }} className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{t.title}</h2>
              <p className="text-sm text-orange-100">{t.subtitle}</p>
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
            <span className="text-2xl">\ud83c\udf4a</span>
            <span className="font-semibold text-orange-800">Orange Money</span>
            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Hebdomadaire</span>
          </div>
        </div>

        <div className="p-6 text-center border-b">
          <div className="text-3xl font-bold">{t.price}</div>
          <div className="text-sm text-gray-500 mt-1">{t.period}</div>
          <div className="text-xs text-green-600 mt-2">\u2713 Frais inclus</div>
          <div className="text-xs text-gray-400 mt-1">\u21bb Facturé chaque semaine \u2022 Annulez à tout moment</div>
        </div>

        {step === 'form' && (
          <>
            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-3">{t.providerLabel}</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setProvider('orange')}
                  className={`flex-1 p-4 border rounded-xl text-center transition ${
                    provider === 'orange' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">\ud83c\udf4a</div>
                  <div className="font-semibold">Orange Money</div>
                  <div className="text-xs text-gray-500">Jusqu'à 1M FCFA</div>
                </button>
                <button
                  onClick={() => setProvider('mtn')}
                  className={`flex-1 p-4 border rounded-xl text-center transition ${
                    provider === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">\ud83d\udcf1</div>
                  <div className="font-semibold">MTN MoMo</div>
                  <div className="text-xs text-gray-500">Paiement instantané</div>
                </button>
              </div>
            </div>

            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-2">{t.phoneLabel}</label>
              <div className="flex">
                <span className="bg-gray-100 px-4 py-3 rounded-l-xl border text-gray-600">+225</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="flex-1 px-4 py-3 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{t.phoneHint}</p>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={handleSubmit}
                style={{ backgroundColor: OrangeColors.primary }}
                className="w-full hover:opacity-90 text-white py-3 rounded-xl font-semibold transition"
              >
                {t.button}
              </button>
            </div>
          </>
        )}

        {step === 'waiting' && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="font-medium text-gray-900">{t.waiting}</p>
            <p className="text-sm text-gray-500 mt-1">{t.waitingHint}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">\u2705</div>
            <p className="font-medium text-gray-900">{t.success}</p>
            <p className="text-sm text-gray-500 mt-1">{t.successHint}</p>
          </div>
        )}

        <div className="p-4 text-center text-xs text-gray-400 border-t">
          {t.footer}
        </div>
      </div>
    </div>
  );
}
