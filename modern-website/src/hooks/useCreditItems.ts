import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface CreditItem {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface UseCreditItemsProps {
  businessId?: string;
  industry?: string;
}

export interface UseCreditItemsReturn {
  data: CreditItem[];
  isLoading: boolean;
  error: Error | null;
  addCreditItem: (item: Omit<CreditItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCreditItem: (id: string, updates: Partial<CreditItem>) => Promise<void>;
  deleteCreditItem: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useCreditItems({ businessId, industry }: UseCreditItemsProps = {}): UseCreditItemsReturn {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['credit-items', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('credit_items')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addCreditItemMutation = useMutation({
    mutationFn: async (item: Omit<CreditItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('credit_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-items'] });
    },
  });

  const updateCreditItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreditItem> }) => {
      const { data, error } = await supabase
        .from('credit_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-items'] });
    },
  });

  const deleteCreditItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('credit_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-items'] });
    },
  });

  const addCreditItem = async (item: Omit<CreditItem, 'id' | 'created_at' | 'updated_at'>) => {
    await addCreditItemMutation.mutateAsync(item);
  };

  const updateCreditItem = async (id: string, updates: Partial<CreditItem>) => {
    await updateCreditItemMutation.mutateAsync({ id, updates });
  };

  const deleteCreditItem = async (id: string) => {
    await deleteCreditItemMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    addCreditItem,
    updateCreditItem,
    deleteCreditItem,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['credit-items'] }),
  };
}
