import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';

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

      setData((results as unknown as Expense[]) || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
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
      const expenseData = {
        ...newData,
        business_id: business.id
      };

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
