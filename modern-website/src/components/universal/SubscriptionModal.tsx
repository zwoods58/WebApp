"use client";

import React, { useState } from 'react';
import { X, Check, Crown, CreditCard, Calendar, Shield, Star } from 'lucide-react';
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
  
  const plan = SUBSCRIPTION_PLANS[country as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.ke;

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Webhook-only approach: simulate subscription creation
      const webhookPayload = {
        event: 'subscription.created',
        data: {
          subscription: {
            id: `sub_test_${Date.now()}_${plan.planId}`,
            customer: {
              id: `cust_${Date.now()}`,
              email: businessEmail || 'test@example.com',
              currencyCode: plan.currency
            },
            plan: {
              id: plan.planId,
              name: `${plan.name} Weekly Plan`,
              amount: plan.price,
              currency: plan.currency,
              interval: 'weekly',
              code: `${plan.currency.toUpperCase()}_WEEKLY_${plan.price}`
            },
            startDate: new Date().toISOString(),
            nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            reference: `kyshi_ref_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      };

      // Send webhook to simulate subscription creation
      const response = await fetch('/api/webhook/kyshi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Subscription failed:', error);
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
        <div className="glass-card rounded-2xl border border-[var(--border)] shadow-float-lg w-full max-w-md overflow-hidden">
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
            {/* Success State */}
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[var(--color-success-light)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-[var(--color-success)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">
                  {t('subscription.subscription_activated', 'Subscription Activated!')}
                </h3>
                <p className="text-[var(--text-2)] mb-4">
                  {t('subscription.enjoy_premium_features', 'Enjoy all premium features')}
                </p>
                <div className="bg-[var(--powder)]/10 rounded-lg p-3">
                  <p className="text-sm text-[var(--text-2)]">
                    {t('subscription.next_billing', 'Next billing')}: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
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
                        {t('subscription.per_week', '/week')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-[var(--text-1)] mb-3">
                    {t('subscription.what_you_get', 'What you get:')}
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-success-light)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={12} className="text-[var(--color-success)]" />
                        </div>
                        <span className="text-sm text-[var(--text-2)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-[var(--powder)]/5 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Shield size={20} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">{t('subscription.secure', 'Secure')}</p>
                    </div>
                    <div>
                      <Calendar size={20} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">{t('subscription.weekly', 'Weekly')}</p>
                    </div>
                    <div>
                      <Star size={20} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">{t('subscription.premium', 'Premium')}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-[var(--bg2)] rounded-lg p-3 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={16} className="text-[var(--text-3)]" />
                    <p className="text-xs text-[var(--text-3)]">
                      {t('subscription.payment_via_kyshi', 'Payment processed securely via Kyshi')}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--text-3)]">
                    {t('subscription.no_card_data', 'Your payment details are never stored on our servers')}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full py-3 bg-[var(--powder-dark)] text-white rounded-xl font-semibold hover:bg-[var(--powder-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('subscription.processing', 'Processing...')}
                    </>
                  ) : (
                    <>
                      <Crown size={20} />
                      {t('subscription.subscribe_now', 'Subscribe Now')}
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
