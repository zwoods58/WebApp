"use client";

import { useState } from 'react';
import { COUNTRY_PAYMENT_METHODS } from '@/lib/subscription-api';
// Kyshi API functions removed - no longer available
import { X } from 'lucide-react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

const PagaColors = {
  primary: '#F26522',   // Dark Orange - Official Paga color
  secondary: '#F7931E',
  accent: '#FFC20E'
};

interface NigeriaSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function NigeriaSubscriptionModal({ isOpen, onClose, onSuccess }: NigeriaSubscriptionModalProps) {
  const { business } = useUnifiedAuth();
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
      console.log(`Starting subscription for NG`);
      
      // Call subscription API
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: business.id,
          user_email: business.email,
          user_phone: identifier,
          country: 'Nigeria',
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
          <div style={{ backgroundColor: PagaColors.primary }} className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">Subscribe with Paga</h2>
                <p className="text-xs text-orange-100">Powered by Kyshi • NIBSS Instant</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Provider Badge */}
          <div className="bg-orange-50 py-3 px-4 border-b border-orange-100">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg"></span>
              <span className="text-sm font-semibold text-orange-800">Paga Instant Payment</span>
              <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">Weekly</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="py-4 text-center border-b">
            <div className="text-2xl font-bold">₦{amount.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">weekly subscription • auto-renews every 7 days</div>
            <div className="text-sm text-green-600 mt-2"> 7.5% VAT included</div>
          </div>

          {/* Content */}
          <div className="p-4">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Select payment method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 border rounded-lg text-left transition ${
                          paymentMethod === method.id 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="text-lg mb-2">{method.icon}</div>
                        <div className="text-sm font-medium">{method.name}</div>
                        <div className="text-xs text-gray-400">{method.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Field */}
                <div>
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
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    required
                  />
                  {paymentMethod === 'bank' && (
                    <p className="text-xs text-blue-600 mt-1"> You will be redirected to your banking app</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{ backgroundColor: PagaColors.primary }}
                  className="w-full hover:opacity-90 text-white py-3 rounded-lg font-semibold transition"
                >
                  Pay ₦{amount} via {paymentMethods.find(m => m.id === paymentMethod)?.name}
                </button>
              </form>
            )}

            {/* Waiting State */}
            {step === 'waiting' && (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-900">Check your phone</p>
                <p className="text-sm text-gray-500 mt-2">Approve payment on your Paga app or banking app</p>
              </div>
            )}

            {/* Success State */}
            {step === 'success' && (
              <div className="py-8 text-center">
                <div className="text-4xl mb-4"></div>
                <p className="text-lg font-medium text-gray-900">Weekly subscription activated!</p>
                <p className="text-sm text-gray-500 mt-2">You will be charged ₦{amount} every 7 days</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="py-3 text-center text-xs text-gray-400 border-t">
            Secured by Kyshi • NIBSS Instant Payment Network
          </div>
        </div>
      </div>
    </>
  );
}

