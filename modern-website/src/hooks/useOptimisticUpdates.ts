import { useState, useCallback } from 'react';

export interface OptimisticItem<T> {
  id: string;
  data: T;
  status: 'pending' | 'synced' | 'error';
  timestamp: number;
}

export interface UseOptimisticUpdatesOptions<T> {
  key?: string;
  ttl?: number; // Time to live in milliseconds
}

export function useOptimisticUpdates<T = any>(options: UseOptimisticUpdatesOptions<T> = {}) {
  const [items, setItems] = useState<OptimisticItem<T>[]>([]);
  const { key = 'default', ttl = 30000 } = options; // 30 seconds default TTL

  const addItem = useCallback((data: T, id?: string) => {
    const optimisticItem: OptimisticItem<T> = {
      id: id || `temp-${Date.now()}-${Math.random()}`,
      data,
      status: 'pending',
      timestamp: Date.now()
    };

    setItems(prev => [...prev, optimisticItem]);

    // Auto-remove after TTL
    if (ttl > 0) {
      setTimeout(() => {
        removeItem(optimisticItem.id);
      }, ttl);
    }

    return optimisticItem.id;
  }, [ttl]);

  const updateItem = useCallback((id: string, data: Partial<T>, status: OptimisticItem<T>['status'] = 'synced') => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, data: { ...item.data, ...data }, status, timestamp: Date.now() }
        : item
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const markAsSynced = useCallback((id: string, finalData?: T) => {
    if (finalData) {
      updateItem(id, finalData, 'synced');
    } else {
      updateItem(id, {}, 'synced');
    }
  }, [updateItem]);

  const markAsError = useCallback((id: string, errorData?: Partial<T>) => {
    if (errorData) {
      updateItem(id, errorData, 'error');
    } else {
      updateItem(id, {}, 'error');
    }
  }, [updateItem]);

  const clearItems = useCallback((status?: OptimisticItem<T>['status']) => {
    setItems(prev => {
      if (status) {
        return prev.filter(item => item.status !== status);
      }
      return [];
    });
  }, []);

  const clearExpired = useCallback(() => {
    const now = Date.now();
    setItems(prev => prev.filter(item => 
      (now - item.timestamp) < ttl
    ));
  }, [ttl]);

  const getData = useCallback((syncStatus?: OptimisticItem<T>['status']) => {
    let filteredItems = items;
    
    if (syncStatus) {
      filteredItems = items.filter(item => item.status === syncStatus);
    }
    
    return filteredItems.map(item => item.data);
  }, [items]);

  const getPendingCount = useCallback(() => {
    return items.filter(item => item.status === 'pending').length;
  }, [items]);

  const getErrorCount = useCallback(() => {
    return items.filter(item => item.status === 'error').length;
  }, [items]);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    markAsSynced,
    markAsError,
    clearItems,
    clearExpired,
    getData,
    getPendingCount,
    getErrorCount
  };
}
