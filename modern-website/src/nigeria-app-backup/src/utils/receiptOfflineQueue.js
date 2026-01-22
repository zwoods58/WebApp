// Receipt Offline Queue Manager
// Handles offline receipt images and background sync

import { openDB } from 'idb';
import { receiptToTransaction } from './supabase';
import { uploadReceiptImage } from './receiptStorage';
import { imageToBase64 } from './imageProcessor';

const DB_NAME = 'beezee-offline';
const RECEIPT_QUEUE_STORE = 'receipt-images';

/**
 * Initialize receipt images store
 */
export async function initReceiptQueue() {
  const db = await openDB(DB_NAME, 3, {
    upgrade(db, oldVersion) {
      if (oldVersion < 3) {
        if (!db.objectStoreNames.contains(RECEIPT_QUEUE_STORE)) {
          const store = db.createObjectStore(RECEIPT_QUEUE_STORE, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('status', 'status');
          store.createIndex('created_at', 'created_at');
          store.createIndex('user_id', 'user_id');
        }
      }
    },
  });
  return db;
}

/**
 * Add receipt image to offline queue
 * @param {string} userId - User ID
 * @param {Blob} imageBlob - Image blob
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<number>} Receipt ID
 */
export async function addOfflineReceipt(userId, imageBlob, metadata = {}) {
  const db = await initReceiptQueue();
  
  // Convert blob to base64 for storage
  const reader = new FileReader();
  const base64Promise = new Promise((resolve) => {
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(imageBlob);
  });
  
  const dataUrl = await base64Promise;
  
  const receipt = {
    user_id: userId,
    image_data: dataUrl,
    image_size: imageBlob.size,
    image_type: imageBlob.type,
    status: 'pending',
    retry_count: 0,
    metadata,
    created_at: new Date().toISOString(),
  };

  const id = await db.add(RECEIPT_QUEUE_STORE, receipt);
  
  console.log('Receipt saved to offline queue:', id);
  
  return id;
}

/**
 * Get all pending receipt images
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Array>} Pending receipts
 */
export async function getPendingReceipts(userId = null) {
  const db = await initReceiptQueue();
  const tx = db.transaction(RECEIPT_QUEUE_STORE, 'readonly');
  const store = tx.objectStore(RECEIPT_QUEUE_STORE);
  const index = store.index('status');

  const receipts = await index.getAll('pending');
  
  if (userId) {
    return receipts.filter(r => r.user_id === userId);
  }
  
  return receipts;
}

/**
 * Process a single receipt image
 * @param {number} receiptId - Receipt ID
 * @returns {Promise<Object>} Result
 */
export async function processReceiptImage(receiptId) {
  const db = await initReceiptQueue();
  
  try {
    // Get receipt
    const receipt = await db.get(RECEIPT_QUEUE_STORE, receiptId);
    
    if (!receipt) {
      throw new Error('Receipt not found');
    }

    if (receipt.status === 'processed') {
      return { success: true, message: 'Already processed' };
    }

    // Update status to processing
    await db.put(RECEIPT_QUEUE_STORE, {
      ...receipt,
      status: 'processing',
      processing_at: new Date().toISOString(),
    });

    // Convert data URL back to blob
    const response = await fetch(receipt.image_data);
    const imageBlob = await response.blob();

    // Upload to storage
    const imageUrl = await uploadReceiptImage(receipt.user_id, imageBlob);

    // Convert to base64 for API
    const base64 = await imageToBase64(imageBlob);

    // Process with Gemini Vision API
    const result = await receiptToTransaction(base64, receipt.image_type);

    if (result.success) {
      // Mark as processed
      await db.put(RECEIPT_QUEUE_STORE, {
        ...receipt,
        status: 'processed',
        processed_at: new Date().toISOString(),
        result: {
          ...result.transaction,
          imageUrl,
        },
      });

      return {
        success: true,
        transaction: {
          ...result.transaction,
          receipt_image_url: imageUrl,
        },
        confidence: result.confidence,
      };
    } else {
      // Mark as failed
      const retryCount = receipt.retry_count + 1;
      const status = retryCount >= 3 ? 'failed' : 'pending';

      await db.put(RECEIPT_QUEUE_STORE, {
        ...receipt,
        status,
        retry_count: retryCount,
        last_error: result.message || result.error,
        last_attempt: new Date().toISOString(),
      });

      return {
        success: false,
        error: result.message || result.error,
        retryCount,
      };
    }
  } catch (error) {
    console.error('Error processing receipt:', error);
    
    // Update retry count
    const receipt = await db.get(RECEIPT_QUEUE_STORE, receiptId);
    if (receipt) {
      const retryCount = receipt.retry_count + 1;
      await db.put(RECEIPT_QUEUE_STORE, {
        ...receipt,
        status: retryCount >= 3 ? 'failed' : 'pending',
        retry_count: retryCount,
        last_error: error.message,
        last_attempt: new Date().toISOString(),
      });
    }

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Process all pending receipts
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Results summary
 */
export async function processAllPendingReceipts(userId) {
  const pendingReceipts = await getPendingReceipts(userId);
  
  if (pendingReceipts.length === 0) {
    return {
      success: true,
      processed: 0,
      failed: 0,
      total: 0,
    };
  }

  let processed = 0;
  let failed = 0;

  for (const receipt of pendingReceipts) {
    const result = await processReceiptImage(receipt.id);
    
    if (result.success) {
      processed++;
    } else {
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return {
    success: true,
    processed,
    failed,
    total: pendingReceipts.length,
  };
}

/**
 * Delete processed receipts older than specified days
 * @param {number} days - Age threshold in days
 * @returns {Promise<number>} Number of deleted receipts
 */
export async function cleanupOldReceipts(days = 30) {
  const db = await initReceiptQueue();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const allReceipts = await db.getAll(RECEIPT_QUEUE_STORE);
  let deletedCount = 0;

  for (const receipt of allReceipts) {
    if (
      receipt.status === 'processed' &&
      new Date(receipt.processed_at) < cutoffDate
    ) {
      await db.delete(RECEIPT_QUEUE_STORE, receipt.id);
      deletedCount++;
    }
  }

  console.log(`Cleaned up ${deletedCount} old receipts from offline queue`);
  return deletedCount;
}

/**
 * Get receipt statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Statistics
 */
export async function getReceiptStats(userId) {
  const db = await initReceiptQueue();
  const allReceipts = await db.getAll(RECEIPT_QUEUE_STORE);
  
  const userReceipts = userId
    ? allReceipts.filter(r => r.user_id === userId)
    : allReceipts;

  const stats = {
    total: userReceipts.length,
    pending: userReceipts.filter(r => r.status === 'pending').length,
    processing: userReceipts.filter(r => r.status === 'processing').length,
    processed: userReceipts.filter(r => r.status === 'processed').length,
    failed: userReceipts.filter(r => r.status === 'failed').length,
    totalSizeBytes: userReceipts.reduce((sum, r) => sum + (r.image_size || 0), 0),
  };

  stats.totalSizeMB = (stats.totalSizeBytes / (1024 * 1024)).toFixed(2);

  return stats;
}

/**
 * Delete a specific receipt
 * @param {number} receiptId - Receipt ID
 * @returns {Promise<void>}
 */
export async function deleteReceipt(receiptId) {
  const db = await initReceiptQueue();
  await db.delete(RECEIPT_QUEUE_STORE, receiptId);
  console.log('Receipt deleted from offline queue:', receiptId);
}

/**
 * Retry failed receipts
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Results
 */
export async function retryFailedReceipts(userId) {
  const db = await initReceiptQueue();
  const allReceipts = await db.getAll(RECEIPT_QUEUE_STORE);
  
  const failedReceipts = allReceipts.filter(
    r => r.status === 'failed' && r.user_id === userId
  );

  if (failedReceipts.length === 0) {
    return {
      success: true,
      retried: 0,
    };
  }

  // Reset failed receipts to pending
  for (const receipt of failedReceipts) {
    await db.put(RECEIPT_QUEUE_STORE, {
      ...receipt,
      status: 'pending',
      retry_count: 0,
    });
  }

  // Process them
  const result = await processAllPendingReceipts(userId);

  return {
    success: true,
    retried: failedReceipts.length,
    ...result,
  };
}

/**
 * Get thumbnail for receipt
 * @param {number} receiptId - Receipt ID
 * @returns {Promise<string>} Data URL of thumbnail
 */
export async function getReceiptThumbnail(receiptId) {
  const db = await initReceiptQueue();
  const receipt = await db.get(RECEIPT_QUEUE_STORE, receiptId);
  
  if (!receipt) {
    throw new Error('Receipt not found');
  }

  // Receipt image_data is already a data URL
  return receipt.image_data;
}


