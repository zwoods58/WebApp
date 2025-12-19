// Offline Store - Manages offline state and sync status

import { create } from 'zustand';

export const useOfflineStore = create((set) => ({
  isOnline: navigator.onLine,
  syncPending: false,
  lastSyncTime: null,
  unsyncedCount: 0,
  syncCompleted: false, // Flag to trigger page refreshes

  setOnline: (isOnline) => set({ isOnline }),
  setSyncPending: (syncPending) => set({ syncPending }),
  setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
  setUnsyncedCount: (unsyncedCount) => set({ unsyncedCount }),
  setSyncCompleted: (syncCompleted) => set({ syncCompleted }),
  // Helper to mark sync as completed and reset after a short delay
  markSyncCompleted: () => {
    set({ syncCompleted: true, lastSyncTime: new Date().toISOString() });
    // Reset flag after a short delay so it can trigger again on next sync
    setTimeout(() => set({ syncCompleted: false }), 100);
  },
}));


