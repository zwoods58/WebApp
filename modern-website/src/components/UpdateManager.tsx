"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import UpdateModal from '@/components/ui/UpdateModal';

interface UpdateManagerProps {
  children: React.ReactNode;
}

export default function UpdateManager({ children }: UpdateManagerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { business } = useUnifiedAuth();
  
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string>('v108');
  const [laterPressedTime, setLaterPressedTime] = useState<number | null>(null);

  // Check if 24 hours have passed since "Later" was pressed
  const shouldShowUpdateModal = () => {
    const laterPressedTime = localStorage.getItem('update-later-timestamp');
    if (!laterPressedTime) return true;
    
    const hoursPassed = (Date.now() - parseInt(laterPressedTime)) / (1000 * 60 * 60);
    return hoursPassed >= 24;
  };

  // Handle "Later" button press
  const handleLater = () => {
    localStorage.setItem('update-later-timestamp', Date.now().toString());
    setShowUpdateModal(false);
  };

  // Clear old caches and reload app
  const clearOldCachesAndReload = async () => {
    try {
      // Clear all existing caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      // Clear localStorage update timer
      localStorage.removeItem('update-later-timestamp');
      
      // Update app version in localStorage
      if (newVersion) {
        localStorage.setItem('app-version', newVersion);
      }
      
      // Reload app with fresh cache
      window.location.reload();
    } catch (error) {
      console.error('Cache clear failed:', error);
      // Force reload anyway
      window.location.reload();
    }
  };

  // Handle "Update Now" button press
  const handleUpdateNow = async () => {
    console.log('[UpdateManager] User clicked Update Now');
    setIsUpdating(true);
    
    try {
      // 1. Get service worker registration
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration?.waiting) {
        // 2. Tell waiting service worker to activate
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // 3. Listen for controller change (new SW activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // 4. Clear old caches and reload with new version
          clearOldCachesAndReload();
        });
      } else {
        // 5. Force service worker update check
        if (registration) {
          await registration.update();
          
          // 6. Check if new version found
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              clearOldCachesAndReload();
            });
          } else {
            // 7. No waiting worker, just reload to get latest from Vercel
            clearOldCachesAndReload();
          }
        } else {
          // No registration, just reload
          clearOldCachesAndReload();
        }
      }
    } catch (error) {
      console.error('Update failed:', error);
      // Fallback: just reload
      clearOldCachesAndReload();
    }
  };

  // Initialize current version from localStorage
  useEffect(() => {
    const storedVersion = localStorage.getItem('app-version');
    if (storedVersion) {
      setCurrentVersion(storedVersion);
    }
    
    // Load later timestamp from localStorage
    const laterTime = localStorage.getItem('update-later-timestamp');
    if (laterTime) {
      setLaterPressedTime(parseInt(laterTime));
    }
  }, []);

  // ✅ ENHANCED Update Detection System (Service Worker + API) - ONLY in authenticated app
  useEffect(() => {
    // Only run update detection if user is authenticated
    if (!business?.id) return;
    if (!('serviceWorker' in navigator)) return;
    
    let updateCheckInterval: NodeJS.Timeout;
    
    const checkForUpdate = async () => {
      // Check if we should show modal (24-hour cooldown)
      if (!shouldShowUpdateModal()) return;
      
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
          setNewVersion(cleanApiVersion); // Show clean version to user
          setShowUpdateModal(true);
          return;
        }
        
        // 3. Check service worker for waiting update (backup detection)
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          
          if (registration.waiting && navigator.serviceWorker.controller) {
            console.log('[UpdateManager] 🎉 Service worker update available (user-controlled activation)');
            setNewVersion(cleanApiVersion);
            setShowUpdateModal(true);
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
      if (!document.hidden && shouldShowUpdateModal() && business?.id) checkForUpdate();
    };
    
    const handleOnline = () => {
      if (shouldShowUpdateModal() && business?.id) checkForUpdate();
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
      
      {/* Update Modal - ONLY in authenticated app */}
      <Suspense fallback={null}>
        <UpdateModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateNow}
          onLater={handleLater}
          isUpdating={isUpdating}
          currentVersion={currentVersion}
          newVersion={newVersion || 'v108'}
        />
      </Suspense>
    </>
  );
}
