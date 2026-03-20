// Phone formatting utilities for consistent phone number handling across the application

export interface PhoneFormat {
  code: string;
  name: string;
  digits: number;
  total: number;
}

export const SUPPORTED_COUNTRIES: Record<string, PhoneFormat> = {
  ke: { code: '+254', name: 'Kenya', digits: 9, total: 12 },
  za: { code: '+27', name: 'South Africa', digits: 9, total: 11 },
  ng: { code: '+234', name: 'Nigeria', digits: 10, total: 13 },
  gh: { code: '+233', name: 'Ghana', digits: 9, total: 12 },
  ug: { code: '+256', name: 'Uganda', digits: 9, total: 12 },
  rw: { code: '+250', name: 'Rwanda', digits: 9, total: 12 },
  tz: { code: '+255', name: 'Tanzania', digits: 9, total: 12 }
};

/**
 * Formats a phone number to ensure it matches the database format
 * Handles various input formats and converts to standardized international format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // If already starts with + and has correct format, return as-is
  if (cleanPhone.startsWith('+')) {
    // Validate against supported countries
    for (const [key, config] of Object.entries(SUPPORTED_COUNTRIES)) {
      if (cleanPhone.startsWith(config.code)) {
        const digitsAfterCode = cleanPhone.substring(config.code.length);
        if (digitsAfterCode.length === config.digits) {
          return cleanPhone; // Already in correct format
        }
      }
    }
  }
  
  // If no country code, try to detect based on length and first digits
  if (!cleanPhone.startsWith('+')) {
    // Remove leading zeros
    cleanPhone = cleanPhone.replace(/^0+/, '');
    
    // Nigeria: starts with 234 and has 10 digits after country code
    if (cleanPhone.startsWith('234') && cleanPhone.length === 13) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      return '+234' + cleanPhone;
    }
    
    // Kenya: starts with 254 and has 9 digits after country code
    if (cleanPhone.startsWith('254') && cleanPhone.length === 12) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.length === 9 && cleanPhone.startsWith('1')) {
      return '+254' + cleanPhone;
    }
    
    // South Africa: starts with 27 and has 9 digits after country code
    if (cleanPhone.startsWith('27') && cleanPhone.length === 11) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.length === 9 && (cleanPhone.startsWith('6') || cleanPhone.startsWith('7') || cleanPhone.startsWith('8'))) {
      return '+27' + cleanPhone;
    }
    
    // Ghana: starts with 233 and has 9 digits after country code
    if (cleanPhone.startsWith('233') && cleanPhone.length === 12) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.length === 9 && cleanPhone.startsWith('2')) {
      return '+233' + cleanPhone;
    }
    
    // Uganda: starts with 256 and has 9 digits after country code
    if (cleanPhone.startsWith('256') && cleanPhone.length === 12) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
      return '+256' + cleanPhone;
    }
    
    // Rwanda: starts with 250 and has 9 digits after country code
    if (cleanPhone.startsWith('250') && cleanPhone.length === 12) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
      return '+250' + cleanPhone;
    }
    
    // Tanzania: starts with 255 and has 9 digits after country code
    if (cleanPhone.startsWith('255') && cleanPhone.length === 12) {
      return '+' + cleanPhone;
    }
    if (cleanPhone.length === 9 && (cleanPhone.startsWith('6') || cleanPhone.startsWith('7'))) {
      return '+255' + cleanPhone;
    }
    
    // Default to Kenya if no clear match and length is 9
    if (cleanPhone.length === 9) {
      return '+254' + cleanPhone;
    }
  }
  
  // If we can't determine the format, return original
  return phone;
}

/**
 * Validates phone number format against supported countries
 */
export function validatePhoneFormat(phone: string): { valid: boolean; country?: string } {
  for (const [key, config] of Object.entries(SUPPORTED_COUNTRIES)) {
    const regex = new RegExp(`^\\${config.code}\\d{${config.digits}}$`);
    if (regex.test(phone)) {
      return { valid: true, country: key };
    }
  }
  return { valid: false };
}

/**
 * Gets display format for phone number (for UI display)
 */
export function getDisplayPhone(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  const validation = validatePhoneFormat(formatted);
  
  if (!validation.valid) {
    return phone; // Return original if invalid
  }
  
  const country = SUPPORTED_COUNTRIES[validation.country!];
  if (!country) return formatted;
  
  const digits = formatted.substring(country.code.length);
  
  // Format based on country
  switch (validation.country) {
    case 'ng': // Nigeria: +234 XXX XXX XXXX
      return `${country.code} ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
    
    case 'ke': // Kenya: +254 XXX XXX XXX
    case 'ug': // Uganda: +256 XXX XXX XXX  
    case 'rw': // Rwanda: +250 XXX XXX XXX
    case 'tz': // Tanzania: +255 XXX XXX XXX
      return `${country.code} ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
    
    case 'za': // South Africa: +27 XX XXX XXXX
      return `${country.code} ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
    
    case 'gh': // Ghana: +233 XXX XXX XXX
      return `${country.code} ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
    
    default:
      return formatted;
  }
}
