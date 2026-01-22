// Receipt Storage Management
// Handles Supabase storage operations for receipt images

import { supabase } from './supabase';

const BUCKET_NAME = 'receipts';
const MAX_STORAGE_MB = 50; // Per user storage quota
const RETENTION_DAYS = 90; // Auto-delete after 90 days

/**
 * Upload receipt image to Supabase Storage
 * @param {string} userId - User ID
 * @param {Blob} imageBlob - Image blob
 * @param {string} transactionId - Transaction ID (optional, generates random if not provided)
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadReceiptImage(userId, imageBlob, transactionId = null) {
  try {
    // Generate filename
    const filename = transactionId || `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const filePath = `${userId}/${filename}.jpg`;

    // Check storage quota before upload
    const canUpload = await checkStorageQuota(userId, imageBlob.size);
    if (!canUpload) {
      throw new Error('Storage quota exceeded. Please delete old receipts.');
    }

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, imageBlob, {
        contentType: 'image/jpeg',
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    console.log('Receipt uploaded:', urlData.publicUrl);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading receipt:', error);
    throw error;
  }
}

/**
 * Check user's storage quota
 * @param {string} userId - User ID
 * @param {number} newFileSize - Size of new file to upload
 * @returns {Promise<boolean>} True if upload is allowed
 */
async function checkStorageQuota(userId, newFileSize) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId, {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) {
      console.error('Error checking quota:', error);
      return true; // Allow upload if we can't check quota
    }

    // Calculate total storage used
    const totalBytes = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const totalMB = totalBytes / (1024 * 1024);

    const newTotalMB = (totalBytes + newFileSize) / (1024 * 1024);

    console.log(`Storage used: ${totalMB.toFixed(2)}MB / ${MAX_STORAGE_MB}MB`);

    return newTotalMB <= MAX_STORAGE_MB;
  } catch (error) {
    console.error('Error checking storage quota:', error);
    return true; // Allow upload if error
  }
}

/**
 * Get user's storage usage statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Storage statistics
 */
export async function getStorageStats(userId) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId, {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;

    const totalBytes = data.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const totalMB = totalBytes / (1024 * 1024);

    return {
      fileCount: data.length,
      totalBytes,
      totalMB: parseFloat(totalMB.toFixed(2)),
      quotaMB: MAX_STORAGE_MB,
      percentUsed: parseFloat(((totalMB / MAX_STORAGE_MB) * 100).toFixed(1)),
      remainingMB: parseFloat((MAX_STORAGE_MB - totalMB).toFixed(2)),
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      fileCount: 0,
      totalBytes: 0,
      totalMB: 0,
      quotaMB: MAX_STORAGE_MB,
      percentUsed: 0,
      remainingMB: MAX_STORAGE_MB,
    };
  }
}

/**
 * Delete a receipt image
 * @param {string} userId - User ID
 * @param {string} filename - Filename (without path)
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteReceiptImage(userId, filename) {
  try {
    const filePath = `${userId}/${filename}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;

    console.log('Receipt deleted:', filePath);
    return true;
  } catch (error) {
    console.error('Error deleting receipt:', error);
    return false;
  }
}

/**
 * Clean up old receipts (older than retention period)
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of receipts deleted
 */
export async function cleanupOldReceipts(userId) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId, {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'asc' },
      });

    if (error) throw error;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

    const oldFiles = data.filter(file => {
      const fileDate = new Date(file.created_at);
      return fileDate < cutoffDate;
    });

    if (oldFiles.length === 0) {
      return 0;
    }

    // Delete old files
    const filePaths = oldFiles.map(file => `${userId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (deleteError) throw deleteError;

    console.log(`Cleaned up ${oldFiles.length} old receipts`);
    return oldFiles.length;
  } catch (error) {
    console.error('Error cleaning up old receipts:', error);
    return 0;
  }
}

/**
 * Get receipt image URL
 * @param {string} userId - User ID
 * @param {string} filename - Filename (without path)
 * @param {number} expiresIn - URL expiry in seconds (default 24 hours)
 * @returns {Promise<string>} Signed URL
 */
export async function getReceiptUrl(userId, filename, expiresIn = 86400) {
  try {
    const filePath = `${userId}/${filename}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    console.error('Error getting receipt URL:', error);
    throw error;
  }
}

/**
 * List all receipts for a user
 * @param {string} userId - User ID
 * @param {Object} options - List options
 * @returns {Promise<Array>} Array of receipt files
 */
export async function listUserReceipts(userId, options = {}) {
  try {
    const defaultOptions = {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    };

    const finalOptions = { ...defaultOptions, ...options };

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(userId, finalOptions);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error listing receipts:', error);
    return [];
  }
}

/**
 * Initialize storage bucket (call once during setup)
 * This should be run manually or as part of setup script
 * @returns {Promise<boolean>}
 */
export async function initializeReceiptBucket() {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);

    if (bucketExists) {
      console.log('Receipts bucket already exists');
      return true;
    }

    // Create bucket with public access
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB per file
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    });

    if (error) throw error;

    console.log('Receipts bucket created successfully');
    return true;
  } catch (error) {
    console.error('Error initializing bucket:', error);
    return false;
  }
}

/**
 * Download receipt image
 * @param {string} userId - User ID
 * @param {string} filename - Filename (without path)
 * @returns {Promise<Blob>} Image blob
 */
export async function downloadReceiptImage(userId, filename) {
  try {
    const filePath = `${userId}/${filename}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw error;
  }
}


