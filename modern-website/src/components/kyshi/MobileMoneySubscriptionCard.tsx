'use client';

import React, { useState } from 'react';
import { CalendarDays, DollarSign, Smartphone, RefreshCw } from 'lucide-react';

interface MobileMoneySubscriptionCardProps {
  subscription: {
    id: string;
    status: string;
    current_period_end: string;
    kyshi_plans: {
      name: string;
      amount: number;
      currency: string;
      country_code: string;
    };
    kyshi_customers: {
      email: string;
      first_name: string;
      last_name: string;
    };
  };
  onRenew?: (subscriptionId: string) => void;
  loading?: boolean;
}

const MobileMoneySubscriptionCard: React.FC<MobileMoneySubscriptionCardProps> = ({
  subscription,
  onRenew,
  loading = false
}) => {
  const [isRenewing, setIsRenewing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'past_due':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending Payment';
      case 'past_due':
        return 'Payment Due';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getDaysUntilRenewal = () => {
    if (!subscription.current_period_end) return null;
    const today = new Date();
    const renewalDate = new Date(subscription.current_period_end);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMobileMoneyProvider = (countryCode: string) => {
    switch (countryCode) {
      case 'KE':
        return 'M-PESA, Airtel Money, T-Kash';
      case 'GH':
        return 'MTN MoMo, Vodafone Cash, AirtelTigo';
      case 'CI':
        return 'MTN MoMo, Orange Money, Moov Money';
      default:
        return 'Mobile Money';
    }
  };

  const handleRenew = async () => {
    if (onRenew && !isRenewing) {
      setIsRenewing(true);
      try {
        await onRenew(subscription.id);
      } finally {
        setIsRenewing(false);
      }
    }
  };

  const daysUntilRenewal = getDaysUntilRenewal();
  const isMobileMoneyCountry = subscription.kyshi_plans?.country_code && ['KE', 'GH', 'CI'].includes(subscription.kyshi_plans.country_code);

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {subscription.kyshi_plans?.name || 'Unknown Plan'}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
            {getStatusText(subscription.status)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          {isMobileMoneyCountry && <Smartphone className="w-4 h-4" />}
          <span>{subscription.kyshi_customers?.email || 'No email available'}</span>
        </div>
      </div>
      
      <div className="px-6 pb-6 space-y-4">
        {/* Price and Currency */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-2xl font-bold text-gray-900">
              {subscription.kyshi_plans?.amount || '0'}
            </span>
            <span className="text-lg text-gray-500">
              {subscription.kyshi_plans?.currency || 'USD'}
            </span>
          </div>
          <span className="text-sm text-gray-500">per week</span>
        </div>

        {/* Mobile Money Provider */}
        {isMobileMoneyCountry && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Smartphone className="w-4 h-4" />
              <span className="font-medium">Mobile Money Providers:</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {getMobileMoneyProvider(subscription.kyshi_plans?.country_code || '')}
            </p>
          </div>
        )}

        {/* Next Billing Date */}
        {subscription.current_period_end && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="w-4 h-4" />
            <span>
              Next billing: {new Date(subscription.current_period_end).toLocaleDateString()}
            </span>
            {daysUntilRenewal !== null && (
              <span className="text-xs text-gray-500">
                ({daysUntilRenewal > 0 ? `${daysUntilRenewal} days` : 'Today'})
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {(subscription.status === 'active' || subscription.status === 'past_due') && (
            <button
              onClick={handleRenew}
              disabled={isRenewing || loading}
              className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                subscription.status === 'past_due'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400'
              }`}
            >
              {isRenewing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                  Processing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 inline" />
                  {subscription.status === 'past_due' ? 'Pay Now' : 'Renew Now'}
                </>
              )}
            </button>
          )}
          
          {subscription.status === 'pending' && (
            <button
              onClick={handleRenew}
              disabled={isRenewing || loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isRenewing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin inline" />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2 inline" />
                  Complete Payment
                </>
              )}
            </button>
          )}
        </div>

        {/* Status Messages */}
        {subscription.status === 'past_due' && (
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-red-800">
              Payment is overdue. Please renew your subscription to continue using premium features.
            </p>
          </div>
        )}
        
        {subscription.status === 'pending' && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              Your subscription is waiting for payment completion. Click "Complete Payment" to finish the setup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMoneySubscriptionCard;
