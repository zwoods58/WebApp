"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * Hook for components to listen to app updates
 * Use this in components that need to refresh data on update
 */
export function useAppUpdater(onUpdate?: () => void) {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  useEffect(() => {
    const handleAppUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('[useAppUpdater] App updated to version:', customEvent.detail.version);
      
      // Refetch all queries to get fresh data
      await queryClient.refetchQueries();
      
      // Refresh router to update server components
      router.refresh();
      
      // Call custom callback if provided
      if (onUpdate) {
        onUpdate();
      }
    };
    
    window.addEventListener('app-updated', handleAppUpdate);
    
    return () => {
      window.removeEventListener('app-updated', handleAppUpdate);
    };
  }, [queryClient, router, onUpdate]);
}
