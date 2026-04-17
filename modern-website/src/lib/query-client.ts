import { QueryClient, onlineManager } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 1000 * 60 * 30, // 30 minutes (increase from 5)
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: false, // Don't retry when offline - use cached data immediately
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnReconnect: false, // Don't refetch when connection is restored
    },
    mutations: {
      networkMode: 'offlineFirst',
      retry: false, // Don't retry mutations when offline
    },
  },
})

// Persistence setup
if (typeof window !== 'undefined') {
  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: 'BLACKBOOK_OFFLINE_CACHE',
  })

  persistQueryClient({
    queryClient,
    persister,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        return query.state.status === 'success' // Don't persist errors
      },
    },
  })

  // Connection monitoring is now handled by connection-manager.ts
  // This prevents duplicate event listeners and conflicts
}

