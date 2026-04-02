import { useEffect, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';

/**
 * Wrapper hook for TanStack Query that prevents infinite loading when offline
 * Adds a 3-second timeout when offline and no data is available
 */
export function useOfflineQuery<T>(
  queryResult: UseQueryResult<T>
): UseQueryResult<T> & { isTimeout: boolean } {
  const isOffline = typeof window !== 'undefined' ? !navigator.onLine : false;
  const [isTimeout, setIsTimeout] = useState(false);

  // Add 3-second timeout for offline loading
  useEffect(() => {
    if (isOffline && queryResult.isLoading && !queryResult.data) {
      const timer = setTimeout(() => {
        console.log('⏱️ Offline query timeout - showing fallback');
        setIsTimeout(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setIsTimeout(false);
    }
  }, [isOffline, queryResult.isLoading, queryResult.data]);

  // Return enhanced query result with timeout flag
  return {
    ...queryResult,
    isTimeout,
  };
}
