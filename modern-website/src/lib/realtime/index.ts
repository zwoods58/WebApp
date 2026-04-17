// =====================================================
// Realtime Optimization Module Exports
// PURPOSE: Central export point for all realtime optimization components
// =====================================================

import { realtimeManager, RealtimeManager } from './manager';
import { realtimeBatcher, RealtimeBatcher } from './batcher';
import { realtimeConnectionPool, RealtimeConnectionPool } from './connection';
import { realtimeVisibilityHandler, RealtimeVisibilityHandler } from './visibility';

// Re-export classes and instances
export { RealtimeManager, realtimeManager };
export { RealtimeBatcher, realtimeBatcher };
export { RealtimeConnectionPool, realtimeConnectionPool };
export { RealtimeVisibilityHandler, realtimeVisibilityHandler };

// Combined interface for easy access
export const realtimeOptimization = {
  manager: realtimeManager,
  batcher: realtimeBatcher,
  connectionPool: realtimeConnectionPool,
  visibilityHandler: realtimeVisibilityHandler,
  
  // Convenience methods
  getStats: () => ({
    manager: realtimeManager.getStats(),
    batcher: realtimeBatcher.getStats(),
    connectionPool: realtimeConnectionPool.getStats(),
    visibility: realtimeVisibilityHandler.getStats(),
  }),
  
  destroy: () => {
    realtimeManager.destroy();
    realtimeBatcher.destroy();
    realtimeConnectionPool.destroy();
    realtimeVisibilityHandler.destroy();
  },
  
  // Initialize all components
  initialize: () => {
    console.log('[Realtime] Initializing optimization components');
    // Components are auto-initialized via constructors
  }
};

