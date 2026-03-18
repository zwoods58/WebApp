/**
 * Optimistic Updates Hook
 * Provides automatic optimistic UI updates with sync status tracking
 */

import { useState, useEffect, useCallback } from 'react';
import { getQueue } from '@/utils/offlineQueue';

export interface OptimisticItem<T = any> {
  id: string;
  data: T;
  status: 'synced' | 'pending' | 'syncing' | 'error';
  createdAt: number;
  operationId?: string;
}

export interface UseOptimisticUpdatesOptions<T> {
  feature: string;
  initialData?: T[];
  getId?: (item: T) => string;
  transformPending?: (operation: any) => T;
}

export function useOptimisticUpdates<T extends { id: string }>({
  feature,
  initialData = [],
  getId = (item) => item.id,
  transformPending
}: UseOptimisticUpdatesOptions<T>) {
  const [items, setItems] = useState<OptimisticItem<T>[]>(() => 
    initialData.map(item => ({
      id: getId(item),
      data: item,
      status: 'synced' as const,
      createdAt: Date.now()
    }))
  );

  const [isOptimistic, setIsOptimistic] = useState(false);

  // Load pending operations on mount
  useEffect(() => {
    const loadPendingOps = async () => {
      const pendingOps = await getQueue();
      const optimisticItems = pendingOps
        .filter((op: any) => op.status === 'pending' && op.type === feature)
        .map((op: any) => {
          const transformedData = transformPending ? transformPending(op) : op.data as unknown as T;
          return {
            id: op.id,
            data: transformedData,
            status: 'pending' as const,
            createdAt: op.timestamp,
            operationId: op.id
          } as OptimisticItem<T>;
        });

      if (optimisticItems.length > 0) {
        setItems(prev => [...optimisticItems, ...prev]);
        setIsOptimistic(true);
      }
    };

    loadPendingOps();
  }, [feature, transformPending]);

  // Listen for sync status updates
  useEffect(() => {
    const handleSyncComplete = (event: Event) => {
      const customEvent = event as CustomEvent<{ operationId: string; feature: string }>;
      
      if (customEvent.detail.feature === feature) {
        const operationId = customEvent.detail.operationId;
        
        setItems(prev => prev.map(item => {
          if (item.operationId === operationId || item.id === operationId) {
            return { ...item, status: 'synced' as const };
          }
          return item;
        }));

        // Remove synced items after a delay
        setTimeout(() => {
          setItems(prev => prev.filter(item => item.status !== 'synced' || !item.operationId));
          setIsOptimistic(false);
        }, 1000);
      }
    };

    const handleSyncStart = (event: Event) => {
      const customEvent = event as CustomEvent<{ operationId: string; feature: string }>;
      
      if (customEvent.detail.feature === feature) {
        const operationId = customEvent.detail.operationId;
        
        setItems(prev => prev.map(item => {
          if (item.operationId === operationId || item.id === operationId) {
            return { ...item, status: 'syncing' as const };
          }
          return item;
        }));
      }
    };

    const handleSyncError = (event: Event) => {
      const customEvent = event as CustomEvent<{ operationId: string; feature: string; error: string }>;
      
      if (customEvent.detail.feature === feature) {
        const operationId = customEvent.detail.operationId;
        
        setItems(prev => prev.map(item => {
          if (item.operationId === operationId || item.id === operationId) {
            return { ...item, status: 'error' as const };
          }
          return item;
        }));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('offline-sync-complete', handleSyncComplete);
      window.addEventListener('offline-sync-start', handleSyncStart);
      window.addEventListener('offline-sync-error', handleSyncError);
      
      return () => {
        window.removeEventListener('offline-sync-complete', handleSyncComplete);
        window.removeEventListener('offline-sync-start', handleSyncStart);
        window.removeEventListener('offline-sync-error', handleSyncError);
      };
    }
  }, [feature]);

  // Add optimistic item
  const addOptimistic = useCallback((data: T, operationId?: string) => {
    const optimisticItem: OptimisticItem<T> = {
      id: getId(data),
      data,
      status: 'pending',
      createdAt: Date.now(),
      operationId
    };

    setItems(prev => [optimisticItem, ...prev]);
    setIsOptimistic(true);
    
    return optimisticItem;
  }, [getId]);

  // Update optimistic item
  const updateOptimistic = useCallback((id: string, updates: Partial<T>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          data: { ...item.data, ...updates }
        };
      }
      return item;
    }));
  }, []);

  // Remove optimistic item
  const removeOptimistic = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Get data with optimistic updates
  const getData = useCallback((syncStatus?: OptimisticItem['status']) => {
    let filteredItems = items;
    
    if (syncStatus) {
      filteredItems = items.filter(item => item.status === syncStatus);
    }
    
    return filteredItems.map(item => item.data);
  }, [items]);

  // Get items by status
  const getItemsByStatus = useCallback((status: OptimisticItem['status']) => {
    return items.filter(item => item.status === status);
  }, [items]);

  // Check if has optimistic items
  const hasOptimisticItems = useCallback(() => {
    return items.some(item => item.status === 'pending' || item.status === 'syncing');
  }, [items]);

  // Merge with server data
  const mergeWithServerData = useCallback((serverData: T[]) => {
    const serverItems = serverData.map(item => ({
      id: getId(item),
      data: item,
      status: 'synced' as const,
      createdAt: Date.now()
    }));

    // Keep optimistic items that aren't synced yet
    const optimisticItems = items.filter(item => 
      item.status === 'pending' || item.status === 'syncing'
    );

    setItems([...optimisticItems, ...serverItems]);
  }, [items, getId]);

  return {
    items,
    isOptimistic,
    addOptimistic,
    updateOptimistic,
    removeOptimistic,
    getData,
    getItemsByStatus,
    hasOptimisticItems,
    mergeWithServerData,
    
    // Convenience getters
    pendingItems: getItemsByStatus('pending'),
    syncingItems: getItemsByStatus('syncing'),
    errorItems: getItemsByStatus('error'),
    syncedItems: getItemsByStatus('synced')
  };
}

export default useOptimisticUpdates;
