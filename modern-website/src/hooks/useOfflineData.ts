/**
 * Offline Data Hook
 * Provides offline-first functionality for all app features
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  OfflineOperation, 
  SyncStatus, 
  BeehiveOfflineOperation,
  CashOfflineOperation,
  InventoryOfflineOperation,
  CalendarOfflineOperation,
  CreditOfflineOperation,
  SYNC_PRIORITY
} from '@/types/offlineTypes';
import { offlineQueueManager } from '@/utils/offlineQueue';
import { localStorageManager } from '@/utils/localStorageManager';

export interface UseOfflineDataReturn {
  isOnline: boolean;
  syncStatus: SyncStatus;
  pendingCount: number;
  isOfflineMode: boolean;
  
  // Feature-specific operations
  addBeehiveOperation: (type: BeehiveOfflineOperation['type'], data: BeehiveOfflineOperation['data']) => string;
  addCashOperation: (type: CashOfflineOperation['type'], data: CashOfflineOperation['data']) => string;
  addInventoryOperation: (type: InventoryOfflineOperation['type'], data: InventoryOfflineOperation['data']) => string;
  addCalendarOperation: (type: CalendarOfflineOperation['type'], data: CalendarOfflineOperation['data']) => string;
  addCreditOperation: (type: CreditOfflineOperation['type'], data: CreditOfflineOperation['data']) => string;
  
  // Utility functions
  forceSync: () => void;
  clearPending: () => void;
  getPendingByFeature: (feature: string) => number;
}

export const useOfflineData = (): UseOfflineDataReturn => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(offlineQueueManager.getSyncStatus());
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsOfflineMode(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update sync status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(offlineQueueManager.getSyncStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Listen for sync status updates
  useEffect(() => {
    const handleSyncUpdate = () => {
      setSyncStatus(offlineQueueManager.getSyncStatus());
    };

    window.addEventListener('sync-status-update', handleSyncUpdate);
    return () => window.removeEventListener('sync-status-update', handleSyncUpdate);
  }, []);

  // Get total pending count
  const pendingCount = useCallback(() => {
    return offlineQueueManager.getPendingCount();
  }, []);

  // Beehive operations
  const addBeehiveOperation = useCallback((
    type: BeehiveOfflineOperation['type'], 
    data: BeehiveOfflineOperation['data']
  ): string => {
    const sessionData = localStorageManager.get('sessionData') as any;
    const userId = sessionData?.userId || 'anonymous';
    
    const operation: Omit<BeehiveOfflineOperation, 'id' | 'timestamp' | 'retryCount'> = {
      feature: 'beehive',
      type,
      data,
      status: 'pending',
      priority: type === 'profile_update' ? SYNC_PRIORITY.HIGH : SYNC_PRIORITY.MEDIUM,
      userId
    };

    return offlineQueueManager.addOperation(operation);
  }, []);

  // Cash operations
  const addCashOperation = useCallback((
    type: CashOfflineOperation['type'], 
    data: CashOfflineOperation['data']
  ): string => {
    const sessionData = localStorageManager.get('sessionData') as any;
    const userId = sessionData?.userId || 'anonymous';
    
    const operation: Omit<CashOfflineOperation, 'id' | 'timestamp' | 'retryCount'> = {
      feature: 'cash',
      type,
      data,
      status: 'pending',
      priority: SYNC_PRIORITY.HIGH, // Financial operations are highest priority
      userId
    };

    return offlineQueueManager.addOperation(operation);
  }, []);

  // Inventory operations
  const addInventoryOperation = useCallback((
    type: InventoryOfflineOperation['type'], 
    data: InventoryOfflineOperation['data']
  ): string => {
    const sessionData = localStorageManager.get('sessionData') as any;
    const userId = sessionData?.userId || 'anonymous';
    
    const operation: Omit<InventoryOfflineOperation, 'id' | 'timestamp' | 'retryCount'> = {
      feature: 'inventory',
      type,
      data,
      status: 'pending',
      priority: SYNC_PRIORITY.HIGH, // Inventory is critical for business
      userId
    };

    return offlineQueueManager.addOperation(operation);
  }, []);

  // Calendar operations
  const addCalendarOperation = useCallback((
    type: CalendarOfflineOperation['type'], 
    data: CalendarOfflineOperation['data']
  ): string => {
    const sessionData = localStorageManager.get('sessionData') as any;
    const userId = sessionData?.userId || 'anonymous';
    
    const operation: Omit<CalendarOfflineOperation, 'id' | 'timestamp' | 'retryCount'> = {
      feature: 'calendar',
      type,
      data,
      status: 'pending',
      priority: type === 'create_appointment' ? SYNC_PRIORITY.HIGH : SYNC_PRIORITY.MEDIUM,
      userId
    };

    return offlineQueueManager.addOperation(operation);
  }, []);

  // Credit operations
  const addCreditOperation = useCallback((
    type: CreditOfflineOperation['type'], 
    data: CreditOfflineOperation['data']
  ): string => {
    const sessionData = localStorageManager.get('sessionData') as any;
    const userId = sessionData?.userId || 'anonymous';
    
    const operation: Omit<CreditOfflineOperation, 'id' | 'timestamp' | 'retryCount'> = {
      feature: 'credit',
      type,
      data,
      status: 'pending',
      priority: type === 'issue_credit' ? SYNC_PRIORITY.HIGH : SYNC_PRIORITY.MEDIUM,
      userId
    };

    return offlineQueueManager.addOperation(operation);
  }, []);

  // Force sync
  const forceSync = useCallback(() => {
    if (isOnline) {
      offlineQueueManager.processQueue();
    }
  }, [isOnline]);

  // Clear pending operations
  const clearPending = useCallback(() => {
    offlineQueueManager.clearQueue();
  }, []);

  // Get pending count by feature
  const getPendingByFeature = useCallback((feature: string): number => {
    return offlineQueueManager.getPendingCount(feature);
  }, []);

  return {
    isOnline,
    syncStatus,
    pendingCount: pendingCount(),
    isOfflineMode,
    
    // Feature-specific operations
    addBeehiveOperation,
    addCashOperation,
    addInventoryOperation,
    addCalendarOperation,
    addCreditOperation,
    
    // Utility functions
    forceSync,
    clearPending,
    getPendingByFeature,
  };
};

export default useOfflineData;
