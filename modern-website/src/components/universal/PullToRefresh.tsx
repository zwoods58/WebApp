"use client";

import React, { useState, useEffect, useRef, TouchEvent } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const PULL_THRESHOLD = 80;

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      setIsDragging(true);
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    
    if (deltaY > 0) {
      e.preventDefault();
      setPullDistance(Math.min(deltaY * 0.5, PULL_THRESHOLD * 1.5)); // Add resistance
    }
  };

  const handleTouchEnd = async () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (pullDistance > PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(50); // Snap to refresh position
      
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Haptic feedback
      }
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0); // Reset position
      }
    } else {
      setPullDistance(0); // Reset position
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none z-10 transition-transform duration-200 ease-out"
        style={{ 
          height: '50px',
          transform: `translateY(${Math.max(0, pullDistance - 30)}px)`,
          opacity: Math.min(1, pullDistance / PULL_THRESHOLD)
        }}
      >
        <div
          className={`w-8 h-8 rounded-full border-2 border-[var(--powder-dark)] border-t-transparent flex items-center justify-center bg-white shadow-md ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        />
      </div>

      <div
        className="w-full h-full z-20 relative bg-[var(--bg)] transition-transform duration-200 ease-out"
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
};

