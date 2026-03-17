import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { setBusinessContext } from '@/lib/supabaseContext';

export interface UserData {
  id: string;
  phone_number: string;
  business_name: string;
  country: string;
  default_industry?: string;
  daily_target?: number;
  currency?: string;
  auth_method: string;
  created_at?: string;
  updated_at?: string;
  business?: {
    id: string;
    business_name: string;
    country: string;
    industry: string;
    settings: any;
  };
}

export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  session: any | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true, // Start with loading true to prevent race conditions
    error: null,
    isAuthenticated: false,
    session: null,
  });

  // Supported countries configuration
  const SUPPORTED_COUNTRIES = {
    ke: { code: '+254', name: 'Kenya', digits: 9, total: 12 },
    za: { code: '+27', name: 'South Africa', digits: 9, total: 11 },
    ng: { code: '+234', name: 'Nigeria', digits: 10, total: 13 },
    gh: { code: '+233', name: 'Ghana', digits: 9, total: 12 },
    ug: { code: '+256', name: 'Uganda', digits: 9, total: 12 },
    rw: { code: '+250', name: 'Rwanda', digits: 9, total: 12 },
    tz: { code: '+255', name: 'Tanzania', digits: 9, total: 12 }
  };

  // Validate phone for supported countries only
  const validatePhone = (phone: string): { valid: boolean; country?: string } => {
    for (const [key, config] of Object.entries(SUPPORTED_COUNTRIES)) {
      const regex = new RegExp(`^\\${config.code}\\d{${config.digits}}$`);
      if (regex.test(phone)) {
        return { valid: true, country: key };
      }
    }
    return { valid: false };
  };

  // Check for existing session on mount (localStorage only)
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      console.log('🔍 Checking for existing business session...');
      
      // First, let's see what's in localStorage before cleaning up
      console.log('📦 Current localStorage items:', {
        beezee_business_auth: localStorage.getItem('beezee_business_auth'),
        beezee_direct_auth: localStorage.getItem('beezee_direct_auth'),
        sessionData: localStorage.getItem('sessionData'),
        userProfile: localStorage.getItem('userProfile'),
        beezee_simple_auth: localStorage.getItem('beezee_simple_auth')
      });
      
      // Clean up conflicting auth data first
      localStorage.removeItem('beezee_direct_auth');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('beezee_simple_auth');
      
      // Check for stored business authentication data
      const storedAuthData = localStorage.getItem('beezee_business_auth');
      console.log('📦 Raw stored auth data:', storedAuthData);
      
      if (storedAuthData) {
        try {
          const authData = JSON.parse(storedAuthData);
          console.log('✅ Found stored business authentication:', authData.business?.business_name);
          console.log('🔍 Full auth data structure:', authData);
          
          // Validate the stored data structure before using it
          if (authData.business && authData.session && authData.business.id) {
            // Set business context for RLS policies
            try {
              await setBusinessContext(
                authData.business.id, 
                authData.business.country, 
                authData.business.industry
              );
            } catch (contextError) {
              console.error('⚠️ Failed to set business context on session restore:', contextError);
            }

            // Restore auth state from stored business data
            const userData: UserData = {
              id: authData.business.id,
              phone_number: authData.session.phone,
              business_name: authData.business.business_name,
              country: authData.business.country,
              default_industry: authData.business.industry,
              auth_method: 'phone_direct',
              business: authData.business
            };
            
            console.log('🔄 Setting auth state with user data:', userData);
            
            setAuthState({
              user: userData,
              loading: false,
              error: null,
              isAuthenticated: true,
              session: authData.session,
            });
            return;
          } else {
            console.error('❌ Invalid stored auth data structure:', {
              hasBusiness: !!authData.business,
              hasSession: !!authData.session,
              hasBusinessId: !!authData.business?.id
            });
            localStorage.removeItem('beezee_business_auth');
          }
        } catch (parseError) {
          console.error('❌ Failed to parse stored business auth data:', parseError);
          localStorage.removeItem('beezee_business_auth');
        }
      }
      
      console.log('🔓 No existing business session found');
      setAuthState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        session: null,
      });
    } catch (error) {
      console.error('💥 Error checking business session:', error);
      setAuthState({
        user: null,
        loading: false,
        error: 'Failed to check authentication status',
        isAuthenticated: false,
        session: null,
      });
    }
  };

  const signInDirect = async (phone: string) => {
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
      const { data: business, error } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('phone_number', phone)
        .single();

      if (error || !business) {
        console.log('❌ No business found for phone:', phone);
        return { 
          error: { 
            message: 'Business not found. Please sign up first.' 
          } 
        };
      }

      console.log('✅ Found business:', business);

      // Set business context for RLS policies
      try {
        await setBusinessContext(business.id, business.country, business.industry);
      } catch (contextError) {
        console.error('⚠️ Failed to set business context, but continuing:', contextError);
      }

      // Create simple session data - no user concept needed
      const sessionData = {
        businessId: business.id,
        businessName: business.business_name,
        country: business.country,
        industry: business.industry,
        phone: phone
      };

      // Store simple authentication data
      const authData = {
        business: business,
        session: sessionData
      };

      localStorage.setItem('beezee_business_auth', JSON.stringify(authData));

      // Set auth state with business data
      const userData: UserData = {
        id: business.id,
        phone_number: phone,
        business_name: business.business_name,
        country: business.country,
        default_industry: business.industry,
        auth_method: 'phone_direct',
        business: business
      };

      setAuthState({
        user: userData,
        loading: false,
        error: null,
        isAuthenticated: true,
        session: sessionData,
      });

      return { 
        error: null, 
        data: { 
          message: 'Access granted successfully!',
          business: authData.business
        } 
      };

    } catch (error) {
      console.error('💥 Sign-in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Sign-in failed. Please try again later.';
      
      setAuthState({
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
  };

  const signOut = async () => {
    try {
      console.log('🔓 Signing out...');
      
      // Clear stored business authentication data
      localStorage.removeItem('beezee_business_auth');
      
      // Also clear any old auth data for completeness
      localStorage.removeItem('beezee_direct_auth');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('beezee_simple_auth');
      
      // Reset state
      setAuthState({
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
  };

  const refreshUserData = async () => {
    // Mock implementation - no database connection
    console.log('🔄 Mock refresh user data');
    return;
  };

  return {
    ...authState,
    signInDirect,
    signOut,
    refreshUserData,
    validatePhone,
  };
}
