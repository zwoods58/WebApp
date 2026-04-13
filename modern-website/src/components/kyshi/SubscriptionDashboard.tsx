'use client';

import React, { useState, useEffect } from 'react';
import MobileMoneySubscriptionCard from './MobileMoneySubscriptionCard';
import { CalendarDays, DollarSign, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { redirectToPayment } from '../../utils/paymentRedirect';

interface Subscription {
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
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  payment_method?: string;
}

interface SubscriptionDashboardProps {
  userEmail: string;
  countryCode: string;
}

const SubscriptionDashboard: React.FC<SubscriptionDashboardProps> = ({
  userEmail,
  countryCode
}) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, [userEmail]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/kyshi/subscription-status?email=${userEmail}`);
      const data = await response.json();

      if (data.success) {
        setSubscriptions(data.subscriptions || []);
        setTransactions(data.transactions || []);
      } else {
        setError(data.message || 'Failed to fetch subscription data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch('/api/kyshi/charge-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh subscription data
        await fetchSubscriptionData();
        
        // If there's an authorization URL, redirect to it using PWA-aware function
        if (data.kyshiChargeResponse?.data?.authorizationUrl) {
          console.log('=== INITIATING PWA-AWARE PAYMENT REDIRECT ===');
          redirectToPayment(data.kyshiChargeResponse.data.authorizationUrl, (error: string) => {
            setError(`Payment redirect failed: ${error}. Please try again.`);
            console.error('Payment redirect error:', error);
          });
        }
      } else {
        setError(data.message || 'Failed to renew subscription');
      }
    } catch (err) {
      setError('Failed to process renewal. Please try again.');
      console.error('Error renewing subscription:', err);
    }
  };

  const getSubscriptionSummary = () => {
    const active = subscriptions.filter(s => s.status === 'active').length;
    const pending = subscriptions.filter(s => s.status === 'pending').length;
    const pastDue = subscriptions.filter(s => s.status === 'past_due').length;
    
    return { active, pending, pastDue };
  };

  const getTransactionSummary = () => {
    const successful = transactions.filter(t => t.status === 'success').length;
    const failed = transactions.filter(t => t.status === 'failed').length;
    const totalAmount = transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { successful, failed, totalAmount };
  };

  const isMobileMoneyCountry = ['KE', 'GH', 'CI'].includes(countryCode);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
        <button
          onClick={fetchSubscriptionData}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const subscriptionSummary = getSubscriptionSummary();
  const transactionSummary = getTransactionSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your mobile money subscriptions</p>
        </div>
        {isMobileMoneyCountry && (
          <div className="bg-blue-50 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">Mobile Money Country</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{subscriptionSummary.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{subscriptionSummary.pending + subscriptionSummary.pastDue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                {transactionSummary.totalAmount} {transactions[0]?.currency || ''}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Subscriptions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Subscriptions</h3>
        {subscriptions.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Subscriptions</h4>
            <p className="text-gray-600">You don't have any subscriptions yet. Get started with a weekly plan!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <MobileMoneySubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onRenew={handleRenewSubscription}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.amount} {transaction.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.payment_method || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDashboard;
