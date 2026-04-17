import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Expense {
  id: string;
  business_id: string;
  amount: number;
  description: string;
  category?: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export interface UseExpensesTanStackProps {
  businessId?: string;
  industry?: string;
  country?: string;
}

export interface UseExpensesTanStackReturn {
  data: Expense[];
  isLoading: boolean;
  error: Error | null;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addExpenseAsync: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<{ data?: any; error?: any }>;
  updateExpense: (id: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  refetch: () => void;
  isOffline: boolean;
  isPending: boolean;
}

export function useExpensesTanStack({ businessId, industry }: UseExpensesTanStackProps = {}): UseExpensesTanStackReturn {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error, isPending } = useQuery({
    queryKey: ['expenses', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert(expense)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Expense> }) => {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const addExpense = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
    await addExpenseMutation.mutateAsync(expense);
  };

  const addExpenseAsync = async (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await addExpenseMutation.mutateAsync(expense);
      return { data, error: undefined };
    } catch (error) {
      return { data: undefined, error };
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    await updateExpenseMutation.mutateAsync({ id, updates });
  };

  const deleteExpense = async (id: string) => {
    await deleteExpenseMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    addExpense,
    addExpenseAsync,
    updateExpense,
    deleteExpense,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
    isOffline: typeof window !== 'undefined' ? !navigator.onLine : false,
    isPending: addExpenseMutation.status === 'pending',
  };
}
