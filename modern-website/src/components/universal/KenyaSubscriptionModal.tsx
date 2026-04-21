"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { COUNTRY_PAYMENT_METHODS } from '@/lib/subscription-api';
// Kyshi API functions removed - no longer available
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const MpesaColors = {
  primary: '#1B5E20',  // Dark Green - Official M-Pesa color
  secondary: '#4CAF50',
  text: '#FFFFFF'
};

interface KenyaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function KenyaSubscriptionModal({ isOpen, onClose, onSuccess }: KenyaSubscriptionModalProps) {
  const { business } = useSupabaseAuth();
  const amount = COUNTRY_PAYMENT_METHODS.KE.defaultAmount;
  const currency = COUNTRY_PAYMENT_METHODS.KE.currency;
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('form');
  const [language, setLanguage] = useState('en');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [mobileProvider, setMobileProvider] = useState('m-pesa');

  const texts = {
    en: {
      title: 'Lipa na M-Pesa',
      subtitle: 'Secure payment processing',
      price: `KES ${amount}`,
      period: 'weekly subscription \u2022 auto-renews every 7 days',
      phoneLabel: 'M-Pesa Phone Number',
      phonePlaceholder: '712 345 678',
      phoneHint: 'You will receive an STK Push on this number',
      button: `Pay KES ${amount}`,
      waiting: 'Check your phone',
      waitingHint: 'Enter your M-Pesa PIN to complete',
      success: 'Weekly subscription activated!',
      successHint: `You will be charged KES ${amount} every 7 days`,
      footer: 'Secure payment processing • Protected by Safaricom'
    },
    sw: {
      title: 'Lipa kwa M-Pesa',
      subtitle: 'Usindikaji salama wa malipo',
      price: `KES ${amount}`,
      period: 'usajili wa kila wiki \u2022 hujirudia kila siku 7',
      phoneLabel: 'Nambari ya Simu ya M-Pesa',
      phonePlaceholder: '712 345 678',
      phoneHint: 'Utapokea STK Push kwenye nambari hii',
      button: `Lipia KES ${amount}`,
      waiting: 'Angalia simu yako',
      waitingHint: 'Weka PIN yako ya M-Pesa kukamilisha',
      success: 'Usajili wa wiki umeanzishwa!',
      successHint: `Utatozwa KES ${amount} kila baada ya siku 7`,
      footer: 'Usindikaji salama • Safaricom'
    }
  };

  const t = texts[language as keyof typeof texts];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email exists in business data
    if (!business?.email) {
      console.warn('No email found in business profile:', { business });
      alert('Please add an email to your profile in Settings before subscribing.');
      return;
    }
    
    setStep('waiting');
    
    try {
      console.log(`Starting subscription for KE`);
      
      // Call subscription API
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: business.id,
          user_email: business.email,
          user_phone: phoneNumber,
          country: 'Kenya',
          full_name: business.business_name || 'Business User',
          business_id: business.id,
          industry: business.industry
        })
      });

      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        // Redirect to payment URL
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Failed to create subscription');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
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
          <div style={{ backgroundColor: MpesaColors.primary }} className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">{t.title}</h2>
                <p className="text-xs text-green-100">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setLanguage(l => l === 'en' ? 'sw' : 'en')}
                  className="text-xs bg-white/20 px-2 py-1 rounded-full text-white"
                >
                  {language === 'en' ? 'KE' : 'GB'}
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
          <div className="bg-green-50 py-3 px-4 border-b border-green-100">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg"></span>
              <span className="text-sm font-semibold text-green-800">Lipa na M-Pesa</span>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">Weekly</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="py-4 text-center border-b">
            <div className="text-2xl font-bold">{t.price}</div>
            <div className="text-sm text-gray-500 mt-1">{t.period}</div>
            <div className="text-sm text-green-600 mt-2"> VAT included  No hidden fees</div>
          </div>

          {/* Content */}
          <div className="p-4">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Payment method</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mobile_money')}
                      className={`flex-1 p-3 border rounded-lg text-center transition ${
                        paymentMethod === 'mobile_money' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1"></div>
                      <div className="text-sm font-medium">Mobile</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 p-3 border rounded-lg text-center transition ${
                        paymentMethod === 'card' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1"></div>
                      <div className="text-sm font-medium">Card</div>
                    </button>
                  </div>
                </div>

                {/* Mobile Provider Selection */}
                {paymentMethod === 'mobile_money' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Mobile provider</label>
                    <div className="flex gap-2">
                      {['m-pesa', 'airtel_money', 't-kash'].map(provider => (
                        <button
                          key={provider}
                          type="button"
                          onClick={() => setMobileProvider(provider)}
                          className={`flex-1 p-3 border rounded-lg text-center transition ${
                            mobileProvider === provider 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="text-sm font-medium capitalize">
                            {provider.replace('_', ' ').replace('money', '')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t.phoneLabel}</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-3 rounded-l-lg border border-r-0 text-gray-600 text-sm">+254</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder={t.phonePlaceholder}
                      className="flex-1 px-3 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t.phoneHint}</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{ backgroundColor: MpesaColors.primary }}
                  className="w-full hover:opacity-90 text-white py-3 rounded-lg font-semibold transition"
                >
                  {t.button}
                </button>
              </form>
            )}

            {/* Waiting State */}
            {step === 'waiting' && (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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

