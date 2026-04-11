"use client";

import { useState } from 'react';

const OzowColors = {
  primary: '#0052CC',   // Ozow Blue
  secondary: '#00A3FF'
};

interface SouthAfricaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (cardDetails: any, paymentMethod: string, country: string, frequency: string, amount: number) => Promise<void>;
}

export default function SouthAfricaSubscriptionModal({ isOpen, onClose, onSubscribe }: SouthAfricaSubscriptionModalProps) {
  const amount = 30;
  const currency = 'ZAR';
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState('form');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handleSubmit = async () => {
    setStep('waiting');
    try {
      await onSubscribe(cardDetails, paymentMethod, 'ZA', 'weekly', amount);
      setTimeout(() => setStep('success'), 2000);
      setTimeout(() => { onClose(); setStep('form'); }, 5000);
    } catch (error) {
      alert('Payment failed. Please try again.');
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] shadow-xl overflow-hidden flex flex-col">
        
        <div style={{ backgroundColor: OzowColors.primary }} className="p-5">
          <h2 className="text-xl font-bold text-white">Subscribe in Rands</h2>
          <p className="text-sm text-blue-200">Secured by Kyshi \u2022 PCI Compliant</p>
        </div>

        <div className="bg-blue-50 p-3 text-center border-b border-blue-100">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">\ud83d\udd12</span>
            <span className="font-semibold text-blue-800">Ozow Instant EFT</span>
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Weekly</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 text-center border-b">
          <div className="text-2xl sm:text-3xl font-bold">R {amount}</div>
          <div className="text-sm text-gray-500 mt-1">weekly subscription \u2022 auto-renews every 7 days</div>
          <div className="text-xs text-green-600 mt-2">\u2713 15% VAT included</div>
          <div className="text-xs text-gray-400 mt-1">\u21bb Billed weekly \u2022 Cancel anytime</div>
        </div>

        {step === 'form' && (
          <>
            <div className="p-4 sm:p-6 border-b">
              <div className="flex gap-3 mb-5">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 rounded-lg text-center transition ${
                    paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  \ud83d\udcb3 Card
                </button>
                <button
                  onClick={() => setPaymentMethod('ozow')}
                  className={`flex-1 py-2 rounded-lg text-center transition ${
                    paymentMethod === 'ozow' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  \ud83d\udd04 Ozow / EFT
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="p-4 sm:p-6 border-b flex-1 overflow-y-auto">
                    <label className="block text-sm mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-4 px-4 sm:px-6 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/25"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm mb-1">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'ozow' && (
                <div className="text-center py-6 flex-1 flex flex-col justify-center">
                  <div className="text-3xl sm:text-4xl mb-3">\ud83c\udfe6</div>
                  <p className="text-sm">You'll be redirected to your bank's secure portal</p>
                  <p className="text-xs text-gray-500 mt-2">Supports: FNB, Standard Bank, ABSA, Nedbank, Capitec</p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 pt-0">
              <button
                onClick={handleSubmit}
                style={{ backgroundColor: OzowColors.primary }}
                className="w-full hover:opacity-90 text-white py-3 rounded-xl font-semibold transition"
              >
                {paymentMethod === 'card' ? `Pay R ${amount} with Card` : 'Continue with Ozow / EFT'}
              </button>
            </div>
          </>
        )}

        {step === 'waiting' && (
          <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="font-medium text-gray-900">Processing payment</p>
            <p className="text-sm text-gray-500 mt-1">
              {paymentMethod === 'card' ? 'Verifying your card...' : 'Redirecting to your bank...'}
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 sm:p-8 text-center flex-1 flex flex-col justify-center">
            <div className="text-4xl sm:text-5xl mb-4">\ud83c\udf89</div>
            <p className="font-medium text-gray-900">Weekly subscription activated!</p>
            <p className="text-sm text-gray-500 mt-1">You will be charged R{amount} every 7 days</p>
          </div>
        )}

        <div className="p-4 text-center text-xs text-gray-400 border-t">
          Secured by Kyshi \u2022 PCI DSS Level 1 Certified
        </div>
      </div>
    </div>
  );
}
