import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface SubscriptionRequest {
  user_id: string;
  user_email: string;
  user_phone?: string;
  country: string;
  full_name?: string;
}

export interface SubscriptionResponse {
  success: boolean;
  subscription?: any;
  paymentUrl?: string;
  paymentMethod?: string;
  redirectBehavior?: 'modal' | 'external';
  country: string;
  amount: number;
  currency: string;
  mobileMoneyProvider?: string;
  subscriptionId?: string;
  error?: string;
}

export interface SubscriptionStatus {
  success: boolean;
  isActive?: boolean;
  status?: string;
  nextPaymentDate?: string;
  subscription?: any;
  error?: string;
}

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubscription = async (params: SubscriptionRequest): Promise<SubscriptionResponse> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('create-subscription', {
        body: params
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data as SubscriptionResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        country: params.country,
        amount: 0,
        currency: '',
      };
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async (subscriptionId: string, kyshiSubscriptionId: string): Promise<SubscriptionStatus> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('subscription-status', {
        body: { subscription_id: subscriptionId, kyshi_subscription_id: kyshiSubscriptionId }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      return data as SubscriptionStatus;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check subscription status';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      // Call the subscription API to cancel
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getUserSubscriptions = async (userId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get subscriptions';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionTransactions = async (subscriptionId: string): Promise<any[]> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get transactions';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    createSubscription,
    checkSubscriptionStatus,
    cancelSubscription,
    getUserSubscriptions,
    getSubscriptionTransactions,
    loading,
    error,
  };
};
