"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface Business {
  id: string;
  phone: string;
  businessName: string;
  country: string;
  industry: string;
  settings?: Record<string, any>;
  isActive?: boolean;
}

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refreshBusiness: () => void;
  logout: () => void;
  businessId?: string; // Add businessId for easy access
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBusinessFromAuth = useCallback((): Business | null => {
    try {
      // Try to get business data from authentication context
      const sessionData = localStorage.getItem('sessionData');
      if (!sessionData) return null;

      const authData = JSON.parse(sessionData);
      if (!authData.businessId) return null;

      const businessData: Business = {
        id: authData.businessId,
        phone: authData.phone || '',
        businessName: authData.businessName || 'My Business',
        country: authData.country || 'KE',
        industry: authData.industry || 'retail',
        settings: authData.settings || {},
        isActive: authData.isActive ?? true
      };

      return businessData;
    } catch (err) {
      console.error('Failed to load business from auth data:', err);
      return null;
    }
  }, []);

  const fetchBusinessFromDatabase = useCallback(async (phone: string): Promise<Business | null> => {
    try {
      const { data, error: dbError } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('phone_number', phone)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no results

      if (dbError) {
        console.error('Error fetching business from database:', dbError);
        return null;
      }

      if (!data) return null;

      const businessData: Business = {
        id: data.id,
        phone: data.phone_number,
        businessName: data.business_name,
        country: data.country,
        industry: data.industry,
        settings: data.settings || {},
        isActive: data.is_active ?? true
      };

      return businessData;
    } catch (err) {
      console.error('Failed to fetch business from database:', err);
      return null;
    }
  }, []);

  const syncBusinessData = useCallback(async () => {
    const authBusiness = loadBusinessFromAuth();
    
    if (!authBusiness) {
      setLoading(false);
      return;
    }

    setBusiness(authBusiness);
    setLoading(false);

    if (authBusiness.phone) {
      const dbBusiness = await fetchBusinessFromDatabase(authBusiness.phone);
      
      if (dbBusiness && JSON.stringify(dbBusiness) !== JSON.stringify(authBusiness)) {
        console.log('Business data updated from database');
        setBusiness(dbBusiness);
        
        // Update session data with fresh business info
        const sessionData = localStorage.getItem('sessionData');
        if (sessionData) {
          try {
            const authData = JSON.parse(sessionData);
            authData.businessId = dbBusiness.id;
            authData.phone = dbBusiness.phone;
            authData.businessName = dbBusiness.businessName;
            authData.country = dbBusiness.country;
            authData.industry = dbBusiness.industry;
            authData.settings = dbBusiness.settings;
            authData.isActive = dbBusiness.isActive;
            localStorage.setItem('sessionData', JSON.stringify(authData));
          } catch (err) {
            console.error('Failed to update session data:', err);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    syncBusinessData();
  }, []);

  const refreshBusiness = useCallback(() => {
    setLoading(true);
    syncBusinessData();
  }, []);

  const logout = useCallback(() => {
    // Clear session data and business-related storage
    localStorage.removeItem('sessionData');
    localStorage.removeItem('beezee_business_auth');
    localStorage.removeItem('beezee_signup_data');
    localStorage.removeItem('beezee_user_data');
    sessionStorage.clear();
    setBusiness(null);
    setError(null);
    console.log('User logged out and auth data cleared');
  }, []);

  const isAuthenticated = business !== null;

  return (
    <BusinessContext.Provider
      value={{
        business,
        loading,
        error,
        isAuthenticated,
        refreshBusiness,
        logout,
        businessId: business?.id
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within BusinessProvider');
  }
  return context;
}
