import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';
import { useOfflineData } from '@/hooks/useOfflineData';
import { getQueue } from '@/utils/offlineQueue';

export interface Appointment {
  id: string;
  business_id: string;
  industry: string;
  customer_name: string;
  customer_contact?: string;
  service_id?: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  duration?: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  syncStatus?: 'synced' | 'pending' | 'error'; // Add sync status for offline support
}

export interface UseAppointmentsOptions {
  businessId?: string;
  industry?: string;
  status?: Appointment['status'];
  startDate?: string;
  endDate?: string;
  customerName?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useAppointments(options: UseAppointmentsOptions = {}) {
  const { business } = useBusiness();
  const { isOnline, addCalendarOperation } = useOfflineData();
  const [data, setData] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!business?.id) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('appointments')
        .select(options.select || '*')
        .eq('business_id', business.id);

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const orderBy = options.orderBy || { column: 'appointment_date', ascending: true };
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: results, error: queryError } = await query;

      if (queryError) throw queryError;

      // Load pending operations from IndexedDB queue
      const queue = await getQueue();
      const pendingOps = queue.filter(op => op.type === 'calendar');
      const pendingAppointments: Appointment[] = pendingOps
        .filter(op => op.status === 'pending' && op.operation === 'create_appointment')
        .map(op => {
          const dateTime = new Date((op.payload as any).dateTime);
          return {
            id: op.id?.toString() || '',
            business_id: business.id,
            industry: business.industry || 'retail',
            customer_name: (op.payload as any).customerId || 'Unknown',
            service_name: (op.payload as any).service || '',
            appointment_date: dateTime.toISOString().split('T')[0],
            appointment_time: dateTime.toTimeString().split(' ')[0],
            duration: (op.payload as any).duration,
            notes: (op.payload as any).notes,
            status: (op.payload as any).status || 'pending',
            created_at: new Date(op.timestamp).toISOString(),
            updated_at: new Date(op.timestamp).toISOString(),
            syncStatus: 'pending' as const
          };
        });

      // Merge pending + fetched data
      const allData = [...pendingAppointments, ...(results as unknown as Appointment[]) || []];
      setData(allData);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Still load pending items even if fetch fails
      if (business?.id) {
        const queue = await getQueue();
        const pendingOps = queue.filter(op => op.type === 'calendar');
        const pendingAppointments: Appointment[] = pendingOps
          .filter(op => op.status === 'pending' && op.operation === 'create_appointment')
          .map(op => {
            const dateTime = new Date((op.payload as any).dateTime);
            return {
              id: op.id?.toString() || '',
              business_id: business.id,
              industry: business.industry || 'retail',
              customer_name: (op.payload as any).customerId || 'Unknown',
              service_name: (op.payload as any).service || '',
              appointment_date: dateTime.toISOString().split('T')[0],
              appointment_time: dateTime.toTimeString().split(' ')[0],
              duration: (op.payload as any).duration,
              notes: (op.payload as any).notes,
              status: (op.payload as any).status || 'pending',
              created_at: new Date(op.timestamp).toISOString(),
              updated_at: new Date(op.timestamp).toISOString(),
              syncStatus: 'pending' as const
            };
          });
        setData(pendingAppointments);
      } else {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, [business?.id, business?.industry, options.select, options.limit, options.orderBy?.column, options.orderBy?.ascending]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const insert = async (newData: any) => {
    if (!business) throw new Error('No business context');

    try {
      const appointmentData = {
        ...newData,
        business_id: business.id
      };

      // If online, try direct API call first
      if (isOnline) {
        try {
          const { data: result, error } = await supabase
            .from('appointments')
            .insert(appointmentData)
            .select()
            .single();

          if (error) throw error;

          setData(prev => [result, ...prev]);
          return result;
        } catch (apiError) {
          console.warn('⚠️ API call failed, falling back to offline queue:', apiError);
          // Fall through to offline queue
        }
      }

      // Always queue for offline/sync or as fallback
      const operationId = addCalendarOperation('create_appointment', {
        customerId: appointmentData.customer_name, // Using customer name as ID for now
        service: appointmentData.service_name,
        dateTime: new Date(`${appointmentData.appointment_date} ${appointmentData.appointment_time}`),
        duration: appointmentData.duration || 30,
        notes: appointmentData.notes,
        status: appointmentData.status || 'pending'
      });

      // Return optimistic update
      const optimisticAppointment = {
        ...appointmentData,
        id: operationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        syncStatus: 'pending' // Add sync status field for pending items
      } as Appointment;

      setData(prev => [optimisticAppointment, ...prev]);
      return optimisticAppointment;

    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    if (!business) throw new Error('No business context');

    try {
      const { data: result, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .eq('business_id', business.id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(item => item.id === id ? result : item));
      return result;
    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const remove = async (id: string) => {
    if (!business) throw new Error('No business context');

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('business_id', business.id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const dateCompare = a.appointment_date.localeCompare(b.appointment_date);
    if (dateCompare !== 0) return dateCompare;
    return a.appointment_time.localeCompare(b.appointment_time);
  });

  const confirmAppointment = async (id: string) => {
    return update(id, { status: 'confirmed' });
  };

  const completeAppointment = async (id: string, addTransaction?: any, getServiceById?: any) => {
    try {
      const appointment = data.find(apt => apt.id === id);
      if (!appointment) throw new Error('Appointment not found');

      // Only create transaction if there's a service_id and the appointment isn't already completed
      if (appointment.service_id && appointment.status !== 'completed' && addTransaction && getServiceById) {
        // Get service details to fetch the price
        const service = await getServiceById(appointment.service_id);
        if (!service) {
          throw new Error('Service not found for this appointment');
        }

        // Create money-in transaction for the service fee
        await addTransaction({
          business_id: appointment.business_id,
          industry: appointment.industry,
          amount: service.price,
          category: 'Service Fee',
          description: `Service fee - ${appointment.service_name}`,
          customer_name: appointment.customer_name,
          payment_method: 'cash',
          transaction_date: new Date().toISOString().split('T')[0],
          metadata: {
            appointment_id: appointment.id,
            service_id: appointment.service_id,
            completion_date: new Date().toISOString(),
            service_name: appointment.service_name,
            service_price: service.price
          }
        });
      }

      return update(id, { status: 'completed' });
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to complete appointment');
    }
  };

  const cancelAppointment = async (id: string) => {
    return update(id, { status: 'cancelled' });
  };

  // Get calculated values
  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return sortedData.filter(apt => 
      apt.appointment_date === today && 
      apt.status !== 'completed' && 
      apt.status !== 'cancelled'
    );
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return sortedData.filter(apt => 
      new Date(`${apt.appointment_date} ${apt.appointment_time}`) > today &&
      apt.status !== 'completed' &&
      apt.status !== 'cancelled'
    );
  };

  const getAppointmentsByStatus = (status: Appointment['status']) => {
    return sortedData.filter(apt => apt.status === status);
  };

  const getTotalAppointments = () => {
    return sortedData.length;
  };

  const getCompletedAppointments = () => {
    return sortedData.filter(apt => apt.status === 'completed');
  };

  const getPendingAppointments = () => {
    return sortedData.filter(apt => apt.status === 'pending');
  };

  return {
    data: sortedData,
    loading,
    error,
    insert,
    update,
    remove,
    refresh: fetchData,
    confirmAppointment,
    completeAppointment,
    cancelAppointment,
    getTodayAppointments,
    getUpcomingAppointments,
    getAppointmentsByStatus,
    getTotalAppointments,
    getCompletedAppointments,
    getPendingAppointments,
    appointments: sortedData,
    fetchAppointments: fetchData,
    // Aliases for backward compatibility
    addAppointment: insert,
    updateAppointment: update,
    deleteAppointment: remove,
    refetch: fetchData
  };
}
