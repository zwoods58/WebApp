"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { setBusinessContext } from '@/lib/supabaseContext';
import { supabase } from '@/lib/supabase';
import { SUPPORTED_COUNTRIES, validatePhoneFormat } from '@/utils/phoneUtils';
import { persistentStorage } from '@/utils/persistentStorage';
import { getOnlineStatus } from '@/lib/connection-manager';

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
  signInAfterSignup: (business: Business, session: any) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshBusiness: () => void;
  validatePhone: (phone: string) => { valid: boolean; country?: string };
  businessId?: string;
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(undefined);

// Helper function to notify Service Worker about user routes
async function notifyServiceWorker(country: string, industry: string, retryCount = 0) {
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    try {
      // Wait for service worker to be ready and activated
      const registration = await navigator.serviceWorker.ready;
      
      // Wait a bit for the SW to fully activate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (registration.active) {
        registration.active.postMessage({
          type: 'CACHE_USER_ROUTES',
          country: country.toLowerCase(),
          industry: industry.toLowerCase()
        });
        console.log('📦 Service Worker notified to cache routes:', { country, industry });
      } else {
        // Retry up to 3 times if SW not active yet
        if (retryCount < 3) {
          console.warn(`⚠️ Service Worker not active yet, retrying in 2 seconds... (attempt ${retryCount + 1}/3)`);
          setTimeout(() => notifyServiceWorker(country, industry, retryCount + 1), 2000);
        } else {
          console.error('❌ Service Worker failed to activate after 3 retries');
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not notify service worker:', err);
    }
  }
}

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

  // Helper function to check if error is network/offline related
  const isOfflineError = useCallback((error: any): boolean => {
    if (!error) return false;
    
    const errorMessage = error.message || '';
    const errorCode = error.code || '';
    
    // Check for various network error patterns
    const networkErrorPatterns = [
      'fetch',
      'network',
      'Failed to fetch',
      'NetworkError',
      'ERR_INTERNET_DISCONNECTED',
      'ERR_CONNECTION_REFUSED',
      'ERR_NAME_NOT_RESOLVED',
      'ERR_CONNECTION_TIMED_OUT',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNREFUSED',
      'ECONNRESET',
      '503', // Service Unavailable
      '502', // Bad Gateway
      '504', // Gateway Timeout
      '0',   // Often indicates CORS/network issues in fetch
      'PGRST301', // Supabase offline error
      'offline',
      'connection'
    ];
    
    // Check error message
    const hasNetworkError = networkErrorPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
    
    // Check error code
    const hasNetworkCode = networkErrorPatterns.includes(errorCode);
    
    // Check if browser is offline
    const isBrowserOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    // Check connection manager status
    const isConnectionManagerOffline = !getOnlineStatus();
    
    return hasNetworkError || hasNetworkCode || isBrowserOffline || isConnectionManagerOffline;
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
        // � OFFLINE-FIRST: Completely skip database validation when offline
        const isOnline = getOnlineStatus();
        
        if (!isOnline) {
          console.log('📴 Offline mode detected - skipping ALL database operations, using cached session only');
          
          // Set auth state from cached data without any database validation
          setAuthState({
            business: authData.business,
            user: authData.business, // Alias for compatibility
            loading: false,
            error: null,
            isAuthenticated: true,
            session: authData.session,
          });
          
          console.log('✅ Auth state restored from cache (offline mode)');
          return;
        }
        
        // Only perform database validation when online
        console.log('🌐 Online mode detected - performing database validation');
        
        try {
          const { data: business, error } = await supabase
            .from('businesses')
            .select('id, country, industry')
            .eq('id', authData.business.id)
            .single();

          if (error) {
            if (isOfflineError(error)) {
              console.log('📴 Network error during database check, falling back to cached session');
              // Fall back to cached session
            } else if (!business) {
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
          } else if (!business) {
            console.log('❌ Business not found in database, clearing session');
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

          // Update localStorage with fresh data if changed (only if business exists)
          if (business && (business.country !== authData.business.country ||
              business.industry !== authData.business.industry)) {
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
          
          if (isOfflineError(dbError)) {
            console.log('📴 Network error during validation, falling back to cached session');
            // Fall back to cached session when network issues occur
          } else {
            // Only clear session for non-network errors
            console.log('❌ Non-network error during validation, clearing session');
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
        }

        // Validate the stored data structure and set context (only when online)
        if (authData.business.id && authData.session.businessId) {
          // Set business context for RLS policies (only when online)
          if (isOnline) {
            try {
              await setBusinessContext(
                authData.business.id, 
                authData.business.country, 
                authData.business.industry
              );
            } catch (contextError) {
              console.error('⚠️ Failed to set business context:', contextError);
            }
          } else {
            console.log('📴 Skipping business context setup in offline mode');
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
    // Check if offline using connection manager
    if (!getOnlineStatus()) {
      return { 
        error: { 
          message: 'You are currently offline. Please connect to the internet to sign in.' 
        } 
      };
    }

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

      // 🔥 NOTIFY SERVICE WORKER TO CACHE USER ROUTES
      await notifyServiceWorker(business.country, business.industry);

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
    // Check if offline using connection manager
    if (!getOnlineStatus()) {
      return { 
        error: { 
          message: 'You are currently offline. Please connect to the internet to sign in.' 
        } 
      };
    }

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

      // 🔥 NOTIFY SERVICE WORKER TO CACHE USER ROUTES
      await notifyServiceWorker(business.country, business.industry);

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

  const signInAfterSignup = useCallback(async (business: Business, session: any) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🚀 Setting auth state after signup:', business);

      // Set business context for RLS policies
      try {
        await setBusinessContext(business.id, business.country, business.industry);
      } catch (contextError) {
        console.error('⚠️ Failed to set business context, but continuing:', contextError);
      }

      // Set auth state with business data
      setAuthState({
        business: business,
        user: business, // Alias for compatibility
        loading: false,
        error: null,
        isAuthenticated: true,
        session: session,
      });

      // 🔥 NOTIFY SERVICE WORKER TO CACHE USER ROUTES
      await notifyServiceWorker(business.country, business.industry);

      return { 
        error: null, 
        data: { 
          message: 'Authentication established successfully after signup!',
          business: business
        } 
      };

    } catch (error) {
      console.error('💥 Post-signup auth error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to establish authentication after signup.';
      
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
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('🔓 Signing out...');
      
      // 🔥 OPTIONAL: Notify service worker to clear user routes
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          registration.active?.postMessage({
            type: 'CLEAR_USER_ROUTES'
          });
          console.log('📦 Service worker notified to clear user routes');
        } catch (err) {
          console.warn('Could not notify service worker:', err);
        }
      }
      
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
    signInAfterSignup,
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