"use client";

import React, { useState } from 'react';
import { X, Check, Crown, CreditCard, Calendar, Shield, Star, Phone } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { useLanguage } from '@/hooks/useLanguage';
import { useParams } from 'next/navigation';
import KenyaSubscriptionModal from './KenyaSubscriptionModal';
import NigeriaSubscriptionModal from './NigeriaSubscriptionModal';
// import SouthAfricaSubscriptionModal from './SouthAfricaSubscriptionModal'; // Hidden for now
import GhanaSubscriptionModal from './GhanaSubscriptionModal';
import CoteDIvoireSubscriptionModal from './CoteDIvoireSubscriptionModal';

// Country pricing configuration (from BeeZee landing page)
const SUBSCRIPTION_PLANS = {
  ke: { 
    name: 'Kenya', 
    flag: 'BeeZee', 
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
    flag: 'BeeZee', 
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
  // za: { 
  //   name: 'South Africa', 
  //   flag: 'BeeZee', 
  //   currency: 'ZAR', 
  //   price: 30, 
  //   period: 'week',
  //   planId: 'plan_za_weekly',
  //   features: [
  //     'All 6 Core Features',
  //     'Business Tracking & Analytics',
  //     'Zulu/Xhosa/Afrikaans Support',
  //     'Performance Insights', 
  //     '24/7 Customer Support'
  //   ]
  // },
  gh: { 
    name: 'Ghana', 
    flag: 'BeeZee', 
    currency: 'GHS', 
    price: 20, 
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
    flag: 'BeeZee', 
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
    flag: 'BeeZee', 
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
    flag: 'BeeZee', 
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
  onSubscribe?: (phoneNumber: string, paymentMethod: string, country: string, frequency: string, amount: number) => Promise<void>;
  userData?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function SubscriptionModal({ isOpen, onClose, businessEmail, onSubscribe, userData }: SubscriptionModalProps) {
  const { t } = useLanguage();
  const params = useParams();
  const country = (params.country as string) || 'ke';
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [paymentState, setPaymentState] = useState<'initial' | 'initiating' | 'stk_sent' | 'complete'>('initial');
const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [referenceNumber, setReferenceNumber] = useState('');
  
  const plan = SUBSCRIPTION_PLANS[country as keyof typeof SUBSCRIPTION_PLANS] || SUBSCRIPTION_PLANS.ke;

  const formatPhoneNumber = (input: string): string => {
    // Remove non-digits
    const cleaned = input.replace(/\D/g, '');
    
    // Add 254 if user entered 07 format
    if (cleaned.startsWith('7') && cleaned.length === 9) {
      return '254' + cleaned;
    }
    
    // Validate 2547 format
    if (cleaned.startsWith('2547') && cleaned.length === 12) {
      return cleaned;
    }
    
    return input;
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleStepSubmit = () => {
    if (currentStep === 1) {
      handleNextStep();
    } else if (currentStep === 2) {
      handleSubscribe();
    }
  };

  const handleSubscribe = async () => {
    // Validate M-Pesa number (must be 2547XXXXXXXX format)
    const formattedNumber = formatPhoneNumber(mpesaNumber);
    if (!formattedNumber || !formattedNumber.startsWith('2547') || formattedNumber.length !== 12) {
      alert('Please enter a valid M-Pesa number (2547XXXXXXXX)');
      return;
    }
    
    // Update with formatted number
    setMpesaNumber(formattedNumber);

    setLoading(true);
    setCurrentStep(3); // Move to STK Push status step
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
          setCurrentStep(1);
          setMpesaNumber('');
          onClose();
        }, 3000);
      }, 5000);
      
    } catch (error) {
      console.error('STK Push failed:', error);
      setPaymentState('initial');
      setCurrentStep(2); // Go back to M-Pesa entry
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Use Kenya-specific modal for Kenya users
  if (country === 'ke') {
    return (
      <KenyaSubscriptionModal
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onSubscribe ? () => onSubscribe(mpesaNumber, 'mobile_money', country, 'weekly', SUBSCRIPTION_PLANS.ke.price) : undefined}
      />
    );
  }

  // Use Nigeria-specific modal for Nigeria users
  if (country === 'ng') {
    return (
      <NigeriaSubscriptionModal
        isOpen={isOpen}
        onClose={onClose}
        userData={userData || { email: '', firstName: '', lastName: '' }}
      />
    );
  }

  // South Africa modal hidden for now
  // if (country === 'za' && userData) {
  //   return (
  //     <SouthAfricaSubscriptionModal
  //       isOpen={isOpen}
  //       onClose={onClose}
  //       userData={userData}
  //     />
  //   );
  // }

  // Use Ghana-specific modal for Ghana users
  if (country === 'gh') {
    return (
      <GhanaSubscriptionModal
        isOpen={isOpen}
        onClose={onClose}
        userData={userData || { email: '', firstName: '', lastName: '' }}
      />
    );
  }

  // Use Cote D'Ivoire-specific modal for Cote D'Ivoire users
  if (country === 'ci') {
    return (
      <CoteDIvoireSubscriptionModal
        isOpen={isOpen}
        onClose={onClose}
        userData={userData || { email: '', firstName: '', lastName: '' }}
      />
    );
  }

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
                  {currentStep === 1 ? 'Select Plan' : currentStep === 2 ? 'M-Pesa Payment' : 'STK Push Status'}
                </h3>
                <p className="text-xs text-[var(--text-3)]">
                  Step {currentStep}/3
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
          <div className="p-4">
            {/* Step 1: Plan Selection */}
            {currentStep === 1 && (
              <div className="text-center py-4">
                <div className="mb-4">
                  <span className="text-3xl">{plan.flag}</span>
                </div>
                <h4 className="font-semibold text-[var(--text-1)] mb-2">
                  {plan.name} Plan
                </h4>
                <div className="text-2xl font-black text-[var(--text-1)] mb-4">
                  {formatCurrency(plan.price, country)}
                  <span className="text-sm text-[var(--text-3)]">/week</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-success-light)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={8} className="text-[var(--color-success)]" />
                      </div>
                      <span className="text-[var(--text-2)]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleStepSubmit}
                  className="w-full py-2 bg-[var(--powder-dark)] text-white rounded-lg font-medium hover:bg-[var(--powder-darker)] transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: M-Pesa Number Entry */}
            {currentStep === 2 && (
              <div className="py-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--text-1)] mb-2">
                    M-Pesa Number
                  </label>
                  <input
                    type="tel"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(formatPhoneNumber(e.target.value))}
                    placeholder="254712345678"
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--powder)] focus:border-transparent text-sm"
                  />
                  <p className="text-xs text-[var(--text-3)] mt-2">
                    Enter your M-Pesa registered number
                  </p>
                </div>
                <div className="bg-[var(--powder)]/5 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <Shield size={14} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">Secure</p>
                    </div>
                    <div>
                      <Calendar size={14} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">Weekly</p>
                    </div>
                    <div>
                      <Star size={14} className="text-[var(--powder-dark)] mx-auto mb-1" />
                      <p className="text-xs text-[var(--text-3)]">Premium</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 py-2 bg-gray-200 text-[var(--text-1)] rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleStepSubmit}
                    disabled={loading || !mpesaNumber}
                    className="flex-1 py-2 bg-[var(--powder-dark)] text-white rounded-lg font-medium hover:bg-[var(--powder-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: STK Push Status */}
            {currentStep === 3 && (
              <div className="text-center py-4">
                {paymentState === 'initiating' ? (
                  <>
                    <div className="w-12 h-12 bg-[var(--powder)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-6 h-6 border-3 border-[var(--powder-dark)] border-t-transparent rounded-full animate-spin" />
                    </div>
                    <h4 className="font-semibold text-[var(--text-1)] mb-2">
                      Initiating STK Push...
                    </h4>
                    <p className="text-sm text-[var(--text-2)] mb-4">
                      Sending payment request to {mpesaNumber.slice(0, 6)}******{mpesaNumber.slice(-2)}
                    </p>
                    <button
                      onClick={() => {
                        setCurrentStep(2);
                        setPaymentState('initial');
                      }}
                      className="text-sm text-[var(--text-3)] hover:text-[var(--text-2)]"
                    >
                      Cancel
                    </button>
                  </>
                ) : paymentState === 'stk_sent' ? (
                  <>
                    <div className="w-12 h-12 bg-[var(--powder)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone size={24} className="text-[var(--powder-dark)]" />
                    </div>
                    <h4 className="font-semibold text-[var(--text-1)] mb-2">
                      Check Your Phone!
                    </h4>
                    <p className="text-sm text-[var(--text-2)] mb-2">
                      M-Pesa prompt sent to your phone
                    </p>
                    <p className="text-sm text-[var(--text-2)] mb-4">
                      Enter your M-Pesa PIN to complete payment
                    </p>
                    <div className="bg-[var(--powder)]/10 rounded-lg p-2 mb-4">
                      <p className="text-xs text-[var(--text-2)]">
                        Reference: {referenceNumber}
                      </p>
                    </div>
                    <div className="text-sm text-[var(--text-3)] animate-pulse">
                      Waiting for PIN entry...
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-[var(--color-success-light)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={24} className="text-[var(--color-success)]" />
                    </div>
                    <h4 className="font-semibold text-[var(--text-1)] mb-2">
                      Payment Complete!
                    </h4>
                    <p className="text-sm text-[var(--text-2)] mb-4">
                      Subscription activated successfully
                    </p>
                    <div className="bg-[var(--powder)]/10 rounded-lg p-2">
                      <p className="text-xs text-[var(--text-2)]">
                        Next billing: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

