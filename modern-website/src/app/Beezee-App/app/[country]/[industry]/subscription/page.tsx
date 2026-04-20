'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, Calendar, AlertCircle, CheckCircle, Clock, Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import Header from '@/components/universal/Header';
import BottomNav from '@/components/universal/BottomNav';
import GhanaSubscriptionModal from '@/components/subscription/GhanaSubscriptionModal';
import KenyaSubscriptionModal from '@/components/subscription/KenyaSubscriptionModal';
import CoteIvoireSubscriptionModal from '@/components/subscription/CoteIvoireSubscriptionModal';
import NigeriaSubscriptionModal from '@/components/subscription/NigeriaSubscriptionModal';
import KyshiAPI from '@/lib/kyshi-api';
import { useToastContext } from '@/providers/ToastProvider';

export default function SubscriptionPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const { business } = useUnifiedAuth();
  const { showSuccess, showError } = useToastContext();
  
  const country = (params.country as string) || 'ke';
  const industry = (params.industry as string) || 'retail';
  
  const [showModal, setShowModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const config = KyshiAPI.getCountryConfig(country.toUpperCase());

  useEffect(() => {
    // Check current subscription status
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual subscription status check from database
      // For now, show as no active subscription
      setSubscriptionStatus({
        status: 'inactive',
        nextPaymentDue: null,
        lastPayment: null
      });
    } catch (error) {
      console.error('Error checking subscription status:', error);
      showError('Failed to check subscription status');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowModal(false);
    showSuccess('Payment successful! Your subscription is now active.');
    checkSubscriptionStatus(); // Refresh status
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'past_due': return 'text-red-600 bg-red-50';
      case 'grace_period_1': 
      case 'grace_period_2': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('subscription.status.active', 'Active');
      case 'past_due': return t('subscription.status.past_due', 'Payment Due');
      case 'grace_period_1': return t('subscription.status.grace_1', 'Grace Period - Day 1');
      case 'grace_period_2': return t('subscription.status.grace_2', 'Grace Period - Day 2');
      case 'cancelled': return t('subscription.status.cancelled', 'Cancelled');
      default: return t('subscription.status.inactive', 'Inactive');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <Header industry={industry} country={country} />
        <main className="flex-1 flex items-center justify-center p-5">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--text-1)] font-medium">Loading subscription status...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header industry={industry} country={country} />

      <main className="flex-1">
        <div className="p-5 max-w-md mx-auto pb-32">
          {/* Subscription Status Card */}
          <div className="fade-in">
            <div className="glass-card rounded-2xl border border-[var(--border)] p-6 mb-6">
              <h2 className="text-xl font-bold text-[var(--text-1)] mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                {t('subscription.title', 'Subscription Status')}
              </h2>
              
              {subscriptionStatus && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                    <span className="text-sm font-medium text-[var(--text-2)]">{t('subscription.current_status', 'Current Status')}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(subscriptionStatus.status)}`}>
                      {getStatusText(subscriptionStatus.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-[var(--text-3)] mb-1">
                        <Calendar size={16} />
                        {t('subscription.last_payment', 'Last Payment')}
                      </div>
                      <div className="font-medium text-[var(--text-1)]">
                        {subscriptionStatus.lastPayment ? 
                          new Date(subscriptionStatus.lastPayment).toLocaleDateString() : 
                          t('subscription.never', 'Never')
                        }
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-[var(--text-3)] mb-1">
                        <Clock size={16} />
                        {t('subscription.next_payment', 'Next Payment')}
                      </div>
                      <div className="font-medium text-[var(--text-1)]">
                        {subscriptionStatus.nextPaymentDue ? 
                          new Date(subscriptionStatus.nextPaymentDue).toLocaleDateString() : 
                          t('subscription.no_due_date', 'Not scheduled')
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Options */}
          <div className="fade-in">
            <div className="glass-card rounded-2xl border border-[var(--border)] p-6">
              <h3 className="text-lg font-bold text-[var(--text-1)] mb-4">{t('subscription.payment_options', 'Payment Options')}</h3>
              
              <div className="space-y-4">
                {/* Current Plan Info */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-2)]">{t('subscription.current_plan', 'Current Plan')}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      {t('subscription.weekly', 'WEEKLY')}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-1)]">
                    {config.currency} {config.amount}
                  </div>
                  <div className="text-sm text-[var(--text-2)] mt-1">
                    {t('subscription.manual_payment_required', 'Manual payment required every 7 days')}
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                >
                  <CreditCard size={20} />
                  {t('subscription.pay_now', 'Pay Now')}
                </button>

                {/* Instructions */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle size={16} className="text-blue-600 mt-0.5" />
                    <span className="text-sm font-medium text-blue-800">{t('subscription.important_note', 'Important Note')}</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1 ml-6">
                    <li>• {t('subscription.note1', 'This is a manual payment subscription')}</li>
                    <li>• {t('subscription.note2', 'You will receive payment reminders every 7 days')}</li>
                    <li>• {t('subscription.note3', '3-day grace period before access is revoked')}</li>
                    <li>• {t('subscription.note4', 'Payments are processed securely via Kyshi')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="fade-in mt-6">
            <div className="glass-card rounded-2xl border border-[var(--border)] p-6">
              <h3 className="text-lg font-bold text-[var(--text-1)] mb-4">{t('subscription.need_help', 'Need Help?')}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-[var(--text-3)]" />
                  <div>
                    <div className="text-sm font-medium text-[var(--text-1)]">{t('subscription.support_email', 'Support Email')}</div>
                    <div className="text-xs text-[var(--text-2)]">support@beezee.app</div>
                  </div>
                </div>
                
                <button className="w-full py-3 border-2 border-[var(--border)] text-[var(--text-1)] font-medium rounded-lg hover:bg-[var(--bg2)] transition-colors">
                  {t('subscription.view_faq', 'View FAQ')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav industry={industry} country={country} />

      {/* Subscription Modal */}
      {country.toUpperCase() === 'GH' && (
        <GhanaSubscriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {country.toUpperCase() === 'KE' && (
        <KenyaSubscriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {country.toUpperCase() === 'CI' && (
        <CoteIvoireSubscriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {country.toUpperCase() === 'NG' && (
        <NigeriaSubscriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
