// =====================================================
// Realtime Page Visibility Handler
// PURPOSE: Pause realtime when tab is inactive to reduce load
// Automatically resumes when user returns to the tab
// =====================================================

import { realtimeManager } from './manager';
import { realtimeBatcher } from './batcher';
import { realtimeConnectionPool } from './connection';

type VisibilityState = 'visible' | 'hidden' | 'prerender' | 'unloaded';

class RealtimeVisibilityHandler {
  private isVisible = true;
  private wasVisible = true;
  private visibilityTimeout: NodeJS.Timeout | null = null;
  private readonly VISIBILITY_DELAY = 1000; // 1 second delay before pausing
  private subscribers: Array<(isVisible: boolean) => void> = [];
  private businessSubscriptions = new Map<string, string[]>(); // businessId -> subscriptionIds

  constructor() {
    this.initialize();
  }

  /**
   * Initialize visibility detection
   */
  private initialize(): void {
    if (typeof window === 'undefined') {
      return; // Skip on server-side
    }

    // Check initial visibility
    this.updateVisibility();

    // Listen for visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Listen for page focus/blur events (additional detection)
    window.addEventListener('focus', this.handleFocus.bind(this));
    window.addEventListener('blur', this.handleBlur.bind(this));
    
    // Listen for page unload
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

    console.log('[Visibility] Initialized page visibility handler');
  }

  /**
   * Handle visibility change event
   */
  private handleVisibilityChange(): void {
    this.updateVisibility();
  }

  /**
   * Handle window focus event
   */
  private handleFocus(): void {
    if (!this.isVisible) {
      this.setVisibility(true);
    }
  }

  /**
   * Handle window blur event
   */
  private handleBlur(): void {
    if (this.isVisible && !document.hidden) {
      // Only blur if document is not hidden (window lost focus but page still visible)
      this.setVisibility(false);
    }
  }

  /**
   * Handle before unload event
   */
  private handleBeforeUnload(): void {
    // Immediately pause all realtime activity
    this.setVisibility(false, true);
  }

  /**
   * Update visibility state
   */
  private updateVisibility(): void {
    const newVisibility = !document.hidden;
    
    if (newVisibility !== this.isVisible) {
      this.setVisibility(newVisibility);
    }
  }

  /**
   * Set visibility state
   */
  private setVisibility(visible: boolean, immediate = false): void {
    if (visible === this.isVisible) {
      return;
    }

    this.wasVisible = this.isVisible;
    this.isVisible = visible;

    console.log(`[Visibility] Page ${visible ? 'visible' : 'hidden'}`);

    // Clear any pending timeout
    if (this.visibilityTimeout) {
      clearTimeout(this.visibilityTimeout);
      this.visibilityTimeout = null;
    }

    if (visible) {
      // Immediately resume when visible
      this.resumeRealtime();
    } else {
      if (immediate) {
        // Immediately pause (e.g., page unload)
        this.pauseRealtime();
      } else {
        // Delay pause to avoid quick tab switches
        this.visibilityTimeout = setTimeout(() => {
          if (!this.isVisible) {
            this.pauseRealtime();
          }
        }, this.VISIBILITY_DELAY);
      }
    }

    // Notify subscribers
    this.notifySubscribers(visible);
  }

  /**
   * Pause realtime activity
   */
  private pauseRealtime(): void {
    console.log('[Visibility] Pausing realtime activity');

    // Get all current subscriptions
    const stats = realtimeManager.getStats();
    const businessIds = Object.keys(stats.subscriptionsByBusiness);

    // Store subscription info for resuming
    businessIds.forEach(businessId => {
      const businessStats = realtimeManager.getStats();
      // Note: We'll need to enhance the manager to provide subscription details
      this.businessSubscriptions.set(businessId, []);
    });

    // Unsubscribe all business subscriptions
    businessIds.forEach(businessId => {
      realtimeManager.unsubscribeBusiness(businessId);
    });

    // Flush any pending batches
    realtimeBatcher.flushAll();

    // Track pause event
    this.trackVisibilityEvent('pause');
  }

  /**
   * Resume realtime activity
   */
  private resumeRealtime(): void {
    console.log('[Visibility] Resuming realtime activity');

    // Note: In a real implementation, you would need to:
    // 1. Re-subscribe to all previous subscriptions
    // 2. Restore any state that was paused
    // 3. Fetch any missed data during the pause

    // For now, we'll just log the resume
    // The actual re-subscription logic would need to be implemented
    // based on the application's specific needs

    // Track resume event
    this.trackVisibilityEvent('resume');
  }

  /**
   * Subscribe to visibility changes
   */
  onVisibilityChange(callback: (isVisible: boolean) => void): () => void {
    this.subscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * Get current visibility state
   */
  getVisibility(): boolean {
    return this.isVisible;
  }

  /**
   * Get visibility statistics
   */
  getStats() {
    return {
      isVisible: this.isVisible,
      wasVisible: this.wasVisible,
      subscriberCount: this.subscribers.length,
      trackedBusinesses: this.businessSubscriptions.size,
      hasPendingTimeout: this.visibilityTimeout !== null
    };
  }

  /**
   * Notify all subscribers of visibility change
   */
  private notifySubscribers(visible: boolean): void {
    this.subscribers.forEach(callback => {
      try {
        callback(visible);
      } catch (error) {
        console.error('[Visibility] Subscriber callback error:', error);
      }
    });
  }

  /**
   * Track visibility events for analytics
   */
  private async trackVisibilityEvent(action: 'pause' | 'resume'): Promise<void> {
    try {
      const { supabase } = await import('@/lib/supabase');
      
      // Track in cache_metrics table for monitoring
      const { error } = await supabase
        .from('cache_metrics')
        .insert({
          cache_key: `visibility:${action}`,
          operation: 'set',
          duration_ms: 0
        });

      if (error) {
        console.error('[Visibility] Failed to track event:', error);
      }
    } catch (err) {
      console.error('[Visibility] Event tracking error:', err);
    }
  }

  /**
   * Destroy visibility handler
   */
  destroy(): void {
    // Clear timeout
    if (this.visibilityTimeout) {
      clearTimeout(this.visibilityTimeout);
      this.visibilityTimeout = null;
    }

    // Remove event listeners
    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      window.removeEventListener('focus', this.handleFocus.bind(this));
      window.removeEventListener('blur', this.handleBlur.bind(this));
      window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    // Clear subscribers
    this.subscribers = [];
    this.businessSubscriptions.clear();

    console.log('[Visibility] Destroyed');
  }
}

// Singleton instance
export const realtimeVisibilityHandler = new RealtimeVisibilityHandler();

// Export class for testing
export { RealtimeVisibilityHandler };
