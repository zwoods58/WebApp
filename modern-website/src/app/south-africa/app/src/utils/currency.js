/**
 * Country-Specific Currency Formatting Utility
 * Supports Kenya (KES), South Africa (ZAR), and Nigeria (NGN)
 */

// Country configurations
export const COUNTRY_CONFIGS = {
  KE: {
    code: 'KE',
    name: 'Kenya',
    currency: {
      code: 'KES',
      symbol: 'KES',
      position: 'before',
      decimalSeparator: '.',
      thousandsSeparator: ',',
      decimalDigits: 2,
      format: 'KES 1,000.00'
    },
    locale: 'en-KE',
    dateFormat: 'DD/MM/YYYY',
    subscription: {
      amount: 100,
      period: 'weekly',
      currency: 'KES'
    },
    paymentMethods: ['M-Pesa', 'Card (dLocal)']
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    currency: {
      code: 'ZAR',
      symbol: 'R',
      position: 'before',
      decimalSeparator: '.',
      thousandsSeparator: ',',
      decimalDigits: 2,
      format: 'R 1,000.00'
    },
    locale: 'en-ZA',
    dateFormat: 'YYYY/MM/DD',
    subscription: {
      amount: 49,
      period: 'monthly',
      currency: 'ZAR'
    },
    paymentMethods: ['Ozow', 'Card (dLocal)']
  },
  NG: {
    code: 'NG',
    name: 'Nigeria',
    currency: {
      code: 'NGN',
      symbol: '₦',
      position: 'before',
      decimalSeparator: '.',
      thousandsSeparator: ',',
      decimalDigits: 2,
      format: '₦1,000.00'
    },
    locale: 'en-NG',
    dateFormat: 'DD/MM/YYYY',
    subscription: {
      amount: 600,
      period: 'weekly',
      currency: 'NGN'
    },
    paymentMethods: ['MTN Mobile Money', 'Card (dLocal)']
  }
};

/**
 * Get current country configuration
 */
export const getCurrentCountry = () => {
  // South Africa PWA defaults to ZA
  const envCountry = process.env.NEXT_PUBLIC_COUNTRY_CODE || 'ZA';
  if (envCountry && COUNTRY_CONFIGS[envCountry]) {
    return COUNTRY_CONFIGS[envCountry];
  }
  
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem('beezee_country_code');
    if (stored && COUNTRY_CONFIGS[stored]) {
      return COUNTRY_CONFIGS[stored];
    }
  } catch (error) {
    console.warn('Could not read country from localStorage:', error);
  }
  
  // Default to South Africa
  return COUNTRY_CONFIGS.ZA;
};

/**
 * Format currency according to country-specific rules
 */
export const formatCurrency = (amount, countryCode = null) => {
  const config = countryCode ? COUNTRY_CONFIGS[countryCode] : getCurrentCountry();
  const { currency } = config;
  
  // Ensure amount is a number
  const numAmount = parseFloat(amount) || 0;
  
  // Format the number with proper separators
  const formattedNumber = numAmount.toLocaleString('en-US', {
    minimumFractionDigits: currency.decimalDigits,
    maximumFractionDigits: currency.decimalDigits,
    useGrouping: true
  }).replace(/,/g, currency.thousandsSeparator);
  
  // Replace decimal separator if needed
  const finalNumber = formattedNumber.replace('.', currency.decimalSeparator);
  
  // Add currency symbol in correct position
  if (currency.position === 'before') {
    return `${currency.symbol} ${finalNumber}`;
  } else {
    return `${finalNumber} ${currency.symbol}`;
  }
};

/**
 * Parse currency string back to number
 */
export const parseCurrency = (currencyString, countryCode = null) => {
  const config = countryCode ? COUNTRY_CONFIGS[countryCode] : getCurrentCountry();
  const { currency } = config;
  
  // Remove currency symbol and spaces
  let cleanString = currencyString.replace(currency.symbol, '').trim();
  
  // Replace thousands separator
  cleanString = cleanString.replace(new RegExp(`\\${currency.thousandsSeparator}`, 'g'), '');
  
  // Replace decimal separator with standard decimal
  cleanString = cleanString.replace(currency.decimalSeparator, '.');
  
  // Parse as float
  return parseFloat(cleanString) || 0;
};

/**
 * Format amount for display (short version for small spaces)
 */
export const formatCurrencyShort = (amount, countryCode = null) => {
  const config = countryCode ? COUNTRY_CONFIGS[countryCode] : getCurrentCountry();
  const { currency } = config;
  
  const numAmount = parseFloat(amount) || 0;
  
  if (numAmount >= 1000000) {
    return `${currency.symbol} ${(numAmount / 1000000).toFixed(1)}M`;
  } else if (numAmount >= 1000) {
    return `${currency.symbol} ${(numAmount / 1000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount, countryCode);
  }
};

/**
 * Get currency symbol only
 */
export const getCurrencySymbol = (countryCode = null) => {
  const config = countryCode ? COUNTRY_CONFIGS[countryCode] : getCurrentCountry();
  return config.currency.symbol;
};

/**
 * Get currency code only
 */
export const getCurrencyCode = (countryCode = null) => {
  const config = countryCode ? COUNTRY_CONFIGS[countryCode] : getCurrentCountry();
  return config.currency.code;
};

/**
 * Validate currency amount
 */
export const validateCurrencyAmount = (amount, countryCode = null) => {
  const config = countryCode ? COUNTRY_CONFIGS[countryCode] : getCurrentCountry();
  const { currency } = config;
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return {
      isValid: false,
      error: 'Please enter a valid number'
    };
  }
  
  if (numAmount < 0) {
    return {
      isValid: false,
      error: 'Amount cannot be negative'
    };
  }
  
  if (numAmount > 999999999) {
    return {
      isValid: false,
      error: 'Amount is too large'
    };
  }
  
  return {
    isValid: true,
    formattedAmount: formatCurrency(numAmount, countryCode)
  };
};

/**
 * Convert amount between currencies (placeholder for future exchange rates)
 */
export const convertCurrency = (amount, fromCountry, toCountry, exchangeRate = null) => {
  const fromConfig = COUNTRY_CONFIGS[fromCountry];
  const toConfig = COUNTRY_CONFIGS[toCountry];
  
  if (!fromConfig || !toConfig) {
    throw new Error('Invalid country codes');
  }
  
  // For now, return same amount (implement exchange rates later)
  const convertedAmount = exchangeRate ? amount * exchangeRate : amount;
  
  return {
    amount: convertedAmount,
    formattedFrom: formatCurrency(amount, fromCountry),
    formattedTo: formatCurrency(convertedAmount, toCountry),
    fromCurrency: fromConfig.currency.code,
    toCurrency: toConfig.currency.code
  };
};

/**
 * Get subscription pricing for country
 */
export const getSubscriptionPricing = (countryCode = null) => {
  const config = countryCode ? COUNTRY_CONFIGS[countryCode] : getCurrentCountry();
  return config.subscription;
};

/**
 * Format subscription display text
 */
export const formatSubscriptionText = (countryCode = null) => {
  const pricing = getSubscriptionPricing(countryCode);
  const formattedAmount = formatCurrency(pricing.amount, countryCode);
  
  const periodText = pricing.period === 'weekly' ? 'week' : 'month';
  return `${formattedAmount}/${periodText}`;
};

/**
 * Get available payment methods for country
 */
export const getPaymentMethods = (countryCode = null) => {
  const config = countryCode ? COUNTRY_CONFIGS[countryCode] : getCurrentCountry();
  return config.paymentMethods;
};

/**
 * React hook for currency formatting
 */
import { useState, useEffect } from 'react';

export const useCurrency = () => {
  const [country, setCountry] = useState(getCurrentCountry());
  
  useEffect(() => {
    // Listen for country changes
    const handleStorageChange = (e) => {
      if (e.key === 'beezee_country_code') {
        setCountry(getCurrentCountry());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return {
    format: (amount) => formatCurrency(amount, country.code),
    formatShort: (amount) => formatCurrencyShort(amount, country.code),
    parse: (string) => parseCurrency(string, country.code),
    validate: (amount) => validateCurrencyAmount(amount, country.code),
    symbol: getCurrencySymbol(country.code),
    code: getCurrencyCode(country.code),
    country,
    subscription: getSubscriptionPricing(country.code),
    paymentMethods: getPaymentMethods(country.code)
  };
};

export default {
  formatCurrency,
  parseCurrency,
  formatCurrencyShort,
  getCurrencySymbol,
  getCurrencyCode,
  validateCurrencyAmount,
  convertCurrency,
  getSubscriptionPricing,
  formatSubscriptionText,
  getPaymentMethods,
  useCurrency,
  COUNTRY_CONFIGS
};
