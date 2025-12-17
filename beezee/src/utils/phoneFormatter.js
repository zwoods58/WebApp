/**
 * Phone Number Formatting Utilities
 * Supports any country code for testing purposes
 */

/**
 * Format phone number for display
 * Accepts: +1234567890 or 1234567890
 * Returns: Properly formatted based on country code
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  
  // Remove all non-digits except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  if (!cleaned) return '';
  
  // If starts with +, keep it
  if (cleaned.startsWith('+')) {
    const digits = cleaned.slice(1);
    
    // US/Canada (+1): Format as +1 (XXX) XXX-XXXX
    if (digits.startsWith('1') && digits.length === 11) {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    // South Africa (+27): Format as +27 XX XXX XXXX
    if (digits.startsWith('27') && digits.length >= 11) {
      if (digits.length === 11) {
        return `+27 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
      } else if (digits.length <= 4) {
        return `+27 ${digits.slice(2)}`;
      } else if (digits.length <= 7) {
        return `+27 ${digits.slice(2, 4)} ${digits.slice(4)}`;
      } else {
        return `+27 ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
      }
    }
    
    // UK (+44): Format as +44 XXXX XXXXXX
    if (digits.startsWith('44') && digits.length >= 12) {
      if (digits.length === 12) {
        return `+44 ${digits.slice(2, 6)} ${digits.slice(6)}`;
      } else {
        return `+44 ${digits.slice(2, 6)} ${digits.slice(6)}`;
      }
    }
    
    // Generic formatting for other countries
    if (digits.length <= 3) {
      return `+${digits}`;
    } else if (digits.length <= 6) {
      return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else if (digits.length <= 12) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
    } else {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 12)} ${digits.slice(12)}`;
    }
  } else {
    // No +, try to detect country code
    // If starts with 1 and 11 digits, assume US
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    
    // Otherwise, format generically
    if (cleaned.length <= 3) {
      return `+${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 9) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    }
  }
}

/**
 * Normalize phone number to E.164 format
 * Input: Any format (with or without +, spaces, etc.)
 * Output: +1234567890
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return '';
  
  // Remove all non-digits except + (keep + for detection)
  const hasPlus = phone.trim().startsWith('+');
  const digits = phone.replace(/\D/g, '');
  
  // If empty, return empty
  if (!digits) return '';
  
  // If already starts with +, ensure it's in E.164 format
  if (hasPlus) {
    return `+${digits}`;
  }
  
  // Handle US/Canada numbers (11 digits starting with 1)
  // If user types 11 digits starting with 1, it's likely a US number without country code
  if (digits.length === 11 && digits.startsWith('1')) {
    // Already has country code, just add +
    return `+${digits}`;
  }
  
  // Handle US/Canada numbers (10 digits) - add country code
  if (digits.length === 10) {
    // Assume US/Canada, add +1
    return `+1${digits}`;
  }
  
  // Otherwise, assume it needs a + prefix
  // For testing: accept any length, but minimum 7 digits
  return `+${digits}`;
}

/**
 * Validate phone number
 * For testing: Accept any international number (7-15 digits after country code)
 */
export function isValidPhoneNumber(phone) {
  if (!phone) return false;
  
  const normalized = normalizePhoneNumber(phone);
  const digits = normalized.replace(/\D/g, '');
  
  // E.164 format: + followed by 1-15 digits
  // Minimum: +1234567 (country code + 7 digits)
  // Maximum: +123456789012345 (country code + 15 digits)
  return digits.length >= 8 && digits.length <= 16;
}

/**
 * Extract country code from phone number
 * Returns: { countryCode: string, localNumber: string }
 */
export function parsePhoneNumber(phone) {
  const normalized = normalizePhoneNumber(phone);
  const digits = normalized.replace(/\D/g, '');
  
  // Common country codes (1-3 digits)
  // For testing, we'll try to detect common patterns
  // Default: assume first 1-3 digits are country code
  
  if (digits.startsWith('1') && digits.length >= 11) {
    // US/Canada: +1
    return {
      countryCode: '+1',
      localNumber: digits.slice(1),
    };
  } else if (digits.startsWith('27') && digits.length >= 11) {
    // South Africa: +27
    return {
      countryCode: '+27',
      localNumber: digits.slice(2),
    };
  } else if (digits.startsWith('44') && digits.length >= 12) {
    // UK: +44
    return {
      countryCode: '+44',
      localNumber: digits.slice(2),
    };
  } else if (digits.length >= 8) {
    // Generic: assume first 1-3 digits are country code
    // For simplicity, use first 2 digits
    return {
      countryCode: `+${digits.slice(0, 2)}`,
      localNumber: digits.slice(2),
    };
  }
  
  return {
    countryCode: '',
    localNumber: digits,
  };
}

