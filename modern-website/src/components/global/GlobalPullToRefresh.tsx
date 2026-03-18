"use client";

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRefreshContext } from '@/contexts/RefreshContext';
import { useOfflineData } from '@/hooks/useOfflineData';
import { useLanguage } from '@/hooks/LanguageContext';
import SyncToast from '@/components/ui/SyncToast';

interface GlobalPullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  onHardRefresh?: () => Promise<void> | void;
  threshold?: number;
  hardRefreshThreshold?: number; // Time in ms for long press
  translations?: {
    pullToRefresh?: string;
    releaseToRefresh?: string;
    refreshing?: string;
    refreshingApp?: string;
    hardRefresh?: string;
    hardRefreshing?: string;
  };
}

export default function GlobalPullToRefresh({
  children,
  onRefresh,
  onHardRefresh,
  threshold = 120,
  hardRefreshThreshold = 800, // 0.8 seconds for hard refresh (more accessible)
  translations
}: GlobalPullToRefreshProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { triggerRefresh } = useRefreshContext();
  const { forceSync, pendingCount, syncStatus } = useOfflineData();
  
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHardRefreshing, setIsHardRefreshing] = useState(false);
  const [hardRefreshProgress, setHardRefreshProgress] = useState(0);
  const [syncToast, setSyncToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string; details?: string } | null>(null);
  const startY = useRef(0);
  const pullStartTime = useRef(0);
  const hardRefreshTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use provided translations or fallback to English defaults
  const pullToRefreshText = translations?.pullToRefresh || 'Pull to refresh data';
  const releaseToRefreshText = translations?.releaseToRefresh || 'Release to refresh';
  const refreshingText = translations?.refreshing || 'Refreshing data...';
  const refreshingAppText = translations?.refreshingApp || 'Refreshing app...';
  const hardRefreshText = translations?.hardRefresh || 'Hold to reload app';
  const hardRefreshingText = translations?.hardRefreshing || 'Reloading app...';

  const handleSoftRefresh = async () => {
    console.log('🔄 Performing soft refresh...');
    
    setIsRefreshing(true);
    
    try {
      if (navigator.onLine) {
        // Online: Try to sync first, then refresh data
        try {
          await forceSync();
          console.log('✅ Sync completed');
        } catch (syncError) {
          console.warn('⚠️ Sync failed, still refreshing data:', syncError);
        }
      } else {
        console.log('📴 Offline mode: Refreshing local data only');
      }
      
      // Always refresh the data regardless of sync status
      window.dispatchEvent(new CustomEvent('force-refresh-data'));
      
      // Also trigger hard refresh for complete data reload
      window.dispatchEvent(new CustomEvent('hard-refresh-data'));
      
      setSyncToast({
        type: 'success',
        message: navigator.onLine ? 'Data refreshed ✓' : 'Local data refreshed ✓'
      });
      
      console.log('✅ Soft refresh completed');
    } catch (error) {
      console.error('Soft refresh failed:', error);
      
      // Even if refresh fails, still try to dispatch the events
      window.dispatchEvent(new CustomEvent('force-refresh-data'));
      window.dispatchEvent(new CustomEvent('hard-refresh-data'));
      
      setSyncToast({
        type: 'error',
        message: 'Refresh failed - try again'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleHardRefresh = async () => {
    console.log('🔄 Performing hard refresh - full page reload...');
    setIsHardRefreshing(true);
    
    try {
      if (navigator.onLine) {
        // Try to sync first if online
        try {
          await forceSync();
          console.log('✅ Pre-reload sync completed');
        } catch (syncError) {
          console.warn('⚠️ Pre-reload sync failed:', syncError);
        }
      }
      
      // Clear some caches and reload the page
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          // Only clear HTTP caches and app shell, not offline data
          const httpCaches = cacheNames.filter(name => 
            !name.includes('offline') && 
            !name.includes('workbox') &&
            (name.includes('app-shell') || name.includes('static') || name.includes('http'))
          );
          await Promise.all(httpCaches.map(name => caches.delete(name)));
          console.log('🗑️ Cleared app shell and HTTP caches');
        } catch (e) {
          console.warn('Failed to clear some caches:', e);
        }
      }
      
      // Show feedback before reload
      setSyncToast({
        type: 'success',
        message: 'Reloading app...'
      });
      
      // Small delay to show the toast
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error('Hard refresh failed:', error);
      // Fallback - just reload anyway
      window.location.reload();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialScrollY = 0;
    let isPullGesture = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Only handle touch events on the container itself, not on interactive elements
      const target = e.target as HTMLElement;
      const closestInteractive = target.closest('button, a, input, select, textarea, [role="button"], [onclick]');
      if (closestInteractive) {
        return; // Let interactive elements work normally
      }

      initialScrollY = window.scrollY;
      
      // Only start pull-to-refresh logic if we're at the very top of the page
      // AND not already pulling (prevent duplicate triggers)
      if (window.scrollY === 0 && !isPulling) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
        isPullGesture = false;
        pullStartTime.current = Date.now();
        setHardRefreshProgress(0);
        
        // Clear any existing hard refresh timer
        if (hardRefreshTimer.current) {
          clearTimeout(hardRefreshTimer.current);
        }
        
        // Start hard refresh progress timer
        hardRefreshTimer.current = setInterval(() => {
          const elapsed = Date.now() - pullStartTime.current;
          const progress = Math.min(elapsed / hardRefreshThreshold, 1);
          setHardRefreshProgress(progress);
          
          if (progress >= 1) {
            // Hard refresh threshold reached
            clearInterval(hardRefreshTimer.current!);
            hardRefreshTimer.current = null;
          }
        }, 50);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY.current;
      const scrollDelta = window.scrollY - initialScrollY;
      
      // If user scrolls down more than 3px, cancel pull-to-refresh immediately
      if (scrollDelta > 3) {
        setIsPulling(false);
        setPullDistance(0);
        isPullGesture = false;
        return;
      }
      
      // Cancel if user starts scrolling up (negative delta) - this means they want to scroll normally
      if (deltaY < -3) {
        setIsPulling(false);
        setPullDistance(0);
        isPullGesture = false;
        return;
      }
      
      // Only treat as pull gesture if:
      // 1. We're still at the exact top (scrollY === 0)
      // 2. Pulling down significantly (deltaY > 20)
      // 3. No scrolling has occurred (scrollDelta === 0)
      if (deltaY > 20 && window.scrollY === 0 && scrollDelta === 0) {
        isPullGesture = true;
      }
      
      // Only prevent default and show pull indicator if we're in a clear pull gesture
      if (isPullGesture && window.scrollY === 0 && deltaY > 0) {
        e.preventDefault();
        setPullDistance(Math.min(deltaY, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      
      // Clear hard refresh timer
      if (hardRefreshTimer.current) {
        clearInterval(hardRefreshTimer.current);
        hardRefreshTimer.current = null;
      }
      
      // Check if hard refresh threshold was reached
      if (hardRefreshProgress >= 1 && !isHardRefreshing) {
        setIsHardRefreshing(true);
        
        try {
          await handleHardRefresh();
        } catch (error) {
          console.error('Hard refresh failed:', error);
        } finally {
          setIsHardRefreshing(false);
        }
      }
      // Only trigger normal refresh if we had a clear pull gesture and threshold is met
      else if (isPullGesture && pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        
        try {
          await handleSoftRefresh();
        } catch (error) {
          console.error('Soft refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setIsPulling(false);
      setPullDistance(0);
      setHardRefreshProgress(0);
      isPullGesture = false;
    };

    // Mouse event handlers for desktop support - only handle on container
    const handleMouseDown = (e: MouseEvent) => {
      // Only handle mouse events on the container itself, not on interactive elements
      const target = e.target as HTMLElement;
      const closestInteractive = target.closest('button, a, input, select, textarea, [role="button"], [onclick]');
      if (closestInteractive) {
        return; // Let interactive elements work normally
      }

      initialScrollY = window.scrollY;
      
      // Only start pull-to-refresh logic if we're at the very top of the page
      // AND not already pulling (prevent duplicate triggers)
      if (window.scrollY === 0 && !isPulling) {
        startY.current = e.clientY;
        setIsPulling(true);
        isPullGesture = false;
        pullStartTime.current = Date.now();
        setHardRefreshProgress(0);
        
        // Clear any existing hard refresh timer
        if (hardRefreshTimer.current) {
          clearTimeout(hardRefreshTimer.current);
        }
        
        // Start hard refresh progress timer
        hardRefreshTimer.current = setInterval(() => {
          const elapsed = Date.now() - pullStartTime.current;
          const progress = Math.min(elapsed / hardRefreshThreshold, 1);
          setHardRefreshProgress(progress);
          
          if (progress >= 1) {
            // Hard refresh threshold reached
            clearInterval(hardRefreshTimer.current!);
            hardRefreshTimer.current = null;
          }
        }, 50);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPulling) return;
      
      const currentY = e.clientY;
      const deltaY = currentY - startY.current;
      const scrollDelta = window.scrollY - initialScrollY;
      
      // If user scrolls down more than 3px, cancel pull-to-refresh immediately
      if (scrollDelta > 3) {
        setIsPulling(false);
        setPullDistance(0);
        isPullGesture = false;
        return;
      }
      
      // Cancel if user starts scrolling up (negative delta) - this means they want to scroll normally
      if (deltaY < -3) {
        setIsPulling(false);
        setPullDistance(0);
        isPullGesture = false;
        return;
      }
      
      // Only treat as pull gesture if:
      // 1. We're still at the exact top (scrollY === 0)
      // 2. Pulling down significantly (deltaY > 20)
      // 3. No scrolling has occurred (scrollDelta === 0)
      if (deltaY > 20 && window.scrollY === 0 && scrollDelta === 0) {
        isPullGesture = true;
      }
      
      // Only prevent default and show pull indicator if we're in a clear pull gesture
      if (isPullGesture && window.scrollY === 0 && deltaY > 0) {
        e.preventDefault();
        setPullDistance(Math.min(deltaY, threshold * 1.5));
      }
    };

    const handleMouseUp = async () => {
      if (!isPulling) return;
      
      // Clear hard refresh timer
      if (hardRefreshTimer.current) {
        clearInterval(hardRefreshTimer.current);
        hardRefreshTimer.current = null;
      }
      
      // Check if hard refresh threshold was reached
      if (hardRefreshProgress >= 1 && !isHardRefreshing) {
        setIsHardRefreshing(true);
        
        try {
          await handleHardRefresh();
        } catch (error) {
          console.error('Hard refresh failed:', error);
        } finally {
          setIsHardRefreshing(false);
        }
      }
      // Only trigger normal refresh if we had a clear pull gesture and threshold is met
      else if (isPullGesture && pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        
        try {
          await handleSoftRefresh();
        } catch (error) {
          console.error('Soft refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setIsPulling(false);
      setPullDistance(0);
      setHardRefreshProgress(0);
      isPullGesture = false;
    };

    // Cleanup function
    const cleanup = () => {
      if (hardRefreshTimer.current) {
        clearInterval(hardRefreshTimer.current);
        hardRefreshTimer.current = null;
      }
    };

    // Add event listeners only to the container, not globally
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events for desktop - only on container
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      
      // Cleanup timers
      cleanup();
    };
  }, [isPulling, pullDistance, threshold, isRefreshing, isHardRefreshing, hardRefreshProgress, onRefresh, onHardRefresh, router]);

  // Listen for sync completion events
  useEffect(() => {
    const handleSyncComplete = () => {
      if (pendingCount === 0 && syncStatus.errors.length === 0) {
        setSyncToast({
          type: 'success',
          message: 'All changes synced ✓'
        });
      } else if (syncStatus.errors.length > 0) {
        setSyncToast({
          type: 'error',
          message: 'Some items failed to sync',
          details: `${syncStatus.errors.length} errors`
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('offline-sync-complete', handleSyncComplete);
      return () => window.removeEventListener('offline-sync-complete', handleSyncComplete);
    }
  }, [pendingCount, syncStatus]);

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Sync Toast Notification */}
      {syncToast && (
        <SyncToast
          type={syncToast.type}
          message={syncToast.message}
          details={syncToast.details}
          onClose={() => setSyncToast(null)}
        />
      )}

      {/* Global Pull Indicator */}
      <div 
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center pointer-events-none"
        style={{
          height: '120px',
          transform: `translateY(${Math.max(0, pullDistance - 120)}px)`,
          opacity: isPulling ? 1 : 0,
        }}
      >
        <div className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-300 ${
          hardRefreshProgress > 0 
            ? 'bg-red-50 border-red-200' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div
              className={`transition-transform duration-300 ${
                pullProgress >= 1 ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <RefreshCw 
                size={28} 
                className={
                  hardRefreshProgress > 0 
                    ? 'text-red-600 animate-pulse' 
                    : pullProgress >= 1 
                      ? 'text-blue-600' 
                      : 'text-gray-400'
                }
              />
            </div>
            <span className={`text-sm font-medium transition-colors ${
              hardRefreshProgress > 0 
                ? 'text-red-600' 
                : pullProgress >= 1 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
            }`}>
              {isHardRefreshing 
                ? hardRefreshingText 
                : isRefreshing 
                  ? refreshingText 
                  : hardRefreshProgress > 0
                    ? `${hardRefreshText} (${Math.round(hardRefreshProgress * 100)}%)`
                    : pullProgress >= 1 
                      ? releaseToRefreshText 
                      : pullToRefreshText
              }
            </span>
          </div>
          
          {/* Hard refresh progress bar */}
          {hardRefreshProgress > 0 && (
            <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-100"
                style={{ width: `${hardRefreshProgress * 100}%` }}
              />
            </div>
          )}

          {/* Instructions for hard refresh */}
          {hardRefreshProgress > 0 && hardRefreshProgress < 1 && (
            <div className="text-xs text-red-500 mt-1 text-center">
              Hold for hard refresh
            </div>
          )}
        </div>
      </div>

      {/* Global Loading Overlay */}
      {(isRefreshing || isHardRefreshing) && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[70] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin">
              <RefreshCw 
                size={32} 
                className={isHardRefreshing ? 'text-red-600' : 'text-blue-600'} 
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {isHardRefreshing ? hardRefreshingText : refreshingAppText}
            </span>
            {isHardRefreshing && (
              <p className="text-xs text-gray-500 text-center max-w-xs">
                Clearing cache and refreshing data...
              </p>
            )}
          </div>
        </div>
      )}

      {/* App Content */}
      <div 
        className="transition-transform duration-200"
        style={{
          transform: isPulling ? `translateY(${pullDistance}px)` : 'translateY(0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
