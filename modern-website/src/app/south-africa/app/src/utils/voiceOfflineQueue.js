// Voice Recording Offline Queue Manager
// Handles offline voice recordings and background sync

import { openDB } from 'idb';
import { voiceToTransaction } from './supabase';

const DB_NAME = 'beezee-offline';
const VOICE_QUEUE_STORE = 'voice-recordings';

/**
 * Initialize voice recordings store
 */
export async function initVoiceQueue() {
  const db = await openDB(DB_NAME, 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(VOICE_QUEUE_STORE)) {
          const store = db.createObjectStore(VOICE_QUEUE_STORE, {
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
 * Add voice recording to offline queue
 * @param {string} userId - User ID
 * @param {string} audioBase64 - Base64 encoded audio
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<number>} Recording ID
 */
export async function addVoiceRecording(userId, audioBase64, metadata = {}) {
  const db = await initVoiceQueue();
  
  const recording = {
    user_id: userId,
    audio_data: audioBase64,
    status: 'pending',
    retry_count: 0,
    metadata,
    created_at: new Date().toISOString(),
  };

  const id = await db.add(VOICE_QUEUE_STORE, recording);
  
  console.log('Voice recording saved to offline queue:', id);
  
  return id;
}

/**
 * Get all pending voice recordings
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Array>} Pending recordings
 */
export async function getPendingVoiceRecordings(userId = null) {
  const db = await initVoiceQueue();
  const tx = db.transaction(VOICE_QUEUE_STORE, 'readonly');
  const store = tx.objectStore(VOICE_QUEUE_STORE);
  const index = store.index('status');

  const recordings = await index.getAll('pending');
  
  if (userId) {
    return recordings.filter(r => r.user_id === userId);
  }
  
  return recordings;
}

/**
 * Process a single voice recording
 * @param {number} recordingId - Recording ID
 * @returns {Promise<Object>} Result
 */
export async function processVoiceRecording(recordingId) {
  const db = await initVoiceQueue();
  
  try {
    // Get recording
    const recording = await db.get(VOICE_QUEUE_STORE, recordingId);
    
    if (!recording) {
      throw new Error('Recording not found');
    }

    if (recording.status === 'processed') {
      return { success: true, message: 'Already processed' };
    }

    // Update status to processing
    await db.put(VOICE_QUEUE_STORE, {
      ...recording,
      status: 'processing',
      processing_at: new Date().toISOString(),
    });

    // Call edge function
    const result = await voiceToTransaction(
      recording.audio_data,
      recording.metadata.language || 'en'
    );

    if (result.success) {
      // Mark as processed
      await db.put(VOICE_QUEUE_STORE, {
        ...recording,
        status: 'processed',
        processed_at: new Date().toISOString(),
        result: result.transaction,
      });

      return {
        success: true,
        transaction: result.transaction,
        confidence: result.confidence,
      };
    } else {
      // Mark as failed
      const retryCount = recording.retry_count + 1;
      const status = retryCount >= 3 ? 'failed' : 'pending';

      await db.put(VOICE_QUEUE_STORE, {
        ...recording,
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
    console.error('Error processing voice recording:', error);
    
    // Update retry count
    const recording = await db.get(VOICE_QUEUE_STORE, recordingId);
    if (recording) {
      const retryCount = recording.retry_count + 1;
      await db.put(VOICE_QUEUE_STORE, {
        ...recording,
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
 * Process all pending voice recordings
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Results summary
 */
export async function processAllPendingRecordings(userId) {
  const pendingRecordings = await getPendingVoiceRecordings(userId);
  
  if (pendingRecordings.length === 0) {
    return {
      success: true,
      processed: 0,
      failed: 0,
      total: 0,
    };
  }

  let processed = 0;
  let failed = 0;

  for (const recording of pendingRecordings) {
    const result = await processVoiceRecording(recording.id);
    
    if (result.success) {
      processed++;
    } else {
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return {
    success: true,
    processed,
    failed,
    total: pendingRecordings.length,
  };
}

/**
 * Delete processed recordings older than specified days
 * @param {number} days - Age threshold in days
 * @returns {Promise<number>} Number of deleted recordings
 */
export async function cleanupOldRecordings(days = 7) {
  const db = await initVoiceQueue();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const allRecordings = await db.getAll(VOICE_QUEUE_STORE);
  let deletedCount = 0;

  for (const recording of allRecordings) {
    if (
      recording.status === 'processed' &&
      new Date(recording.processed_at) < cutoffDate
    ) {
      await db.delete(VOICE_QUEUE_STORE, recording.id);
      deletedCount++;
    }
  }

  console.log(`Cleaned up ${deletedCount} old voice recordings`);
  return deletedCount;
}

/**
 * Get voice recording statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Statistics
 */
export async function getVoiceRecordingStats(userId) {
  const db = await initVoiceQueue();
  const allRecordings = await db.getAll(VOICE_QUEUE_STORE);
  
  const userRecordings = userId
    ? allRecordings.filter(r => r.user_id === userId)
    : allRecordings;

  const stats = {
    total: userRecordings.length,
    pending: userRecordings.filter(r => r.status === 'pending').length,
    processing: userRecordings.filter(r => r.status === 'processing').length,
    processed: userRecordings.filter(r => r.status === 'processed').length,
    failed: userRecordings.filter(r => r.status === 'failed').length,
  };

  return stats;
}

/**
 * Delete a specific voice recording
 * @param {number} recordingId - Recording ID
 * @returns {Promise<void>}
 */
export async function deleteVoiceRecording(recordingId) {
  const db = await initVoiceQueue();
  await db.delete(VOICE_QUEUE_STORE, recordingId);
  console.log('Voice recording deleted:', recordingId);
}

/**
 * Retry failed voice recordings
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Results
 */
export async function retryFailedRecordings(userId) {
  const db = await initVoiceQueue();
  const allRecordings = await db.getAll(VOICE_QUEUE_STORE);
  
  const failedRecordings = allRecordings.filter(
    r => r.status === 'failed' && r.user_id === userId
  );

  if (failedRecordings.length === 0) {
    return {
      success: true,
      retried: 0,
    };
  }

  // Reset failed recordings to pending
  for (const recording of failedRecordings) {
    await db.put(VOICE_QUEUE_STORE, {
      ...recording,
      status: 'pending',
      retry_count: 0,
    });
  }

  // Process them
  const result = await processAllPendingRecordings(userId);

  return {
    success: true,
    retried: failedRecordings.length,
    ...result,
  };
}


