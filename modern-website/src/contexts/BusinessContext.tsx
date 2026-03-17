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
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBusinessFromStorage = useCallback((): Business | null => {
    try {
      const storedAuthData = localStorage.getItem('beezee_business_auth');
      if (!storedAuthData) return null;

      const authData = JSON.parse(storedAuthData);
      if (!authData.business || !authData.business.id) return null;

      const businessData: Business = {
        id: authData.business.id,
        phone: authData.session?.phone || authData.business.phone_number || '',
        businessName: authData.business.business_name || 'My Business',
        country: authData.business.country || 'KE',
        industry: authData.business.industry || 'retail',
        settings: authData.business.settings || {},
        isActive: authData.business.is_active ?? true
      };

      return businessData;
    } catch (err) {
      console.error('Failed to load business from storage:', err);
      return null;
    }
  }, []);

  const fetchBusinessFromDatabase = useCallback(async (phone: string): Promise<Business | null> => {
    try {
      const { data, error: dbError } = await supabaseAdmin
        .from('businesses')
        .select('*')
        .eq('phone_number', phone)
        .single();

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
    const storedBusiness = loadBusinessFromStorage();
    
    if (!storedBusiness) {
      setLoading(false);
      return;
    }

    setBusiness(storedBusiness);
    setLoading(false);

    if (storedBusiness.phone) {
      const dbBusiness = await fetchBusinessFromDatabase(storedBusiness.phone);
      
      if (dbBusiness && JSON.stringify(dbBusiness) !== JSON.stringify(storedBusiness)) {
        console.log('Business data updated from database');
        setBusiness(dbBusiness);
        
        const storedAuthData = localStorage.getItem('beezee_business_auth');
        if (storedAuthData) {
          try {
            const authData = JSON.parse(storedAuthData);
            authData.business = {
              id: dbBusiness.id,
              phone_number: dbBusiness.phone,
              business_name: dbBusiness.businessName,
              country: dbBusiness.country,
              industry: dbBusiness.industry,
              settings: dbBusiness.settings,
              is_active: dbBusiness.isActive
            };
            localStorage.setItem('beezee_business_auth', JSON.stringify(authData));
          } catch (err) {
            console.error('Failed to update localStorage:', err);
          }
        }
      }
    }
  }, [loadBusinessFromStorage, fetchBusinessFromDatabase]);

  useEffect(() => {
    syncBusinessData();
  }, [syncBusinessData]);

  const refreshBusiness = useCallback(() => {
    setLoading(true);
    syncBusinessData();
  }, [syncBusinessData]);

  const logout = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    setBusiness(null);
    setError(null);
    console.log('User logged out and all storage cleared');
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
        logout
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
