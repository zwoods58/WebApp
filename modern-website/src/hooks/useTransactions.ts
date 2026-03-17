import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';

export interface Transaction {
  id: string;
  business_id: string;
  industry: string;
  amount: number;
  category?: string;
  description?: string;
  customer_name?: string;
  payment_method?: string;
  transaction_date: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseTransactionsOptions {
  businessId?: string;
  industry?: string;
  category?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const { business } = useBusiness();
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!business?.id) {
      console.log('🔍 useTransactions: No business ID, skipping fetch');
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 useTransactions: Fetching with business_id:', business.id);
      console.log('🔍 useTransactions: Options:', { select: options.select, filters: options.filters, limit: options.limit });

      let query = supabase
        .from('transactions')
        .select(options.select || '*')
        .eq('business_id', business.id);

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const orderBy = options.orderBy || { column: 'transaction_date', ascending: false };
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: results, error: queryError } = await query;

      console.log('🔍 useTransactions: Query result:', { 
        resultsCount: results?.length || 0, 
        error: queryError,
        firstResult: results?.[0]
      });

      if (queryError) throw queryError;

      setData((results as unknown as Transaction[]) || []);
    } catch (err) {
      console.error('❌ Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [business?.id, options.select, options.limit, options.orderBy?.column, options.orderBy?.ascending]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const insert = async (newData: any) => {
    if (!business) throw new Error('No business context');

    try {
      const transactionData = {
        ...newData,
        business_id: business.id
      };

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to insert transaction');
      }

      setData(prev => [result.data, ...prev]);
      return result.data;
    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    if (!business) throw new Error('No business context');

    try {
      const { data: result, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('business_id', business.id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(item => item.id === id ? result : item));
      return result;
    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const remove = async (id: string) => {
    if (!business) throw new Error('No business context');

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('business_id', business.id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const getTotalSales = (date?: string) => {
    const filteredTransactions = date 
      ? data.filter(t => t.transaction_date === date)
      : data;
    
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const getTodaySales = () => {
    const today = new Date().toISOString().split('T')[0];
    return getTotalSales(today);
  };

  const getSalesByCategory = () => {
    return data.reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  };

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    refresh: fetchData,
    getTotalSales,
    getTodaySales,
    getSalesByCategory,
    transactions: data,
    fetchTransactions: fetchData,
    addTransaction: insert,
    updateTransaction: update,
    deleteTransaction: remove
  };
}
