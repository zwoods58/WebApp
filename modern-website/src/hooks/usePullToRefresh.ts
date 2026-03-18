"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  debounceMs?: number;
  disabled?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  shouldRefresh: boolean;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  debounceMs = 100,
  disabled = false
}: PullToRefreshOptions) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    shouldRefresh: false
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const resetState = useCallback(() => {
    setState({
      isPulling: false,
      isRefreshing: false,
      pullDistance: 0,
      shouldRefresh: false
    });
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    startY.current = touch.clientY;
    currentY.current = touch.clientY;

    // Only start pull to refresh if we're at the top of the container
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      if (scrollTop > 0) return;
    }

    setState(prev => ({
      ...prev,
      isPulling: true,
      pullDistance: 0,
      shouldRefresh: false
    }));
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled || !state.isPulling) return;

    const touch = e.touches[0];
    currentY.current = touch.clientY;
    const deltaY = currentY.current - startY.current;

    // Only allow pulling down (negative deltaY)
    if (deltaY > 0) return;

    const pullDistance = Math.abs(deltaY);
    const shouldRefresh = pullDistance >= threshold;

    setState(prev => ({
      ...prev,
      pullDistance: Math.min(pullDistance, threshold * 1.5),
      shouldRefresh
    }));

    // Prevent default scrolling when pulling down
    if (pullDistance > 10) {
      e.preventDefault();
    }
  }, [disabled, state.isPulling, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || !state.isPulling) return;

    if (state.shouldRefresh && !state.isRefreshing) {
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        pullDistance: threshold
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        // Reset after a short delay to show completion
        setTimeout(() => {
          resetState();
        }, 500);
      }
    } else {
      resetState();
    }
  }, [disabled, state.isPulling, state.shouldRefresh, state.isRefreshing, threshold, onRefresh, resetState]);

  // Mouse event handlers for desktop
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (disabled) return;
    
    const mouse = e as MouseEvent;
    startY.current = mouse.clientY;
    currentY.current = mouse.clientY;

    // Only start pull to refresh if we're at the top of the container
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      if (scrollTop > 0) return;
    }

    setState(prev => ({
      ...prev,
      isPulling: true,
      pullDistance: 0,
      shouldRefresh: false
    }));
  }, [disabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (disabled || !state.isPulling) return;

    const mouse = e as MouseEvent;
    currentY.current = mouse.clientY;
    const deltaY = currentY.current - startY.current;

    // Only allow pulling down (positive deltaY for mouse)
    if (deltaY < 0) return;

    const pullDistance = Math.abs(deltaY);
    const shouldRefresh = pullDistance >= threshold;

    setState(prev => ({
      ...prev,
      pullDistance: Math.min(pullDistance, threshold * 1.5),
      shouldRefresh
    }));

    // Prevent default scrolling when pulling down
    if (pullDistance > 10) {
      e.preventDefault();
    }
  }, [disabled, state.isPulling, threshold]);

  const handleMouseUp = useCallback(async () => {
    if (disabled || !state.isPulling) return;

    if (state.shouldRefresh && !state.isRefreshing) {
      setState(prev => ({
        ...prev,
        isRefreshing: true,
        pullDistance: threshold
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull to refresh failed:', error);
      } finally {
        // Reset after a short delay to show completion
        setTimeout(() => {
          resetState();
        }, 500);
      }
    } else {
      resetState();
    }
  }, [disabled, state.isPulling, state.shouldRefresh, state.isRefreshing, threshold, onRefresh, resetState]);

  // Add touch and mouse event listeners
  useEffect(() => {
    const element = containerRef.current;
    if (!element || disabled) return;

    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    // Mouse events for desktop
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseup', handleMouseUp);
    element.addEventListener('mouseleave', handleMouseUp);

    return () => {
      // Touch events
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      // Mouse events
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
      element.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, disabled]);

  // Debounce pull distance updates
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    debounceTimer.current = setTimeout(() => {
      // Debounced updates can be handled here if needed
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [state.pullDistance, debounceMs]);

  return {
    containerRef,
    ...state,
    resetState
  };
}
