"use client";

import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from './SupabaseAuthContext';

export interface UnifiedAuthState {
  user: any | null;
  business: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isEmailConfirmed: boolean;
  subscription: any | null;
  isReadOnly: boolean;
}

interface SupabaseAuthContextType extends UnifiedAuthState {
  // Re-export all SupabaseAuth methods
  signUp: (email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    phone: string;
    businessName: string;
    country: string;
    industry: string;
    dailyTarget?: number | undefined;
  }) => Promise<{ error?: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error?: any; data?: any }>;
  signOut: () => Promise<{ error?: any }>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
  updatePassword: (newPassword: string) => Promise<{ error?: any }>;
  resendConfirmation: (email: string) => Promise<{ error?: any }>;
  refreshSession: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseAuth = useSupabaseAuth();

  const value: SupabaseAuthContextType = {
    ...supabaseAuth,
  };

  return React.createElement(
    SupabaseAuthContext.Provider,
    { value },
    children
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    // Return a default empty state for pages outside the provider (e.g., landing pages, offline tests)
    // This prevents "useSupabaseAuth must be used within UnifiedAuthProvider" errors during SSR/Build
    return {
      user: null,
      business: null,
      subscription: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      isEmailConfirmed: false,
      isReadOnly: false,
      signUp: async () => ({ error: 'Auth provider missing' }),
      signIn: async () => ({ error: 'Auth provider missing' }),
      signOut: async () => ({ error: 'Auth provider missing' }),
      resetPassword: async () => ({ error: 'Auth provider missing' }),
      updatePassword: async () => ({ error: 'Auth provider missing' }),
      resendConfirmation: async () => ({ error: 'Auth provider missing' }),
      refreshSession: async () => {},
    } as SupabaseAuthContextType;
  }
  return context;
}

