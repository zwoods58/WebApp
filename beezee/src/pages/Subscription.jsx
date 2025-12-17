import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, callEdgeFunction } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { CreditCard, CheckCircle, XCircle, Loader2, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadSubscriptionData();
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get user subscription status
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_status, subscription_tier, trial_end_date, grace_period_end_date, last_payment_at')
        .eq('id', user.id)
        .single();

      setSubscription(userData);

      // Get payment history
      const { data: paymentData } = await supabase
        .from('subscription_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setPayments(paymentData || []);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      toast.error(t('subscription.loadError', 'Failed to load subscription data'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tier) => {
    if (!user) {
      toast.error(t('common.loginRequired', 'Please log in first'));
      return;
    }

    if (!STRIPE_PUBLISHABLE_KEY) {
      toast.error(t('subscription.stripeError', 'Stripe is not configured. Please contact support.'));
      return;
    }

    try {
      setProcessing(tier);

      // Create checkout session
      const result = await callEdgeFunction('stripe-checkout', {
        user_id: user.id,
        tier: tier,
        success_url: `${window.location.origin}/dashboard/subscription?payment=success`,
        cancel_url: `${window.location.origin}/dashboard/subscription?payment=cancelled`,
      }, true);

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = result.url;
    } catch (error) {
      console.error('Subscribe error:', error);
      toast.error(error.message || t('subscription.checkoutError', 'Failed to start checkout'));
      setProcessing(null);
    }
  };

  // Handle payment success/cancel from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    
    if (paymentStatus === 'success') {
      toast.success(t('subscription.success', 'Payment successful! Your subscription is now active.'));
      loadSubscriptionData();
      // Clean URL
      window.history.replaceState({}, '', '/dashboard/subscription');
    } else if (paymentStatus === 'cancelled') {
      toast.error(t('subscription.cancelled', 'Payment was cancelled.'));
      window.history.replaceState({}, '', '/dashboard/subscription');
    }
  }, []);

  if (loading) {
    return (
      <div className="subscription-container">
        <OfflineBanner />
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          <p className="text-gray-600">{t('common.loading', 'Loading subscription...')}</p>
        </div>
      </div>
    );
  }

  const isTrial = subscription?.subscription_status === 'trial';
  const isActive = subscription?.subscription_status === 'active';
  const isCancelled = subscription?.subscription_status === 'cancelled';
  const isGracePeriod = subscription?.subscription_status === 'grace_period';

  const daysRemaining = subscription?.trial_end_date
    ? Math.ceil((new Date(subscription.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const gracePeriodDaysRemaining = subscription?.grace_period_end_date
    ? Math.ceil((new Date(subscription.grace_period_end_date) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="subscription-container">
      <OfflineBanner />
      <div className="space-y-6">
        {/* Header */}
        <div className="subscription-header flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('nav.subscription', 'Subscription')}</h1>
            <p className="text-gray-600">{t('subscription.subtitle', 'Manage your BeeZee subscription')}</p>
          </div>
        </div>

      {/* Current Status */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('subscription.currentStatus', 'Current Status')}</h2>
        
        <div className="space-y-4">
          {isTrial && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-yellow-900">{t('subscription.trial', 'Trial Active')}</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {daysRemaining} {t('common.daysLeft', 'days left')}
                  </p>
                </div>
                <Calendar className="text-yellow-600" size={32} />
              </div>
            </div>
          )}

          {isActive && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-900 flex items-center gap-2">
                    <CheckCircle size={20} />
                    {t('subscription.active', 'Subscription Active')}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {t('subscription.renewInfo', 'Your subscription is active and will renew automatically')}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
          )}

          {isGracePeriod && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-orange-900 flex items-center gap-2">
                    <XCircle size={20} />
                    {t('subscription.graceTitle', 'Payment Failed - Grace Period')}
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    {gracePeriodDaysRemaining > 0 
                      ? t('subscription.graceInfo', { days: gracePeriodDaysRemaining })
                      : t('subscription.graceEnded', 'Your grace period has ended. Please subscribe to continue using AI features.')}
                  </p>
                </div>
                <XCircle className="text-orange-600" size={32} />
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-red-900 flex items-center gap-2">
                    <XCircle size={20} />
                    {t('subscription.cancelledTitle', 'Subscription Cancelled')}
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {t('subscription.cancelledInfo', 'Your subscription has been cancelled. Subscribe to regain access to AI features.')}
                  </p>
                </div>
                <XCircle className="text-red-600" size={32} />
              </div>
            </div>
          )}

          {/* Subscription Details */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('subscription.plan', 'Plan')}</p>
                <p className="font-semibold text-gray-900">
                  {subscription?.subscription_tier === 'ai' ? t('subscription.full', 'Full Access (AI)') : t('subscription.manual', 'Manual Entry')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('subscription.price', 'Price')}</p>
                <p className="font-semibold text-gray-900">
                  {subscription?.subscription_tier === 'ai' ? t('subscription.fullPrice', '$3.00/month') : t('subscription.manualPrice', '$1.00/month')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe Section */}
      {!isActive && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 px-1">{t('subscription.choosePlan', 'Choose your plan')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manual Plan */}
            <div className="card border-2 border-gray-100 hover:border-primary-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('subscription.manual', 'Manual Entry')}</h3>
                  <p className="text-primary-600 font-bold">{t('subscription.manualPrice', '$1.00 / month')}</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.manualEntries', 'Unlimited manual entries')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.reports', 'Financial reports')}
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <XCircle size={16} className="text-gray-400" />
                  {t('subscription.features.noVoice', 'No AI Voice recording')}
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <XCircle size={16} className="text-gray-400" />
                  {t('subscription.features.noCoach', 'No AI Financial Coach')}
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe('manual')}
                disabled={processing !== null}
                className="btn btn-secondary w-full"
              >
                {processing === 'manual' ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t('subscription.selectManual', 'Select Manual Plan')
                )}
              </button>
            </div>

            {/* AI Plan */}
            <div className="card border-2 border-primary-500 relative">
              <div className="absolute -top-3 right-4 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {t('subscription.recommended', 'RECOMMENDED')}
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('subscription.full', 'Full Access')}</h3>
                  <p className="text-primary-600 font-bold">{t('subscription.fullPrice', '$3.00 / month')}</p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.voiceTransactions', 'AI Voice Transactions')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.voiceBookings', 'AI Voice Bookings')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.coach', 'AI Financial Coach')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.receipts', 'AI Receipt Scanning')}
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe('ai')}
                disabled={processing !== null}
                className="btn btn-primary w-full"
              >
                {processing === 'ai' ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t('subscription.selectFull', 'Select Full Access')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('subscription.paymentHistory', 'Payment History')}</h2>
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    ${payment.amount} {payment.currency}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.created_at).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
