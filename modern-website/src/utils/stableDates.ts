// src/utils/stableDates.ts
// This file prevents hydration mismatches by providing stable dates

let cachedToday: string | null = null;
let cachedNow: Date | null = null;

// Get stable date string for server/client consistency
export const getStableDateString = (): string => {
  if (typeof window === 'undefined') {
    // Server-side: use fixed date to prevent mismatch
    return '2024-01-01';
  }
  
  // Client-side: cache the date to prevent recalculation
  if (!cachedToday) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    cachedToday = `${year}-${month}-${day}`;
  }
  
  return cachedToday;
};

// Get stable timestamp for IDs (client-side only)
let idCounter = 0;
export const getStableId = (prefix: string = 'id'): string => {
  if (typeof window === 'undefined') {
    // Server-side: use static ID
    return `${prefix}-server-${idCounter++}`;
  }
  
  // Client-side: use incrementing counter
  const clientId = `${prefix}-${Date.now()}-${idCounter++}`;
  return clientId;
};

// Get stable date for display (client-side only)
export const getStableDisplayDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (typeof window === 'undefined') {
    // Server-side: return UTC string
    return d.toUTCString();
  }
  
  // Client-side: format properly
  return d.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Check if running on client
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

// Get current time in stable format
let cachedTimeString: string | null = null;
export const getStableTimeString = (): string => {
  if (typeof window === 'undefined') {
    return '12:00 PM';
  }
  
  if (!cachedTimeString) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutesStr = minutes.toString().padStart(2, '0');
    cachedTimeString = `${hours}:${minutesStr} ${ampm}`;
  }
  
  return cachedTimeString;
};

// Reset caches (for testing)
export const resetDateCaches = (): void => {
  cachedToday = null;
  cachedNow = null;
  cachedTimeString = null;
  idCounter = 0;
};

