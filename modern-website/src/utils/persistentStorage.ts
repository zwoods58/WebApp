/**
 * Persistent Storage Utility
 * Provides robust localStorage persistence with backup strategies
 * Prevents data loss during hard refresh and browser sessions
 */

interface PersistentStorageItem<T> {
  data: T;
  timestamp: number;
  version: string;
  checksum: string;
}

interface BackupStorage {
  primary: string;
  fallback: string[];
  encrypted?: boolean;
}

class PersistentStorage {
  private readonly APP_VERSION = '1.0.0';
  private readonly BACKUP_KEYS = {
    primary: 'beezee_persistent_data',
    fallback: ['beezee_backup_data', 'beezee_emergency_data']
  };

  /**
   * Generate checksum for data integrity
   */
  private generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Store data with multiple backup strategies
   */
  set<T>(key: string, data: T, options: {
    encrypt?: boolean;
    ttl?: number;
    backup?: boolean;
  } = {}): boolean {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }

      const { encrypt = false, ttl, backup = true } = options;
      
      const storageItem: PersistentStorageItem<T> = {
        data,
        timestamp: Date.now(),
        version: this.APP_VERSION,
        checksum: this.generateChecksum(data)
      };

      // Store primary data
      const primaryItem = {
        ...storageItem,
        ttl: ttl || (30 * 24 * 60 * 60 * 1000), // Default 30 days
        encrypt: encrypt
      };

      localStorage.setItem(key, JSON.stringify(primaryItem));

      // Create backups for critical data
      if (backup && this.isCriticalKey(key)) {
        this.createBackups(key, storageItem);
      }

      console.log(`✅ Stored persistent data: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to store persistent data ${key}:`, error);
      return false;
    }
  }

  /**
   * Retrieve data with integrity verification
   */
  get<T>(key: string): T | null {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return null;
      }

      // Try primary storage first
      let item = localStorage.getItem(key);
      
      if (!item) {
        // Try fallback storage
        item = this.getFromFallback(key);
      }

      if (!item) {
        console.log(`⚠️ No data found for key: ${key}`);
        return null;
      }

      const storageItem: PersistentStorageItem<T> = JSON.parse(item);
      
      // Verify data integrity
      const currentChecksum = this.generateChecksum(storageItem.data);
      if (currentChecksum !== storageItem.checksum) {
        console.error(`❌ Data corruption detected for ${key}, trying backup...`);
        return this.getFromBackup<T>(key);
      }

      // Check version compatibility
      if (this.isVersionIncompatible(storageItem.version)) {
        console.log(`🔄 Version mismatch for ${key}, migrating data...`);
        this.migrateData(key, storageItem);
      }

      console.log(`✅ Retrieved persistent data: ${key}`);
      return storageItem.data;
    } catch (error) {
      console.error(`❌ Failed to retrieve persistent data ${key}:`, error);
      return this.getFromBackup<T>(key);
    }
  }

  /**
   * Remove data from all storage locations
   */
  remove(key: string): void {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }

      localStorage.removeItem(key);
      
      // Remove from backup locations
      this.BACKUP_KEYS.fallback.forEach(backupKey => {
        const backupData = localStorage.getItem(backupKey);
        if (backupData) {
          try {
            const parsed = JSON.parse(backupData);
            if (parsed[key]) {
              delete parsed[key];
              localStorage.setItem(backupKey, JSON.stringify(parsed));
            }
          } catch (error) {
            console.warn(`Failed to clean backup ${backupKey}:`, error);
          }
        }
      });

      console.log(`🗑️ Removed persistent data: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to remove persistent data ${key}:`, error);
    }
  }

  /**
   * Create backup copies of critical data
   */
  private createBackups<T>(key: string, data: PersistentStorageItem<T>): void {
    try {
      this.BACKUP_KEYS.fallback.forEach((backupKey, index) => {
        const existingBackup = localStorage.getItem(backupKey);
        let backupData = existingBackup ? JSON.parse(existingBackup) : {};
        
        backupData[key] = {
          ...data,
          backupIndex: index,
          backupTimestamp: Date.now()
        };

        localStorage.setItem(backupKey, JSON.stringify(backupData));
      });

      console.log(`💾 Created backups for: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to create backups for ${key}:`, error);
    }
  }

  /**
   * Retrieve data from fallback storage
   */
  private getFromFallback(key: string): string | null {
    for (const backupKey of this.BACKUP_KEYS.fallback) {
      const backupData = localStorage.getItem(backupKey);
      if (backupData) {
        try {
          const parsed = JSON.parse(backupData);
          if (parsed[key]) {
            console.log(`🔄 Retrieved from fallback: ${backupKey}`);
            return JSON.stringify(parsed[key]);
          }
        } catch (error) {
          console.warn(`Invalid backup data in ${backupKey}:`, error);
        }
      }
    }
    return null;
  }

  /**
   * Retrieve data from backup with integrity check
   */
  private getFromBackup<T>(key: string): T | null {
    for (const backupKey of this.BACKUP_KEYS.fallback) {
      const backupData = localStorage.getItem(backupKey);
      if (backupData) {
        try {
          const parsed = JSON.parse(backupData);
          const backupItem = parsed[key];
          
          if (backupItem) {
            const currentChecksum = this.generateChecksum(backupItem.data);
            if (currentChecksum === backupItem.checksum) {
              console.log(`✅ Retrieved valid backup from: ${backupKey}`);
              return backupItem.data;
            }
          }
        } catch (error) {
          console.warn(`Failed to parse backup ${backupKey}:`, error);
        }
      }
    }
    return null;
  }

  /**
   * Check if key is critical and needs backup
   */
  private isCriticalKey(key: string): boolean {
    const criticalKeys = [
      'beezee_unified_auth',
      'beezee_business_auth',
      'user_preferences',
      'app_settings',
      'business_profile'
    ];
    return criticalKeys.some(criticalKey => key.includes(criticalKey));
  }

  /**
   * Check version compatibility
   */
  private isVersionIncompatible(storedVersion: string): boolean {
    // Simple version check - can be made more sophisticated
    return storedVersion !== this.APP_VERSION;
  }

  /**
   * Migrate data to new version
   */
  private migrateData<T>(key: string, storageItem: PersistentStorageItem<T>): void {
    // Update version and re-store
    storageItem.version = this.APP_VERSION;
    storageItem.timestamp = Date.now();
    
    const updatedItem = {
      ...storageItem,
      ttl: 30 * 24 * 60 * 60 * 1000, // Reset TTL to 30 days
    };

    localStorage.setItem(key, JSON.stringify(updatedItem));
    console.log(`🔄 Migrated data for ${key} to version ${this.APP_VERSION}`);
  }

  /**
   * Get storage statistics
   */
  getStats(): {
    totalItems: number;
    totalSize: number;
    backupItems: number;
    criticalItems: string[];
  } {
    let totalItems = 0;
    let totalSize = 0;
    let backupItems = 0;
    const criticalItems: string[] = [];

    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage[key];
          totalSize += value.length + key.length;
          totalItems++;

          if (this.isCriticalKey(key)) {
            criticalItems.push(key);
          }

          if (key.includes('backup')) {
            backupItems++;
          }
        }
      }
    } catch (error) {
      console.error('Error calculating storage stats:', error);
    }

    return {
      totalItems,
      totalSize,
      backupItems,
      criticalItems
    };
  }

  /**
   * Emergency restore from all available backups
   */
  emergencyRestore(): { restored: string[]; failed: string[] } {
    const restored: string[] = [];
    const failed: string[] = [];

    const criticalKeys = [
      'beezee_unified_auth',
      'beezee_business_auth',
      'user_preferences',
      'app_settings'
    ];

    criticalKeys.forEach(key => {
      const data = this.getFromBackup(key);
      if (data) {
        this.set(key, data, { backup: true });
        restored.push(key);
      } else {
        failed.push(key);
      }
    });

    console.log(`🚨 Emergency restore: ${restored.length} restored, ${failed.length} failed`);
    return { restored, failed };
  }

  /**
   * Validate and repair storage
   */
  validateAndRepair(): { issues: string[]; repaired: string[] } {
    const issues: string[] = [];
    const repaired: string[] = [];

    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && this.isCriticalKey(key)) {
          try {
            const item = localStorage.getItem(key);
            if (item) {
              const parsed = JSON.parse(item);
              const checksum = this.generateChecksum(parsed.data);
              
              if (checksum !== parsed.checksum) {
                issues.push(`Checksum mismatch for ${key}`);
                const backupData = this.getFromBackup(key);
                if (backupData) {
                  this.set(key, backupData, { backup: true });
                  repaired.push(key);
                }
              }
            }
          } catch (error) {
            issues.push(`Parse error for ${key}`);
            const backupData = this.getFromBackup(key);
            if (backupData) {
              this.set(key, backupData, { backup: true });
              repaired.push(key);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during validation:', error);
    }

    return { issues, repaired };
  }
}

export const persistentStorage = new PersistentStorage();
export default PersistentStorage;
