// Offline Store - Manages offline state and sync status

import { create } from 'zustand';

export const useOfflineStore = create((set) => ({
  isOnline: navigator.onLine,
  syncPending: false,
  lastSyncTime: null,
  unsyncedCount: 0,

  setOnline: (isOnline) => set({ isOnline }),
  setSyncPending: (syncPending) => set({ syncPending }),
  setLastSyncTime: (lastSyncTime) => set({ lastSyncTime }),
  setUnsyncedCount: (unsyncedCount) => set({ unsyncedCount }),
}));


