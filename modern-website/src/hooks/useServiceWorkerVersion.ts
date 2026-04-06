"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to get the current service worker version
 * Provides user-controlled version information
 */
export const useServiceWorkerVersion = () => {
  const [version, setVersion] = useState<string>('v108');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getVersionFromServiceWorker = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Method 1: Try to get version from active service worker
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          
          if (registration?.active) {
            console.log('[Version Hook] 📡 Getting version from active service worker');
            
            // Get version from localStorage (updated by update system)
            const storedVersion = localStorage.getItem('app-version');
            if (storedVersion) {
              setVersion(storedVersion);
              console.log('[Version Hook] ✅ Using stored version:', storedVersion);
            } else {
              // Fallback to current service worker version
              setVersion('v108');
              console.log('[Version Hook] 🔧 Using fallback version: v108');
            }
          } else {
            // No active service worker, use fallback
            setVersion('v108');
            console.log('[Version Hook] ⚠️ No active service worker, using fallback: v108');
          }
        } else {
          // Service worker not supported
          setVersion('v108');
          console.log('[Version Hook] ❌ Service worker not supported, using fallback: v108');
        }
      } catch (err) {
        console.error('[Version Hook] ❌ Error getting service worker version:', err);
        setError('Failed to get version');
        setVersion('v108'); // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    getVersionFromServiceWorker();

    // Listen for service worker updates to refresh version
    const handleServiceWorkerUpdate = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATE_ACTIVATED') {
        console.log('[Version Hook] 🔄 Service worker updated, refreshing version');
        getVersionFromServiceWorker();
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerUpdate);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerUpdate);
      }
    };
  }, []);

  return { 
    version, 
    isLoading, 
    error,
    refresh: () => {
      // Manual refresh function
      const getVersionFromServiceWorker = async () => {
        try {
          setIsLoading(true);
          const storedVersion = localStorage.getItem('app-version');
          setVersion(storedVersion || 'v108');
        } catch (err) {
          console.error('[Version Hook] ❌ Error refreshing version:', err);
        } finally {
          setIsLoading(false);
        }
      };
      getVersionFromServiceWorker();
    }
  };
};
