"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface RefreshContextType {
  registerRefreshHandler: (handler: () => Promise<void> | void) => void;
  unregisterRefreshHandler: () => void;
  triggerRefresh: () => Promise<void>;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export function useRefreshContext() {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefreshContext must be used within a RefreshProvider');
  }
  return context;
}

interface RefreshProviderProps {
  children: React.ReactNode;
}

export function RefreshProvider({ children }: RefreshProviderProps) {
  const [refreshHandler, setRefreshHandler] = useState<(() => Promise<void> | void) | null>(null);

  const registerRefreshHandler = useCallback((handler: () => Promise<void> | void) => {
    setRefreshHandler(() => handler);
  }, []);

  const unregisterRefreshHandler = useCallback(() => {
    setRefreshHandler(null);
  }, []);

  const triggerRefresh = useCallback(async () => {
    if (refreshHandler) {
      await refreshHandler();
    }
  }, [refreshHandler]);

  return (
    <RefreshContext.Provider
      value={{
        registerRefreshHandler,
        unregisterRefreshHandler,
        triggerRefresh
      }}
    >
      {children}
    </RefreshContext.Provider>
  );
}
