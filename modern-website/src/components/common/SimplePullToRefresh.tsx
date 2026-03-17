"use client";

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface SimplePullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export default function SimplePullToRefresh({
  onRefresh,
  children,
  className = "",
  threshold = 100
}: SimplePullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only start if we're at the top of the container
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY.current;
      
      // Only allow pulling down
      if (deltaY > 0) {
        e.preventDefault();
        setPullDistance(Math.min(deltaY, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
      
      setIsPulling(false);
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-y-auto ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pointer-events-none"
        style={{
          height: '60px',
          transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
          opacity: isPulling ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
          <div
            className={`transition-transform duration-300 ${
              pullProgress >= 1 ? 'rotate-180' : 'rotate-0'
            }`}
          >
            <RefreshCw 
              size={20} 
              className={pullProgress >= 1 ? 'text-blue-600' : 'text-gray-400'}
            />
          </div>
          <span className={`text-sm font-medium transition-colors ${
            pullProgress >= 1 ? 'text-blue-600' : 'text-gray-400'
          }`}>
            {isRefreshing ? 'Refreshing...' : pullProgress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Loading overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="animate-spin">
              <RefreshCw size={24} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Content */}
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
