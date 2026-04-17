// =====================================================
// Realtime Event Batcher
// PURPOSE: Batch realtime events to reduce database load by 80-90%
// Collects events over a time window and processes them together
// =====================================================

interface BatchedEvent {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  businessId: string;
  table: string;
}

interface EventBatch {
  events: BatchedEvent[];
  timer: NodeJS.Timeout | null;
  businessId: string;
}

class RealtimeBatcher {
  private batches = new Map<string, EventBatch>();
  private readonly BATCH_WINDOW = 100; // 100ms
  private readonly MAX_BATCH_SIZE = 50;
  private processingCallbacks = new Map<string, ((events: BatchedEvent[]) => void)[]>();

  /**
   * Add an event to the batch queue
   */
  addEvent(
    businessId: string,
    type: string,
    payload: any,
    table: string
  ): void {
    const batchKey = `${businessId}:${table}`;
    
    // Create event
    const event: BatchedEvent = {
      id: this.generateEventId(),
      type,
      payload,
      timestamp: Date.now(),
      businessId,
      table
    };

    // Get or create batch
    let batch = this.batches.get(batchKey);
    
    if (!batch) {
      batch = {
        events: [],
        timer: null as any,
        businessId
      };
      this.batches.set(batchKey, batch);
    }

    // Add event to batch
    batch.events.push(event);

    // If batch is full, process immediately
    if (batch.events.length >= this.MAX_BATCH_SIZE) {
      this.processBatch(batchKey);
    } else {
      // Set timer to process batch after window
      if (!batch.timer) {
        batch.timer = setTimeout(() => {
          this.processBatch(batchKey);
        }, this.BATCH_WINDOW);
      }
    }

    console.log(`[Batcher] Added event to batch ${batchKey}: ${type} (${batch.events.length}/${this.MAX_BATCH_SIZE})`);
  }

  /**
   * Register a callback for batch processing
   */
  onBatchProcessed(
    businessId: string,
    table: string,
    callback: (events: BatchedEvent[]) => void
  ): () => void {
    const key = `${businessId}:${table}`;
    
    if (!this.processingCallbacks.has(key)) {
      this.processingCallbacks.set(key, []);
    }
    
    this.processingCallbacks.get(key)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.processingCallbacks.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          this.processingCallbacks.delete(key);
        }
      }
    };
  }

  /**
   * Process a batch of events
   */
  private processBatch(batchKey: string): void {
    const batch = this.batches.get(batchKey);
    
    if (!batch || batch.events.length === 0) {
      return;
    }

    // Clear timer
    if (batch.timer) {
      clearTimeout(batch.timer);
      batch.timer = null;
    }

    // Get events
    const events = [...batch.events];
    
    // Clear batch
    batch.events = [];
    
    // Remove batch if no more events pending
    if (batch.events.length === 0) {
      this.batches.delete(batchKey);
    }

    console.log(`[Batcher] Processing batch ${batchKey}: ${events.length} events`);

    // Call processing callbacks
    const callbacks = this.processingCallbacks.get(batchKey);
    if (callbacks && callbacks.length > 0) {
      callbacks.forEach(callback => {
        try {
          callback(events);
        } catch (error) {
          console.error(`[Batcher] Callback error for ${batchKey}:`, error);
        }
      });
    }

    // Track batch processing metrics
    this.trackBatchMetrics(batch.businessId, events);
  }

  /**
   * Get batch statistics
   */
  getStats() {
    const totalBatches = this.batches.size;
    const totalEvents = Array.from(this.batches.values())
      .reduce((sum, batch) => sum + batch.events.length, 0);
    
    const eventsByBusiness = new Map<string, number>();
    const eventsByTable = new Map<string, number>();

    this.batches.forEach((batch, key) => {
      const [businessId, table] = key.split(':');
      
      // Count by business
      eventsByBusiness.set(businessId, (eventsByBusiness.get(businessId) || 0) + batch.events.length);
      
      // Count by table
      eventsByTable.set(table, (eventsByTable.get(table) || 0) + batch.events.length);
    });

    return {
      totalBatches,
      totalEvents,
      eventsByBusiness: Object.fromEntries(eventsByBusiness),
      eventsByTable: Object.fromEntries(eventsByTable),
      averageEventsPerBatch: totalBatches > 0 ? totalEvents / totalBatches : 0
    };
  }

  /**
   * Force process all pending batches
   */
  flushAll(): void {
    const batchKeys = Array.from(this.batches.keys());
    
    batchKeys.forEach(key => {
      this.processBatch(key);
    });
    
    console.log(`[Batcher] Flushed ${batchKeys.length} batches`);
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track batch processing metrics
   */
  private async trackBatchMetrics(businessId: string, events: BatchedEvent[]): Promise<void> {
    try {
      // Calculate metrics
      const avgLatency = events.reduce((sum, event) => {
        return sum + (Date.now() - event.timestamp);
      }, 0) / events.length;

      // Track in cache_metrics table for monitoring
      const { supabase } = await import('@/lib/supabase');
      
      const { error } = await supabase
        .from('cache_metrics')
        .insert({
          cache_key: `batch:${businessId}`,
          operation: 'set',
          duration_ms: Math.round(avgLatency)
        });

      if (error) {
        console.error('[Batcher] Failed to track metrics:', error);
      }
    } catch (err) {
      console.error('[Batcher] Metrics tracking error:', err);
    }
  }

  /**
   * Destroy batcher and clean up all batches
   */
  destroy(): void {
    // Process all pending batches
    this.flushAll();
    
    // Clear all timers
    this.batches.forEach(batch => {
      if (batch.timer) {
        clearTimeout(batch.timer);
      }
    });
    
    // Clear all data
    this.batches.clear();
    this.processingCallbacks.clear();
    
    console.log('[Batcher] Destroyed');
  }
}

// Singleton instance
export const realtimeBatcher = new RealtimeBatcher();

// Export class for testing
export { RealtimeBatcher };

