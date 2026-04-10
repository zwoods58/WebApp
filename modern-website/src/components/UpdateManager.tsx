"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import UpdateToast from '@/components/ui/UpdateToast';

interface UpdateManagerProps {
  children: React.ReactNode;
}

export default function UpdateManager({ children }: UpdateManagerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { business } = useUnifiedAuth();
  
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [toastVersion, setToastVersion] = useState<string>('v108');
  const [currentVersion, setCurrentVersion] = useState<string>('v108');

  /**
   * SILENT UPDATE - No page refresh!
   * This replaces window.location.reload() with seamless updates
   */
  const performSilentUpdate = async (version: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      console.log('[UpdateManager] Starting silent update to version:', version);
      
      // Dispatch start event for progress indicator
      window.dispatchEvent(new CustomEvent('app-update-start', { 
        detail: { version, timestamp: Date.now() } 
      }));
      
      // Step 1: Clear all React Query caches (refetches fresh data)
      await queryClient.invalidateQueries();
      await queryClient.refetchQueries();
      
      // Step 2: Clear service worker caches (for PWA)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.ready;
        if (registration.waiting) {
          // Tell waiting service worker to activate
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
      
      // Step 3: Clear browser caches (keeps assets fresh)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            // Don't delete critical caches that might break the app
            if (!cacheName.includes('google') && !cacheName.includes('firebase')) {
              await caches.delete(cacheName);
            }
          })
        );
      }
      
      // Step 4: Update stored version
      localStorage.setItem('app-version', version);
      setCurrentVersion(version);
      
      // Step 5: Show success toast (without reload)
      localStorage.setItem('show-update-toast', 'true');
      localStorage.setItem('update-toast-version', version);
      
      // Step 6: Trigger React component refresh (force re-render of key components)
      router.refresh(); // Next.js App Router refresh - no page reload!
      
      // Step 7: Dispatch custom event for components to listen to
      window.dispatchEvent(new CustomEvent('app-updated', { 
        detail: { version, timestamp: Date.now() } 
      }));
      
      // Step 8: Dispatch completion event
      window.dispatchEvent(new CustomEvent('app-update-complete', { 
        detail: { version, timestamp: Date.now() } 
      }));
      
      console.log('[UpdateManager] Silent update completed! Version:', version);
      setUpdateAvailable(false);
      
    } catch (error) {
      console.error('[UpdateManager] Silent update failed:', error);
      // Fallback: show manual update option
      setUpdateAvailable(true);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Trigger silent update when new version is detected
   */
  const triggerSilentUpdate = async (newVersion: string) => {
    console.log('[UpdateManager] Triggering silent update');
    
    try {
      // Get service worker registration
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration?.waiting) {
        // Tell waiting service worker to activate immediately
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Listen for controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          performSilentUpdate(newVersion);
        });
      } else {
        // Force service worker update check
        if (registration) {
          await registration.update();
          
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              performSilentUpdate(newVersion);
            });
          } else {
            // No waiting worker, just perform silent update
            await performSilentUpdate(newVersion);
          }
        } else {
          // No registration, just perform silent update
          await performSilentUpdate(newVersion);
        }
      }
    } catch (error) {
      console.error('[UpdateManager] Silent update trigger failed:', error);
      // Fallback: just perform silent update
      await performSilentUpdate(newVersion);
    }
  };

  /**
   * Manual update trigger (user clicks update button)
   */
  const handleManualUpdate = async () => {
    if (newVersion) {
      await performSilentUpdate(newVersion);
    }
  };

  // Initialize and check for toast to show after update
  useEffect(() => {
    const storedVersion = localStorage.getItem('app-version');
    if (storedVersion) {
      setCurrentVersion(storedVersion);
    }
    
    // Check if we should show toast after update
    const shouldShowToast = localStorage.getItem('show-update-toast');
    const toastVer = localStorage.getItem('update-toast-version');
    
    if (shouldShowToast === 'true' && toastVer) {
      setToastVersion(toastVer);
      setShowUpdateToast(true);
      
      // Clear flags
      localStorage.removeItem('show-update-toast');
      localStorage.removeItem('update-toast-version');
    }
  }, []);

  // Enhanced Update Detection System (Service Worker + API) - ONLY in authenticated app
  useEffect(() => {
    // Only run update detection if user is authenticated
    if (!business?.id) return;
    if (!('serviceWorker' in navigator)) return;
    
    let updateCheckInterval: NodeJS.Timeout;
    
    const checkForUpdate = async () => {
      try {
        // 1. Get current version from API (always dynamic)
        const response = await fetch('/api/version-check');
        const apiData = await response.json();
        const currentApiVersion = apiData.version; // Dynamic: v108-abc123f-1648834567
        const cleanApiVersion = apiData.cleanVersion; // Clean: v108
        
        // Get stored version from localStorage
        const storedVersion = localStorage.getItem('app-version') || 'v108';
        
        console.log('[UpdateManager] Version comparison:', {
          stored: storedVersion,
          currentApi: currentApiVersion,
          cleanApi: cleanApiVersion
        });
        
        // 2. Check if API version is different (detects ANY deployment change)
        if (currentApiVersion !== storedVersion) {
          console.log('[UpdateManager] New deployment detected via API:', currentApiVersion);
          setNewVersion(currentApiVersion);
          // Automatically trigger silent update
          await triggerSilentUpdate(currentApiVersion);
          return;
        }
        
        // 3. Check service worker for waiting update (backup detection)
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting && navigator.serviceWorker.controller) {
            console.log('[UpdateManager] Service worker update available');
            setNewVersion(currentApiVersion);
            // Automatically trigger silent update
            await triggerSilentUpdate(currentApiVersion);
            return;
          }
        }
        
        console.log('[UpdateManager] No updates detected');
      } catch (error) {
        console.error('[UpdateManager] Update check failed:', error);
      }
    };
    
    // Initial check
    checkForUpdate();
    
    // Periodic check every 5 minutes (reduced frequency for free tier)
    updateCheckInterval = setInterval(checkForUpdate, 300000);
    
    // Smart triggers
    const handleVisibilityChange = () => {
      if (!document.hidden && business?.id) checkForUpdate();
    };
    
    const handleOnline = () => {
      if (business?.id) checkForUpdate();
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    
    return () => {
      clearInterval(updateCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [currentVersion, business?.id]);

  return (
    <>
      {children}
      
      {/* Optional: Manual update banner if silent update fails */}
      {updateAvailable && !isUpdating && (
        <div className="fixed bottom-20 right-4 z-[9999] bg-yellow-100 border border-yellow-400 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-yellow-800">Update available</span>
            <button
              onClick={handleManualUpdate}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Update Now
            </button>
          </div>
        </div>
      )}
      
      {/* Update Toast - Shows after silent update completes */}
      <UpdateToast
        isVisible={showUpdateToast}
        version={toastVersion}
        onDismiss={() => setShowUpdateToast(false)}
      />
    </>
  );
}
