/**
 * Internationalization (i18n) Utilities
 * Text length handling, date formatting, number formatting for South Africa
 */

/**
 * Supported languages
 */
export const Languages = {
  EN: 'en',
  SW: 'sw', // Kiswahili
  KI: 'ki', // Kikuyu
  LU: 'lu', // Luo
};

/**
 * Default language
 */
export const DEFAULT_LANGUAGE = Languages.EN;

/**
 * Current language (can be set from localStorage or user preference)
 */
let currentLanguage = localStorage.getItem('beezee_language') || DEFAULT_LANGUAGE;

/**
 * Set current language
 * @param {string} lang - Language code
 */
export function setLanguage(lang) {
  if (Object.values(Languages).includes(lang)) {
    currentLanguage = lang;
    localStorage.setItem('beezee_language', lang);
    document.documentElement.lang = lang;
  }
}

/**
 * Get current language
 * @returns {string}
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * Format date for Kenya (DD/MM/YYYY)
 * @param {Date|string} date - Date to format
 * @param {Object} options - Format options
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
  const { format } = new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return format(date, {
    ...options,
    timeZone: 'Africa/Nairobi'
  });
};

/**
 * Format date with time
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export function formatDateTime(date) {
  const dateObj = date instanceof Date ? date : new Date(date);

  return formatDate(dateObj, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export function formatRelativeTime(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffMs = now - dateObj;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return formatDate(dateObj);
}

/**
 * Format currency for Kenya (KES)
 * @param {number} amount - Amount to format
 * @param {Object} options - Format options
 * @returns {string}
 */
export const formatCurrency = (amount, options = {}) => {
  const { format } = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  });

  return format(amount, {
    ...options
  });
};

/**
 * Format number with Kenyan locale
 * @param {number} number - Number to format
 * @param {Object} options - Format options
 * @returns {string}
 */
export function formatNumber(number, options = {}) {
  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  };

  return new Intl.NumberFormat('en-KE', defaultOptions).format(number);
}

/**
 * Format percentage
 * @param {number} value - Value to format (0-100)
 * @param {Object} options - Format options
 * @returns {string}
 */
export function formatPercentage(value, options = {}) {
  const defaultOptions = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  };

  return new Intl.NumberFormat('en-KE', defaultOptions).format(value / 100);
}

/**
 * Parse date string (handles various formats)
 * @param {string} dateString - Date string to parse
 * @returns {Date|null}
 */
export function parseDate(dateString) {
  if (!dateString) return null;

  // Try ISO format first
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) return isoDate;

  // Try DD/MM/YYYY format
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  return null;
}

/**
 * Get text length for different languages (for UI layout)
 * @param {string} text - Text to measure
 * @param {string} lang - Language code
 * @returns {number} Estimated character width
 */
export function getTextLength(text, lang = currentLanguage) {
  // Different languages have different average character widths
  const widthMultipliers = {
    [Languages.EN]: 1.0,
    [Languages.AF]: 1.1, // Afrikaans can be slightly longer
    [Languages.ZU]: 1.2, // Zulu can be longer
    [Languages.XH]: 1.2, // Xhosa can be longer
  };

  const multiplier = widthMultipliers[lang] || 1.0;
  return Math.ceil(text.length * multiplier);
}

/**
 * Truncate text based on language
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} lang - Language code
 * @returns {string}
 */
export function truncateText(text, maxLength, lang = currentLanguage) {
  const adjustedLength = Math.floor(maxLength / (getTextLength(text, lang) / text.length));

  if (text.length <= adjustedLength) return text;

  return text.substring(0, adjustedLength - 3) + '...';
}

/**
 * Format phone number for Kenya
 * @param {string} phone - Phone number
 * @returns {string}
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Format: +254 XXX XXX XXX
  if (digits.startsWith('254')) {
    const rest = digits.substring(3);
    if (rest.length === 9) {
      return `+254 ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`;
    }
  }

  // Format: 0XXX XXX XXX
  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  }

  return phone;
}

/**
 * Translation strings (basic implementation)
 * Can be extended with a proper i18n library
 */
export const translations = {
  [Languages.EN]: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      skip: 'Skip',
      done: 'Done',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    dashboard: {
      greeting: 'Good morning',
      balance: 'Your Business Balance',
      moneyIn: 'Money In',
      moneyOut: 'Money Out',
    },
  },
  [Languages.AF]: {
    common: {
      save: 'Stoor',
      cancel: 'Kanselleer',
      delete: 'Verwyder',
      edit: 'Wysig',
      close: 'Sluit',
      back: 'Terug',
      next: 'Volgende',
      skip: 'Slaan oor',
      done: 'Klaar',
      loading: 'Laai...',
      error: 'Fout',
      success: 'Sukses',
    },
    dashboard: {
      greeting: 'Goeie môre',
      balance: 'Jou Besigheid Balans',
      moneyIn: 'Geld In',
      moneyOut: 'Geld Uit',
    },
  },
};

/**
 * Translate text
 * @param {string} key - Translation key (e.g., 'common.save')
 * @param {Object} params - Parameters for interpolation
 * @returns {string}
 */
export function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations[currentLanguage];

  for (const k of keys) {
    value = value?.[k];
  }

  if (!value) {
    // Fallback to English
    let fallback = translations[Languages.EN];
    for (const k of keys) {
      fallback = fallback?.[k];
    }
    value = fallback || key;
  }

  // Simple parameter interpolation
  return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
    return params[paramKey] || match;
  });
}

/**
 * Pluralize text
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form
 * @param {number} count - Count
 * @returns {string}
 */
export function pluralize(singular, plural, count) {
  return count === 1 ? singular : plural;
}

/**
 * Format duration (e.g., "2 hours 30 minutes")
 * @param {number} minutes - Duration in minutes
 * @returns {string}
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} ${pluralize('minute', 'minutes', minutes)}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${pluralize('hour', 'hours', hours)}`;
  }

  return `${hours} ${pluralize('hour', 'hours', hours)} ${remainingMinutes} ${pluralize('minute', 'minutes', remainingMinutes)}`;
}

/**
 * Get day name
 * @param {Date|number} date - Date or day index (0-6)
 * @returns {string}
 */
export function getDayName(date) {
  const dayIndex = date instanceof Date ? date.getDay() : date;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

/**
 * Get month name
 * @param {Date|number} date - Date or month index (0-11)
 * @returns {string}
 */
export function getMonthName(date) {
  const monthIndex = date instanceof Date ? date.getMonth() : date;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[monthIndex];
}







