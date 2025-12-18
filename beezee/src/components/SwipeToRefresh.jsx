import { RefreshCw } from 'lucide-react';
import { useSwipeToRefresh } from '../hooks/useSwipeToRefresh';

/**
 * SwipeToRefresh Component
 * Provides pull-to-refresh functionality with visual feedback
 */
export default function SwipeToRefresh({ 
  onRefresh, 
  children, 
  disabled = false,
  threshold = 80,
  className = '' 
}) {
  const { containerRef, isRefreshing, pullDistance, progress } = useSwipeToRefresh(
    onRefresh,
    { threshold, disabled }
  );

  const showIndicator = pullDistance > 0 || isRefreshing;
  const shouldRelease = progress >= 100 && !isRefreshing;

  return (
    <div className={`swipe-to-refresh-container ${className}`} ref={containerRef}>
      {/* Pull-to-refresh indicator */}
      {showIndicator && (
        <div 
          className="swipe-to-refresh-indicator"
          style={{
            transform: `translateY(${Math.min(pullDistance, 60)}px)`,
            opacity: Math.min(progress / 100, 1),
          }}
        >
          <div className="swipe-to-refresh-icon-wrapper">
            <RefreshCw 
              size={24} 
              className={`swipe-to-refresh-icon ${isRefreshing ? 'spinning' : ''}`}
              style={{
                transform: shouldRelease ? 'rotate(180deg)' : `rotate(${progress * 3.6}deg)`,
              }}
            />
          </div>
          <div className="swipe-to-refresh-text">
            {isRefreshing 
              ? 'Refreshing...' 
              : shouldRelease 
              ? 'Release to refresh' 
              : 'Pull to refresh'}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="swipe-to-refresh-content">
        {children}
      </div>
    </div>
  );
}




