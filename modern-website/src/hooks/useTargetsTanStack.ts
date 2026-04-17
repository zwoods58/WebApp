import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Target {
  id: string;
  business_id: string;
  type: 'sales' | 'daily' | 'weekly' | 'monthly';
  period?: 'daily' | 'weekly' | 'monthly';
  amount: number;
  description?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface UseTargetsTanStackProps {
  businessId?: string;
  industry?: string;
}

export interface UseTargetsTanStackReturn {
  data: Target[];
  isLoading: boolean;
  error: Error | null;
  addTarget: (target: Omit<Target, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTarget: (id: string, updates: Partial<Target>) => Promise<void>;
  deleteTarget: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useTargetsTanStack({ businessId, industry }: UseTargetsTanStackProps = {}): UseTargetsTanStackReturn {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['targets', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('targets')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addTargetMutation = useMutation({
    mutationFn: async (target: Omit<Target, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('targets')
        .insert(target)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });

  const updateTargetMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Target> }) => {
      const { data, error } = await supabase
        .from('targets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });

  const deleteTargetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('targets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
    },
  });

  const addTarget = async (target: Omit<Target, 'id' | 'created_at' | 'updated_at'>) => {
    await addTargetMutation.mutateAsync(target);
  };

  const updateTarget = async (id: string, updates: Partial<Target>) => {
    await updateTargetMutation.mutateAsync({ id, updates });
  };

  const deleteTarget = async (id: string) => {
    await deleteTargetMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    addTarget,
    updateTarget,
    deleteTarget,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['targets'] }),
  };
}
