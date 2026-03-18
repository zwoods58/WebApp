import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';
import { useOfflineData } from '@/hooks/useOfflineData';
import { getQueue } from '@/utils/offlineQueue';

export interface Expense {
  id: string;
  business_id: string;
  industry: string;
  amount: number;
  category?: string;
  description?: string;
  supplier?: string;
  expense_date: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  status?: 'synced' | 'pending' | 'error'; // Add status for offline support
}

export interface UseExpensesOptions {
  businessId?: string;
  industry?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  supplier?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useExpenses(options: UseExpensesOptions = {}) {
  const { business } = useBusiness();
  const { isOnline, addCashOperation } = useOfflineData();
  const [data, setData] = useState<Expense[]>([]);
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
        .from('expenses')
        .select(options.select || '*')
        .eq('business_id', business.id);

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const orderBy = options.orderBy || { column: 'expense_date', ascending: false };
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: results, error: queryError } = await query;

      if (queryError) throw queryError;

      // Load pending operations from IndexedDB queue
      const queue = await getQueue();
      const pendingOps = queue.filter(op => op.type === 'cash');
      const pendingExpenses: Expense[] = pendingOps
        .filter(op => op.status === 'pending' && op.operation === 'expense')
        .map(op => ({
          id: op.id?.toString() || '',
          business_id: business.id,
          industry: business.industry || 'retail',
          amount: (op.payload as any).amount || 0,
          category: (op.payload as any).expenseCategory || (op.payload as any).category,
          description: (op.payload as any).description,
          supplier: (op.payload as any).vendorName,
          expense_date: (op.payload as any).expenseDate || new Date(op.timestamp).toISOString().split('T')[0],
          created_at: new Date(op.timestamp).toISOString(),
          updated_at: new Date(op.timestamp).toISOString(),
          status: 'pending' as const
        }));

      // Merge pending + fetched data
      const allData = [...pendingExpenses, ...(results as unknown as Expense[]) || []];
      setData(allData);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Still load pending items even if fetch fails
      if (business?.id) {
        const queue = await getQueue();
        const pendingOps = queue.filter(op => op.type === 'cash');
        const pendingExpenses: Expense[] = pendingOps
          .filter(op => op.status === 'pending' && op.operation === 'expense')
          .map(op => ({
            id: op.id?.toString() || '',
            business_id: business.id,
            industry: business.industry || 'retail',
            amount: (op.payload as any).amount || 0,
            category: (op.payload as any).expenseCategory || (op.payload as any).category,
            description: (op.payload as any).description,
            supplier: (op.payload as any).vendorName,
            expense_date: (op.payload as any).expenseDate || new Date(op.timestamp).toISOString().split('T')[0],
            created_at: new Date(op.timestamp).toISOString(),
            updated_at: new Date(op.timestamp).toISOString(),
            status: 'pending' as const
          }));
        setData(pendingExpenses);
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
      const expenseData = {
        ...newData,
        business_id: business.id
      };

      // If online, try direct API call first
      if (isOnline) {
        try {
          const response = await fetch('/api/expenses', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData)
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to insert expense');
          }

          setData(prev => [result.data, ...prev]);
          return result.data;
        } catch (apiError) {
          console.warn('⚠️ API call failed, falling back to offline queue:', apiError);
          // Fall through to offline queue
        }
      }

      // Always queue for offline/sync or as fallback
      const operationId = addCashOperation('expense', {
        amount: expenseData.amount,
        category: expenseData.category || 'general',
        description: expenseData.description,
        paymentMethod: expenseData.payment_method || 'cash',
        expenseCategory: expenseData.category,
        receiptNumber: expenseData.receipt_number
      });

      // Return optimistic update
      const optimisticExpense = {
        ...expenseData,
        id: operationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending' // Add status field for pending items
      } as Expense;

      setData(prev => [optimisticExpense, ...prev]);
      return optimisticExpense;

    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    if (!business) throw new Error('No business context');

    try {
      const { data: result, error } = await supabase
        .from('expenses')
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
        .from('expenses')
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

  const getTotalExpenses = (date?: string) => {
    const filteredExpenses = date 
      ? data.filter(e => e.expense_date === date)
      : data;
    
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const getTodayExpenses = () => {
    const today = new Date().toISOString().split('T')[0];
    return getTotalExpenses(today);
  };

  const getExpensesByCategory = () => {
    return data.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + expense.amount;
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
    getTotalExpenses,
    getTodayExpenses,
    getExpensesByCategory,
    expenses: data,
    fetchExpenses: fetchData,
    addExpense: insert,
    updateExpense: update,
    deleteExpense: remove
  };
}
