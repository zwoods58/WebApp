"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { setBusinessContext } from '@/lib/supabaseContext';
import { persistentStorage } from '@/utils/persistentStorage';
import { getNetworkStatus } from '@/lib/network-status';

export interface Business {
  id: string;
  supabase_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  business_name: string;
  country: string;
  industry: string;
  settings?: Record<string, any>;
  is_active?: boolean;
  home_currency?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseAuthState {
  user: any | null;
  business: Business | null;
  subscription: any | null; // Added subscription state
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isEmailConfirmed: boolean;
  isReadOnly: boolean; // Added read-only flag
}

interface SupabaseAuthContextType extends SupabaseAuthState {
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

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<SupabaseAuthState>({
    user: null,
    business: null,
    subscription: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    isEmailConfirmed: false,
    isReadOnly: false,
  });

  // Load auth state from storage and Supabase on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing Supabase auth...');
        
        // Get current session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          setAuthState(prev => ({ ...prev, loading: false, error: sessionError.message }));
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing session:', session.user.email);
          
          // Check if email is confirmed
          const isConfirmed = session.user.email_confirmed_at != null;
          
          // Load business data
          const business = await loadBusinessData(session.user.id);
          
          // Load subscription data
          const subscription = await loadSubscriptionData(session.user.id);
          
          // Determine if read-only
          // If status is 'failed' or 'cancelled', or if sub is missing but user is old
          const isReadOnly = subscription?.status === 'failed' || subscription?.status === 'cancelled';
          
          setAuthState({
            user: session.user,
            business,
            subscription,
            loading: false,
            error: null,
            isAuthenticated: true,
            isEmailConfirmed: isConfirmed,
            isReadOnly,
          });

          // Set business context for RLS
          if (business) {
            await setBusinessContext(business.id, business.country, business.industry);
          }
        } else {
          console.log('🔓 No existing session found');
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to initialize authentication' 
        }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const isConfirmed = session.user.email_confirmed_at != null;
          const business = await loadBusinessData(session.user.id);
          const subscription = await loadSubscriptionData(session.user.id);
          const isReadOnly = subscription?.status === 'failed' || subscription?.status === 'cancelled';
          
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            business,
            subscription,
            isAuthenticated: true,
            isEmailConfirmed: isConfirmed,
            isReadOnly,
            loading: false,
            error: null,
          }));
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            business: null,
            subscription: null,
            loading: false,
            error: null,
            isAuthenticated: false,
            isEmailConfirmed: false,
            isReadOnly: false,
          });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const isConfirmed = session.user.email_confirmed_at != null;
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            isEmailConfirmed: isConfirmed,
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load subscription data for a user
  const loadSubscriptionData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Error loading subscription data:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('💥 Error loading subscription data:', error);
      return null;
    }
  }, []);

  // Load business data for a user
  const loadBusinessData = useCallback(async (supabaseUserId: string): Promise<Business | null> => {
    try {
      const { data: business, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('supabase_user_id', supabaseUserId)
        .single();

      if (error) {
        console.error('❌ Error loading business data:', error);
        return null;
      }

      console.log('✅ Business data loaded:', business?.business_name);
      return business;
    } catch (error) {
      console.error('💥 Error loading business data:', error);
      return null;
    }
  }, []);

  // Sign up new user
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    userData: {
      firstName: string;
      lastName: string;
      phone: string;
      businessName: string;
      country: string;
      industry: string;
      dailyTarget?: number | undefined;
    }
  ): Promise<{ error: any; data?: any }> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🚀 Signing up user:', email);
      
      // Create Supabase user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      });

      if (signUpError) {
        console.error('❌ Sign up error:', signUpError);
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: signUpError.message 
        }));
        return { error: signUpError };
      }

      if (authData.user) {
        // Check if user already exists (Supabase security feature returns user but no identities)
        if (authData.user.identities && authData.user.identities.length === 0) {
          console.error('❌ User already exists');
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'An account with this email already exists.' 
          }));
          return { error: new Error('An account with this email already exists.') };
        }

        console.log('✅ User created, creating business record...');
        
        // Create business record
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .insert({
            supabase_user_id: authData.user.id,
            email: email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone_number: userData.phone,
            business_name: userData.businessName,
            country: userData.country.toUpperCase(),
            industry: userData.industry,
            settings: {
              daily_target: userData.dailyTarget || 0,
            },
            home_currency: getCurrency(userData.country),
          })
          .select()
          .single();

        if (businessError) {
          console.error('❌ Business creation error:', businessError);
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Failed to create business record' 
          }));
          return { error: businessError };
        }

        console.log('✅ Business created:', business.business_name);
        
        // Store business data for after email confirmation
        persistentStorage.set('pending_business', business, { backup: true });

        // authData.session is a live session when Supabase email confirmation is OFF.
        // authData.session is null when email confirmation is ON (user must click link first).
        const hasLiveSession = !!authData.session;

        if (hasLiveSession) {
          // Email confirmation is OFF — populate full auth state immediately.
          // This must happen before signUp() returns so that when the signup page
          // calls router.push('/dashboard'), the dashboard loads with a valid user.
          const isConfirmed = !!authData.user.email_confirmed_at;

          setAuthState({
            user:             authData.user,
            business,
            subscription:     null,
            loading:          false,
            error:            null,
            isAuthenticated:  true,
            isEmailConfirmed: isConfirmed,
            isReadOnly:       false,
          });

          // Set RLS context immediately so Supabase queries work on first dashboard load.
          // Without this, the first database query after signup will fail with RLS errors.
          if (business) {
            await setBusinessContext(business.id, business.country, business.industry);
          }
        } else {
          // Email confirmation is ON — no live session yet.
          // Do NOT set isAuthenticated: true. The signup page will route to
          // confirm-email page instead of the dashboard.
          setAuthState(prev => ({ ...prev, loading: false }));
        }

        return {
          error: null,
          data: {
            user:                      authData.user,
            business,
            session:                   authData.session,
            requiresEmailConfirmation: !hasLiveSession,
            message: hasLiveSession
              ? 'Account created successfully!'
              : 'Account created! Please check your email to confirm your account.',
          },
        };
      }

      // If authData.user is null but there was no explicit signUpError
      const silentError = new Error('Signup failed silently. The email might be invalid or network request failed.');
      setAuthState(prev => ({ ...prev, loading: false, error: silentError.message }));
      return { error: silentError, data: undefined };
    } catch (error) {
      console.error('💥 Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { error: { message: errorMessage }, data: undefined };
    }
  }, []);

  // Sign in existing user
  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔐 Signing in user:', email);
      
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('❌ Sign in error:', signInError);
        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          error: signInError.message 
        }));
        return { error: signInError, data: undefined };
      }

      if (authData.user) {
        const isConfirmed = authData.user.email_confirmed_at != null;
        
        if (!isConfirmed) {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Please confirm your email address before signing in.' 
          }));
          return { 
            error: { 
              message: 'Please confirm your email address before signing in.' 
            },
            data: undefined
          };
        }

        console.log('✅ Sign in successful');
        // Business data will be loaded by the auth state change listener
        return { error: null, data: authData };
      }

      return { data: authData };
    } catch (error) {
      console.error('💥 Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      return { error: { message: errorMessage }, data: undefined };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      console.log('🔓 Signing out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        return { error };
      }

      // Clear any pending business data
      persistentStorage.remove('pending_business');
      
      console.log('✅ Signed out successfully');
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

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      console.log('🔄 Sending password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/Beezee-App/auth/update-password`,
      });

      if (error) {
        console.error('❌ Password reset error:', error);
        return { error };
      }

      console.log('✅ Password reset email sent');
      return { error: null };
    } catch (error) {
      console.error('💥 Password reset error:', error);
      return { 
        error: { 
          message: 'Failed to send password reset email' 
        } 
      };
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      console.log('🔄 Updating password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('❌ Password update error:', error);
        return { error };
      }

      console.log('✅ Password updated successfully');
      return { error: null };
    } catch (error) {
      console.error('💥 Password update error:', error);
      return { 
        error: { 
          message: 'Failed to update password' 
        } 
      };
    }
  }, []);

  // Resend confirmation email
  const resendConfirmation = useCallback(async (email: string) => {
    try {
      console.log('🔄 Resending confirmation email to:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/Beezee-App/auth/callback`,
        },
      });

      if (error) {
        console.error('❌ Resend confirmation error:', error);
        return { error };
      }

      console.log('✅ Confirmation email resent');
      return { error: null };
    } catch (error) {
      console.error('💥 Resend confirmation error:', error);
      return { 
        error: { 
          message: 'Failed to resend confirmation email' 
        } 
      };
    }
  }, []);

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Session refresh error:', error);
        return;
      }

      console.log('✅ Session refreshed');
    } catch (error) {
      console.error('💥 Session refresh error:', error);
    }
  }, []);

  const value: SupabaseAuthContextType = {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    refreshSession,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    // Return a default empty state for pages outside the provider
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

// Helper function to get currency by country
function getCurrency(country: string): string {
  const currencies: Record<string, string> = {
    KE: 'KES',
    ZA: 'ZAR',
    NG: 'NGN',
    GH: 'GHS',
    UG: 'UGX',
    RW: 'RWF',
    TZ: 'TZS',
    CI: 'XOF',
  };
  return currencies[country] || 'KES';
}

