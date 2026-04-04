import { useState, useEffect } from 'react';

export function usePersistentStorage<T>(key: string, initialValue: T) {
  // Get stored value
  const getStoredValue = (): T => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
    }
    return initialValue;
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update localStorage when value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch custom event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: key,
          newValue: JSON.stringify(valueToStore)
        }));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}
