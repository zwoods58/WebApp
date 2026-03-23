'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { db, QueuedOperation } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import { getOnlineStatus } from '@/lib/connection-manager';
import { swManager } from '@/lib/serviceWorker';
import { syncProcessor } from '@/lib/sync-processor';

type TableName = 'transactions' | 'inventory' | 'credit' | 'expenses' | 'services' | 'appointments' | 'beehive' | 'targets';

export const useIndustryDataNew = ({
  industry,
  country,
  table,
  select,
  enabled = true,
  businessId: externalBusinessId,
}: {
  industry: string;
  country: string;
  table: TableName;
  select?: string;
  enabled?: boolean;
  businessId?: string;
}) => {
  const queryClient = useQueryClient();
  const { business } = useUnifiedAuth();
  const businessId = externalBusinessId || business?.id;
  const isOnline = getOnlineStatus();

  const hasRequiredParams = !!(industry && country && table && businessId);
  
  // Only log in development and only if we have some params but not all (to catch actual issues)
  if (!hasRequiredParams && process.env.NODE_ENV === 'development') {
    // Only warn if we have industry/country but missing businessId (initial load is expected)
    if (industry && country && table && !businessId) {
      // This is expected during initial auth load, so use debug level logging
      console.debug('[useIndustryDataNew] Waiting for businessId:', { industry, country, table });
    } else {
      console.warn('[useIndustryDataNew] Missing required params:', { industry, country, table, businessId });
    }
  }

  // ============================================================
  // QUERY
  // ============================================================
  const query = useQuery({
    queryKey: [table, industry, country, businessId].filter(Boolean),
    queryFn: async () => {
      if (!businessId) return [];
      
      let cachedData: any[] = [];
      
      try {
        switch (table) {
          case 'transactions':
            cachedData = await db.transactions.where('business_id').equals(businessId).toArray();
            break;
          case 'inventory':
            cachedData = await db.inventory.where('business_id').equals(businessId).toArray();
            break;
          case 'credit':
            cachedData = await db.credit.where('business_id').equals(businessId).toArray();
            break;
          case 'expenses':
            cachedData = await db.expenses.where('business_id').equals(businessId).toArray();
            break;
          case 'services':
            cachedData = await db.services.where('business_id').equals(businessId).toArray();
            break;
          case 'appointments':
            cachedData = await db.appointments.where('business_id').equals(businessId).toArray();
            break;
          case 'targets':
            cachedData = await db.targets.where('business_id').equals(businessId).toArray();
            break;
          default:
            cachedData = await db.table(table as any).where('business_id').equals(businessId).toArray().catch(() => []);
        }
      } catch (error) {
        console.warn(`[useIndustryDataNew] Failed to read from IndexedDB for ${table}:`, error);
        cachedData = [];
      }

      // Filter out soft-deleted items
      const filteredData = Array.isArray(cachedData) ? cachedData.filter(item => !item._deleted) : [];

      // Refresh from Supabase in background if online
      if (isOnline) {
        refreshFromSupabase().catch(console.warn);
      }

      // Apply select filter if provided
      if (select && Array.isArray(filteredData) && filteredData.length > 0) {
        const fields = select.split(',');
        return filteredData.map(item => {
          const selected: any = {};
          fields.forEach(field => {
            const trimmedField = field.trim();
            if (item[trimmedField] !== undefined) {
              selected[trimmedField] = item[trimmedField];
            }
          });
          return selected;
        });
      }

      return filteredData;
    },
    staleTime: isOnline ? 5 * 60 * 1000 : Infinity,
    enabled: enabled && hasRequiredParams,
  });

  const refreshFromSupabase = async () => {
    try {
      let freshData: any[] = [];
      let error: any = null;

      switch (table) {
        case 'transactions':
          const { data: tData, error: tError } = await supabase
            .from('transactions')
            .select('*')
            .eq('business_id', businessId)
            .order('transaction_date', { ascending: false });
          freshData = tData || [];
          error = tError;
          break;
        case 'inventory':
          const { data: iData, error: iError } = await supabase
            .from('inventory')
            .select('*')
            .eq('business_id', businessId);
          freshData = iData || [];
          error = iError;
          break;
        case 'credit':
          const { data: cData, error: cError } = await supabase
            .from('credit')
            .select('*')
            .eq('business_id', businessId);
          freshData = cData || [];
          error = cError;
          break;
        default:
          const { data: gData, error: gError } = await supabase
            .from(table)
            .select('*')
            .eq('business_id', businessId);
          freshData = gData || [];
          error = gError;
      }

      if (error) {
        console.warn(`[useIndustryDataNew] Supabase fetch error for ${table}:`, error);
        return;
      }

      for (const item of freshData) {
        await updateCache(table, { ...item, syncStatus: 'synced' });
      }

      if (freshData.length > 0) {
        queryClient.invalidateQueries({ queryKey: [table, industry, country, businessId] });
      }
    } catch (error) {
      console.warn(`[useIndustryDataNew] Background refresh failed for ${table}:`, error);
    }
  };

  // ============================================================
  // CREATE MUTATION
  // ============================================================
  const createMutation = useMutation({
    mutationFn: async (newData: any) => {
      if (!businessId) throw new Error('Business ID required for create operation');
      
      const operationId = crypto.randomUUID();
      
      const dataToStore = {
        ...newData,
        id: newData.id || operationId,
        business_id: businessId,
        created_at: newData.created_at || new Date().toISOString(),
      };

      // Add to offline queue
      const operation: QueuedOperation = {
        id: operationId,
        type: 'CREATE',
        table: table as any,
        data: dataToStore,
        timestamp: Date.now(),
        idempotencyKey: crypto.randomUUID(),
        status: 'pending',
        retryCount: 0,
        businessId: businessId,
      };
      await db.operations_queue.add(operation);

      // Add to IndexedDB cache
      const cachedItem = {
        ...dataToStore,
        syncStatus: 'pending',
        _offlineId: operationId
      };
      await updateCache(table, cachedItem);

      // Optimistic update
      queryClient.setQueryData(
        [table, industry, country, businessId],
        (oldData: any[] | undefined) => {
          if (!oldData) return [cachedItem];
          return [cachedItem, ...oldData];
        }
      );

      if (isOnline) {
        // Trigger sync processor to immediately process the queued operation
        syncProcessor.forceSync().catch(err => 
          console.error('[useIndustryDataNew] Sync failed:', err)
        );
        await swManager.triggerSync();
      }

      return cachedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table, industry, country, businessId] });
    },
    onError: (error) => {
      console.error(`[useIndustryDataNew] Create failed for ${table}:`, error);
      queryClient.invalidateQueries({ queryKey: [table, industry, country, businessId] });
    },
  });

  // ============================================================
  // UPDATE MUTATION - CLEAN VERSION
  // ============================================================
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      if (!businessId) throw new Error('Business ID required for update operation');
      
      // Get the existing record from IndexedDB
      let existingRecord: any = null;
      try {
        switch (table) {
          case 'credit':
            existingRecord = await db.credit.get(id);
            break;
          case 'transactions':
            existingRecord = await db.transactions.get(id);
            break;
          case 'inventory':
            existingRecord = await db.inventory.get(id);
            break;
          case 'expenses':
            existingRecord = await db.expenses.get(id);
            break;
          case 'services':
            existingRecord = await db.services.get(id);
            break;
          case 'appointments':
            existingRecord = await db.appointments.get(id);
            break;
          case 'targets':
            existingRecord = await db.targets.get(id);
            break;
          default:
            existingRecord = await db.table(table as any).get(id);
        }
      } catch (err) {
        console.warn('[useIndustryDataNew] Could not fetch existing record:', err);
      }
      
      // Merge the update with existing record (preserve all fields!)
      const mergedData = existingRecord 
        ? { ...existingRecord, ...data, updated_at: new Date().toISOString() }
        : { ...data, id, updated_at: new Date().toISOString() };
      
      const operationId = crypto.randomUUID();
      
      // Add to offline queue
      const operation: QueuedOperation = {
        id: operationId,
        type: 'UPDATE',
        table: table as any,
        entityId: id,
        data: mergedData,
        timestamp: Date.now(),
        idempotencyKey: crypto.randomUUID(),
        status: 'pending',
        retryCount: 0,
        businessId: businessId,
      };
      await db.operations_queue.add(operation);
      
      // Update IndexedDB cache with merged data
      const updatedItem = {
        ...mergedData,
        id,
        syncStatus: 'pending',
        _pendingUpdate: operationId
      };
      await updateCache(table, updatedItem);
      
      // Optimistic update - use merged data to preserve all fields
      queryClient.setQueryData(
        [table, industry, country, businessId],
        (oldData: any[] | undefined) => {
          if (!oldData) return [updatedItem];
          return oldData.map((item: any) => 
            item.id === id ? { ...item, ...mergedData, syncStatus: 'pending' } : item
          );
        }
      );
      
      if (isOnline) {
        // Trigger sync processor to immediately process the queued operation
        syncProcessor.forceSync().catch(err => 
          console.error('[useIndustryDataNew] Sync failed:', err)
        );
        await swManager.triggerSync();
      }
      
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table, industry, country, businessId] });
    },
    onError: (error) => {
      console.error(`[useIndustryDataNew] Update failed for ${table}:`, error);
      queryClient.invalidateQueries({ queryKey: [table, industry, country, businessId] });
    },
  });

  // ============================================================
  // DELETE MUTATION
  // ============================================================
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!businessId) throw new Error('Business ID required for delete operation');
      
      const operationId = crypto.randomUUID();
      
      // Add to offline queue
      const operation: QueuedOperation = {
        id: operationId,
        type: 'DELETE',
        table: table as any,
        entityId: id,
        data: null,
        timestamp: Date.now(),
        idempotencyKey: crypto.randomUUID(),
        status: 'pending',
        retryCount: 0,
        businessId: businessId,
      };
      await db.operations_queue.add(operation);
      
      // Soft delete in IndexedDB
      await softDeleteFromCache(table, id);
      
      // Optimistic update - remove from cache
      queryClient.setQueryData(
        [table, industry, country, businessId],
        (oldData: any[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((item: any) => item.id !== id);
        }
      );
      
      if (isOnline) {
        // Trigger sync processor to immediately process the queued operation
        syncProcessor.forceSync().catch(err => 
          console.error('[useIndustryDataNew] Sync failed:', err)
        );
        await swManager.triggerSync();
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table, industry, country, businessId] });
    },
    onError: (error) => {
      console.error(`[useIndustryDataNew] Delete failed for ${table}:`, error);
      queryClient.invalidateQueries({ queryKey: [table, industry, country, businessId] });
    },
  });

  // ============================================================
  // Helpers
  // ============================================================
  const updateCache = async (tableName: TableName, data: any): Promise<void> => {
    try {
      switch (tableName) {
        case 'transactions':
          await db.transactions.put(data);
          break;
        case 'inventory':
          await db.inventory.put(data);
          break;
        case 'credit':
          await db.credit.put(data);
          break;
        case 'expenses':
          await db.expenses.put(data);
          break;
        case 'services':
          await db.services.put(data);
          break;
        case 'appointments':
          await db.appointments.put(data);
          break;
        case 'targets':
          await db.targets.put(data);
          break;
        default:
          await db.table(tableName as any).put(data);
      }
    } catch (error) {
      console.error(`[useIndustryDataNew] Failed to update cache for ${tableName}:`, error);
    }
  };

  const softDeleteFromCache = async (tableName: TableName, id: string): Promise<void> => {
    try {
      let existing: any;
      
      switch (tableName) {
        case 'transactions':
          existing = await db.transactions.get(id);
          if (existing) {
            await db.transactions.put({ ...existing, _deleted: true, _deletedAt: Date.now() });
          }
          break;
        case 'inventory':
          existing = await db.inventory.get(id);
          if (existing) {
            await db.inventory.put({ ...existing, _deleted: true, _deletedAt: Date.now() });
          }
          break;
        case 'credit':
          existing = await db.credit.get(id);
          if (existing) {
            await db.credit.put({ ...existing, _deleted: true, _deletedAt: Date.now() });
          }
          break;
        case 'expenses':
          existing = await db.expenses.get(id);
          if (existing) {
            await db.expenses.put({ ...existing, _deleted: true, _deletedAt: Date.now() });
          }
          break;
        case 'services':
          existing = await db.services.get(id);
          if (existing) {
            await db.services.put({ ...existing, _deleted: true, _deletedAt: Date.now() });
          }
          break;
        case 'appointments':
          existing = await db.appointments.get(id);
          if (existing) {
            await db.appointments.put({ ...existing, _deleted: true, _deletedAt: Date.now() });
          }
          break;
        case 'targets':
          existing = await db.targets.get(id);
          if (existing) {
            await db.targets.put({ ...existing, _deleted: true, _deletedAt: Date.now() });
          }
          break;
        default:
          await db.table(tableName as any).delete(id);
      }
    } catch (error) {
      console.error(`[useIndustryDataNew] Failed to soft delete from cache:`, error);
    }
  };

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    create: createMutation.mutate,
    createAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    update: updateMutation.mutate,
    updateAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    delete: deleteMutation.mutate,
    deleteAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    refetch: query.refetch,
  };
};

export default useIndustryDataNew;