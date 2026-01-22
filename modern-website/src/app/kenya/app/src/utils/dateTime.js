/**
 * Country-Specific Date/Time Localization Utility
 * Supports different date formats and timezones for each country
 */

import { format, parse, isValid } from 'date-fns';
import { COUNTRY_CONFIGS } from './currency';

/**
 * Date format configurations for each country
 */
export const DATE_FORMATS = {
  KE: {
    code: 'KE',
    name: 'Kenya',
    timezone: 'Africa/Nairobi',
    dateFormat: 'dd/MM/yyyy', // DD/MM/YYYY
    shortDateFormat: 'dd/MM/yy',
    longDateFormat: 'dd MMMM yyyy',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'dd/MM/yyyy HH:mm',
    longDateTimeFormat: 'dd MMMM yyyy HH:mm',
    locale: 'en-KE'
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    timezone: 'Africa/Johannesburg',
    dateFormat: 'yyyy/MM/dd', // YYYY/MM/DD
    shortDateFormat: 'yy/MM/dd',
    longDateFormat: 'dd MMMM yyyy',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'yyyy/MM/dd HH:mm',
    longDateTimeFormat: 'dd MMMM yyyy HH:mm',
    locale: 'en-ZA'
  },
  NG: {
    code: 'NG',
    name: 'Nigeria',
    timezone: 'Africa/Lagos',
    dateFormat: 'dd/MM/yyyy', // DD/MM/YYYY
    shortDateFormat: 'dd/MM/yy',
    longDateFormat: 'dd MMMM yyyy',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'dd/MM/yyyy HH:mm',
    longDateTimeFormat: 'dd MMMM yyyy HH:mm',
    locale: 'en-NG'
  }
};

/**
 * Get current country date configuration
 */
export const getCurrentDateConfig = () => {
  // Try to get from environment first
  const envCountry = process.env.NEXT_PUBLIC_COUNTRY_CODE;
  if (envCountry && DATE_FORMATS[envCountry]) {
    return DATE_FORMATS[envCountry];
  }
  
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem('beezee_country_code');
    if (stored && DATE_FORMATS[stored]) {
      return DATE_FORMATS[stored];
    }
  } catch (error) {
    console.warn('Could not read country from localStorage:', error);
  }
  
  // Default to Kenya
  return DATE_FORMATS.KE;
};

/**
 * Convert date to country-specific timezone
 */
export const toCountryTimezone = (date, countryCode = null) => {
  const config = countryCode ? DATE_FORMATS[countryCode] : getCurrentDateConfig();
  
  if (!date) return null;
  
  try {
    // Create a date object in the target timezone
    const utcDate = new Date(date);
    return new Date(utcDate.toLocaleString('en-US', { timeZone: config.timezone }));
  } catch (error) {
    console.error('Error converting timezone:', error);
    return new Date(date);
  }
};

/**
 * Format date according to country-specific format
 */
export const formatDate = (date, formatType = 'dateFormat', countryCode = null) => {
  const config = countryCode ? DATE_FORMATS[countryCode] : getCurrentDateConfig();
  
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return '';
    
    const formatString = config[formatType] || config.dateFormat;
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format time according to country-specific format
 */
export const formatTime = (date, countryCode = null) => {
  return formatDate(date, 'timeFormat', countryCode);
};

/**
 * Format date and time according to country-specific format
 */
export const formatDateTime = (date, formatType = 'dateTimeFormat', countryCode = null) => {
  return formatDate(date, formatType, countryCode);
};

/**
 * Format date in long format (e.g., "01 January 2024")
 */
export const formatLongDate = (date, countryCode = null) => {
  return formatDate(date, 'longDateFormat', countryCode);
};

/**
 * Format date and time in long format
 */
export const formatLongDateTime = (date, countryCode = null) => {
  return formatDate(date, 'longDateTimeFormat', countryCode);
};

/**
 * Parse date string according to country-specific format
 */
export const parseDate = (dateString, formatType = 'dateFormat', countryCode = null) => {
  const config = countryCode ? DATE_FORMATS[countryCode] : getCurrentDateConfig();
  
  if (!dateString) return null;
  
  try {
    const formatString = config[formatType] || config.dateFormat;
    const parsed = parse(dateString, formatString, new Date());
    
    if (isValid(parsed)) {
      return parsed;
    }
    
    // Fallback to standard date parsing
    const fallback = new Date(dateString);
    return isValid(fallback) ? fallback : null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 */
export const getRelativeTime = (date, countryCode = null) => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    const now = new Date();
    const diffMs = now - dateObj;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    // For older dates, return formatted date
    return formatDate(date, 'shortDateFormat', countryCode);
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
};

/**
 * Check if date is today
 */
export const isToday = (date, countryCode = null) => {
  if (!date) return false;
  
  try {
    const dateObj = toCountryTimezone(date, countryCode);
    const today = toCountryTimezone(new Date(), countryCode);
    
    return dateObj.toDateString() === today.toDateString();
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

/**
 * Check if date is yesterday
 */
export const isYesterday = (date, countryCode = null) => {
  if (!date) return false;
  
  try {
    const dateObj = toCountryTimezone(date, countryCode);
    const yesterday = toCountryTimezone(new Date(), countryCode);
    yesterday.setDate(yesterday.getDate() - 1);
    
    return dateObj.toDateString() === yesterday.toDateString();
  } catch (error) {
    console.error('Error checking if date is yesterday:', error);
    return false;
  }
};

/**
 * Check if date is this week
 */
export const isThisWeek = (date, countryCode = null) => {
  if (!date) return false;
  
  try {
    const dateObj = toCountryTimezone(date, countryCode);
    const today = toCountryTimezone(new Date(), countryCode);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return dateObj >= startOfWeek && dateObj <= endOfWeek;
  } catch (error) {
    console.error('Error checking if date is this week:', error);
    return false;
  }
};

/**
 * Check if date is this month
 */
export const isThisMonth = (date, countryCode = null) => {
  if (!date) return false;
  
  try {
    const dateObj = toCountryTimezone(date, countryCode);
    const today = toCountryTimezone(new Date(), countryCode);
    
    return dateObj.getMonth() === today.getMonth() && 
           dateObj.getFullYear() === today.getFullYear();
  } catch (error) {
    console.error('Error checking if date is this month:', error);
    return false;
  }
};

/**
 * Get start of day in country timezone
 */
export const getStartOfDay = (date = new Date(), countryCode = null) => {
  const config = countryCode ? DATE_FORMATS[countryCode] : getCurrentDateConfig();
  
  try {
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj.toLocaleString('en-US', { timeZone: config.timezone }));
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  } catch (error) {
    console.error('Error getting start of day:', error);
    const fallback = new Date(date);
    fallback.setHours(0, 0, 0, 0);
    return fallback;
  }
};

/**
 * Get end of day in country timezone
 */
export const getEndOfDay = (date = new Date(), countryCode = null) => {
  const config = countryCode ? DATE_FORMATS[countryCode] : getCurrentDateConfig();
  
  try {
    const dateObj = new Date(date);
    const endOfDay = new Date(dateObj.toLocaleString('en-US', { timeZone: config.timezone }));
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  } catch (error) {
    console.error('Error getting end of day:', error);
    const fallback = new Date(date);
    fallback.setHours(23, 59, 59, 999);
    return fallback;
  }
};

/**
 * Get date range for a period (today, week, month, year)
 */
export const getDateRange = (period, countryCode = null) => {
  const config = countryCode ? DATE_FORMATS[countryCode] : getCurrentDateConfig();
  const now = toCountryTimezone(new Date(), countryCode);
  
  let startDate, endDate;
  
  switch (period) {
    case 'today':
      startDate = getStartOfDay(now, countryCode);
      endDate = getEndOfDay(now, countryCode);
      break;
      
    case 'yesterday':
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = getStartOfDay(yesterday, countryCode);
      endDate = getEndOfDay(yesterday, countryCode);
      break;
      
    case 'week':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startDate = getStartOfDay(startOfWeek, countryCode);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endDate = getEndOfDay(endOfWeek, countryCode);
      break;
      
    case 'month':
      startDate = getStartOfDay(new Date(now.getFullYear(), now.getMonth(), 1), countryCode);
      endDate = getEndOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0), countryCode);
      break;
      
    case 'lastMonth':
      startDate = getStartOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1), countryCode);
      endDate = getEndOfDay(new Date(now.getFullYear(), now.getMonth(), 0), countryCode);
      break;
      
    case 'year':
      startDate = getStartOfDay(new Date(now.getFullYear(), 0, 1), countryCode);
      endDate = getEndOfDay(new Date(now.getFullYear(), 11, 31), countryCode);
      break;
      
    default:
      startDate = getStartOfDay(now, countryCode);
      endDate = getEndOfDay(now, countryCode);
  }
  
  return { startDate, endDate };
};

/**
 * React hook for date/time formatting
 */
import { useState, useEffect } from 'react';

export const useDateTime = () => {
  const [config, setConfig] = useState(getCurrentDateConfig());
  
  useEffect(() => {
    // Listen for country changes
    const handleStorageChange = (e) => {
      if (e.key === 'beezee_country_code') {
        setConfig(getCurrentDateConfig());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return {
    formatDate: (date, formatType = 'dateFormat') => formatDate(date, formatType, config.code),
    formatTime: (date) => formatTime(date, config.code),
    formatDateTime: (date, formatType = 'dateTimeFormat') => formatDateTime(date, formatType, config.code),
    formatLongDate: (date) => formatLongDate(date, config.code),
    formatLongDateTime: (date) => formatLongDateTime(date, config.code),
    parseDate: (dateString, formatType = 'dateFormat') => parseDate(dateString, formatType, config.code),
    getRelativeTime: (date) => getRelativeTime(date, config.code),
    isToday: (date) => isToday(date, config.code),
    isYesterday: (date) => isYesterday(date, config.code),
    isThisWeek: (date) => isThisWeek(date, config.code),
    isThisMonth: (date) => isThisMonth(date, config.code),
    getDateRange: (period) => getDateRange(period, config.code),
    toCountryTimezone: (date) => toCountryTimezone(date, config.code),
    config
  };
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatLongDate,
  formatLongDateTime,
  parseDate,
  getRelativeTime,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  getStartOfDay,
  getEndOfDay,
  getDateRange,
  toCountryTimezone,
  useDateTime,
  DATE_FORMATS
};
