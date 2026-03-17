"use client";

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRefreshContext } from '@/contexts/RefreshContext';

interface GlobalPullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
  translations?: {
    pullToRefresh?: string;
    releaseToRefresh?: string;
    refreshing?: string;
    refreshingApp?: string;
  };
}

export default function GlobalPullToRefresh({
  children,
  onRefresh,
  threshold = 120,
  translations
}: GlobalPullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { triggerRefresh } = useRefreshContext();
  
  // Use provided translations or fallback to English defaults
  const pullToRefreshText = translations?.pullToRefresh || 'Pull to refresh';
  const releaseToRefreshText = translations?.releaseToRefresh || 'Release to refresh';
  const refreshingText = translations?.refreshing || 'Refreshing...';
  const refreshingAppText = translations?.refreshingApp || 'Refreshing app...';

  const handleGlobalRefresh = async () => {
    // Default global refresh behavior
    console.log('Performing global refresh...');
    
    // Try page-specific refresh handler first
    try {
      await triggerRefresh();
    } catch (error) {
      console.error('Page refresh failed:', error);
    }
    
    // Refresh the current page
    router.refresh();
    
    // If custom refresh function is provided, call it too
    if (onRefresh) {
      try {
        await onRefresh();
      } catch (error) {
        console.error('Custom refresh failed:', error);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialScrollY = 0;
    let isPullGesture = false;

    const handleTouchStart = (e: TouchEvent) => {
      initialScrollY = window.scrollY;
      
      // Only start if we're at the very top of the page
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
        isPullGesture = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY.current;
      const scrollDelta = window.scrollY - initialScrollY;
      
      // If user scrolls down more than 5px, cancel pull-to-refresh
      if (scrollDelta > 5) {
        setIsPulling(false);
        setPullDistance(0);
        isPullGesture = false;
        return;
      }
      
      // Only treat as pull gesture if pulling down significantly
      if (deltaY > 10) {
        isPullGesture = true;
      }
      
      // Cancel if user starts scrolling up (negative delta)
      if (deltaY < -10) {
        setIsPulling(false);
        setPullDistance(0);
        isPullGesture = false;
        return;
      }
      
      // Only prevent default and show pull indicator if we're in a pull gesture
      if (isPullGesture && window.scrollY === 0 && deltaY > 0) {
        e.preventDefault();
        setPullDistance(Math.min(deltaY, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      
      // Only trigger refresh if we had a clear pull gesture and threshold is met
      if (isPullGesture && pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        
        try {
          await handleGlobalRefresh();
        } catch (error) {
          console.error('Global refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setIsPulling(false);
      setPullDistance(0);
      isPullGesture = false;
    };

    // Add event listeners to the document for global coverage
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, router]);

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={containerRef} className="min-h-screen relative">
      {/* Global Pull Indicator */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
        style={{
          height: '80px',
          transform: `translateY(${Math.max(0, pullDistance - 80)}px)`,
          opacity: isPulling ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-2xl border border-gray-200">
          <div
            className={`transition-transform duration-300 ${
              pullProgress >= 1 ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <RefreshCw 
              size={24} 
              className={pullProgress >= 1 ? 'text-blue-600' : 'text-gray-400'}
            />
          </div>
          <span className={`text-sm font-medium transition-colors ${
            pullProgress >= 1 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {isRefreshing ? refreshingText : pullProgress >= 1 ? releaseToRefreshText : pullToRefreshText}
          </span>
        </div>
      </div>

      {/* Global Loading Overlay */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin">
              <RefreshCw size={32} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">{refreshingAppText}</span>
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
