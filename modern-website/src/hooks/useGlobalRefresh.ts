"use client";

import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './useToast';

interface GlobalRefreshOptions {
  clearCache?: boolean;
  refetchData?: boolean;
  showNotification?: boolean;
}

export function useGlobalRefresh() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const performGlobalRefresh = async (options: GlobalRefreshOptions = {}) => {
    const { clearCache = true, refetchData = true, showNotification = true } = options;

    try {
      if (clearCache) {
        // Clear all query cache
        await queryClient.clear();
      }

      if (refetchData) {
        // Refetch all active queries
        await queryClient.refetchQueries({ 
          type: 'active',
          stale: false 
        });
      }

      if (showNotification) {
        showSuccess('Data refreshed successfully');
      }

      return { success: true };
    } catch (error) {
      console.error('Global refresh failed:', error);
      if (showNotification) {
        showError('Failed to refresh data');
      }
      return { success: false, error };
    }
  };

  return { performGlobalRefresh };
}
