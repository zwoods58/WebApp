import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Local type definitions
interface UserProfile {
  id: string
  email: string
  name: string
  // Add other user fields as needed
}

type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline'

interface BuzzNotification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string
  // Add other notification fields as needed
}

// Auth Store
interface AuthStore {
  user: UserProfile | null
  isLoading: boolean
  rememberMe: boolean
  setUser: (user: UserProfile | null) => void
  setLoading: (v: boolean) => void
  setRememberMe: (v: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      rememberMe: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setRememberMe: (rememberMe) => set({ rememberMe }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'beezee-auth',
      partialize: (state) => ({
        user: state.rememberMe ? state.user : null,
        rememberMe: state.rememberMe,
      }),
    }
  )
)

// Sync Store
interface SyncStore {
  status: SyncStatus
  pendingCount: number
  lastSyncedAt: string | null
  setStatus: (s: SyncStatus) => void
  setPendingCount: (n: number) => void
  setLastSynced: (t: string) => void
}

export const useSyncStore = create<SyncStore>()((set) => ({
  status: 'synced',
  pendingCount: 0,
  lastSyncedAt: null,
  setStatus: (status) => set({ status }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
  setLastSynced: (lastSyncedAt) => set({ lastSyncedAt }),
}))

// Notification / Buzz Store
interface NotificationStore {
  notifications: BuzzNotification[]
  unreadCount: number
  setNotifications: (n: BuzzNotification[]) => void
  markRead: (id: string) => void
  markAllRead: () => void
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length }),
  markRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
      return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length }
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
}))

// UI Store
interface UIStore {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOnline: boolean
  setIsOnline: (v: boolean) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (activeTab) => set({ activeTab }),
  isOnline: true,
  setIsOnline: (isOnline) => set({ isOnline }),
}))
