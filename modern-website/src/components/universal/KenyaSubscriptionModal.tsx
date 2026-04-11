"use client";

import { useState } from 'react';

const MpesaColors = {
  primary: '#1B5E20',  // Dark Green - Official M-Pesa color
  secondary: '#4CAF50',
  text: '#FFFFFF'
};

interface KenyaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (phoneNumber: string, paymentMethod: string, country: string, frequency: string, amount: number) => Promise<void>;
}

export default function KenyaSubscriptionModal({ isOpen, onClose, onSubscribe }: KenyaSubscriptionModalProps) {
  const amount = 200;
  const currency = 'KES';
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('form');
  const [language, setLanguage] = useState('en');

  const texts = {
    en: {
      title: 'Lipa na M-Pesa',
      subtitle: 'Powered by Kyshi',
      price: 'KES 200',
      period: 'weekly subscription \u2022 auto-renews every 7 days',
      phoneLabel: 'M-Pesa Phone Number',
      phonePlaceholder: '712 345 678',
      phoneHint: 'You will receive an STK Push on this number',
      button: 'Pay KES 200',
      waiting: 'Check your phone',
      waitingHint: 'Enter your M-Pesa PIN to complete',
      success: 'Weekly subscription activated!',
      successHint: 'You will be charged KES 200 every 7 days',
      footer: 'Secured by Kyshi \u2022 Protected by Safaricom'
    },
    sw: {
      title: 'Lipa kwa M-Pesa',
      subtitle: 'Inaendeshwa na Kyshi',
      price: 'KES 200',
      period: 'usajili wa kila wiki \u2022 hujirudia kila siku 7',
      phoneLabel: 'Nambari ya Simu ya M-Pesa',
      phonePlaceholder: '712 345 678',
      phoneHint: 'Utapokea STK Push kwenye nambari hii',
      button: 'Lipia KES 200',
      waiting: 'Angalia simu yako',
      waitingHint: 'Weka PIN yako ya M-Pesa kukamilisha',
      success: 'Usajili wa wiki umeanzishwa!',
      successHint: 'Utatozwa KES 200 kila baada ya siku 7',
      footer: 'Imelindwa na Kyshi \u2022 Safaricom'
    }
  };

  const t = texts[language as keyof typeof texts];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('waiting');
    try {
      await onSubscribe(`254${phoneNumber}`, 'mpesa', 'KE', 'weekly', amount);
      setTimeout(() => setStep('success'), 2000);
      setTimeout(() => { onClose(); setStep('form'); setPhoneNumber(''); }, 5000);
    } catch (error) {
      alert('Payment failed. Please try again.');
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] shadow-xl overflow-hidden flex flex-col">
        
        <div style={{ backgroundColor: MpesaColors.primary }} className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{t.title}</h2>
              <p className="text-sm text-green-200">{t.subtitle}</p>
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
            <span className="text-2xl">\ud83d\udcf1</span>
            <span className="font-semibold text-green-800">Lipa na M-Pesa</span>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Weekly</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 text-center border-b">
          <div className="text-2xl sm:text-3xl font-bold">{t.price}</div>
          <div className="text-sm text-gray-500 mt-1">{t.period}</div>
          <div className="text-xs text-green-600 mt-2">\u2713 VAT included \u2022 No hidden fees</div>
          <div className="text-xs text-gray-400 mt-1">\u21bb Billed every 7 days \u2022 Cancel anytime</div>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 flex-1 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium mb-2">{t.phoneLabel}</label>
              <div className="flex">
                <span className="bg-gray-100 px-4 py-3 rounded-l-xl border border-r-0 text-gray-600">+254</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder={t.phonePlaceholder}
                  className="flex-1 px-4 py-3 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{t.phoneHint}</p>
            </div>

            <button
              type="submit"
              style={{ backgroundColor: MpesaColors.primary }}
              className="w-full hover:opacity-90 text-white py-3 rounded-xl font-semibold text-lg transition"
            >
              {t.button}
            </button>
          </form>
        )}

        {step === 'waiting' && (
          <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="font-medium text-gray-900">{t.waiting}</p>
            <p className="text-sm text-gray-500 mt-1">{t.waitingHint}</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center">
            <div className="text-4xl sm:text-5xl mb-4">\u2705</div>
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
