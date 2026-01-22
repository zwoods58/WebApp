// Offline Store - Manages offline state and sync status

import { create } from 'zustand';

export const useOfflineStore = create((set) => ({
  isOnline: navigator.onLine,
  syncPending: false,
  lastSyncTime: null,
  unsyncedCount: 0,
  syncCompleted: 0, // Counter to trigger page refreshes (increments on each sync)

  setOnline: (isOnline) => set({ isOnline }),
  setSyncPending: (syncPending) => set({ syncPending }),
  setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
  setUnsyncedCount: (unsyncedCount) => set({ unsyncedCount }),
  setSyncCompleted: (syncCompleted) => set({ syncCompleted }),
  // Helper to mark sync as completed - increments counter to trigger refreshes
  markSyncCompleted: () => {
    set((state) => {
      const newCounter = state.syncCompleted + 1;
      console.log(`[OfflineStore] Marking sync completed. Counter: ${state.syncCompleted} -> ${newCounter}`);
      return { 
        syncCompleted: newCounter, 
        lastSyncTime: new Date().toISOString() 
      };
    });
  },
}));


