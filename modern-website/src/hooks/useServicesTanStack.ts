import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

export interface Service {
  id: string;
  business_id: string;
  service_name: string;
  description?: string;
  price: number;
  duration?: number;
  category?: string;
  is_active?: boolean;
  currency?: string;
  industry?: string;
  created_at: string;
  updated_at: string;
}

export interface UseServicesTanStackProps {
  businessId?: string;
  industry?: string;
}

export interface UseServicesTanStackReturn {
  data: Service[];
  isLoading: boolean;
  error: Error | null;
  addService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: string, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  refetch: () => void;
  isOffline: boolean;
  isPending: boolean;
}

export function useServicesTanStack({ businessId, industry }: UseServicesTanStackProps = {}): UseServicesTanStackReturn {
  const queryClient = useQueryClient();
  const { isReadOnly } = useUnifiedAuth();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['services', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addServiceMutation = useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
      if (isReadOnly) throw new Error('READ_ONLY: Subscription inactive.');
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Service> }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const addService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    await addServiceMutation.mutateAsync(service);
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    await updateServiceMutation.mutateAsync({ id, updates });
  };

  const deleteService = async (id: string) => {
    await deleteServiceMutation.mutateAsync(id);
  };

  return {
    data: data as Service[],
    isLoading,
    error,
    addService,
    updateService,
    deleteService,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
    isOffline: typeof window !== 'undefined' ? !navigator.onLine : false,
    isPending: addServiceMutation.status === 'pending',
  };
}
