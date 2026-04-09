"use client";

import React, { useState } from 'react';
import { X, Check, Crown, CreditCard, Calendar, Shield, Star, Phone } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/LanguageContext';
import { useParams } from 'next/navigation';

// Country pricing configuration (from BeeZee landing page)
const SUBSCRIPTION_PLANS = {
  ke: { 
    name: 'Kenya', 
    flag: '??', 
    currency: 'KES', 
    price: 200, 
    period: 'week',
    planId: 'plan_ke_weekly',
    features: [
      'All 6 Main Features',
      'Sales Tracking & Reports', 
      'Local Language Support',
      'Business Tips',
      'Help Any Time'
    ]
  },
  ng: { 
    name: 'Nigeria', 
    flag: '??', 
    currency: 'NGN', 
    price: 500, 
    period: 'week',
    planId: 'plan_ng_weekly',
    features: [
      'All 6 Core Features',
      'Business Tracking & Analytics',
      'Yoruba/Igbo/Hausa Support', 
      'Performance Insights',
      '24/7 Customer Support'
    ]
  },
  za: { 
    name: 'South Africa', 
    flag: '??', 
    currency: 'ZAR', 
    price: 30, 
    period: 'week',
    planId: 'plan_za_weekly',
    features: [
      'All 6 Core Features',
      'Business Tracking & Analytics',
      'Zulu/Xhosa/Afrikaans Support',
      'Performance Insights', 
      '24/7 Customer Support'
    ]
  },
  gh: { 
    name: 'Ghana', 
    flag: '??', 
    currency: 'GHS', 
    price: 15, 
    period: 'week',
    planId: 'plan_gh_weekly',
    features: [
      'All 6 Core Features',
      'Business Tracking & Analytics',
      'Twi Language Support',
      'Performance Insights',
      '24/7 Customer Support'
    ]
  },
  ug: { 
    name: 'Uganda', 
    flag: '??', 
    currency: 'UGX', 
    price: 4000, 
    period: 'week',
    planId: 'plan_ug_weekly',
    features: [
      'All 6 Core Features',
      'Business Tracking & Analytics', 
      'Luganda Language Support',
      'Performance Insights',
      '24/7 Customer Support'
    ]
  },
  rw: { 
    name: 'Rwanda', 
    flag: '??', 
    currency: 'RWF', 
    price: 1500, 
    period: 'week',
    planId: 'plan_rw_weekly',
    features: [
      'All 6 Core Features',
      'Business Tracking & Analytics',
      'Kinyarwanda Support', 
      'Performance Insights',
      '24/7 Customer Support'
    ]
  },
  tz: { 
    name: 'Tanzania', 
    flag: '??', 
    currency: 'TZS', 
    price: 2000, 
    period: 'week',
    planId: 'plan_tz_weekly',
    features: [
      'All 6 Main Features',
      'Sales Tracking & Reports',
      'Local Language Support', 
      'Business Tips',
      'Help Any Time'
    ]
  }
};

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessEmail?: string;
}

export default function SubscriptionModal({ isOpen, onClose, businessEmail }: SubscriptionModalProps) {
  const { t } = useLanguage();
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [paymentState, setPaymentState] = useState<'initial' | 'initiating' | 'stk_sent' | 'complete'>('initial');
  const [referenceNumber, setReferenceNumber] = useState('');
  
  const plan = SUBSCRIPTION_PLANS[country as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.ke;

  const handleSubscribe = async () => {
    // Validate M-Pesa number
    if (!mpesaNumber || mpesaNumber.length < 10) {
      alert('Please enter a valid M-Pesa number');
      return;
    }

    setLoading(true);
    setPaymentState('initiating');
    
    try {
      // Generate reference number
      const ref = `KYSH${Date.now().toString().slice(-6)}`;
      setReferenceNumber(ref);

      // Simulate API call to initiate STK Push
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay for demo
      
      // Move to STK sent state
      setPaymentState('stk_sent');
      
      // Demo: Auto-complete payment after 5 seconds
      setTimeout(() => {
        setPaymentState('complete');
        setSuccess(true);
        
        // Close modal after showing success
        setTimeout(() => {
          setSuccess(false);
          setPaymentState('initial');
          setMpesaNumber('');
          onClose();
        }, 3000);
      }, 5000);
      
    } catch (error) {
      console.error('STK Push failed:', error);
      setPaymentState('initial');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[60] p-4">
        <div className="glass-card rounded-2xl border border-[var(--border)] shadow-float-lg w-full max-w-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--powder)]/15 rounded-xl flex items-center justify-center">
                <Crown size={20} className="text-[var(--powder-dark)]" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-1)] text-lg">
                  {t('subscription.upgrade_to_premium', 'Upgrade to Premium')}
                </h3>
                <p className="text-sm text-[var(--text-3)]">
                  {plan.name} Plan
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--powder)]/10 transition-colors"
            >
              <X size={20} className="text-[var(--text-3)]" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Success/Complete State */}
            {success && paymentState === 'complete' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[var(--color-success-light)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-[var(--color-success)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">
                  Payment Complete!
                </h3>
                <p className="text-[var(--text-2)] mb-4">
                  Your subscription is now active. Enjoy all premium features!
                </p>
                <div className="bg-[var(--powder)]/10 rounded-lg p-3">
                  <p className="text-sm text-[var(--text-2)]">
                    Next billing: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : paymentState === 'initiating' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[var(--powder)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-3 border-[var(--powder-dark)] border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">
                  Initiating M-Pesa STK Push...
                </h3>
                <p className="text-[var(--text-2)] mb-4">
                  Please wait while we send the payment request to your phone.
                </p>
                <button
                  onClick={() => setPaymentState('initial')}
                  className="text-sm text-[var(--text-3)] hover:text-[var(--text-2)]"
                >
                  Cancel
                </button>
              </div>
            ) : paymentState === 'stk_sent' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[var(--powder)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={32} className="text-[var(--powder-dark)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">
                  STK Push Sent!
                </h3>
                <p className="text-[var(--text-2)] mb-2">
                  Check your phone for M-Pesa prompt and enter your PIN to complete.
                </p>
                <div className="bg-[var(--powder)]/10 rounded-lg p-3 mb-4">
                  <p className="text-sm text-[var(--text-2)]">
                    Reference: {referenceNumber}
                  </p>
                </div>
                <div className="text-sm text-[var(--text-3)] animate-pulse">
                  Waiting for payment...
                </div>
              </div>
            ) : (
              <>
                {/* Plan Display */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{plan.flag}</span>
                      <span className="text-sm font-medium text-[var(--text-2)]">{plan.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[var(--text-1)]">
                        {formatCurrency(plan.price, country)}
                      </div>
                      <div className="text-sm text-[var(--text-3)]">
                        /week
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-[var(--text-1)] mb-3">
                    What you get:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-[var(--color-success-light)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={10} className="text-[var(--color-success)]" />
                        </div>
                        <span className="text-xs text-[var(--text-2)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* M-Pesa Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[var(--text-1)] mb-2">
                    M-Pesa Number
                  </label>
                  <input
                    type="tel"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    placeholder="254712345678"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--powder)] focus:border-transparent text-sm"
                  />
                </div>

                {/* Benefits */}
                <div className="bg-[var(--powder)]/5 rounded-lg p-3 mb-6">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <Shield size={16} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">Secure</p>
                    </div>
                    <div>
                      <Calendar size={16} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">Weekly</p>
                    </div>
                    <div>
                      <Star size={16} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">Premium</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-[var(--bg2)] rounded-lg p-3 mb-6">
                  <p className="text-xs text-[var(--text-3)]">
                    Payment via M-Pesa STK Push
                  </p>
                  <p className="text-xs text-[var(--text-3)]">
                    Enter your number to continue
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSubscribe}
                  disabled={loading || !mpesaNumber}
                  className="w-full py-3 bg-[var(--powder-dark)] text-white rounded-xl font-semibold hover:bg-[var(--powder-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown size={20} />
                      Subscribe Now
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
