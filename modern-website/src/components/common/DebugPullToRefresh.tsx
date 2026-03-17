"use client";

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface DebugPullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export default function DebugPullToRefresh({
  onRefresh,
  children,
  className = "",
  threshold = 100
}: DebugPullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [currentTouchY, setCurrentTouchY] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const y = touch.clientY;
      setTouchStartY(y);
      setCurrentTouchY(y);
      
      addDebugInfo(`Touch start at Y: ${y}, ScrollTop: ${container.scrollTop}`);
      
      // Only start if we're at the top of the container
      if (container.scrollTop === 0) {
        setIsPulling(true);
        addDebugInfo('Started pulling (at top)');
      } else {
        addDebugInfo('Not at top, ignoring');
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const y = touch.clientY;
      setCurrentTouchY(y);
      
      if (!isPulling) return;
      
      const deltaY = y - touchStartY;
      
      addDebugInfo(`Touch move: deltaY=${deltaY}, isPulling=${isPulling}`);
      
      // Only allow pulling down
      if (deltaY > 0) {
        e.preventDefault();
        setPullDistance(Math.min(deltaY, threshold * 1.5));
        addDebugInfo(`Pull distance: ${Math.min(deltaY, threshold * 1.5)}`);
      }
    };

    const handleTouchEnd = async () => {
      addDebugInfo(`Touch end - Pull distance: ${pullDistance}, Threshold: ${threshold}`);
      
      if (!isPulling) return;
      
      if (pullDistance >= threshold && !isRefreshing) {
        addDebugInfo('Triggering refresh!');
        setIsRefreshing(true);
        try {
          await onRefresh();
          addDebugInfo('Refresh completed successfully');
        } catch (error) {
          addDebugInfo(`Refresh failed: ${error}`);
        } finally {
          setIsRefreshing(false);
        }
      } else {
        addDebugInfo('Not enough pull distance or already refreshing');
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
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, touchStartY]);

  const pullProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Debug Panel */}
        <div className="bg-black text-green-400 p-3 rounded-lg mb-4 font-mono text-xs">
          <div className="mb-2 font-bold">DEBUG INFO:</div>
          <div>isPulling: {isPulling ? 'true' : 'false'}</div>
          <div>pullDistance: {pullDistance}px</div>
          <div>threshold: {threshold}px</div>
          <div>pullProgress: {pullProgress.toFixed(2)}</div>
          <div>isRefreshing: {isRefreshing ? 'true' : 'false'}</div>
          <div>touchStartY: {touchStartY}</div>
          <div>currentTouchY: {currentTouchY}</div>
          <div className="mt-2 border-t border-green-600 pt-2">
            {debugInfo.map((info, idx) => (
              <div key={idx} className="text-xs">{info}</div>
            ))}
          </div>
        </div>

        {/* Pull to Refresh Container */}
        <div 
          ref={containerRef}
          className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
          style={{ touchAction: 'pan-y', height: '400px' }}
        >
          {/* Pull indicator */}
          <div 
            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center pointer-events-none bg-blue-50 border-b border-blue-200"
            style={{
              height: '60px',
              transform: `translateY(${Math.max(0, pullDistance - 60)}px)`,
              opacity: isPulling ? 1 : 0,
            }}
          >
            <div className="flex items-center gap-2">
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
            <div className="absolute inset-0 bg-white/90 z-20 flex items-center justify-center">
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
            className="p-4 transition-transform duration-200"
            style={{
              transform: isPulling ? `translateY(${pullDistance}px)` : 'translateY(0)',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
