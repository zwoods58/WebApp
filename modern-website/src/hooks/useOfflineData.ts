/**
 * Offline Data Hook
 * Provides offline-first functionality for all app features using new PWA architecture
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
import { addToQueue, getPendingCount, getPendingCountByType } from '@/utils/offlineQueue';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

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
  const { isOnline } = useNetworkStatus();
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingByType, setPendingByType] = useState<Record<string, number>>({});

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update offline mode based on network status
  useEffect(() => {
    setIsOfflineMode(!isOnline);
  }, [isOnline]);

  // Update pending counts from IndexedDB
  useEffect(() => {
    if (!isClient) return;

    const updateCounts = async () => {
      try {
        const total = await getPendingCount();
        const byType = await getPendingCountByType();
        
        setPendingCount(total);
        setPendingByType(byType);
      } catch (error) {
        console.error('Failed to get pending counts:', error);
      }
    };

    updateCounts();

    // Update counts every 2 seconds
    const interval = setInterval(updateCounts, 2000);
    return () => clearInterval(interval);
  }, [isClient]);

  // Create a simple sync status object for compatibility
  const syncStatus: SyncStatus = {
    isOnline,
    isSyncing: false,
    lastSync: Date.now(),
    pendingItems: {
      total: pendingCount,
      beehive: pendingByType.beehive || 0,
      cash: pendingByType.cash || 0,
      inventory: pendingByType.inventory || 0,
      calendar: pendingByType.calendar || 0,
      credit: pendingByType.credit || 0
    },
    errors: [],
    featureStatus: {
      beehive: isOnline ? 'online' : 'offline',
      cash: isOnline ? 'online' : 'offline',
      inventory: isOnline ? 'online' : 'offline',
      calendar: isOnline ? 'online' : 'offline',
      credit: isOnline ? 'online' : 'offline'
    }
  };

  // Beehive operations
  const addBeehiveOperation = useCallback((
    type: BeehiveOfflineOperation['type'], 
    data: BeehiveOfflineOperation['data']
  ): string => {
    if (!isClient) return '';
    
    // Fire and forget - the queue handles async internally
    addToQueue('beehive', type, data).then(result => {
      console.log('Beehive operation queued:', result.idempotencyKey);
    }).catch(err => {
      console.error('Failed to queue beehive operation:', err);
    });
    
    return 'pending';
  }, [isClient]);

  // Cash operations
  const addCashOperation = useCallback((
    type: CashOfflineOperation['type'], 
    data: CashOfflineOperation['data']
  ): string => {
    if (!isClient) return '';
    
    // Fire and forget - the queue handles async internally
    addToQueue('cash', type, data).then(result => {
      console.log('Cash operation queued:', result.idempotencyKey);
    }).catch(err => {
      console.error('Failed to queue cash operation:', err);
    });
    
    return 'pending';
  }, [isClient]);

  // Inventory operations
  const addInventoryOperation = useCallback((
    type: InventoryOfflineOperation['type'], 
    data: InventoryOfflineOperation['data']
  ): string => {
    if (!isClient) return '';
    
    // Fire and forget - the queue handles async internally
    addToQueue('inventory', type, data).then(result => {
      console.log('Inventory operation queued:', result.idempotencyKey);
    }).catch(err => {
      console.error('Failed to queue inventory operation:', err);
    });
    
    return 'pending';
  }, [isClient]);

  // Calendar operations
  const addCalendarOperation = useCallback((
    type: CalendarOfflineOperation['type'], 
    data: CalendarOfflineOperation['data']
  ): string => {
    if (!isClient) return '';
    
    // Fire and forget - the queue handles async internally
    addToQueue('calendar', type, data).then(result => {
      console.log('Calendar operation queued:', result.idempotencyKey);
    }).catch(err => {
      console.error('Failed to queue calendar operation:', err);
    });
    
    return 'pending';
  }, [isClient]);

  // Credit operations
  const addCreditOperation = useCallback((
    type: CreditOfflineOperation['type'], 
    data: CreditOfflineOperation['data']
  ): string => {
    if (!isClient) return '';
    
    // Fire and forget - the queue handles async internally
    addToQueue('credit', type, data).then(result => {
      console.log('Credit operation queued:', result.idempotencyKey);
    }).catch(err => {
      console.error('Failed to queue credit operation:', err);
    });
    
    return 'pending';
  }, [isClient]);

  // Force sync - trigger Background Sync
  const forceSync = useCallback(() => {
    if (isOnline && isClient) {
      // Import dynamically to avoid SSR issues
      import('@/utils/registerSW').then(({ registerSync }) => {
        registerSync();
      });
    }
  }, [isOnline, isClient]);

  // Clear pending operations
  const clearPending = useCallback(() => {
    if (isClient) {
      import('@/utils/offlineQueue').then(({ clearQueue }) => {
        clearQueue();
      });
    }
  }, [isClient]);

  // Get pending count by feature
  const getPendingByFeature = useCallback((feature: string): number => {
    return pendingByType[feature] || 0;
  }, [pendingByType]);

  return {
    isOnline,
    syncStatus,
    pendingCount,
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
