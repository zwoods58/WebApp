"use client";

import { createContext, useContext } from 'react';
import { useState } from 'react';

// Temporary inline useAuth implementation to bypass import issues
function useAuthInline() {
  const [authState, setAuthState] = useState<{
    user: any;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    session: any;
  }>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    session: null,
  });

  const validatePhone = (phone: string) => {
    const supportedCountries = {
      ke: { code: '+254', digits: 9 },
      za: { code: '+27', digits: 9 },
      ng: { code: '+234', digits: 10 },
      gh: { code: '+233', digits: 9 },
      ug: { code: '+256', digits: 9 },
      rw: { code: '+250', digits: 9 },
      tz: { code: '+255', digits: 9 }
    };
    
    for (const [key, config] of Object.entries(supportedCountries)) {
      const regex = new RegExp(`^\\${config.code}\\d{${config.digits}}$`);
      if (regex.test(phone)) {
        return { valid: true, country: key };
      }
    }
    return { valid: false };
  };

  const signInDirect = async (phone: string) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      return { error: { message: 'Invalid phone format' } };
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    // Mock implementation
    const mockUser = {
      id: 'mock-' + Date.now(),
      phone_number: phone,
      business_name: 'Mock Business',
      country: validation.country || 'ke',
      default_industry: 'retail',
      auth_method: 'simple_phone'
    };

    setAuthState({
      user: mockUser,
      loading: false,
      error: null,
      isAuthenticated: true,
      session: { user: mockUser }
    });

    return { error: null, data: { message: 'Mock login successful', user: mockUser } };
  };

  const signOut = async () => {
    setAuthState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      session: null,
    });
    return { error: null };
  };

  return {
    ...authState,
    signInDirect,
    signOut,
    validatePhone,
  };
}

interface AuthContextType {
  user: any;
  loading: boolean;
  businessData: any;
  signInDirect: (phone: string) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<{ error: any }>;
  validatePhone: (phone: string) => { valid: boolean; country?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authHook = useAuthInline();

  // Transform the hook data to match the expected interface
  const value: AuthContextType = {
    user: authHook.user,
    loading: authHook.loading,
    businessData: authHook.user, // For now, user data serves as business data
    signInDirect: authHook.signInDirect,
    signOut: authHook.signOut,
    validatePhone: authHook.validatePhone,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
