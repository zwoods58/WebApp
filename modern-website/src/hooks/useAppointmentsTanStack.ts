import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

export interface Appointment {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_contact?: string;
  service_id?: string;
  service_name?: string;
  appointment_date: string;
  appointment_time: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminder_sent?: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  syncStatus?: 'synced' | 'pending' | 'conflict';
}

export interface UseAppointmentsTanStackProps {
  businessId?: string;
  industry?: string;
}

export interface UseAppointmentsTanStackReturn {
  data: Appointment[];
  isLoading: boolean;
  error: Error | null;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  refetch: () => void;
  isOffline: boolean;
}

export function useAppointmentsTanStack({ businessId, industry }: UseAppointmentsTanStackProps = {}): UseAppointmentsTanStackReturn {
  const queryClient = useQueryClient();
  const { isReadOnly } = useUnifiedAuth();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['appointments', businessId, industry],
    queryFn: async () => {
      if (!businessId) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('business_id', businessId)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!businessId,
  });

  const addAppointmentMutation = useMutation({
    mutationFn: async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
      if (isReadOnly) throw new Error('READ_ONLY: Subscription inactive.');
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Appointment> }) => {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    await addAppointmentMutation.mutateAsync(appointment);
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    await updateAppointmentMutation.mutateAsync({ id, updates });
  };

  const deleteAppointment = async (id: string) => {
    await deleteAppointmentMutation.mutateAsync(id);
  };

  return {
    data,
    isLoading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
    isOffline: !navigator.onLine,
  };
}
