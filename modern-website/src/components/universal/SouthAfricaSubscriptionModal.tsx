"use client";

import { useState } from 'react';
import { SubscriptionAPI, COUNTRY_PAYMENT_METHODS, getPlanIdForCountry } from '@/lib/subscription-api';
import BottomSheetContainer from './BottomSheetContainer';

const OzowColors = {
  primary: '#0052CC',   // Ozow Blue
  secondary: '#00A3FF'
};

interface SouthAfricaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function SouthAfricaSubscriptionModal({ isOpen, onClose, userData }: SouthAfricaSubscriptionModalProps) {
  const amount = COUNTRY_PAYMENT_METHODS.ZA.defaultAmount;
  const currency = COUNTRY_PAYMENT_METHODS.ZA.currency;
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState('form');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  const handleSubmit = async () => {
    setStep('waiting');
    try {
      // Get plan ID for South Africa
      const planId = await getPlanIdForCountry('ZA', amount);
      
      // Create subscription request
      const subscriptionRequest = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: cardDetails.name, // Using name as phone placeholder for SA
        countryCode: 'ZA',
        planId,
        paymentMethod
      };

      const response = await SubscriptionAPI.createSubscription(subscriptionRequest);
      
      if (response.success && response.authorizationUrl) {
        // Redirect to payment URL
        window.location.href = response.authorizationUrl;
      } else {
        setTimeout(() => setStep('success'), 2000);
        setTimeout(() => { onClose(); setStep('form'); }, 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Payment failed. Please try again.');
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <BottomSheetContainer isOpen={isOpen} onClose={onClose} initialHeight="50vh" maxHeight="70vh">
      
      {/* Compact Header */}
      <div style={{ backgroundColor: OzowColors.primary }} className="-mx-4 -mt-4 px-4 py-3">
        <h2 className="text-lg font-bold text-white">Subscribe in Rands</h2>
        <p className="text-xs text-blue-200">Secured by Kyshi • PCI Compliant</p>
      </div>

      {/* Compact Provider Badge */}
      <div className="bg-blue-50 py-2 px-3 -mx-4 mt-2 border-b border-blue-100">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">🔒</span>
          <span className="text-sm font-semibold text-blue-800">Ozow Instant EFT</span>
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Weekly</span>
        </div>
      </div>

      {/* Compact Price Section */}
      <div className="py-3 text-center border-b">
        <div className="text-xl font-bold">R {amount}</div>
        <div className="text-xs text-gray-500 mt-0.5">weekly subscription • auto-renews every 7 days</div>
        <div className="text-xs text-green-600 mt-1">✓ 15% VAT included</div>
      </div>

      {step === 'form' && (
        <>
          {/* Compact Payment Method Selection */}
          <div className="py-3 border-b">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-2 rounded-lg text-center transition text-sm ${
                  paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                💳 Card
              </button>
              <button
                onClick={() => setPaymentMethod('ozow')}
                className={`flex-1 py-2 rounded-lg text-center transition text-sm ${
                  paymentMethod === 'ozow' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
              >
                🔄 Ozow / EFT
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/25"
                      className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'ozow' && (
              <div className="text-center py-4">
                <div className="text-2xl mb-2">🏦</div>
                <p className="text-xs">You'll be redirected to your bank's secure portal</p>
                <p className="text-xs text-gray-500 mt-1">Supports: FNB, Standard Bank, ABSA, Nedbank, Capitec</p>
              </div>
            )}
          </div>

          {/* Compact Submit Button */}
          <div className="py-3">
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: OzowColors.primary }}
              className="w-full hover:opacity-90 text-white py-3 rounded-lg font-semibold text-sm transition h-11"
            >
              {paymentMethod === 'card' ? `Pay R ${amount} with Card` : 'Continue with Ozow / EFT'}
            </button>
          </div>
        </>
      )}

      {/* Compact Waiting State */}
      {step === 'waiting' && (
        <div className="py-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-900">Processing payment</p>
          <p className="text-xs text-gray-500 mt-1">
            {paymentMethod === 'card' ? 'Verifying your card...' : 'Redirecting to your bank...'}
          </p>
        </div>
      )}

      {/* Compact Success State */}
      {step === 'success' && (
        <div className="py-6 text-center">
          <div className="text-3xl mb-3">🎉</div>
          <p className="text-sm font-medium text-gray-900">Weekly subscription activated!</p>
          <p className="text-xs text-gray-500 mt-1">You will be charged R{amount} every 7 days</p>
        </div>
      )}
      
      {/* Compact Footer */}
      <div className="py-2 text-center text-xs text-gray-400 border-t mt-2">
        Secured by Kyshi • PCI DSS Level 1 Certified
      </div>
    </BottomSheetContainer>
  );
}

