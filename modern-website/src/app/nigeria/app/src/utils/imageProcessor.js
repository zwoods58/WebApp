// Image Processing Utilities
// Handles image compression, validation, and optimization for receipt scanning

import imageCompression from 'browser-image-compression';

/**
 * Compress image for upload
 * @param {File|Blob} imageFile - Image file or blob
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} Compressed image blob
 */
export async function compressImage(imageFile, options = {}) {
  const defaultOptions = {
    maxSizeMB: 0.5, // 500KB
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    console.log('Original image size:', (imageFile.size / 1024 / 1024).toFixed(2), 'MB');
    
    const compressedFile = await imageCompression(imageFile, finalOptions);
    
    console.log('Compressed image size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    // Return original if compression fails
    return imageFile;
  }
}

/**
 * Validate image file
 * @param {File|Blob} imageFile - Image file or blob
 * @returns {Promise<Object>} Validation result
 */
export async function validateImage(imageFile) {
  const result = {
    valid: true,
    errors: [],
  };

  // Check if it's an image
  if (!imageFile.type.startsWith('image/')) {
    result.valid = false;
    result.errors.push('File must be an image');
    return result;
  }

  // Check file size (max 10MB uncompressed)
  if (imageFile.size > 10 * 1024 * 1024) {
    result.valid = false;
    result.errors.push('Image too large (max 10MB)');
  }

  // Check minimum size (at least 10KB)
  if (imageFile.size < 10 * 1024) {
    result.valid = false;
    result.errors.push('Image too small');
  }

  // Try to load image to validate it's not corrupted
  try {
    const isValid = await isValidImageBlob(imageFile);
    if (!isValid) {
      result.valid = false;
      result.errors.push('Image appears to be corrupted');
    }
  } catch (error) {
    result.valid = false;
    result.errors.push('Could not read image file');
  }

  return result;
}

/**
 * Check if image blob is valid by attempting to load it
 * @param {Blob} blob - Image blob
 * @returns {Promise<boolean>}
 */
function isValidImageBlob(blob) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(true);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * Get image dimensions
 * @param {File|Blob} imageFile - Image file or blob
 * @returns {Promise<Object>} {width, height}
 */
export async function getImageDimensions(imageFile) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };

    img.src = url;
  });
}

/**
 * Convert image to base64
 * @param {File|Blob} imageFile - Image file or blob
 * @returns {Promise<string>} Base64 string (without data URL prefix)
 */
export async function imageToBase64(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Remove data URL prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Rotate image if needed (based on EXIF orientation)
 * @param {File|Blob} imageFile - Image file or blob
 * @returns {Promise<Blob>} Rotated image blob
 */
export async function rotateImageIfNeeded(imageFile) {
  // Use imageCompression library which handles EXIF orientation automatically
  return await imageCompression(imageFile, {
    maxSizeMB: Infinity, // Don't compress, just rotate
    maxWidthOrHeight: undefined,
    useWebWorker: true,
  });
}

/**
 * Enhance image for better OCR
 * @param {File|Blob} imageFile - Image file or blob
 * @returns {Promise<Blob>} Enhanced image blob
 */
export async function enhanceImageForOCR(imageFile) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Enhance contrast
      for (let i = 0; i < data.length; i += 4) {
        // Increase contrast
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const diff = avg - 128;
        const factor = 1.5; // Contrast factor

        data[i] = Math.min(255, Math.max(0, avg + diff * factor));
        data[i + 1] = Math.min(255, Math.max(0, avg + diff * factor));
        data[i + 2] = Math.min(255, Math.max(0, avg + diff * factor));
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        resolve(blob);
      }, 'image/jpeg', 0.9);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };

    img.src = url;
  });
}

/**
 * Check if image is blurry (using variance of Laplacian)
 * @param {File|Blob} imageFile - Image file or blob
 * @returns {Promise<Object>} {isBlurry: boolean, score: number}
 */
export async function detectImageBlur(imageFile) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Use smaller size for faster processing
      const size = Math.min(img.width, img.height, 640);
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;

      // Convert to grayscale and calculate Laplacian variance
      let sum = 0;
      let count = 0;

      for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
          const idx = (y * size + x) * 4;
          const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

          // Simple Laplacian kernel
          const neighbors = [
            data[((y - 1) * size + x) * 4],
            data[((y + 1) * size + x) * 4],
            data[(y * size + (x - 1)) * 4],
            data[(y * size + (x + 1)) * 4],
          ];

          const avgNeighbor = neighbors.reduce((a, b) => a + b, 0) / 4;
          const diff = Math.abs(gray - avgNeighbor);

          sum += diff;
          count++;
        }
      }

      const variance = sum / count;
      const isBlurry = variance < 10; // Threshold for blur detection

      URL.revokeObjectURL(url);
      resolve({
        isBlurry,
        score: variance,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isBlurry: false,
        score: 0,
      });
    };

    img.src = url;
  });
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Create thumbnail from image
 * @param {File|Blob} imageFile - Image file or blob
 * @param {number} maxSize - Maximum width/height
 * @returns {Promise<string>} Data URL of thumbnail
 */
export async function createThumbnail(imageFile, maxSize = 200) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not create thumbnail'));
    };

    img.src = url;
  });
}


