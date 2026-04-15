"use client";

import { useState } from 'react';
import { COUNTRY_PAYMENT_METHODS } from '@/lib/subscription-api';
// Kyshi API functions removed - no longer available
import { X } from 'lucide-react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const MtnColors = { primary: '#EAB308', secondary: '#000000' };
const VodafoneColors = { primary: '#DC2626', secondary: '#FFFFFF' };
const AirtelTigoColors = { primary: '#DC2626', secondary: '#FFFFFF' };

interface GhanaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GhanaSubscriptionModal({ isOpen, onClose, onSuccess }: GhanaSubscriptionModalProps) {
  const { business } = useUnifiedAuth();
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
      console.log(`Starting subscription for GH`);
      
      // Kyshi API removed - show error message
      alert('Payment system temporarily unavailable. Please contact support for subscription assistance.');
      setStep('form');
      return;
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Payment failed. Please try again.');
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
          <div style={{ backgroundColor: currentProvider.color }} className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-lg font-bold ${currentProvider.textColor === 'white' ? 'text-white' : 'text-black'}`}>
                  {currentProvider.name}
                </h2>
                <p className={`text-xs ${currentProvider.textColor === 'white' ? 'text-white/70' : 'text-black/70'}`}>
                  Secure payment processing  MoMo approved
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className={currentProvider.textColor === 'white' ? 'text-white' : 'text-black'} />
              </button>
            </div>
          </div>

          {/* Provider Badge */}
          <div className="bg-yellow-50 py-3 px-4 border-b border-yellow-100">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg"></span>
              <span className="text-sm font-semibold text-yellow-800">Mobile Money</span>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">Weekly</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="py-4 text-center border-b">
            <div className="text-2xl font-bold">¢{amount}</div>
            <div className="text-sm text-gray-500 mt-1">weekly subscription  auto-renews every 7 days</div>
            <div className="text-sm text-gray-500 mt-2">E-Levy included in price</div>
          </div>

          {/* Content */}
          <div className="p-4">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Choose your network</label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setProvider('mtn')}
                      className={`w-full p-4 border rounded-lg flex items-center gap-3 transition ${
                        provider === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">M</div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold">MTN Mobile Money</div>
                        <div className="text-xs text-gray-500">Instant payment processing</div>
                      </div>
                      {provider === 'mtn' && <div className="text-yellow-600 text-sm"></div>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setProvider('vodafone')}
                      className={`w-full p-4 border rounded-lg flex items-center gap-3 transition ${
                        provider === 'vodafone' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">V</div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold">Vodafone Cash</div>
                        <div className="text-xs text-gray-500">Instant payment processing</div>
                      </div>
                      {provider === 'vodafone' && <div className="text-red-600 text-sm"></div>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setProvider('airteltigo')}
                      className={`w-full p-4 border rounded-lg flex items-center gap-3 transition ${
                        provider === 'airteltigo' ? 'border-red-500 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold">AirtelTigo Money</div>
                        <div className="text-xs text-gray-500">Instant payment processing</div>
                      </div>
                      {provider === 'airteltigo' && <div className="text-red-600 text-sm"></div>}
                    </button>
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Money Number</label>
                  <div className="flex">
                    <span className="bg-gray-100 px-3 py-3 rounded-l-lg border text-gray-600 text-sm">+233</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder={currentProvider.prefix}
                      className="flex-1 px-3 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You'll receive a payment request on your {currentProvider.name}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{ backgroundColor: currentProvider.color }}
                  className={`w-full hover:opacity-90 py-3 rounded-lg font-semibold transition ${
                    currentProvider.textColor === 'white' ? 'text-white' : 'text-black'
                  }`}
                >
                  Pay ¢{amount} via {currentProvider.short}
                </button>
              </form>
            )}

            {/* Waiting State */}
            {step === 'waiting' && (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-900">Check your phone</p>
                <p className="text-sm text-gray-500 mt-2">Enter your MoMo PIN to complete payment</p>
              </div>
            )}

            {/* Success State */}
            {step === 'success' && (
              <div className="py-8 text-center">
                <div className="text-4xl mb-4"></div>
                <p className="text-lg font-medium text-gray-900">Weekly subscription activated!</p>
                <p className="text-sm text-gray-500 mt-2">You will be charged ¢{amount} every 7 days</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="py-3 text-center text-xs text-gray-400 border-t">
            Secure payment processing  Ghana MoMo approved
          </div>
        </div>
      </div>
    </>
  );
}
