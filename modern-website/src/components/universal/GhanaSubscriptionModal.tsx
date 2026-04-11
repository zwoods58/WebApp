"use client";

import { useState } from 'react';

const MtnColors = { primary: '#EAB308', secondary: '#000000' };
const VodafoneColors = { primary: '#DC2626', secondary: '#FFFFFF' };
const AirtelTigoColors = { primary: '#DC2626', secondary: '#FFFFFF' };

interface GhanaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (phoneNumber: string, paymentMethod: string, country: string, frequency: string, amount: number, provider?: string) => Promise<void>;
}

export default function GhanaSubscriptionModal({ isOpen, onClose, onSubscribe }: GhanaSubscriptionModalProps) {
  const amount = 20;
  const currency = 'GHS';
  
  const [provider, setProvider] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('form');

  const providers = {
    mtn: { name: 'MTN Mobile Money', short: 'MTN MoMo', color: MtnColors.primary, textColor: 'black', prefix: '24' },
    vodafone: { name: 'Vodafone Cash', short: 'Vodafone Cash', color: VodafoneColors.primary, textColor: 'white', prefix: '30' },
    airteltigo: { name: 'AirtelTigo Money', short: 'AirtelTigo', color: AirtelTigoColors.primary, textColor: 'white', prefix: '27' }
  };

  const currentProvider = providers[provider as keyof typeof providers];

  const handleSubmit = async () => {
    setStep('waiting');
    try {
      await onSubscribe(`233${phoneNumber}`, 'mobile_money', 'GH', 'weekly', amount, provider);
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
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
        
        <div style={{ backgroundColor: currentProvider.color }} className="p-5">
          <h2 className={`text-xl font-bold ${currentProvider.textColor === 'white' ? 'text-white' : 'text-black'}`}>
            {currentProvider.name}
          </h2>
          <p className={`text-sm ${currentProvider.textColor === 'white' ? 'text-white/70' : 'text-black/70'}`}>
            Powered by Kyshi \u2022 MoMo approved
          </p>
        </div>

        <div className="bg-yellow-50 p-3 text-center border-b border-yellow-100">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">\ud83d\udcf1</span>
            <span className="font-semibold text-yellow-800">Mobile Money</span>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">Weekly</span>
          </div>
        </div>

        <div className="p-6 text-center border-b">
          <div className="text-3xl font-bold">\u20b5{amount}</div>
          <div className="text-sm text-gray-500 mt-1">weekly subscription \u2022 auto-renews every 7 days</div>
          <div className="text-xs text-gray-500 mt-2">E-Levy included in price</div>
          <div className="text-xs text-gray-400 mt-1">\u21bb Billed weekly \u2022 Cancel anytime</div>
        </div>

        {step === 'form' && (
          <>
            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-3">Choose your network</label>
              <div className="space-y-3">
                <button
                  onClick={() => setProvider('mtn')}
                  className={`w-full p-4 border rounded-xl flex items-center gap-4 transition ${
                    provider === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">M</div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">MTN Mobile Money</div>
                    <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                  </div>
                  {provider === 'mtn' && <div className="text-yellow-600">\u2713</div>}
                </button>

                <button
                  onClick={() => setProvider('vodafone')}
                  className={`w-full p-4 border rounded-xl flex items-center gap-4 transition ${
                    provider === 'vodafone' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">V</div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Vodafone Cash</div>
                    <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                  </div>
                  {provider === 'vodafone' && <div className="text-red-600">\u2713</div>}
                </button>

                <button
                  onClick={() => setProvider('airteltigo')}
                  className={`w-full p-4 border rounded-xl flex items-center gap-4 transition ${
                    provider === 'airteltigo' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">AirtelTigo Money</div>
                    <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                  </div>
                  {provider === 'airteltigo' && <div className="text-red-600">\u2713</div>}
                </button>
              </div>
            </div>

            <div className="p-6 border-b">
              <label className="block text-sm font-medium mb-2">Mobile Money Number</label>
              <div className="flex">
                <span className="bg-gray-100 px-4 py-3 rounded-l-xl border text-gray-600">+233</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder={currentProvider.prefix}
                  className="flex-1 px-4 py-3 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                You'll receive a payment request on your {currentProvider.name}
              </p>
            </div>

            <div className="p-6 pt-0">
              <button
                style={{ backgroundColor: currentProvider.color }}
                className={`w-full hover:opacity-90 py-3 rounded-xl font-semibold transition ${
                  currentProvider.textColor === 'white' ? 'text-white' : 'text-black'
                }`}
                onClick={handleSubmit}
              >
                Pay \u20b5{amount} via {currentProvider.short}
              </button>
            </div>
          </>
        )}

        {step === 'waiting' && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="font-medium text-gray-900">Check your phone</p>
            <p className="text-sm text-gray-500 mt-1">Enter your MoMo PIN to complete payment</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">\u2705</div>
            <p className="font-medium text-gray-900">Weekly subscription activated!</p>
            <p className="text-sm text-gray-500 mt-1">You will be charged \u20b5{amount} every 7 days</p>
          </div>
        )}

        <div className="p-4 text-center text-xs text-gray-400 border-t">
          Secured by Kyshi \u2022 Ghana MoMo approved
        </div>
      </div>
    </div>
  );
}
