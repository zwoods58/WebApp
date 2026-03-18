import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';
import { useOfflineData } from '@/hooks/useOfflineData';
import { getQueue } from '@/utils/offlineQueue';

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
  status?: 'synced' | 'pending' | 'error'; // Add status for offline support
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
  const { isOnline, addCashOperation } = useOfflineData();
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!business?.id) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

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

      if (queryError) throw queryError;

      // Load pending operations from IndexedDB queue
      const queue = await getQueue();
      const pendingOps = queue.filter(op => op.type === 'cash');
      const pendingTransactions: Transaction[] = pendingOps
        .filter(op => op.status === 'pending' && op.operation === 'sale')
        .map(op => ({
          id: op.id?.toString() || '',
          business_id: business.id,
          industry: business.industry || 'retail',
          amount: (op.payload as any).amount || 0,
          category: (op.payload as any).category,
          description: (op.payload as any).description,
          customer_name: (op.payload as any).customerName,
          payment_method: (op.payload as any).paymentMethod,
          transaction_date: (op.payload as any).transactionDate || new Date(op.timestamp).toISOString().split('T')[0],
          created_at: new Date(op.timestamp).toISOString(),
          updated_at: new Date(op.timestamp).toISOString(),
          status: 'pending' as const
        }));

      // Merge pending + fetched data
      const allData = [...pendingTransactions, ...(results as unknown as Transaction[]) || []];
      setData(allData);
    } catch (err) {
      console.error('❌ Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Still load pending items even if fetch fails
      if (business?.id) {
        const queue = await getQueue();
        const pendingOps = queue.filter(op => op.type === 'cash');
        const pendingTransactions: Transaction[] = pendingOps
          .filter(op => op.status === 'pending' && op.operation === 'sale')
          .map(op => ({
            id: op.id?.toString() || '',
            business_id: business.id,
            industry: business.industry || 'retail',
            amount: (op.payload as any).amount || 0,
            category: (op.payload as any).category,
            description: (op.payload as any).description,
            customer_name: (op.payload as any).customerName,
            payment_method: (op.payload as any).paymentMethod,
            transaction_date: (op.payload as any).transactionDate || new Date(op.timestamp).toISOString().split('T')[0],
            created_at: new Date(op.timestamp).toISOString(),
            updated_at: new Date(op.timestamp).toISOString(),
            status: 'pending' as const
          }));
        setData(pendingTransactions);
      } else {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [business?.id, business?.industry, options.select, options.limit, options.orderBy?.column, options.orderBy?.ascending]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for force refresh events
  useEffect(() => {
    const handleForceRefresh = () => {
      fetchData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('force-refresh-data', handleForceRefresh);
      return () => {
        window.removeEventListener('force-refresh-data', handleForceRefresh);
      };
    }
  }, [fetchData]);

  const insert = async (newData: any) => {
    if (!business) throw new Error('No business context');

    try {
      const transactionData = {
        ...newData,
        business_id: business.id
      };

      // If online, try direct API call first
      if (isOnline) {
        try {
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
        } catch (apiError) {
          console.warn('⚠️ API call failed, falling back to offline queue:', apiError);
          // Fall through to offline queue
        }
      }

      // Always queue for offline/sync or as fallback
      const operationId = addCashOperation('sale', {
        amount: transactionData.amount,
        category: transactionData.category || 'general',
        description: transactionData.description,
        paymentMethod: transactionData.payment_method || 'cash',
        customerId: transactionData.customer_id,
        receiptNumber: transactionData.receipt_number
      });

      // Return optimistic update
      const optimisticTransaction = {
        ...transactionData,
        id: operationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending' // Add status field for pending items
      } as Transaction;

      setData(prev => [optimisticTransaction, ...prev]);
      return optimisticTransaction;

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
