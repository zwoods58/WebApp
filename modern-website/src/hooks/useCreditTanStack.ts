import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Credit {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_phone?: string;
  amount: number;
  currency: string;
  amount_home?: number;
  exchange_rate?: number;
  paid_amount?: number;
  status: 'outstanding' | 'partial' | 'paid' | 'overdue';
  due_date?: string;
  date_given: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  type?: 'receivable' | 'payable';
}

export interface UseCreditTanStackProps {
  businessId?: string;
  industry?: string;
  country?: string;
}

export interface UseCreditTanStackReturn {
  data: Credit[];
  isLoading: boolean;
  error: Error | null;
  addCredit: (credit: Omit<Credit, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  addCreditAsync: (credit: Omit<Credit, 'id' | 'created_at' | 'updated_at'>) => Promise<{ data?: any; error?: any }>;
  updateCredit: (id: string, updates: Partial<Credit>) => Promise<void>;
  updateCreditAsync: (id: string, updates: Partial<Credit>) => Promise<{ data?: any; error?: any }>;
  deleteCredit: (id: string) => Promise<void>;
  refetch: () => void;
  isOffline: boolean;
}

export function useCreditTanStack({ businessId, industry, country }: UseCreditTanStackProps = {}): UseCreditTanStackReturn {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['credit', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('credit')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addCreditMutation = useMutation({
    mutationFn: async (credit: Omit<Credit, 'id' | 'created_at' | 'updated_at'>) => {
      const creditData = {
        ...credit,
        industry: credit.industry || industry || 'retail',
        currency: credit.currency || 'USD',
        date_given: credit.date_given || new Date().toISOString().split('T')[0],
        status: credit.status || 'outstanding',
        paid_amount: credit.paid_amount ?? 0,
        type: credit.type || 'receivable',
      };

      console.log('Credit data being inserted:', creditData);
      
      const { data, error } = await supabase
        .from('credit')
        .insert(creditData)
        .select()
        .single();

      if (error) {
        console.error('Credit insert error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit'] });
    },
  });

  const updateCreditMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Credit> }) => {
      const { data, error } = await supabase
        .from('credit')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit'] });
    },
  });

  const deleteCreditMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('credit')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit'] });
    },
  });

  const addCredit = async (credit: Omit<Credit, 'id' | 'created_at' | 'updated_at'>) => {
    await addCreditMutation.mutateAsync(credit);
  };

  const addCreditAsync = async (credit: Omit<Credit, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await addCreditMutation.mutateAsync(credit);
      return { data, error: undefined };
    } catch (error) {
      return { data: undefined, error };
    }
  };

  const updateCredit = async (id: string, updates: Partial<Credit>) => {
    await updateCreditMutation.mutateAsync({ id, updates });
  };

  const updateCreditAsync = async (id: string, updates: Partial<Credit>) => {
    try {
      const data = await updateCreditMutation.mutateAsync({ id, updates });
      return { data, error: undefined };
    } catch (error) {
      return { data: undefined, error };
    }
  };

  const deleteCredit = async (id: string) => {
    await deleteCreditMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    addCredit,
    addCreditAsync,
    updateCredit,
    updateCreditAsync,
    deleteCredit,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['credit'] }),
    isOffline: typeof window !== 'undefined' ? !navigator.onLine : false,
  };
}
