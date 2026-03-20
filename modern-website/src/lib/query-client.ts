import { QueryClient, onlineManager } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      staleTime: 5 * 60 * 1000,
      gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
      retry: 3,
    },
    mutations: {
      networkMode: 'offlineFirst',
      retry: 3, // CRITICAL: mutations default to 0!
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
