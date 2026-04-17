import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Inventory {
  id: string;
  business_id: string;
  item_name: string;
  quantity: number;
  threshold?: number;
  unit?: string;
  cost_price?: number;
  selling_price?: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface UseInventoryTanStackProps {
  businessId?: string;
  industry?: string;
}

export interface UseInventoryTanStackReturn {
  data: Inventory[];
  isLoading: boolean;
  error: Error | null;
  addInventory: (inventory: Omit<Inventory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateInventory: (id: string, updates: Partial<Inventory>) => Promise<void>;
  deleteInventory: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useInventoryTanStack({ businessId, industry }: UseInventoryTanStackProps = {}): UseInventoryTanStackReturn {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['inventory', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addInventoryMutation = useMutation({
    mutationFn: async (inventory: Omit<Inventory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('inventory')
        .insert(inventory)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Inventory> }) => {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const addInventory = async (inventory: Omit<Inventory, 'id' | 'created_at' | 'updated_at'>) => {
    await addInventoryMutation.mutateAsync(inventory);
  };

  const updateInventory = async (id: string, updates: Partial<Inventory>) => {
    await updateInventoryMutation.mutateAsync({ id, updates });
  };

  const deleteInventory = async (id: string) => {
    await deleteInventoryMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    addInventory,
    updateInventory,
    deleteInventory,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  };
}
