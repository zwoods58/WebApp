// src/hooks/usePersistentStorage.ts
import { useState, useEffect } from 'react';

export function usePersistentStorage<T>(key: string, initialValue: T) {
  // State to track if component is mounted on client
  const [isMounted, setIsMounted] = useState(false);
  
  // State for stored value - start with initialValue on server
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage ONLY after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setStoredValue(JSON.parse(stored));
      }
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
    }
  }, [key]);

  // Save to localStorage whenever value changes (client-side only)
  useEffect(() => {
    if (!isMounted) return; // Don't save during SSR
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue, isMounted]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  };

  // Sync across tabs (client-side only)
  useEffect(() => {
    if (!isMounted) return;
    if (typeof window === 'undefined') return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing storage change for ${key}:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, isMounted]);

  // Return object instead of array
  return { value: storedValue, setValue, isLoading: !isMounted };
}