"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { setBusinessContext } from '@/lib/supabaseContext';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { SUPPORTED_COUNTRIES, validatePhoneFormat } from '@/utils/phoneUtils';
import { persistentStorage } from '@/utils/persistentStorage';

export interface Business {
  id: string;
  phone_number: string;
  business_name: string;
  country: string;
  industry: string;
  settings?: Record<string, any>;
  is_active?: boolean;
  home_currency?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UnifiedAuthState {
  business: Business | null;
  user: Business | null; // Alias for business for compatibility
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  session: {
    businessId: string;
    businessName: string;
    country: string;
    industry: string;
    phone: string;
  } | null;
}

interface UnifiedAuthContextType extends UnifiedAuthState {
  signInWithPIN: (phone: string, pin: string) => Promise<{ error: any; data?: any }>;
  signInDirect: (phone: string) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshBusiness: () => void;
  validatePhone: (phone: string) => { valid: boolean; country?: string };
  businessId?: string;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

export function UnifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<UnifiedAuthState>({
    business: null,
    user: null,
    loading: true, // Start with loading true to prevent race conditions
    error: null,
    isAuthenticated: false,
    session: null,
  });

  // Validate phone for supported countries only
  const validatePhone = useCallback((phone: string): { valid: boolean; country?: string } => {
    return validatePhoneFormat(phone);
  }, []);

  // Clear invalid sessions from localStorage
  const clearInvalidSessions = useCallback(() => {
    console.log('🧹 Clearing invalid auth sessions...');
    localStorage.removeItem('beezee_unified_auth');
    localStorage.removeItem('beezee_business_auth');
    localStorage.removeItem('beezee_direct_auth');
    localStorage.removeItem('sessionData');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('beezee_simple_auth');
  }, []);

  // Validate session freshness and integrity
  const isSessionValid = useCallback((authData: any): boolean => {
    if (!authData || !authData.business || !authData.session) {
      console.log('❌ Invalid session structure');
      return false;
    }

    // Extended session timeout - 7 days instead of 24 hours
    if (authData.session.timestamp) {
      const sessionAge = Date.now() - authData.session.timestamp;
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (sessionAge > maxAge) {
        console.log('❌ Session expired (age:', Math.round(sessionAge / (60 * 60 * 1000)), 'hours)');
        return false;
      }
    }

    // Validate business data integrity
    if (!authData.business.id || !authData.business.phone_number || !authData.business.business_name) {
      console.log('❌ Incomplete business data in session');
      return false;
    }

    console.log('✅ Session validation passed');
    return true;
  }, []);

  // Load auth state from localStorage on mount
  const loadAuthFromStorage = useCallback(async () => {
    try {
      console.log('🔍 Loading unified auth from storage...');
      
      // Clean up old auth data first
      localStorage.removeItem('beezee_direct_auth');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('beezee_simple_auth');
      
      // Try persistent storage first
      let authData: any = persistentStorage.get('beezee_unified_auth');
      
      if (authData) {
        console.log('✅ Found persistent auth data:', authData.business?.business_name);
      } else {
        // Fallback to regular localStorage for migration
        const unifiedAuthData = localStorage.getItem('beezee_unified_auth');
        const oldBusinessAuth = localStorage.getItem('beezee_business_auth');
        
        if (unifiedAuthData) {
          authData = JSON.parse(unifiedAuthData);
          console.log('✅ Found unified auth data:', authData.business?.business_name);
        } else if (oldBusinessAuth) {
          authData = JSON.parse(oldBusinessAuth);
          console.log('🔄 Migrating old auth data to persistent format');
          // Migrate to persistent storage
          persistentStorage.set('beezee_unified_auth', authData, { backup: true });
          localStorage.removeItem('beezee_business_auth');
        }
      }
      
      // Validate session before restoring
      if (authData && isSessionValid(authData)) {
        // 🔥 DATABASE VALIDATION: Verify business still exists
        try {
          const { data: business, error } = await supabaseAdmin
            .from('businesses')
            .select('id, country, industry')
            .eq('id', authData.business.id)
            .single();

          if (error || !business) {
            console.log('❌ Business no longer exists in database, clearing session');
            clearInvalidSessions();
            setAuthState({
              business: null,
              user: null,
              loading: false,
              error: null,
              isAuthenticated: false,
              session: null,
            });
            return;
          }

          // Update localStorage with fresh data if changed
          if (business.country !== authData.business.country ||
              business.industry !== authData.business.industry) {
            console.log('🔄 Updating business data from database:', {
              oldCountry: authData.business.country,
              newCountry: business.country,
              oldIndustry: authData.business.industry, 
              newIndustry: business.industry
            });
            
            authData.business.country = business.country;
            authData.business.industry = business.industry;
            authData.session.country = business.country;
            authData.session.industry = business.industry;
          }

        } catch (dbError) {
          console.error('❌ Database validation error:', dbError);
          clearInvalidSessions();
          setAuthState({
            business: null,
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            session: null,
          });
          return;
        }

        // Validate the stored data structure
        if (authData.business.id && authData.session.businessId) {
          // Set business context for RLS policies
          try {
            await setBusinessContext(
              authData.business.id, 
              authData.business.country, 
              authData.business.industry
            );
          } catch (contextError) {
            console.error('⚠️ Failed to set business context:', contextError);
          }

          // Set auth state from stored data
          setAuthState({
            business: authData.business,
            user: authData.business, // Alias for compatibility
            loading: false,
            error: null,
            isAuthenticated: true,
            session: authData.session,
          });
          
          // Also save to persistent storage if not already there
          persistentStorage.set('beezee_unified_auth', authData, { backup: true });
          
          console.log('✅ Auth state restored successfully');
          return;
        } else {
          console.error('❌ Invalid stored auth data structure');
          clearInvalidSessions();
        }
      } else if (authData) {
        console.log('🧹 Session validation failed, attempting emergency restore');
        const restored = persistentStorage.emergencyRestore();
        if (restored.restored.includes('beezee_unified_auth')) {
          console.log('🚨 Emergency restore successful, retrying...');
          // Retry loading after emergency restore
          setTimeout(() => loadAuthFromStorage(), 100);
          return;
        }
        clearInvalidSessions();
      }
      
      console.log('🔓 No existing auth session found');
      setAuthState({
        business: null,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        session: null,
      });
    } catch (error) {
      console.error('💥 Error loading auth state:', error);
      // Try emergency restore on error
      const restored = persistentStorage.emergencyRestore();
      if (restored.restored.length > 0) {
        console.log('🚨 Emergency restore after error:', restored.restored);
        setTimeout(() => loadAuthFromStorage(), 100);
        return;
      }
      
      setAuthState({
        business: null,
        user: null,
        loading: false,
        error: 'Failed to load authentication state',
        isAuthenticated: false,
        session: null,
      });
    }
  }, [isSessionValid, clearInvalidSessions]);

  // Initialize auth state on mount
  useEffect(() => {
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.business && authState.session) {
      const authData = {
        business: authState.business,
        session: authState.session
      };
      
      // Use persistent storage with backup
      persistentStorage.set('beezee_unified_auth', authData, { backup: true });
      
      // Also keep regular localStorage as fallback
      localStorage.setItem('beezee_unified_auth', JSON.stringify(authData));
    }
  }, [authState]);

  const signInWithPIN = useCallback(async (phone: string, pin: string) => {
    // Validate phone format
    const validation = validatePhone(phone);
    if (!validation.valid) {
      return { 
        error: { 
          message: 'Invalid phone format or unsupported country. Supported countries: Kenya, South Africa, Nigeria, Ghana, Uganda, Rwanda, Tanzania' 
        } 
      };
    }

    // Validate PIN format
    if (!/^\d{6}$/.test(pin)) {
      return { 
        error: { 
          message: 'Invalid PIN format. PIN must be exactly 6 digits.' 
        } 
      };
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔐 Verifying PIN for phone:', phone);
      
      // Call PIN verification API
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone, pin }),
      });

      const result = await response.json();

      if (!result.success) {
        console.log('❌ PIN verification failed:', result.error);
        setAuthState({
          business: null,
          user: null,
          loading: false,
          error: result.error || 'Invalid PIN',
          isAuthenticated: false,
          session: null,
        });

        return { 
          error: { 
            message: result.error || 'Invalid PIN' 
          } 
        };
      }

      const business = result.business;
      console.log('✅ PIN verification successful:', business);

      // Set business context for RLS policies
      try {
        await setBusinessContext(business.id, business.country, business.industry);
      } catch (contextError) {
        console.error('⚠️ Failed to set business context, but continuing:', contextError);
      }

      // Create session data with timestamp
      const sessionData = {
        businessId: business.id,
        businessName: business.business_name,
        country: business.country,
        industry: business.industry,
        phone: phone,
        timestamp: Date.now() // Add timestamp for session validation
      };

      // Set auth state with business data
      setAuthState({
        business: business,
        user: business, // Alias for compatibility
        loading: false,
        error: null,
        isAuthenticated: true,
        session: sessionData,
      });

      return { 
        error: null, 
        data: { 
          message: 'Access granted successfully!',
          business: business
        } 
      };

    } catch (error) {
      console.error('💥 Sign-in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign-in failed. Please try again later.';
      
      setAuthState({
        business: null,
        user: null,
        loading: false,
        error: errorMessage,
        isAuthenticated: false,
        session: null,
      });

      return { 
        error: { 
          message: errorMessage 
        } 
      };
    }
  }, [validatePhone]);

  const signInDirect = useCallback(async (phone: string) => {
    // Validate phone format
    const validation = validatePhone(phone);
    if (!validation.valid) {
      return { 
        error: { 
          message: 'Invalid phone format or unsupported country. Supported countries: Kenya, South Africa, Nigeria, Ghana, Uganda, Rwanda, Tanzania' 
        } 
      };
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Looking up business for phone:', phone);
      
      // Real database lookup - find business by phone number
      const response = await fetch('/api/auth/lookup-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const result = await response.json();

      if (!result.success || !result.business) {
        console.log('❌ No business found for phone:', phone);
        return { 
          error: { 
            message: 'Business not found. Please sign up first.' 
          } 
        };
      }

      const business = result.business;
      console.log('✅ Found business:', business);

      // Set business context for RLS policies
      try {
        await setBusinessContext(business.id, business.country, business.industry);
      } catch (contextError) {
        console.error('⚠️ Failed to set business context, but continuing:', contextError);
      }

      // Create session data with timestamp
      const sessionData = {
        businessId: business.id,
        businessName: business.business_name,
        country: business.country,
        industry: business.industry,
        phone: phone,
        timestamp: Date.now() // Add timestamp for session validation
      };

      // Set auth state with business data
      setAuthState({
        business: business,
        user: business, // Alias for compatibility
        loading: false,
        error: null,
        isAuthenticated: true,
        session: sessionData,
      });

      return { 
        error: null, 
        data: { 
          message: 'Access granted successfully!',
          business: business
        } 
      };

    } catch (error) {
      console.error('💥 Sign-in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign-in failed. Please try again later.';
      
      setAuthState({
        business: null,
        user: null,
        loading: false,
        error: errorMessage,
        isAuthenticated: false,
        session: null,
      });

      return { 
        error: { 
          message: errorMessage 
        } 
      };
    }
  }, [validatePhone]);

  const signOut = useCallback(async () => {
    try {
      console.log('🔓 Signing out...');
      
      // Clear all auth data from persistent storage
      persistentStorage.remove('beezee_unified_auth');
      
      // Clear all auth data from regular localStorage
      localStorage.removeItem('beezee_unified_auth');
      localStorage.removeItem('beezee_business_auth');
      localStorage.removeItem('beezee_direct_auth');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('beezee_simple_auth');
      
      // Reset state
      setAuthState({
        business: null,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        session: null,
      });

      return { error: null };
    } catch (error) {
      console.error('💥 Sign out error:', error);
      return { 
        error: { 
          message: 'Failed to sign out' 
        } 
      };
    }
  }, []);

  const refreshBusiness = useCallback(() => {
    console.log('🔄 Refreshing business data');
    loadAuthFromStorage();
  }, [loadAuthFromStorage]);

  const value: UnifiedAuthContextType = {
    ...authState,
    signInWithPIN,
    signInDirect,
    signOut,
    refreshBusiness,
    validatePhone,
    businessId: authState.business?.id
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
}

export function useUnifiedAuth() {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within UnifiedAuthProvider');
  }
  return context;
}

// Export aliases for backward compatibility
export const useAuth = useUnifiedAuth;
export const useBusiness = useUnifiedAuth;
