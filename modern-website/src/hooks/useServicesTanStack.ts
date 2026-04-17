import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  category?: string;
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
}

export function useServicesTanStack({ businessId, industry }: UseServicesTanStackProps = {}): UseServicesTanStackReturn {
  const queryClient = useQueryClient();

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
    data,
    isLoading,
    error,
    addService,
    updateService,
    deleteService,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  };
}
