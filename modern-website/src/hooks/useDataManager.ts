/**
 * React hook for the centralized Data Manager
 * Provides easy access to data operations with React integration
 */

import { useState, useEffect, useCallback } from 'react';
import { getDataManager, DataManager, SyncStatus, DataManagerConfig } from '@/lib/data-manager';

export interface UseDataManagerOptions {
  businessId: string;
  industry: string;
  country: string;
}

export interface UseDataManagerReturn<T = any> {
  // Data operations
  create: (table: string, data: T, priority?: 'high' | 'normal' | 'low') => Promise<string>;
  update: (table: string, id: string, data: Partial<T>, priority?: 'high' | 'normal' | 'low') => Promise<void>;
  delete: (table: string, id: string, priority?: 'high' | 'normal' | 'low') => Promise<void>;
  get: (table: string, id: string) => Promise<T | null>;
  query: (table: string, filters?: Record<string, any>) => Promise<T[]>;
  
  // Sync operations
  forceSync: () => Promise<void>;
  syncStatus: SyncStatus;
  
  // Utility operations
  clearLocalData: () => Promise<void>;
  
  // Data manager instance
  dataManager: DataManager;
}

export function useDataManager<T = any>(options: UseDataManagerOptions): UseDataManagerReturn<T> {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingOperations: 0,
    hasErrors: false
  });

  // Get or create data manager instance
  const [dataManager] = useState(() => {
    const config: DataManagerConfig = {
      businessId: options.businessId,
      industry: options.industry,
      country: options.country
    };
    return getDataManager(config);
  });

  // Subscribe to sync status changes
  useEffect(() => {
    const unsubscribe = dataManager.onSyncStatusChange(setSyncStatus);
    return unsubscribe;
  }, [dataManager]);

  // Listen for network changes
  useEffect(() => {
    const handleOnline = () => setSyncStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Data operations
  const create = useCallback(
    (table: string, data: T, priority?: 'high' | 'normal' | 'low') => 
      dataManager.create(table, data, priority),
    [dataManager]
  );

  const update = useCallback(
    (table: string, id: string, data: Partial<T>, priority?: 'high' | 'normal' | 'low') => 
      dataManager.update(table, id, data, priority),
    [dataManager]
  );

  const deleteItem = useCallback(
    (table: string, id: string, priority?: 'high' | 'normal' | 'low') => 
      dataManager.delete(table, id, priority),
    [dataManager]
  );

  const get = useCallback(
    (table: string, id: string) => 
      dataManager.get<T>(table, id),
    [dataManager]
  );

  const query = useCallback(
    (table: string, filters?: Record<string, any>) => 
      dataManager.query<T>(table, filters),
    [dataManager]
  );

  const forceSync = useCallback(
    () => dataManager.forceSync(),
    [dataManager]
  );

  const clearLocalData = useCallback(
    () => dataManager.clearLocalData(),
    [dataManager]
  );

  return {
    create,
    update,
    delete: deleteItem,
    get,
    query,
    forceSync,
    syncStatus,
    clearLocalData,
    dataManager
  };
}

// Type-specific hooks for better TypeScript support

export function useInventoryDataManager(options: UseDataManagerOptions) {
  return useDataManager<any>(options);
}

export function useServicesDataManager(options: UseDataManagerOptions) {
  return useDataManager<any>(options);
}

export function useAppointmentsDataManager(options: UseDataManagerOptions) {
  return useDataManager<any>(options);
}

export function useTransactionsDataManager(options: UseDataManagerOptions) {
  return useDataManager<any>(options);
}
