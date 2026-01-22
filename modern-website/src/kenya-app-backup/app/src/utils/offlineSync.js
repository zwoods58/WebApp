// Offline Sync Utility
// Manages IndexedDB for offline transaction queue

import { openDB } from 'idb';

const DB_NAME = 'beezee-offline';
const DB_VERSION = 1;
const TRANSACTION_STORE = 'transactions';
const SYNC_STORE = 'sync-queue';

// Initialize IndexedDB
export async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Create transaction store
      if (!db.objectStoreNames.contains(TRANSACTION_STORE)) {
        const transactionStore = db.createObjectStore(TRANSACTION_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        transactionStore.createIndex('synced', 'synced');
        transactionStore.createIndex('created_at', 'created_at');
      }

      // Create sync queue store
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        const syncStore = db.createObjectStore(SYNC_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        syncStore.createIndex('status', 'status');
        syncStore.createIndex('created_at', 'created_at');
      }
    },
  });

  return db;
}

// Add transaction to offline queue
export async function addOfflineTransaction(transaction) {
  const db = await initDB();
  const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
  const store = tx.objectStore(TRANSACTION_STORE);

  const offlineTransaction = {
    ...transaction,
    synced: false,
    created_at: new Date().toISOString(),
    offline_id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  const id = await store.add(offlineTransaction);
  await tx.done;

  return { ...offlineTransaction, id };
}

// Get all unsynced transactions
export async function getUnsyncedTransactions() {
  const db = await initDB();
  const tx = db.transaction(TRANSACTION_STORE, 'readonly');
  const store = tx.objectStore(TRANSACTION_STORE);
  const index = store.index('synced');

  const transactions = await index.getAll(false);
  await tx.done;

  return transactions;
}

// Mark transaction as synced
export async function markTransactionSynced(id, serverId) {
  const db = await initDB();
  const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
  const store = tx.objectStore(TRANSACTION_STORE);

  const transaction = await store.get(id);
  if (transaction) {
    transaction.synced = true;
    transaction.synced_at = new Date().toISOString();
    transaction.server_id = serverId;
    await store.put(transaction);
  }

  await tx.done;
}

// Delete synced transaction from IndexedDB
export async function deleteSyncedTransaction(id) {
  const db = await initDB();
  const tx = db.transaction(TRANSACTION_STORE, 'readwrite');
  const store = tx.objectStore(TRANSACTION_STORE);

  await store.delete(id);
  await tx.done;
}

// Get all transactions (for offline viewing)
export async function getAllOfflineTransactions() {
  const db = await initDB();
  const tx = db.transaction(TRANSACTION_STORE, 'readonly');
  const store = tx.objectStore(TRANSACTION_STORE);

  const transactions = await store.getAll();
  await tx.done;

  return transactions.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
}

// Add item to sync queue
export async function addToSyncQueue(action, payload) {
  const db = await initDB();
  const tx = db.transaction(SYNC_STORE, 'readwrite');
  const store = tx.objectStore(SYNC_STORE);

  const item = {
    action,
    payload,
    status: 'pending',
    retry_count: 0,
    created_at: new Date().toISOString(),
  };

  const id = await store.add(item);
  await tx.done;

  return { ...item, id };
}

// Get pending sync queue items
export async function getPendingSyncItems() {
  const db = await initDB();
  const tx = db.transaction(SYNC_STORE, 'readonly');
  const store = tx.objectStore(SYNC_STORE);
  const index = store.index('status');

  const items = await index.getAll('pending');
  await tx.done;

  return items;
}

// Update sync queue item status
export async function updateSyncItemStatus(id, status, error = null) {
  const db = await initDB();
  const tx = db.transaction(SYNC_STORE, 'readwrite');
  const store = tx.objectStore(SYNC_STORE);

  const item = await store.get(id);
  if (item) {
    item.status = status;
    item.updated_at = new Date().toISOString();
    
    if (status === 'failed') {
      item.retry_count = (item.retry_count || 0) + 1;
      item.last_error = error;
    }
    
    await store.put(item);
  }

  await tx.done;
}

// Delete completed sync items
export async function cleanupSyncQueue() {
  const db = await initDB();
  const tx = db.transaction(SYNC_STORE, 'readwrite');
  const store = tx.objectStore(SYNC_STORE);

  const allItems = await store.getAll();
  
  for (const item of allItems) {
    // Delete completed items older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (
      item.status === 'completed' &&
      new Date(item.updated_at) < sevenDaysAgo
    ) {
      await store.delete(item.id);
    }

    // Delete failed items after 5 retry attempts
    if (item.status === 'failed' && item.retry_count >= 5) {
      await store.delete(item.id);
    }
  }

  await tx.done;
}

// Check if online
export function isOnline() {
  return navigator.onLine;
}

// Listen for online/offline events
export function setupOnlineListener(onOnline, onOffline) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// Sync all pending transactions with server
export async function syncWithServer(supabaseClient) {
  console.log('[syncWithServer] Starting sync...');
  if (!isOnline()) {
    console.log('[syncWithServer] Offline - skipping sync');
    return { success: false, message: 'Device is offline' };
  }

  console.log('[syncWithServer] Getting unsynced transactions...');
  const unsyncedTransactions = await getUnsyncedTransactions();
  console.log(`[syncWithServer] Found ${unsyncedTransactions.length} unsynced transactions`);
  
  if (unsyncedTransactions.length === 0) {
    console.log('[syncWithServer] No unsynced transactions, returning success');
    return { success: true, synced: 0 };
  }

  let syncedCount = 0;
  let failedCount = 0;

  for (const transaction of unsyncedTransactions) {
    try {
      // Remove local-only fields before sending to server
      const { id, offline_id, synced, synced_at, created_at, ...serverTransaction } = transaction;

      // Insert into Supabase
      const { data, error } = await supabaseClient
        .from('transactions')
        .insert(serverTransaction)
        .select()
        .single();

      if (error) {
        console.error('Failed to sync transaction:', error);
        failedCount++;
        continue;
      }

      // Mark as synced
      await markTransactionSynced(id, data.id);
      
      // Optionally delete from IndexedDB after successful sync
      // await deleteSyncedTransaction(id);
      
      syncedCount++;
    } catch (error) {
      console.error('Sync error:', error);
      failedCount++;
    }
  }

  return {
    success: true,
    synced: syncedCount,
    failed: failedCount,
    total: unsyncedTransactions.length,
  };
}


