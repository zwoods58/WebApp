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

interface UnifiedAuthContextType extends UnifiedAuthState {
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

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseAuth = useSupabaseAuth();

  const value: UnifiedAuthContextType = {
    ...supabaseAuth,
  };

  return React.createElement(
    UnifiedAuthContext.Provider,
    { value },
    children
  );
}

export function useUnifiedAuth() {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
}

