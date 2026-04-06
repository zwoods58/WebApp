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
  
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [toastVersion, setToastVersion] = useState<string>('v108');
  const [currentVersion, setCurrentVersion] = useState<string>('v108');

  // Auto-update: Clear caches, store version, and reload
  const autoUpdateAndReload = async (newVersion: string) => {
    try {
      console.log('[UpdateManager] 🔄 Auto-updating to:', newVersion);
      
      // Clear all existing caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      // Store flag to show toast after reload
      localStorage.setItem('show-update-toast', 'true');
      localStorage.setItem('update-toast-version', newVersion);
      
      // Store the new version
      localStorage.setItem('app-version', newVersion);
      
      // Reload app with fresh cache
      window.location.reload();
    } catch (error) {
      console.error('[UpdateManager] Auto-update failed:', error);
      // Force reload anyway
      window.location.reload();
    }
  };

  // Trigger automatic update
  const triggerAutoUpdate = async (newVersion: string) => {
    console.log('[UpdateManager] 🚀 Triggering automatic update');
    
    try {
      // Get service worker registration
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration?.waiting) {
        // Tell waiting service worker to activate immediately
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Listen for controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          autoUpdateAndReload(newVersion);
        });
      } else {
        // Force service worker update check
        if (registration) {
          await registration.update();
          
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              autoUpdateAndReload(newVersion);
            });
          } else {
            // No waiting worker, just reload to get latest from Vercel
            autoUpdateAndReload(newVersion);
          }
        } else {
          // No registration, just reload
          autoUpdateAndReload(newVersion);
        }
      }
    } catch (error) {
      console.error('[UpdateManager] Auto-update trigger failed:', error);
      // Fallback: just reload
      autoUpdateAndReload(newVersion);
    }
  };

  // Initialize and check for toast to show after reload
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

  // ✅ ENHANCED Update Detection System (Service Worker + API) - ONLY in authenticated app
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
          console.log('[UpdateManager] 🎉 New deployment detected via API:', currentApiVersion);
          // Automatically trigger update
          triggerAutoUpdate(currentApiVersion);
          return;
        }
        
        // 3. Check service worker for waiting update (backup detection)
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting && navigator.serviceWorker.controller) {
            console.log('[UpdateManager] 🎉 Service worker update available');
            // Automatically trigger update
            triggerAutoUpdate(currentApiVersion);
            return;
          }
        }
        
        console.log('[UpdateManager] ✅ No updates detected');
      } catch (error) {
        console.error('[UpdateManager] Update check failed:', error);
      }
    };
    
    // Initial check
    checkForUpdate();
    
    // Periodic check every 30 seconds
    updateCheckInterval = setInterval(checkForUpdate, 30000);
    
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
      
      {/* Update Toast - Shows after automatic update completes */}
      <UpdateToast
        isVisible={showUpdateToast}
        version={toastVersion}
        onDismiss={() => setShowUpdateToast(false)}
      />
    </>
  );
}
