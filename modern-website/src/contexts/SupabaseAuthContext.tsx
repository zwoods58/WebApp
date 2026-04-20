"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { setBusinessContext } from '@/lib/supabaseContext';
import { persistentStorage } from '@/utils/persistentStorage';

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

export interface SubscriptionData {
  status: 'active' | 'inactive' | 'cancelled' | 'failed';
  isActive: boolean;
  expiresAt: string | null;
  daysRemaining: number;
}

export interface SupabaseAuthState {
  user: any | null;
  business: Business | null;
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isEmailConfirmed: boolean;
  isReadOnly: boolean;
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

  // Load subscription data from businesses table (NOT subscriptions table)
  const loadSubscriptionData = useCallback(async (supabaseUserId: string): Promise<SubscriptionData | null> => {
    try {
      const { data: business, error } = await supabase
        .from('businesses')
        .select('subscription_status, subscription_expires_at')
        .eq('supabase_user_id', supabaseUserId)
        .single();

      if (error || !business) {
        console.error('❌ Error loading subscription data:', error);
        return null;
      }

      const now = new Date();
      const expiresAt = business.subscription_expires_at
        ? new Date(business.subscription_expires_at)
        : null;

      const isActive =
        business.subscription_status === 'active' &&
        expiresAt !== null &&
        expiresAt > now;

      const daysRemaining = expiresAt
        ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

      return {
        status: isActive ? 'active' : (business.subscription_status ?? 'inactive'),
        isActive,
        expiresAt: business.subscription_expires_at ?? null,
        daysRemaining,
      };
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔍 Initializing Supabase auth...');

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          setAuthState(prev => ({ ...prev, loading: false, error: sessionError.message }));
          return;
        }

        if (session?.user) {
          console.log('✅ Found existing session:', session.user.email);

          const isConfirmed = session.user.email_confirmed_at != null;
          const business = await loadBusinessData(session.user.id);
          const subscription = await loadSubscriptionData(session.user.id);
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
  }, [loadBusinessData, loadSubscriptionData]);

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
        setAuthState(prev => ({ ...prev, loading: false, error: signUpError.message }));
        return { error: signUpError };
      }

      if (authData.user) {
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
            subscription_status: 'inactive',
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
        persistentStorage.set('pending_business', business, { backup: true });

        const hasLiveSession = !!authData.session;

        if (hasLiveSession) {
          const isConfirmed = !!authData.user.email_confirmed_at;

          setAuthState({
            user: authData.user,
            business,
            subscription: {
              status: 'inactive',
              isActive: false,
              expiresAt: null,
              daysRemaining: 0,
            },
            loading: false,
            error: null,
            isAuthenticated: true,
            isEmailConfirmed: isConfirmed,
            isReadOnly: false,
          });

          if (business) {
            await setBusinessContext(business.id, business.country, business.industry);
          }
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }

        return {
          error: null,
          data: {
            user: authData.user,
            business,
            session: authData.session,
            requiresEmailConfirmation: !hasLiveSession,
            message: hasLiveSession
              ? 'Account created successfully!'
              : 'Account created! Please check your email to confirm your account.',
          },
        };
      }

      const silentError = new Error('Signup failed silently.');
      setAuthState(prev => ({ ...prev, loading: false, error: silentError.message }));
      return { error: silentError, data: undefined };
    } catch (error) {
      console.error('💥 Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: { message: errorMessage }, data: undefined };
    }
  }, []);

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
        setAuthState(prev => ({ ...prev, loading: false, error: signInError.message }));
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
            error: { message: 'Please confirm your email address before signing in.' },
            data: undefined
          };
        }

        console.log('✅ Sign in successful');
        setAuthState(prev => ({ ...prev, loading: true }));
        return { error: null, data: authData };
      }

      return { data: authData };
    } catch (error) {
      console.error('💥 Sign in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setAuthState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return { error: { message: errorMessage }, data: undefined };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('🔓 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) return { error };
      persistentStorage.remove('pending_business');
      console.log('✅ Signed out successfully');
      return { error: null };
    } catch (error) {
      console.error('💥 Sign out error:', error);
      return { error: { message: 'Failed to sign out' } };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/Beezee-App/auth/update-password`,
      });
      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to send password reset email' } };
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to update password' } };
    }
  }, []);

  const resendConfirmation = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/Beezee-App/auth/callback`,
        },
      });
      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to resend confirmation email' } };
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      await supabase.auth.refreshSession();
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