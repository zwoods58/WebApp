/**
 * localStorage Manager with caching, TTL, and cleanup functionality
 * Prevents storage overflow and manages data lifecycle
 */

interface CacheMeta {
  version: string;
  size: number;
  compressed: boolean;
  lastCleanup: number;
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  compressed?: boolean;
}

interface StorageRules {
  [key: string]: {
    ttl: number;
    compress?: boolean;
  };
}

const CACHE_RULES: StorageRules = {
  userProfile: { ttl: 7 * 24 * 60 * 60 * 1000 }, // 7 days
  sessionData: { ttl: 7 * 24 * 60 * 60 * 1000 },     // 7 days (extended)
  syncStatus: { ttl: 30 * 60 * 1000 },            // 30 minutes
  dashboardCache: { ttl: 60 * 60 * 1000 },       // 1 hour
  businessData: { ttl: 30 * 24 * 60 * 60 * 1000 }, // 30 days (extended)
  // Preserve auth data much longer
  beezee_unified_auth: { ttl: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  beezee_business_auth: { ttl: 30 * 24 * 60 * 60 * 1000 }, // 30 days
};

const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
const CLEANUP_THRESHOLD = 4 * 1024 * 1024; // Start cleanup at 4MB

class LocalStorageManager {
  private project_id: string;

  constructor(project_id: string = 'zruprmhkcqhgzydjfhrk') {
    this.project_id = project_id;
    
    // SAFEGUARD: Only initialize cleanup in browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.initializeCleanup();
    }
  }

  /**
   * Get data from localStorage with TTL validation
   */
  get<T>(key: string): T | null {
    try {
      // SAFEGUARD: Only run in browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return null;
      }

      const item = localStorage.getItem(key);
      if (!item) return null;

      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      // Check if item has expired
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error);
      return null;
    }
  }

  /**
   * Set data in localStorage with TTL
   */
  set<T>(key: string, data: T, customTtl?: number): boolean {
    try {
      // SAFEGUARD: Only run in browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }

      const ttl = customTtl || CACHE_RULES[key]?.ttl || 24 * 60 * 60 * 1000; // Default 24 hours
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      const itemString = JSON.stringify(cacheItem);
      
      // Check storage size before setting
      if (this.getStorageSize() + itemString.length > MAX_STORAGE_SIZE) {
        this.performCleanup();
        
        // If still too large after cleanup, don't set
        if (this.getStorageSize() + itemString.length > MAX_STORAGE_SIZE) {
          console.warn('localStorage quota exceeded, cannot set item:', key);
          return false;
        }
      }

      localStorage.setItem(key, itemString);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      // SAFEGUARD: Only run in browser environment
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
    }
  }

  /**
   * Clear all localStorage data
   */
  clear(): void {
    try {
      // SAFEGUARD: Only run in browser environment
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if item is critical and should not be removed during cleanup
   */
  private isCriticalItem(key: string): boolean {
    const criticalKeys = [
      'beezee_unified_auth',
      'beezee_business_auth',
      'sessionData',
      'userProfile',
      'beezee_backup_data',
      'beezee_emergency_data',
      'cacheMeta'
    ];
    return criticalKeys.some(criticalKey => key.includes(criticalKey));
  }

  /**
   * Get current storage size in bytes
   */
  private getStorageSize(): number {
    // SAFEGUARD: Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return 0;
    }

    let totalSize = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
    return totalSize;
  }

  /**
   * Perform cleanup of expired items
   */
  private performCleanup(): void {
    // SAFEGUARD: Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const now = Date.now();
    const keysToRemove: string[] = [];

    try {
      // Find expired items
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const cacheItem: CacheItem<any> = JSON.parse(item);
              if (now - cacheItem.timestamp > cacheItem.ttl) {
                keysToRemove.push(key);
              }
            }
          } catch {
            // Remove malformed items
            keysToRemove.push(key);
          }
        }
      }

      // Remove expired items
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // If still over threshold, remove oldest items
      if (this.getStorageSize() > CLEANUP_THRESHOLD) {
        this.performLRUCleanup();
      }

      // Update cleanup metadata
      this.setCacheMeta();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Remove least recently used items
   */
  private performLRUCleanup(): void {
    const items: Array<{ key: string; timestamp: number }> = [];

    try {
      // Collect all items with timestamps
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const cacheItem: CacheItem<any> = JSON.parse(item);
              items.push({ key, timestamp: cacheItem.timestamp });
            }
          } catch {
            // Remove malformed items
            localStorage.removeItem(key);
          }
        }
      }

      // Sort by timestamp (oldest first)
      items.sort((a, b) => a.timestamp - b.timestamp);

      // Remove oldest items until under threshold
      let removed = 0;
      for (const item of items) {
        if (this.getStorageSize() <= CLEANUP_THRESHOLD) break;
        
        // Don't remove critical items
        if (!this.isCriticalItem(item.key)) {
          localStorage.removeItem(item.key);
          removed++;
        }
      }

      console.log(`LRU Cleanup: removed ${removed} items`);
    } catch (error) {
      console.error('Error during LRU cleanup:', error);
    }
  }

  /**
   * Initialize periodic cleanup
   */
  private initializeCleanup(): void {
    // SAFEGUARD: Only run in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    // Perform cleanup on initialization
    this.performCleanup();

    // Set up periodic cleanup every hour
    setInterval(() => {
      this.performCleanup();
    }, 60 * 60 * 1000);
  }

  /**
   * Update cache metadata
   */
  private setCacheMeta(): void {
    const meta: CacheMeta = {
      version: '1.0',
      size: this.getStorageSize(),
      compressed: false,
      lastCleanup: Date.now(),
    };

    localStorage.setItem('cacheMeta', JSON.stringify(meta));
  }

  /**
   * Get storage statistics
   */
  getStorageStats(): {
    size: number;
    sizeFormatted: string;
    itemCount: number;
    lastCleanup: number;
  } {
    let itemCount = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          itemCount++;
        }
      }
    } catch (error) {
      console.error('Error counting items:', error);
    }

    const size = this.getStorageSize();
    const meta = this.get<CacheMeta>('cacheMeta') || {
      lastCleanup: 0,
    };

    return {
      size,
      sizeFormatted: this.formatBytes(size),
      itemCount,
      lastCleanup: meta.lastCleanup,
    };
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if storage needs cleanup
   */
  needsCleanup(): boolean {
    return this.getStorageSize() > CLEANUP_THRESHOLD;
  }

  /**
   * Force cleanup
   */
  forceCleanup(): void {
    this.performCleanup();
  }
}

export const localStorageManager = new LocalStorageManager();
export default LocalStorageManager;
