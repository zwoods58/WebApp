"use client";

import { useState } from 'react';
import { SubscriptionAPI, COUNTRY_PAYMENT_METHODS, getPlanIdForCountry } from '@/lib/subscription-api';
import BottomSheetContainer from './BottomSheetContainer';

const PagaColors = {
  primary: '#F26522',   // Dark Orange - Official Paga color
  secondary: '#F7931E',
  accent: '#FFC20E'
};

interface NigeriaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function NigeriaSubscriptionModal({ isOpen, onClose, userData }: NigeriaSubscriptionModalProps) {
  const amount = COUNTRY_PAYMENT_METHODS.NG.defaultAmount;
  const currency = COUNTRY_PAYMENT_METHODS.NG.currency;
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState('form');

  const paymentMethods = [
    { id: 'paga', name: 'Paga', icon: 'ð', description: 'Paga ID or phone number', color: PagaColors.primary },
    { id: 'opay', name: 'OPay', icon: 'ð', description: 'OPay account number', color: '#4CAF50' },
    { id: 'bank', name: 'Bank Transfer', icon: 'ð¦', description: 'Instant NIBSS payment', color: '#3B82F6' },
    { id: 'card', name: 'Card', icon: 'ð³', description: 'Visa, Mastercard, Verve', color: '#1E3A5F' }
  ];

  const handleSubmit = async () => {
    setStep('waiting');
    try {
      // Get plan ID for Nigeria
      const planId = await getPlanIdForCountry('NG', amount);
      
      // Create subscription request
      const subscriptionRequest = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: identifier,
        countryCode: 'NG',
        planId,
        paymentMethod
      };

      const response = await SubscriptionAPI.createSubscription(subscriptionRequest);
      
      if (response.success && response.authorizationUrl) {
        // Redirect to payment URL
        window.location.href = response.authorizationUrl;
      } else {
        setTimeout(() => setStep('success'), 2000);
        setTimeout(() => { onClose(); setStep('form'); setIdentifier(''); }, 5000);
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
      <div style={{ backgroundColor: PagaColors.primary }} className="-mx-4 -mt-4 px-4 py-3">
        <h2 className="text-lg font-bold text-white">Subscribe with Paga</h2>
        <p className="text-xs text-orange-100">Powered by Kyshi • NIBSS Instant</p>
      </div>

      {/* Compact Provider Badge */}
      <div className="bg-orange-50 py-2 px-3 -mx-4 mt-2 border-b border-orange-100">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg"></span>
          <span className="text-sm font-semibold text-orange-800">Paga Instant Payment</span>
          <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Weekly</span>
        </div>
      </div>

      {/* Compact Price Section */}
      <div className="py-3 text-center border-b">
        <div className="text-xl font-bold">₦{amount.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-0.5">weekly subscription • auto-renews every 7 days</div>
        <div className="text-xs text-green-600 mt-1"> 7.5% VAT included</div>
      </div>

      {step === 'form' && (
        <>
          {/* Compact Payment Method Selection */}
          <div className="py-3 border-b">
            <label className="block text-sm font-medium mb-2">Select payment method</label>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3 border rounded-lg text-left transition ${
                    paymentMethod === method.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="text-base mb-1">{method.icon}</div>
                  <div className="text-xs font-medium">{method.name}</div>
                  <div className="text-xs text-gray-400">{method.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Input Field */}
          <div className="py-3 border-b">
            <label className="block text-sm font-medium mb-2">
              {paymentMethod === 'paga' && 'Paga ID or Phone Number'}
              {paymentMethod === 'opay' && 'OPay Account Number'}
              {paymentMethod === 'bank' && 'Bank Account Number'}
              {paymentMethod === 'card' && 'Card Number'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                paymentMethod === 'paga' ? '0801 234 5678 or Paga ID' :
                paymentMethod === 'opay' ? '8123456789' :
                paymentMethod === 'bank' ? '0123456789' :
                '1234 5678 9012 3456'
              }
              className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
            {paymentMethod === 'bank' && (
              <p className="text-xs text-blue-600 mt-1"> You will be redirected to your banking app</p>
            )}
          </div>

          {/* Compact Submit Button */}
          <div className="py-3">
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: PagaColors.primary }}
              className="w-full hover:opacity-90 text-white py-3 rounded-lg font-semibold text-sm transition h-11"
            >
              Pay ₦{amount} via {paymentMethods.find(m => m.id === paymentMethod)?.name}
            </button>
          </div>
        </>
      )}

      {/* Compact Waiting State */}
      {step === 'waiting' && (
        <div className="py-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-3"></div>
          <p className="text-sm font-medium text-gray-900">Check your phone</p>
          <p className="text-xs text-gray-500 mt-1">Approve payment on your Paga app or banking app</p>
        </div>
      )}

      {/* Compact Success State */}
      {step === 'success' && (
        <div className="py-6 text-center">
          <div className="text-3xl mb-3"></div>
          <p className="text-sm font-medium text-gray-900">Weekly subscription activated!</p>
          <p className="text-xs text-gray-500 mt-1">You will be charged ₦{amount} every 7 days</p>
        </div>
      )}
      
      {/* Compact Footer */}
      <div className="py-2 text-center text-xs text-gray-400 border-t mt-2">
        Secured by Kyshi • NIBSS Instant Payment Network
      </div>
    </BottomSheetContainer>
  );
}
