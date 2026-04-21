import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Transaction {
  id: string;
  business_id: string;
  industry?: string;
  type: 'money_in' | 'money_out';
  amount: number;
  description: string;
  category?: string;
  currency?: string;
  customer_name?: string;
  payment_method?: string;
  transaction_date: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UseTransactionsTanStackProps {
  businessId?: string;
  industry?: string;
  country?: string;
}

export interface UseTransactionsTanStackReturn {
  data: Transaction[];
  isLoading: boolean;
  error: Error | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addTransactionAsync: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<{ data?: any; error?: any }>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refetch: () => void;
  isOffline: boolean;
  isAdding: boolean;
}

// Maps country code -> currency (mirrors what the API route does via getCurrency)
function getCurrencyFromCountry(country?: string): string {
  const map: Record<string, string> = {
    KE: 'KES', UG: 'UGX', TZ: 'TZS', GH: 'GHS', NG: 'NGN',
    ZA: 'ZAR', RW: 'RWF', ET: 'ETB', US: 'USD', GB: 'GBP',
  };
  return (country && map[country.toUpperCase()]) ? map[country.toUpperCase()] : 'USD';
}

export function useTransactionsTanStack({ businessId, industry, country }: UseTransactionsTanStackProps = {}): UseTransactionsTanStackReturn {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['transactions', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
      const payload = {
        ...transaction,
        industry: transaction.industry || industry || 'retail',    // <- ensure present
        currency: transaction.currency || getCurrencyFromCountry(country), // <- REQUIRED
        transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
      };

      console.log('Transaction data being inserted:', payload);
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Transaction insert error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Transaction> }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    await addTransactionMutation.mutateAsync(transaction);
  };

  const addTransactionAsync = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await addTransactionMutation.mutateAsync(transaction);
      return { data, error: undefined };
    } catch (error) {
      return { data: undefined, error };
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    await updateTransactionMutation.mutateAsync({ id, updates });
  };

  const deleteTransaction = async (id: string) => {
    await deleteTransactionMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    addTransaction,
    addTransactionAsync,
    updateTransaction,
    deleteTransaction,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
    isOffline: typeof window !== 'undefined' ? !navigator.onLine : false,
    isAdding: addTransactionMutation.status === 'pending',
  };
}
