/**
 * Country-Specific Storage Utility
 * Prevents data conflicts between PWAs running on same domain
 */

// Get country code from environment or default to Kenya
const COUNTRY_CODE = process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE';

/**
 * Get namespaced localStorage key for current country
 */
const getCountryKey = (key) => {
  return `${COUNTRY_CODE}_${key}`;
};

/**
 * Format currency based on country
 */
export const formatCurrency = (amount, currencyCode = 'KES', locale = 'en-KE') => {
  try {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0;
    }
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currencyCode} ${amount}`;
  }
};

/**
 * Country-specific localStorage methods
 */
export const countryStorage = {
  /**
   * Set an item in localStorage with country namespace
   */
  setItem: (key, value) => {
    try {
      const namespacedKey = getCountryKey(key);
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(namespacedKey, serializedValue);
      console.log(`[${COUNTRY_CODE}] Saved ${key}:`, value);
    } catch (error) {
      console.error(`[${COUNTRY_CODE}] Error saving to localStorage (${key}):`, error);
    }
  },

  /**
   * Get an item from localStorage with country namespace
   */
  getItem: (key, defaultValue = null) => {
    try {
      const namespacedKey = getCountryKey(key);
      const item = localStorage.getItem(namespacedKey);
      
      if (item === null) {
        return defaultValue;
      }
      
      const parsed = JSON.parse(item);
      console.log(`[${COUNTRY_CODE}] Loaded ${key}:`, parsed);
      return parsed;
    } catch (error) {
      console.error(`[${COUNTRY_CODE}] Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  /**
   * Remove an item from localStorage with country namespace
   */
  removeItem: (key) => {
    try {
      const namespacedKey = getCountryKey(key);
      localStorage.removeItem(namespacedKey);
      console.log(`[${COUNTRY_CODE}] Removed ${key}`);
    } catch (error) {
      console.error(`[${COUNTRY_CODE}] Error removing from localStorage (${key}):`, error);
    }
  },

  /**
   * Clear all items for the current country only
   */
  clear: () => {
    try {
      const keysToRemove = [];
      
      // Find all keys that belong to this country
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${COUNTRY_CODE}_`)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove them
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`[${COUNTRY_CODE}] Cleared all country data`);
    } catch (error) {
      console.error(`[${COUNTRY_CODE}] Error clearing country-specific localStorage:`, error);
    }
  },

  /**
   * Get all keys for the current country
   */
  getAllKeys: () => {
    try {
      const countryKeys = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${COUNTRY_CODE}_`)) {
          // Remove prefix to get original key name
          countryKeys.push(key.replace(`${COUNTRY_CODE}_`, ''));
        }
      }
      
      return countryKeys;
    } catch (error) {
      console.error(`[${COUNTRY_CODE}] Error getting country keys:`, error);
      return [];
    }
  },

  /**
   * Check if a key exists for the current country
   */
  hasItem: (key) => {
    const namespacedKey = getCountryKey(key);
    return localStorage.getItem(namespacedKey) !== null;
  },

  /**
   * Get current country code
   */
  getCountryCode: () => {
    return COUNTRY_CODE;
  }
};

/**
 * Custom React Hook for country-specific localStorage
 */
import { useState, useEffect } from 'react';

export const useCountryStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    return countryStorage.getItem(key, initialValue);
  });

  // Update localStorage whenever the value changes
  useEffect(() => {
    countryStorage.setItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default countryStorage;
