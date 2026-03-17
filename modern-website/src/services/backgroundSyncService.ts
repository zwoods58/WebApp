/**
 * Background Sync Service
 * Handles synchronization between localStorage and Supabase
 * Provides retry logic, conflict resolution, and sync status tracking
 */

import { localStorageManager } from '@/utils/localStorageManager';
import { supabase } from '@/lib/supabase';

export interface SyncQueueItem {
  id: string;
  type: 'user' | 'business' | 'cleanup';
  data: any;
  retryCount: number;
  lastAttempt: number;
  priority: 'high' | 'medium' | 'low';
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: number;
  pendingItems: number;
  errors: string[];
}

class BackgroundSyncService {
  private syncQueue: SyncQueueItem[] = [];
  private isProcessing = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private retryDelays = [1000, 2000, 5000, 10000, 30000]; // Exponential backoff
  private maxRetries = 5;
  private status: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: 0,
    pendingItems: 0,
    errors: []
  };

  constructor() {
    this.initializeEventListeners();
    this.startSyncProcess();
    this.loadQueueFromStorage();
  }

  /**
   * Initialize event listeners for online/offline status
   */
  private initializeEventListeners(): void {
    window.addEventListener('online', () => {
      this.status.isOnline = true;
      console.log('Network restored, resuming sync');
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.status.isOnline = false;
      console.log('Network lost, pausing sync');
    });
  }

  /**
   * Start the background sync process
   */
  private startSyncProcess(): void {
    // Process queue every 30 seconds
    this.syncInterval = setInterval(() => {
      if (this.status.isOnline && !this.isProcessing) {
        this.processQueue();
      }
    }, 30000);

    // Also process immediately if queue has items
    if (this.syncQueue.length > 0) {
      setTimeout(() => this.processQueue(), 1000);
    }
  }

  /**
   * Add item to sync queue
   */
  public addToQueue(type: 'user' | 'business' | 'cleanup', data: any, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    const item: SyncQueueItem = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      retryCount: 0,
      lastAttempt: 0,
      priority
    };

    // Insert based on priority
    if (priority === 'high') {
      this.syncQueue.unshift(item);
    } else {
      this.syncQueue.push(item);
    }

    this.saveQueueToStorage();
    this.updateStatus();

    // Process immediately if high priority and online
    if (priority === 'high' && this.status.isOnline && !this.isProcessing) {
      setTimeout(() => this.processQueue(), 100);
    }
  }

  /**
   * Process the sync queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.syncQueue.length === 0 || !this.status.isOnline) {
      return;
    }

    this.isProcessing = true;
    this.status.isSyncing = true;
    this.updateStatus();

    console.log(`Processing sync queue with ${this.syncQueue.length} items`);

    try {
      while (this.syncQueue.length > 0 && this.status.isOnline) {
        const item = this.syncQueue[0];
        
        // Check if item should be retried
        const now = Date.now();
        const retryDelay = this.retryDelays[Math.min(item.retryCount, this.retryDelays.length - 1)];
        
        if (item.lastAttempt > 0 && (now - item.lastAttempt) < retryDelay) {
          // Not time to retry yet, move to next item
          this.syncQueue.push(this.syncQueue.shift()!);
          continue;
        }

        item.lastAttempt = now;

        try {
          await this.processSyncItem(item);
          // Item processed successfully, remove from queue
          this.syncQueue.shift();
          console.log(`Sync item ${item.id} processed successfully`);
        } catch (error) {
          console.error(`Sync item ${item.id} failed:`, error);
          item.retryCount++;

          if (item.retryCount >= this.maxRetries) {
            // Max retries reached, remove from queue and log error
            this.syncQueue.shift();
            this.status.errors.push(`Failed to sync ${item.type} after ${this.maxRetries} attempts: ${error}`);
            console.error(`Max retries reached for item ${item.id}, removing from queue`);
          } else {
            // Move to end of queue for retry
            this.syncQueue.push(this.syncQueue.shift()!);
            console.log(`Item ${item.id} will be retried (${item.retryCount}/${this.maxRetries})`);
          }
        }

        // Save queue state after each item
        this.saveQueueToStorage();
        this.updateStatus();

        // Small delay between items to prevent overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error in sync process:', error);
      this.status.errors.push(`Sync process error: ${error}`);
    } finally {
      this.isProcessing = false;
      this.status.isSyncing = false;
      this.status.lastSync = Date.now();
      this.updateStatus();
    }
  }

  /**
   * Process individual sync item
   */
  private async processSyncItem(item: SyncQueueItem): Promise<void> {
    switch (item.type) {
      case 'user':
        await this.syncUser(item.data);
        break;
      case 'business':
        await this.syncBusiness(item.data);
        break;
      case 'cleanup':
        await this.performCleanup(item.data);
        break;
      default:
        throw new Error(`Unknown sync item type: ${item.type}`);
    }
  }

  /**
   * Sync user data
   */
  private async syncUser(userData: any): Promise<void> {
    try {
      // Check if user exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (existingUser) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('users')
          .update({
            phone_number: userData.phone_number,
            business_name: userData.business_name,
            country: userData.country,
            industry: userData.industry,
            daily_target: userData.daily_target,
            currency: userData.currency,
            updated_at: new Date().toISOString()
          })
          .eq('id', userData.id);
          
        if (updateError) throw updateError;
      } else {
        // Create new user
        const { error: createError } = await supabase
          .from('users')
          .insert({
            id: userData.id,
            phone_number: userData.phone_number,
            business_name: userData.business_name,
            country: userData.country,
            industry: userData.industry,
            daily_target: userData.daily_target,
            currency: userData.currency,
            auth_method: userData.auth_method || 'phone',
            full_name: userData.name || userData.business_name,
          });
          
        if (createError) throw createError;
      }
    } catch (error) {
      throw new Error(`User sync failed: ${error}`);
    }
  }

  /**
   * Sync business data
   */
  private async syncBusiness(businessData: any): Promise<void> {
    try {
      // Check if business exists in database
      const { data: existingBusiness, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', businessData.user_id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (existingBusiness) {
        // Update existing business
        const { error: updateError } = await supabase
          .from('businesses')
          .update({
            industry: businessData.industry,
            business_name: businessData.business_name,
            country: businessData.country,
            settings: businessData.settings,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', businessData.user_id);
          
        if (updateError) throw updateError;
        console.log('Business updated successfully');
      } else {
        // Create new business
        const { error: createError } = await supabase
          .from('businesses')
          .insert(businessData);
          
        if (createError) throw createError;
        console.log('Business created successfully');
      }
    } catch (error) {
      throw new Error(`Business sync failed: ${error}`);
    }
  }

  /**
   * Perform cleanup operations
   */
  private async performCleanup(_data: any): Promise<void> {
    try {
      // Clean up expired OTP codes (older than 24 hours)
      const { error: cleanupError } = await supabase
        .from('otp_codes')
        .delete()
        .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        
      if (cleanupError) throw cleanupError;
      console.log('Cleanup completed successfully');
    } catch (error) {
      throw new Error(`Cleanup failed: ${error}`);
    }
  }

  /**
   * Sync all pending data from localStorage
   */
  public syncAllPendingData(): void {
    const userProfile = localStorageManager.get('userProfile') as any;
    const sessionData = localStorageManager.get('sessionData') as any;
    const syncStatus = localStorageManager.get('syncStatus') as any;

    if (userProfile && sessionData && (!syncStatus || !syncStatus.isSynced)) {
      console.log('Syncing pending user data');
      
      // Add user sync to queue
      this.addToQueue('user', {
        id: sessionData.userId,
        phone_number: userProfile.phoneNumber,
        business_name: userProfile.businessName,
        country: userProfile.country,
        industry: userProfile.industry,
        daily_target: userProfile.dailyTarget,
        currency: userProfile.currency,
        auth_method: 'phone'
      }, 'high');

      // Add business sync to queue
      this.addToQueue('business', {
        user_id: sessionData.userId,
        industry: userProfile.industry || 'retail',
        business_name: userProfile.businessName || 'My Business',
        country: userProfile.country || 'KE',
        settings: {
          currency: userProfile.currency || 'KES',
          daily_target: userProfile.dailyTarget || 5000
        },
        is_active: true
      }, 'high');
    }

    // Add periodic cleanup
    this.addToQueue('cleanup', {}, 'low');
  }

  /**
   * Get current sync status
   */
  public getSyncStatus(): SyncStatus {
    return { ...this.status };
  }

  /**
   * Force sync now
   */
  public forceSyncNow(): void {
    if (this.status.isOnline && !this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Clear sync queue
   */
  public clearQueue(): void {
    this.syncQueue = [];
    this.saveQueueToStorage();
    this.updateStatus();
  }

  /**
   * Update sync status
   */
  private updateStatus(): void {
    this.status.pendingItems = this.syncQueue.length;
    
    // Update localStorage with sync status
    localStorageManager.set('syncStatus', {
      lastSync: this.status.lastSync,
      isSynced: this.syncQueue.length === 0,
      pendingChanges: this.syncQueue.length > 0,
      errors: this.status.errors
    });
  }

  /**
   * Save queue to localStorage
   */
  private saveQueueToStorage(): void {
    try {
      localStorageManager.set('syncQueue', this.syncQueue);
    } catch (error) {
      console.error('Failed to save sync queue to localStorage:', error);
    }
  }

  /**
   * Load queue from localStorage
   */
  private loadQueueFromStorage(): void {
    try {
      const savedQueue = localStorageManager.get('syncQueue') as SyncQueueItem[];
      if (savedQueue && Array.isArray(savedQueue)) {
        this.syncQueue = savedQueue;
        console.log(`Loaded ${savedQueue.length} items from sync queue`);
      }
    } catch (error) {
      console.error('Failed to load sync queue from localStorage:', error);
    }
  }

  /**
   * Destroy sync service
   */
  public destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    this.saveQueueToStorage();
  }
}

// Export singleton instance
export const backgroundSyncService = new BackgroundSyncService();
export default BackgroundSyncService;
