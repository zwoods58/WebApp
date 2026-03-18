import { useEffect, useState, useCallback } from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/lib/supabase';
import { useOfflineData } from '@/hooks/useOfflineData';
import { getQueue } from '@/utils/offlineQueue';

export interface Service {
  id: string;
  business_id: string;
  industry: string;
  service_name: string;
  category?: string;
  price: number;
  duration?: number;
  description?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  status?: 'synced' | 'pending' | 'error'; // Add status for offline support
}

export interface UseServicesOptions {
  businessId?: string;
  industry?: string;
  category?: string;
  activeOnly?: boolean;
  serviceName?: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

export function useServices(options: UseServicesOptions = {}) {
  const { business } = useBusiness();
  const { isOnline, addInventoryOperation } = useOfflineData();
  const [data, setData] = useState<Service[]>([]);
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
        .from('services')
        .select(options.select || '*')
        .eq('business_id', business.id);

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const orderBy = options.orderBy || { column: 'service_name', ascending: true };
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: results, error: queryError } = await query;

      if (queryError) throw queryError;

      // Load pending operations from IndexedDB queue
      const queue = await getQueue();
      const pendingOps = queue.filter(op => op.type === 'inventory');
      const pendingServices: Service[] = pendingOps
        .filter(op => op.status === 'pending' && op.operation === 'add_item')
        .map(op => ({
          id: op.id?.toString() || '',
          business_id: business.id,
          industry: business.industry || 'retail',
          service_name: (op.payload as any).itemName || '',
          category: (op.payload as any).category || 'general',
          price: (op.payload as any).price || 0,
          duration: (op.payload as any).duration,
          description: (op.payload as any).description,
          is_active: (op.payload as any).availability !== false,
          created_at: new Date(op.timestamp).toISOString(),
          updated_at: new Date(op.timestamp).toISOString(),
          status: 'pending' as const
        }));

      // Merge pending + fetched data
      const allData = [...pendingServices, ...(results as unknown as Service[]) || []];
      setData(allData);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Still load pending items even if fetch fails
      if (business?.id) {
        const queue = await getQueue();
        const pendingOps = queue.filter(op => op.type === 'inventory');
        const pendingServices: Service[] = pendingOps
          .filter(op => op.status === 'pending' && op.operation === 'add_item')
          .map(op => ({
            id: op.id?.toString() || '',
            business_id: business.id,
            industry: business.industry || 'retail',
            service_name: (op.payload as any).itemName || '',
            category: (op.payload as any).category || 'general',
            price: (op.payload as any).price || 0,
            duration: (op.payload as any).duration,
            description: (op.payload as any).description,
            is_active: (op.payload as any).availability !== false,
            created_at: new Date(op.timestamp).toISOString(),
            updated_at: new Date(op.timestamp).toISOString(),
            status: 'pending' as const
          }));
        setData(pendingServices);
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

  // Listen for force refresh events
  useEffect(() => {
    const handleForceRefresh = () => {
      fetchData();
    };

    // Listen for sync completion events
    const handleSyncComplete = (event: Event) => {
      const customEvent = event as CustomEvent<{ operationId: string; feature: string }>;
      if (customEvent.detail.feature === 'inventory') {
        fetchData(); // Refresh data when inventory operations sync
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('force-refresh-data', handleForceRefresh);
      window.addEventListener('offline-sync-complete', handleSyncComplete);
      return () => {
        window.removeEventListener('force-refresh-data', handleForceRefresh);
        window.removeEventListener('offline-sync-complete', handleSyncComplete);
      };
    }
  }, [fetchData]);

  const insert = async (newData: any) => {
    if (!business) throw new Error('No business context');

    try {
      const serviceData = {
        ...newData,
        business_id: business.id
      };

      // If online, try direct API call first
      if (isOnline) {
        try {
          const { data: result, error } = await supabase
            .from('services')
            .insert(serviceData)
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
      const operationId = addInventoryOperation('add_item', {
        itemName: serviceData.service_name,
        stockLevel: 1, // Services are typically "in stock" by default
        price: serviceData.price,
        category: serviceData.category || 'general',
        availability: serviceData.is_active !== false
      });

      // Return optimistic update
      const optimisticService = {
        ...serviceData,
        id: operationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'pending' // Add status field for pending items
      } as Service;

      setData(prev => [optimisticService, ...prev]);
      return optimisticService;

    } catch (err) {
      await fetchData();
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    if (!business) throw new Error('No business context');

    try {
      const { data: result, error } = await supabase
        .from('services')
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
        .from('services')
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

  const filteredData = data.filter((service: Service) => {
    if (options.activeOnly && !service.is_active) return false;
    if (options.serviceName && !service.service_name.toLowerCase().includes(options.serviceName.toLowerCase())) return false;
    return true;
  });

  const toggleServiceStatus = async (id: string) => {
    const service = data.find((s: Service) => s.id === id);
    if (!service) throw new Error('Service not found');

    return update(id, { is_active: !service.is_active });
  };

  const getActiveServices = () => {
    return filteredData.filter((service: Service) => service.is_active);
  };

  const getCategories = () => {
    return Array.from(new Set(filteredData.map((service: Service) => service.category).filter(Boolean)));
  };

  const getServicesByCategory = (category: string) => {
    return filteredData.filter((service: Service) => service.category === category);
  };

  const getTotalServices = () => {
    return filteredData.length;
  };

  const getActiveServicesCount = () => {
    return filteredData.filter((service: Service) => service.is_active).length;
  };

  const getAverageRating = () => {
    return 0;
  };

  const getTotalRevenue = () => {
    return 0;
  };

  const getServiceById = async (id: string): Promise<Service | null> => {
    try {
      // First check if service is in local data
      const localService = data.find(s => s.id === id);
      if (localService) return localService;

      // If not found locally, fetch from database
      if (!business?.id) return null;

      const { data: result, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .eq('business_id', business.id)
        .single();

      if (error) throw error;
      return result;
    } catch (err) {
      console.error('Error fetching service by ID:', err);
      return null;
    }
  };

  return {
    data: filteredData,
    loading,
    error,
    insert,
    update,
    remove,
    refresh: fetchData,
    toggleServiceStatus,
    getActiveServices,
    getCategories,
    getServicesByCategory,
    getTotalServices,
    getActiveServicesCount,
    getAverageRating,
    getTotalRevenue,
    getServiceById,
    services: filteredData,
    fetchServices: fetchData
  };
}
