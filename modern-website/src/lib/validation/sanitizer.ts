import validator from 'validator';

/**
 * Sanitize a string by trimming, normalizing whitespace, and removing null bytes
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/\0/g, '') // Remove null bytes
    .replace(/\s+/g, ' ') // Normalize whitespace
    .normalize('NFC'); // Unicode normalization
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Strips all HTML tags and escapes special characters
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // First, strip all HTML tags
  let sanitized = validator.stripLow(input);
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Escape special HTML characters
  sanitized = validator.escape(sanitized);
  
  // Remove null bytes and normalize
  return sanitizeString(sanitized);
}

/**
 * Sanitize phone number by removing non-numeric characters except +
 */
export function sanitizePhone(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove all characters except digits and +
  let sanitized = input.replace(/[^\d+]/g, '');
  
  // Ensure + is only at the beginning
  if (sanitized.includes('+')) {
    const parts = sanitized.split('+');
    sanitized = '+' + parts.filter(p => p).join('');
  }
  
  return sanitized.trim();
}

/**
 * Escape special characters that could be used in SQL injection
 * Note: This is defense in depth - Supabase RLS is the primary protection
 */
export function escapeSpecialChars(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\0/g, '\\0');
}

/**
 * Sanitize an object recursively
 * Applies sanitization to all string values in the object
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options: {
    sanitizeHtml?: boolean;
    maxDepth?: number;
    currentDepth?: number;
  } = {}
): T {
  const {
    sanitizeHtml: shouldSanitizeHtml = false,
    maxDepth = 10,
    currentDepth = 0
  } = options;

  // Prevent infinite recursion
  if (currentDepth >= maxDepth) {
    console.warn('Max depth reached during sanitization');
    return obj;
  }

  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle non-objects
  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return (shouldSanitizeHtml ? sanitizeHtml(obj) : sanitizeString(obj)) as any;
    }
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => 
      sanitizeObject(item, { 
        sanitizeHtml: shouldSanitizeHtml, 
        maxDepth, 
        currentDepth: currentDepth + 1 
      })
    ) as any;
  }

  // Handle objects
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Sanitize the key itself
    const sanitizedKey = sanitizeString(key);
    
    if (typeof value === 'string') {
      sanitized[sanitizedKey] = shouldSanitizeHtml 
        ? sanitizeHtml(value) 
        : sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[sanitizedKey] = sanitizeObject(value, {
        sanitizeHtml: shouldSanitizeHtml,
        maxDepth,
        currentDepth: currentDepth + 1
      });
    } else {
      sanitized[sanitizedKey] = value;
    }
  }

  return sanitized as T;
}

/**
 * Validate and sanitize metadata objects
 * Ensures metadata doesn't exceed size limits and is properly sanitized
 */
export function sanitizeMetadata(
  metadata: Record<string, any>,
  options: {
    maxSizeKB?: number;
    maxDepth?: number;
  } = {}
): Record<string, any> {
  const { maxSizeKB = 10, maxDepth = 3 } = options;

  // Check size
  const jsonString = JSON.stringify(metadata);
  const sizeKB = new Blob([jsonString]).size / 1024;
  
  if (sizeKB > maxSizeKB) {
    throw new Error(`Metadata size (${sizeKB.toFixed(2)}KB) exceeds maximum allowed (${maxSizeKB}KB)`);
  }

  // Sanitize recursively
  return sanitizeObject(metadata, { maxDepth, sanitizeHtml: true });
}

/**
 * Sanitize user input for content fields (descriptions, comments, posts)
 * More aggressive sanitization for user-generated content
 */
export function sanitizeUserContent(input: string, maxLength: number = 2000): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Strip HTML and sanitize
  let sanitized = sanitizeHtml(input);
  
  // Truncate if needed
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Validate email format (for future use)
 */
export function isValidEmail(email: string): boolean {
  return validator.isEmail(email);
}

/**
 * Validate URL format (for future use)
 */
export function isValidUrl(url: string): boolean {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
}

/**
 * Sanitize and validate a numeric amount
 */
export function sanitizeAmount(amount: any): number {
  // Convert to number if string
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid amount: must be a valid number');
  }
  
  if (num < 0) {
    throw new Error('Invalid amount: must be positive');
  }
  
  // Round to 2 decimal places
  return Math.round(num * 100) / 100;
}

/**
 * Log sanitization events for security monitoring
 */
export function logSanitization(
  field: string,
  original: string,
  sanitized: string,
  context?: string
): void {
  if (original !== sanitized) {
    console.warn('🧹 Sanitization applied:', {
      field,
      context,
      originalLength: original.length,
      sanitizedLength: sanitized.length,
      timestamp: new Date().toISOString()
    });
  }
}

