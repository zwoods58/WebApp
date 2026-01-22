import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { useCountryStore } from '../store/countryStore.js';
import { CheckCircle, XCircle, Loader2, ArrowLeft, Calendar, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import OfflineBanner from '../components/OfflineBanner';
import { useTranslation } from 'react-i18next';
import DLocalPaymentForm from '../components/DLocalPaymentForm';

export default function Subscription() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeCountry, formatCurrency, getPricing } = useCountryStore();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

    if (!activeCountry) {
      toast.error('Country not detected. Please contact support.');
      return;
    }

    try {
      setProcessing(tier);

      // Get country-specific pricing
      const pricing = getPricing(tier);
      if (!pricing) {
        throw new Error('Pricing not available for your country');
      }

      // Show D-Local payment form
      setSelectedPlan({ tier, pricing });
      setShowPaymentForm(true);
      setProcessing(null);

    } catch (error) {
      console.error('Subscribe error:', error);
      toast.error(error.message || t('subscription.checkoutError', 'Failed to start checkout'));
      setProcessing(null);
    }
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      // Update user subscription in database
      const { error } = await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_tier: selectedPlan.tier,
          last_payment_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Record payment
      await supabase
        .from('subscription_payments')
        .insert({
          user_id: user.id,
          amount: selectedPlan.pricing.price,
          currency: activeCountry.currency.code,
          status: 'completed',
          payment_method: 'dlocal',
          payment_id: paymentResult.id || paymentResult.payment_id,
          subscription_tier: selectedPlan.tier
        });

      toast.success(t('subscription.success', 'Payment successful! Your subscription is now active.'));
      setShowPaymentForm(false);
      setSelectedPlan(null);
      loadSubscriptionData();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Payment successful but failed to update subscription. Please contact support.');
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error(error.message || 'Payment failed');
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
                  {subscription?.subscription_tier === 'full_access_ai' ? t('subscription.fullAccessAI', 'Full Access AI Plan') : t('subscription.manual', 'Manual Entry')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('subscription.price', 'Price')}</p>
                <p className="font-semibold text-gray-900">
                  {subscription?.subscription_tier === 'full_access_ai' 
                    ? `${getPricing('full_access_ai')?.weeklyDisplay || '100 KSH'}/${activeCountry?.pricing?.billingCycle || 'week'}`
                    : `${getPricing('manual')?.weeklyDisplay || 'Manual Plan'}/${activeCountry?.pricing?.billingCycle || 'week'}`
                  }
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
          
          <div className="grid grid-cols-1 gap-4">
            {/* Full Access AI Plan */}
            <div className="card border-2 border-primary-500 relative">
              <div className="absolute -top-3 right-4 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {t('subscription.recommended', 'RECOMMENDED')}
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{t('subscription.fullAccessAI', 'Full Access AI Plan')}</h3>
                  <p className="text-primary-600 font-bold">
                    {getPricing('full_access_ai')?.weeklyDisplay || getPricing('full_access_ai')?.displayPrice || '100 KSH'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Billed {activeCountry?.pricing?.billingCycle || 'weekly'}
                  </p>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.unlimitedTransactions', 'Unlimited transactions')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.advancedReports', 'Advanced financial reports')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.inventory', 'Inventory management')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.aiCoach', 'AI Financial Coach')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.receipts', 'AI Receipt Scanning')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.offlineMode', 'Offline mode')}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {t('subscription.features.exportData', 'Export data')}
                </li>
              </ul>
              <button
                onClick={() => handleSubscribe('full_access_ai')}
                disabled={processing !== null}
                className="btn btn-primary w-full"
              >
                {processing === 'full_access_ai' ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t('subscription.selectFullAccessAI', 'Select Full Access AI Plan')
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
      
      {/* D-Local Payment Form Modal */}
      {showPaymentForm && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Complete {selectedPlan.tier === 'ai' ? 'Full Access' : 'Manual Entry'} Subscription
                </h2>
                <button
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedPlan(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <DLocalPaymentForm
                countryCode={activeCountry.code}
                amount={selectedPlan.pricing.price}
                description={`BeeZee ${selectedPlan.tier === 'ai' ? 'Full Access' : 'Manual Entry'} Plan`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                planType={selectedPlan.tier}
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
