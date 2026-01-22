/**
 * Country-specific phone number validation
 */

export const COUNTRY_PHONE_PATTERNS = {
  KE: {
    name: 'Kenya',
    code: '+254',
    pattern: /^\+254[17]\d{7}$/,
    example: '+254 712 345678',
    errorMessage: 'Please use a valid Kenyan phone number (e.g., +254 712 345678)'
  },
  ZA: {
    name: 'South Africa', 
    code: '+27',
    pattern: /^\+27[1-9]\d{8}$/,
    example: '+27 83 123 4567',
    errorMessage: 'Please use a valid South African phone number (e.g., +27 83 123 4567)'
  },
  NG: {
    name: 'Nigeria',
    code: '+234',
    pattern: /^\+234[1-9]\d{8}$/,
    example: '+234 801 2345678',
    errorMessage: 'Please use a valid Nigerian phone number (e.g., +234 801 2345678)'
  }
};

/**
 * Validate phone number for specific country
 */
export const validatePhoneNumber = (phoneNumber, countryCode) => {
  const countryConfig = COUNTRY_PHONE_PATTERNS[countryCode];
  
  if (!countryConfig) {
    return {
      isValid: false,
      error: 'Unsupported country code'
    };
  }

  // Remove spaces and special characters
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  const isValid = countryConfig.pattern.test(cleanPhone);
  
  return {
    isValid,
    error: isValid ? null : countryConfig.errorMessage,
    countryConfig
  };
};

/**
 * Get country from phone number
 */
export const getCountryFromPhone = (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  for (const [code, config] of Object.entries(COUNTRY_PHONE_PATTERNS)) {
    if (cleanPhone.startsWith(config.code)) {
      return {
        countryCode: code,
        country: config.name,
        phoneCode: config.code
      };
    }
  }
  
  return null;
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  
  // Add space after country code
  if (cleanPhone.length > 6) {
    return cleanPhone.slice(0, 3) + ' ' + cleanPhone.slice(3, 6) + ' ' + cleanPhone.slice(6);
  }
  
  return cleanPhone;
};
