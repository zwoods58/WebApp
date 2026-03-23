import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, QueuedOperation } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import { getOnlineStatus } from '@/lib/connection-manager';
import { swManager } from '@/lib/serviceWorker';

/**
 * Generic hook for offline-first data operations
 * Wraps TanStack Query with IndexedDB caching
 */
export function useOfflineData<T = any>({
  table,
  businessId,
  queryKey,
  select = (data: any) => data
}: {
  table: string;
  businessId: string;
  queryKey: any[];
  select?: (data: any) => T;
}) {
  const queryClient = useQueryClient();
  const isOnline = getOnlineStatus();
  
  // Query: Get data from IndexedDB first, then sync with Supabase
  const query = useQuery({
    queryKey: [...queryKey, businessId],
    queryFn: async () => {
      // STEP 1: Get from IndexedDB cache
      let cachedData: any[] = [];
      
      switch (table) {
        case 'transactions':
          cachedData = await db.transactions
            .where('business_id')
            .equals(businessId)
            .toArray();
          break;
        case 'inventory':
          cachedData = await db.inventory
            .where('business_id')
            .equals(businessId)
            .toArray();
          break;
        case 'credit':
          cachedData = await db.credit
            .where('business_id')
            .equals(businessId)
            .toArray();
          break;
        default:
          cachedData = [];
      }
      
      // STEP 2: If online, fetch latest from Supabase and update cache
      if (isOnline) {
        try {
          const { data: freshData, error } = await supabase
            .from(table)
            .select('*')
            .eq('business_id', businessId);
          
          if (!error && freshData) {
            // Update IndexedDB with fresh data
            for (const item of freshData) {
              await updateCache(table, { ...item, syncStatus: 'synced' });
            }
            return select(freshData);
          }
        } catch (error) {
          console.warn(`Failed to sync ${table} from Supabase:`, error);
        }
      }
      
      // STEP 3: Return cached data (filter out pending deletions)
      const filteredData = cachedData.filter(item => !item._deleted);
      return select(filteredData);
    },
    staleTime: isOnline ? 5 * 60 * 1000 : Infinity, // Never stale offline
  });
  
  // Mutation: Create (queues if offline)
  const createMutation = useMutation({
    mutationFn: async (newData: any) => {
      const idempotencyKey = crypto.randomUUID();
      const operation: QueuedOperation = {
        id: crypto.randomUUID(),
        type: 'CREATE',
        table: table as any,
        data: newData,
        timestamp: Date.now(),
        idempotencyKey,
        status: 'pending',
        retryCount: 0,
        businessId
      };
      
      // Add to offline queue
      await db.operations_queue.add(operation);
      
      // Add to IndexedDB cache with pending status
      const cachedItem = {
        ...newData,
        id: operation.id,
        business_id: businessId,
        syncStatus: 'pending',
        _offlineId: operation.id
      };
      await updateCache(table, cachedItem);
      
      // If online, try to sync immediately
      if (isOnline) {
        await swManager.triggerSync();
      }
      
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: [...queryKey, businessId] });
      
      return cachedItem;
    }
  });
  
  // Mutation: Update
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const idempotencyKey = crypto.randomUUID();
      const operation: QueuedOperation = {
        id: crypto.randomUUID(),
        type: 'UPDATE',
        table: table as any,
        entityId: id,
        data,
        timestamp: Date.now(),
        idempotencyKey,
        status: 'pending',
        retryCount: 0,
        businessId
      };
      
      await db.operations_queue.add(operation);
      await updateCache(table, { ...data, id, syncStatus: 'pending' });
      
      if (isOnline) await swManager.triggerSync();
      queryClient.invalidateQueries({ queryKey: [...queryKey, businessId] });
      
      return { id, ...data };
    }
  });
  
  // Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const operation: QueuedOperation = {
        id: crypto.randomUUID(),
        type: 'DELETE',
        table: table as any,
        entityId: id,
        data: null,
        timestamp: Date.now(),
        idempotencyKey: crypto.randomUUID(),
        status: 'pending',
        retryCount: 0,
        businessId
      };
      
      await db.operations_queue.add(operation);
      await deleteFromCache(table, id);
      
      if (isOnline) await swManager.triggerSync();
      queryClient.invalidateQueries({ queryKey: [...queryKey, businessId] });
      
      return id;
    }
  });
  
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    create: createMutation.mutate,
    createAsync: createMutation.mutateAsync,
    update: updateMutation.mutate,
    updateAsync: updateMutation.mutateAsync,
    delete: deleteMutation.mutate,
    deleteAsync: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch: query.refetch
  };
}

// Helper: Update cache based on table
async function updateCache(table: string, data: any): Promise<void> {
  switch (table) {
    case 'transactions':
      await db.transactions.put(data);
      break;
    case 'inventory':
      await db.inventory.put(data);
      break;
    case 'credit':
      await db.credit.put(data);
      break;
  }
}

// Helper: Delete from cache
async function deleteFromCache(table: string, id: string): Promise<void> {
  switch (table) {
    case 'transactions':
      await db.transactions.delete(id);
      break;
    case 'inventory':
      await db.inventory.delete(id);
      break;
    case 'credit':
      await db.credit.delete(id);
      break;
  }
}
