"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Real Supabase authentication implementation
function useAuthInline() {
  const [authState, setAuthState] = useState<{
    user: any;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    session: any;
  }>({
    user: null,
    loading: true,
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

  // Monitor auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.phone);
        
        if (session?.user) {
          setAuthState({
            user: session.user,
            loading: false,
            error: null,
            isAuthenticated: true,
            session: session
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            session: null
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthState({
          user: session.user,
          loading: false,
          error: null,
          isAuthenticated: true,
          session: session
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInDirect = async (phone: string, pin?: string) => {
    const validation = validatePhone(phone);
    if (!validation.valid) {
      return { error: { message: 'Invalid phone format' } };
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Use PIN verification API for authentication
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone, pin }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Authentication failed');
      }

      // The API should handle setting up the Supabase session
      // For now, we'll create a custom token session
      if (result.success && result.business) {
        const user = {
          id: result.business.id,
          phone_number: result.business.phone_number,
          business_name: result.business.business_name,
          country: result.business.country,
          industry: result.business.industry,
          auth_method: 'pin'
        };

        // Store session data for BusinessContext
        const sessionData = {
          userId: result.business.id,
          businessId: result.business.id,
          phone: result.business.phone_number,
          businessName: result.business.business_name,
          country: result.business.country,
          industry: result.business.industry,
          settings: result.business.settings,
          isActive: result.business.is_active,
          authenticated: true
        };
        localStorage.setItem('sessionData', JSON.stringify(sessionData));

        setAuthState({
          user,
          loading: false,
          error: null,
          isAuthenticated: true,
          session: { user }
        });

        return { error: null, data: { message: 'Login successful', business: user } };
      } else {
        throw new Error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('❌ Authentication error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear session data
      localStorage.removeItem('sessionData');
      
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        session: null,
      });
      return { error: null };
    } catch (error) {
      console.error('❌ Sign out error:', error);
      // Even if sign out fails, clear local state
      localStorage.removeItem('sessionData');
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        session: null,
      });
      return { error: null };
    }
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
  signInDirect: (phone: string, pin?: string) => Promise<{ error: any; data?: any }>;
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
