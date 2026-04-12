"use client";

import { useState } from 'react';
import { SubscriptionAPI, COUNTRY_PAYMENT_METHODS, getPlanIdForCountry } from '@/lib/subscription-api';
import BottomSheetContainer from './BottomSheetContainer';

const MtnColors = { primary: '#EAB308', secondary: '#000000' };
const VodafoneColors = { primary: '#DC2626', secondary: '#FFFFFF' };
const AirtelTigoColors = { primary: '#DC2626', secondary: '#FFFFFF' };

interface GhanaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function GhanaSubscriptionModal({ isOpen, onClose, userData }: GhanaSubscriptionModalProps) {
  const amount = COUNTRY_PAYMENT_METHODS.GH.defaultAmount;
  const currency = COUNTRY_PAYMENT_METHODS.GH.currency;
  
  const [provider, setProvider] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState('form');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');

  const providers = {
    mtn: { name: 'MTN Mobile Money', short: 'MTN MoMo', color: MtnColors.primary, textColor: 'black', prefix: '24' },
    vodafone: { name: 'Vodafone Cash', short: 'Vodafone Cash', color: VodafoneColors.primary, textColor: 'white', prefix: '30' },
    airteltigo: { name: 'AirtelTigo Money', short: 'AirtelTigo', color: AirtelTigoColors.primary, textColor: 'white', prefix: '27' }
  };

  const currentProvider = providers[provider as keyof typeof providers];

  const handleSubmit = async () => {
    setStep('waiting');
    try {
      // Get plan ID for Ghana
      const planId = await getPlanIdForCountry('GH', amount);
      
      // Create subscription request
      const subscriptionRequest = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: `233${phoneNumber}`,
        countryCode: 'GH',
        planId,
        paymentMethod: paymentMethod === 'mobile_money' ? provider : paymentMethod
      };

      const response = await SubscriptionAPI.createSubscription(subscriptionRequest);
      
      if (response.success && response.authorizationUrl) {
        // Redirect to payment URL
        window.location.href = response.authorizationUrl;
      } else {
        setTimeout(() => setStep('success'), 2000);
        setTimeout(() => { onClose(); setStep('form'); setPhoneNumber(''); }, 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Payment failed. Please try again.');
      setStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <BottomSheetContainer isOpen={isOpen} onClose={onClose} initialHeight="55vh" maxHeight="75vh">
      
      {/* Compact Header */}
      <div style={{ backgroundColor: currentProvider.color }} className="-mx-4 -mt-4 px-4 py-3">
        <h2 className={`text-lg font-bold ${currentProvider.textColor === 'white' ? 'text-white' : 'text-black'}`}>
          {currentProvider.name}
        </h2>
        <p className={`text-xs ${currentProvider.textColor === 'white' ? 'text-white/70' : 'text-black/70'}`}>
          Powered by Kyshi • MoMo approved
        </p>
      </div>

      {/* Compact Provider Badge */}
      <div className="bg-yellow-50 py-2 px-3 -mx-4 mt-2 border-b border-yellow-100">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">📱</span>
          <span className="text-sm font-semibold text-yellow-800">Mobile Money</span>
          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">Weekly</span>
        </div>
      </div>

      {/* Compact Price Section */}
      <div className="py-3 text-center border-b">
        <div className="text-xl font-bold">₵{amount}</div>
        <div className="text-xs text-gray-500 mt-0.5">weekly subscription • auto-renews every 7 days</div>
        <div className="text-xs text-gray-500 mt-1">E-Levy included in price</div>
      </div>

      {step === 'form' && (
        <>
          {/* Compact Provider Selection */}
          <div className="py-3 border-b">
            <label className="block text-sm font-medium mb-2">Choose your network</label>
            <div className="space-y-2">
              <button
                onClick={() => setProvider('mtn')}
                className={`w-full p-3 border rounded-lg flex items-center gap-3 transition ${
                  provider === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">M</div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold">MTN Mobile Money</div>
                  <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                </div>
                {provider === 'mtn' && <div className="text-yellow-600 text-sm">✓</div>}
              </button>

              <button
                onClick={() => setProvider('vodafone')}
                className={`w-full p-3 border rounded-lg flex items-center gap-3 transition ${
                  provider === 'vodafone' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">V</div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold">Vodafone Cash</div>
                  <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                </div>
                {provider === 'vodafone' && <div className="text-red-600 text-sm">✓</div>}
              </button>

              <button
                onClick={() => setProvider('airteltigo')}
                className={`w-full p-3 border rounded-lg flex items-center gap-3 transition ${
                  provider === 'airteltigo' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold">AirtelTigo Money</div>
                  <div className="text-xs text-gray-500">Instant payment via Kyshi</div>
                </div>
                {provider === 'airteltigo' && <div className="text-red-600 text-sm">✓</div>}
              </button>
            </div>
          </div>

          {/* Compact Phone Input */}
          <div className="py-3 border-b">
            <label className="block text-sm font-medium mb-2">Mobile Money Number</label>
            <div className="flex">
              <span className="bg-gray-100 px-3 py-2.5 rounded-l-lg border text-gray-600 text-sm">+233</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                placeholder={currentProvider.prefix}
                className="flex-1 px-3 py-2.5 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You'll receive a payment request on your {currentProvider.name}
            </p>
          </div>

          {/* Compact Submit Button */}
          <div className="py-3">
            <button
              style={{ backgroundColor: currentProvider.color }}
              className={`w-full hover:opacity-90 py-3 rounded-lg font-semibold text-sm transition h-11 ${
                currentProvider.textColor === 'white' ? 'text-white' : 'text-black'
              }`}
              onClick={handleSubmit}
            >
              Pay ₵{amount} via {currentProvider.short}
            </button>
          </div>
        </>
      )}

      {/* Compact Waiting State */}
      {step === 'waiting' && (
        <div className="py-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-900">Check your phone</p>
          <p className="text-xs text-gray-500 mt-1">Enter your MoMo PIN to complete payment</p>
        </div>
      )}

      {/* Compact Success State */}
      {step === 'success' && (
        <div className="py-6 text-center">
          <div className="text-3xl mb-3">✅</div>
          <p className="text-sm font-medium text-gray-900">Weekly subscription activated!</p>
          <p className="text-xs text-gray-500 mt-1">You will be charged ₵{amount} every 7 days</p>
        </div>
      )}
      
      {/* Compact Footer */}
      <div className="py-2 text-center text-xs text-gray-400 border-t mt-2">
        Secured by Kyshi • Ghana MoMo approved
      </div>
    </BottomSheetContainer>
  );
}
