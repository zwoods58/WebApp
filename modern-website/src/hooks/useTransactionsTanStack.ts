import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { checkAuthenticationStatus, validateRequiredFields, logDatabaseError, createHookError } from '@/utils/authHelpers';

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
  vendor_name?: string;
  supplier_phone?: string;
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
        .from('business_transactions')
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
      // Check authentication first
      if (!businessId) {
        throw createHookError('Business ID is required for transactions');
      }

      const authCheck = await checkAuthenticationStatus(businessId);
      if (!authCheck.isAuthenticated) {
        throw createHookError(`Authentication failed: ${authCheck.error}`);
      }

      const payload = {
        ...transaction,
        type: transaction.type || 'money_in', // <- REQUIRED FIELD
        industry: transaction.industry || industry || 'retail',    // <- ensure present
        currency: transaction.currency || getCurrencyFromCountry(country), // <- REQUIRED
        transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
      };

      // Validate required fields
      const validation = validateRequiredFields(payload, ['business_id', 'type', 'amount', 'currency', 'transaction_date']);
      if (!validation.isValid) {
        throw createHookError(`Missing required fields: ${validation.missingFields.join(', ')}`);
      }

      console.log('Transaction data being sent to API:', payload);
      
      // Route through API to use service role key (bypasses RLS)
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        logDatabaseError('Transaction API call', { status: response.status, error: errorData }, payload);
        throw createHookError(`Failed to create transaction: ${errorData.message || response.statusText}`, errorData);
      }

      const result = await response.json();
      
      if (result.error) {
        logDatabaseError('Transaction API error', result.error, payload);
        throw createHookError(`Failed to create transaction: ${result.error}`, result.error);
      }

      console.log('✅ Transaction created via API:', result.data);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Transaction> }) => {
      const { data, error } = await supabase
        .from('business_transactions')
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
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw createHookError(`Failed to delete transaction: ${err.message}`);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
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
