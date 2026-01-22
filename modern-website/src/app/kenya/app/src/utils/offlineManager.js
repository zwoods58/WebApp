/**
 * Offline Manager
 * Handles offline functionality, data synchronization, and queue management
 */

export class OfflineManager {
  constructor() {
    this.dbName = 'BeeZeeFinanceDB';
    this.dbVersion = 1;
    this.db = null;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.listeners = [];
    
    this.init();
  }

  /**
   * Initialize offline manager
   */
  async init() {
    try {
      // Initialize IndexedDB
      await this.initDB();
      
      // Listen for online/offline events
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      
      // Listen for service worker messages
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
      }
      
      console.log('Offline Manager: Initialized');
    } catch (error) {
      console.error('Offline Manager: Failed to initialize', error);
    }
  }

  /**
   * Initialize IndexedDB
   */
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create stores
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id' });
          transactionStore.createIndex('user_id', 'user_id', { unique: false });
          transactionStore.createIndex('date', 'date', { unique: false });
          transactionStore.createIndex('synced', 'synced', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('user_id', 'user_id', { unique: false });
          productStore.createIndex('category', 'category', { unique: false });
          productStore.createIndex('synced', 'synced', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('type', 'type', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('reports')) {
          const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
          reportStore.createIndex('user_id', 'user_id', { unique: false });
          reportStore.createIndex('period', 'period', { unique: false });
        }
      };
    });
  }

  /**
   * Handle online event
   */
  handleOnline() {
    this.isOnline = true;
    console.log('Offline Manager: Back online');
    this.notifyListeners('online', { isOnline: true });
    
    // Trigger sync
    this.syncAll();
  }

  /**
   * Handle offline event
   */
  handleOffline() {
    this.isOnline = false;
    console.log('Offline Manager: Gone offline');
    this.notifyListeners('offline', { isOnline: false });
  }

  /**
   * Handle service worker messages
   */
  handleServiceWorkerMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
      case 'SYNC_COMPLETE':
        console.log('Offline Manager: Background sync completed', data);
        this.notifyListeners('syncComplete', data);
        break;
      case 'VERSION_RESPONSE':
        console.log('Offline Manager: Service worker version', data.version);
        break;
    }
  }

  /**
   * Add event listener
   */
  addListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  removeListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Notify listeners
   */
  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Save transaction offline
   */
  async saveTransaction(transaction) {
    try {
      const transactionData = {
        ...transaction,
        synced: false,
        timestamp: Date.now()
      };
      
      const store = this.db.transaction(['transactions'], 'readwrite').objectStore('transactions');
      await store.add(transactionData);
      
      console.log('Offline Manager: Transaction saved offline', transaction.id);
      
      // Queue for sync if online
      if (this.isOnline) {
        await this.queueForSync('transaction', transactionData);
      }
      
      return { success: true, offline: true };
    } catch (error) {
      console.error('Offline Manager: Failed to save transaction offline', error);
      return { success: false, error: 'Failed to save transaction' };
    }
  }

  /**
   * Save product offline
   */
  async saveProduct(product) {
    try {
      const productData = {
        ...product,
        synced: false,
        timestamp: Date.now()
      };
      
      const store = this.db.transaction(['products'], 'readwrite').objectStore('products');
      await store.add(productData);
      
      console.log('Offline Manager: Product saved offline', product.id);
      
      // Queue for sync if online
      if (this.isOnline) {
        await this.queueForSync('product', productData);
      }
      
      return { success: true, offline: true };
    } catch (error) {
      console.error('Offline Manager: Failed to save product offline', error);
      return { success: false, error: 'Failed to save product' };
    }
  }

  /**
   * Get offline transactions
   */
  async getOfflineTransactions(userId) {
    try {
      const store = this.db.transaction(['transactions'], 'readonly').objectStore('transactions');
      const index = store.index('user_id');
      const transactions = await index.getAll(userId);
      
      return {
        success: true,
        transactions: transactions.map(t => ({
          ...t,
          isOffline: !t.synced
        }))
      };
    } catch (error) {
      console.error('Offline Manager: Failed to get offline transactions', error);
      return { success: false, transactions: [] };
    }
  }

  /**
   * Get offline products
   */
  async getOfflineProducts(userId) {
    try {
      const store = this.db.transaction(['products'], 'readonly').objectStore('products');
      const index = store.index('user_id');
      const products = await index.getAll(userId);
      
      return {
        success: true,
        products: products.map(p => ({
          ...p,
          isOffline: !p.synced
        }))
      };
    } catch (error) {
      console.error('Offline Manager: Failed to get offline products', error);
      return { success: false, products: [] };
    }
  }

  /**
   * Queue item for sync
   */
  async queueForSync(type, data) {
    try {
      const syncData = {
        type,
        data,
        timestamp: Date.now(),
        retryCount: 0
      };
      
      const store = this.db.transaction(['syncQueue'], 'readwrite').objectStore('syncQueue');
      await store.add(syncData);
      
      console.log('Offline Manager: Item queued for sync', type);
      
      // Trigger background sync if available
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Offline Manager: Failed to queue for sync', error);
      return { success: false };
    }
  }

  /**
   * Sync all pending items
   */
  async syncAll() {
    if (!this.isOnline) {
      console.log('Offline Manager: Cannot sync while offline');
      return { success: false, reason: 'Offline' };
    }
    
    try {
      const store = this.db.transaction(['syncQueue'], 'readonly').objectStore('syncQueue');
      const pendingItems = await store.getAll();
      
      console.log(`Offline Manager: Syncing ${pendingItems.length} items`);
      
      let successCount = 0;
      let failureCount = 0;
      
      for (const item of pendingItems) {
        try {
          const result = await this.syncItem(item);
          if (result.success) {
            successCount++;
            // Remove from queue
            await this.removeFromQueue(item.id);
          } else {
            failureCount++;
            // Update retry count
            await this.updateRetryCount(item.id);
          }
        } catch (error) {
          console.error('Offline Manager: Failed to sync item', error);
          failureCount++;
        }
      }
      
      console.log(`Offline Manager: Sync completed - Success: ${successCount}, Failures: ${failureCount}`);
      
      this.notifyListeners('syncComplete', {
        successCount,
        failureCount,
        total: pendingItems.length
      });
      
      return { success: true, successCount, failureCount };
    } catch (error) {
      console.error('Offline Manager: Failed to sync all', error);
      return { success: false, error: 'Sync failed' };
    }
  }

  /**
   * Sync individual item
   */
  async syncItem(item) {
    try {
      const { type, data } = item;
      
      switch (type) {
        case 'transaction':
          return await this.syncTransaction(data);
        case 'product':
          return await this.syncProduct(data);
        default:
          return { success: false, error: 'Unknown sync type' };
      }
    } catch (error) {
      console.error('Offline Manager: Failed to sync item', error);
      return { success: false, error: 'Sync failed' };
    }
  }

  /**
   * Sync transaction
   */
  async syncTransaction(transactionData) {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });
      
      if (response.ok) {
        // Mark as synced in local DB
        await this.markAsSynced('transactions', transactionData.id);
        return { success: true };
      } else {
        return { success: false, error: 'Server error' };
      }
    } catch (error) {
      console.error('Offline Manager: Failed to sync transaction', error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Sync product
   */
  async syncProduct(productData) {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        // Mark as synced in local DB
        await this.markAsSynced('products', productData.id);
        return { success: true };
      } else {
        return { success: false, error: 'Server error' };
      }
    } catch (error) {
      console.error('Offline Manager: Failed to sync product', error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Mark item as synced
   */
  async markAsSynced(storeName, id) {
    try {
      const store = this.db.transaction([storeName], 'readwrite').objectStore(storeName);
      const item = await store.get(id);
      if (item) {
        item.synced = true;
        item.syncedAt = Date.now();
        await store.put(item);
      }
    } catch (error) {
      console.error('Offline Manager: Failed to mark as synced', error);
    }
  }

  /**
   * Remove item from sync queue
   */
  async removeFromQueue(id) {
    try {
      const store = this.db.transaction(['syncQueue'], 'readwrite').objectStore('syncQueue');
      await store.delete(id);
    } catch (error) {
      console.error('Offline Manager: Failed to remove from queue', error);
    }
  }

  /**
   * Update retry count
   */
  async updateRetryCount(id) {
    try {
      const store = this.db.transaction(['syncQueue'], 'readwrite').objectStore('syncQueue');
      const item = await store.get(id);
      if (item) {
        item.retryCount = (item.retryCount || 0) + 1;
        item.lastRetry = Date.now();
        
        // Remove if max retries exceeded
        if (item.retryCount >= 5) {
          await store.delete(id);
        } else {
          await store.put(item);
        }
      }
    } catch (error) {
      console.error('Offline Manager: Failed to update retry count', error);
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    try {
      const store = this.db.transaction(['syncQueue'], 'readonly').objectStore('syncQueue');
      const pendingItems = await store.getAll();
      
      const transactionsStore = this.db.transaction(['transactions'], 'readonly').objectStore('transactions');
      const productsStore = this.db.transaction(['products'], 'readonly').objectStore('products');
      
      const unsyncedTransactions = await transactionsStore.index('synced').getAll(false);
      const unsyncedProducts = await productsStore.index('synced').getAll(false);
      
      return {
        isOnline: this.isOnline,
        pendingSync: pendingItems.length,
        unsyncedTransactions: unsyncedTransactions.length,
        unsyncedProducts: unsyncedProducts.length,
        lastSync: localStorage.getItem('lastSyncTime') || null
      };
    } catch (error) {
      console.error('Offline Manager: Failed to get sync status', error);
      return {
        isOnline: this.isOnline,
        pendingSync: 0,
        unsyncedTransactions: 0,
        unsyncedProducts: 0,
        lastSync: null
      };
    }
  }

  /**
   * Clear offline data
   */
  async clearOfflineData() {
    try {
      const stores = ['transactions', 'products', 'syncQueue', 'reports'];
      
      for (const storeName of stores) {
        const store = this.db.transaction([storeName], 'readwrite').objectStore(storeName);
        await store.clear();
      }
      
      console.log('Offline Manager: Offline data cleared');
      return { success: true };
    } catch (error) {
      console.error('Offline Manager: Failed to clear offline data', error);
      return { success: false };
    }
  }

  /**
   * Get storage usage
   */
  async getStorageUsage() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota,
          usage: estimate.usage,
          usageDetails: estimate.usageDetails
        };
      }
      return null;
    } catch (error) {
      console.error('Offline Manager: Failed to get storage usage', error);
      return null;
    }
  }

  /**
   * Request persistent storage
   */
  async requestPersistentStorage() {
    try {
      if ('storage' in navigator && 'persist' in navigator.storage) {
        const isPersistent = await navigator.storage.persist();
        console.log('Offline Manager: Persistent storage granted', isPersistent);
        return isPersistent;
      }
      return false;
    } catch (error) {
      console.error('Offline Manager: Failed to request persistent storage', error);
      return false;
    }
  }

  /**
   * Export offline data
   */
  async exportOfflineData() {
    try {
      const transactions = await this.db.transaction(['transactions'], 'readonly').objectStore('transactions').getAll();
      const products = await this.db.transaction(['products'], 'readonly').objectStore('products').getAll();
      
      const exportData = {
        transactions,
        products,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `beezee_offline_data_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Offline Manager: Failed to export offline data', error);
      return { success: false };
    }
  }

  /**
   * Import offline data
   */
  async importOfflineData(file) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      // Validate data structure
      if (!importData.transactions || !importData.products) {
        throw new Error('Invalid data format');
      }
      
      // Import transactions
      const transactionStore = this.db.transaction(['transactions'], 'readwrite').objectStore('transactions');
      for (const transaction of importData.transactions) {
        await transactionStore.add(transaction);
      }
      
      // Import products
      const productStore = this.db.transaction(['products'], 'readwrite').objectStore('products');
      for (const product of importData.products) {
        await productStore.add(product);
      }
      
      console.log('Offline Manager: Data imported successfully');
      return { success: true };
    } catch (error) {
      console.error('Offline Manager: Failed to import offline data', error);
      return { success: false, error: 'Import failed' };
    }
  }
}

// Create singleton instance
export const offlineManager = new OfflineManager();
