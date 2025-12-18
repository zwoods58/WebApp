import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for swipe-to-refresh functionality
 * @param {Function} onRefresh - Callback function to execute on refresh
 * @param {Object} options - Configuration options
 * @returns {Object} - Ref to attach to container and refresh state
 */
export function useSwipeToRefresh(onRefresh, options = {}) {
  const {
    threshold = 80, // Distance in pixels to trigger refresh
    resistance = 2.5, // Resistance factor for pull distance
    disabled = false,
  } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef(null);
  const isPulling = useRef(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e) => {
      // Only allow pull-to-refresh when at the top of the scrollable area
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        currentY.current = startY.current;
        isPulling.current = true;
        hasTriggered.current = false;
        setPullDistance(0);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling.current) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // Only allow downward pull
      if (deltaY > 0 && container.scrollTop === 0) {
        e.preventDefault(); // Prevent default scroll behavior
        const distance = Math.min(deltaY / resistance, threshold * 1.5);
        setPullDistance(distance);

        // Trigger refresh when threshold is reached
        if (distance >= threshold && !hasTriggered.current && !isRefreshing) {
          hasTriggered.current = true;
          setIsRefreshing(true);
          if (onRefresh) {
            Promise.resolve(onRefresh())
              .finally(() => {
                setIsRefreshing(false);
                setPullDistance(0);
                isPulling.current = false;
              });
          }
        }
      } else if (deltaY <= 0) {
        // Reset if user pulls up
        isPulling.current = false;
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (isPulling.current) {
        if (!hasTriggered.current) {
          // Snap back if threshold not reached
          setPullDistance(0);
        }
        isPulling.current = false;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold, resistance, disabled, isRefreshing]);

  // Calculate progress percentage (0-100)
  const progress = Math.min((pullDistance / threshold) * 100, 100);

  return {
    containerRef,
    isRefreshing,
    pullDistance,
    progress,
  };
}




