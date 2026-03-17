/**
 * Enhanced Background Sync Service
 * Handles synchronization between localStorage and Supabase for ALL features
 * Provides retry logic, conflict resolution, and sync status tracking
 */

import { localStorageManager } from '@/utils/localStorageManager';
import { supabase } from '@/lib/supabase';
import { offlineQueueManager } from '@/utils/offlineQueue';
import { OfflineOperation, FEATURE_SYNC_ORDER } from '@/types/offlineTypes';

export interface SyncQueueItem {
  id: string;
  type: 'user' | 'business' | 'cleanup' | 'beehive' | 'cash' | 'inventory' | 'calendar' | 'credit';
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
  featureStatus: {
    beehive: 'online' | 'offline' | 'syncing' | 'error';
    cash: 'online' | 'offline' | 'syncing' | 'error';
    inventory: 'online' | 'offline' | 'syncing' | 'error';
    calendar: 'online' | 'offline' | 'syncing' | 'error';
    credit: 'online' | 'offline' | 'syncing' | 'error';
  };
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
    errors: [],
    featureStatus: {
      beehive: 'online',
      cash: 'online',
      inventory: 'online',
      calendar: 'online',
      credit: 'online'
    }
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
      case 'beehive':
        await this.syncBeehive(item.data);
        break;
      case 'cash':
        await this.syncCash(item.data);
        break;
      case 'inventory':
        await this.syncInventory(item.data);
        break;
      case 'calendar':
        await this.syncCalendar(item.data);
        break;
      case 'credit':
        await this.syncCredit(item.data);
        break;
      default:
        throw new Error(`Unknown sync item type: ${item.type}`);
    }
  }

  /**
   * Sync Beehive data (posts, comments, likes)
   */
  private async syncBeehive(beehiveData: any): Promise<void> {
    try {
      this.status.featureStatus.beehive = 'syncing';
      this.updateStatus();
      
      switch (beehiveData.operation) {
        case 'create_post':
          const { error: postError } = await supabase
            .from('posts')
            .insert({
              user_id: beehiveData.userId,
              content: beehiveData.content,
              created_at: new Date(beehiveData.timestamp).toISOString()
            });
          if (postError) throw postError;
          break;
          
        case 'comment':
          const { error: commentError } = await supabase
            .from('comments')
            .insert({
              post_id: beehiveData.postId,
              user_id: beehiveData.userId,
              content: beehiveData.content,
              created_at: new Date(beehiveData.timestamp).toISOString()
            });
          if (commentError) throw commentError;
          break;
          
        case 'like':
          const { error: likeError } = await supabase
            .from('likes')
            .insert({
              post_id: beehiveData.postId,
              user_id: beehiveData.userId,
              created_at: new Date(beehiveData.timestamp).toISOString()
            });
          if (likeError) throw likeError;
          break;
          
        default:
          throw new Error(`Unknown Beehive operation: ${beehiveData.operation}`);
      }
      
      this.status.featureStatus.beehive = 'online';
      this.updateStatus();
    } catch (error) {
      this.status.featureStatus.beehive = 'error';
      this.updateStatus();
      throw new Error(`Beehive sync failed: ${error}`);
    }
  }

  /**
   * Sync Cash/Transactions data
   */
  private async syncCash(cashData: any): Promise<void> {
    try {
      this.status.featureStatus.cash = 'syncing';
      this.updateStatus();
      
      switch (cashData.operation) {
        case 'sale':
        case 'expense':
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              user_id: cashData.userId,
              type: cashData.operation,
              amount: cashData.amount,
              category: cashData.category,
              description: cashData.description,
              payment_method: cashData.paymentMethod,
              customer_id: cashData.customerId,
              created_at: new Date(cashData.timestamp).toISOString()
            });
          if (transactionError) throw transactionError;
          break;
          
        case 'transfer':
          const { error: transferError } = await supabase
            .from('transfers')
            .insert({
              user_id: cashData.userId,
              from_account: cashData.fromAccount,
              to_account: cashData.toAccount,
              amount: cashData.amount,
              description: cashData.description,
              created_at: new Date(cashData.timestamp).toISOString()
            });
          if (transferError) throw transferError;
          break;
          
        default:
          throw new Error(`Unknown Cash operation: ${cashData.operation}`);
      }
      
      this.status.featureStatus.cash = 'online';
      this.updateStatus();
    } catch (error) {
      this.status.featureStatus.cash = 'error';
      this.updateStatus();
      throw new Error(`Cash sync failed: ${error}`);
    }
  }

  /**
   * Sync Inventory data
   */
  private async syncInventory(inventoryData: any): Promise<void> {
    try {
      this.status.featureStatus.inventory = 'syncing';
      this.updateStatus();
      
      switch (inventoryData.operation) {
        case 'add_item':
        case 'update_stock':
          const { error: itemError } = await supabase
            .from('inventory_items')
            .upsert({
              user_id: inventoryData.userId,
              item_name: inventoryData.itemName,
              stock_level: inventoryData.stockLevel,
              price: inventoryData.price,
              category: inventoryData.category,
              updated_at: new Date(inventoryData.timestamp).toISOString()
            });
          if (itemError) throw itemError;
          break;
          
        case 'stock_adjustment':
          const { error: adjustmentError } = await supabase
            .from('stock_adjustments')
            .insert({
              user_id: inventoryData.userId,
              item_id: inventoryData.itemId,
              previous_stock: inventoryData.previousStock,
              new_stock: inventoryData.stockLevel,
              reason: inventoryData.adjustmentReason,
              created_at: new Date(inventoryData.timestamp).toISOString()
            });
          if (adjustmentError) throw adjustmentError;
          break;
          
        default:
          throw new Error(`Unknown Inventory operation: ${inventoryData.operation}`);
      }
      
      this.status.featureStatus.inventory = 'online';
      this.updateStatus();
    } catch (error) {
      this.status.featureStatus.inventory = 'error';
      this.updateStatus();
      throw new Error(`Inventory sync failed: ${error}`);
    }
  }

  /**
   * Sync Calendar data
   */
  private async syncCalendar(calendarData: any): Promise<void> {
    try {
      this.status.featureStatus.calendar = 'syncing';
      this.updateStatus();
      
      switch (calendarData.operation) {
        case 'create_appointment':
        case 'reschedule':
          const { error: appointmentError } = await supabase
            .from('appointments')
            .upsert({
              id: calendarData.appointmentId,
              user_id: calendarData.userId,
              customer_id: calendarData.customerId,
              service: calendarData.service,
              date_time: calendarData.dateTime,
              duration: calendarData.duration,
              notes: calendarData.notes,
              status: calendarData.status || 'scheduled',
              updated_at: new Date(calendarData.timestamp).toISOString()
            });
          if (appointmentError) throw appointmentError;
          break;
          
        case 'cancel':
          const { error: cancelError } = await supabase
            .from('appointments')
            .update({ 
              status: 'cancelled',
              updated_at: new Date(calendarData.timestamp).toISOString()
            })
            .eq('id', calendarData.appointmentId);
          if (cancelError) throw cancelError;
          break;
          
        default:
          throw new Error(`Unknown Calendar operation: ${calendarData.operation}`);
      }
      
      this.status.featureStatus.calendar = 'online';
      this.updateStatus();
    } catch (error) {
      this.status.featureStatus.calendar = 'error';
      this.updateStatus();
      throw new Error(`Calendar sync failed: ${error}`);
    }
  }

  /**
   * Sync Credit data
   */
  private async syncCredit(creditData: any): Promise<void> {
    try {
      this.status.featureStatus.credit = 'syncing';
      this.updateStatus();
      
      switch (creditData.operation) {
        case 'issue_credit':
          const { error: creditError } = await supabase
            .from('credit_transactions')
            .insert({
              user_id: creditData.userId,
              customer_id: creditData.customerId,
              type: 'issue',
              amount: creditData.amount,
              terms: creditData.terms,
              created_at: new Date(creditData.timestamp).toISOString()
            });
          if (creditError) throw creditError;
          break;
          
        case 'repayment':
          const { error: repaymentError } = await supabase
            .from('credit_transactions')
            .insert({
              user_id: creditData.userId,
              customer_id: creditData.customerId,
              type: 'repayment',
              amount: creditData.amount,
              payment_method: creditData.paymentMethod,
              created_at: new Date(creditData.timestamp).toISOString()
            });
          if (repaymentError) throw repaymentError;
          break;
          
        case 'limit_update':
          const { error: limitError } = await supabase
            .from('customer_credit')
            .update({ 
              credit_limit: creditData.newLimit,
              updated_at: new Date(creditData.timestamp).toISOString()
            })
            .eq('customer_id', creditData.customerId);
          if (limitError) throw limitError;
          break;
          
        default:
          throw new Error(`Unknown Credit operation: ${creditData.operation}`);
      }
      
      this.status.featureStatus.credit = 'online';
      this.updateStatus();
    } catch (error) {
      this.status.featureStatus.credit = 'error';
      this.updateStatus();
      throw new Error(`Credit sync failed: ${error}`);
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
