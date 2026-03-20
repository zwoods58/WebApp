"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SignupData } from '@/types/signup';
import { storage, BackgroundSyncManager } from '@/utils/performance';
import { getCurrency, getCountryConfig } from '@/utils/currency';

interface BusinessProfileContextType {
  profile: SignupData | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<SignupData>) => void;
  setProfile: (profile: SignupData) => void;
  clearProfile: () => void;
  syncToBackend: () => Promise<void>;
  syncProfileWithBusiness: (business: any) => void;
  isDataReady: boolean;
  businessId: string | null;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | undefined>(undefined);

interface BusinessProfileProviderProps {
  children: ReactNode;
}

export function BusinessProfileProvider({ children }: BusinessProfileProviderProps) {
  const [profile, setProfileState] = useState<SignupData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataReady, setIsDataReady] = useState(false);
  const syncManager = BackgroundSyncManager.getInstance();

  // Load profile from localStorage on mount
  useEffect(() => {
    const startTime = performance.now();
    
    try {
      const savedProfile = storage.getSignupData();
      if (savedProfile) {
        setProfileState(savedProfile);
        setIsDataReady(true);
      }
    } catch (error) {
      console.warn('Error loading profile:', error);
    } finally {
      setIsLoading(false);
      
      // Measure performance
      const loadTime = performance.now() - startTime;
      console.log(`Profile load time: ${loadTime.toFixed(2)}ms`);
    }
  }, []);

  // Update profile with performance optimization
  const updateProfile = (updates: Partial<SignupData>) => {
    if (!profile) return;

    const updatedProfile = { ...profile, ...updates };
    setProfileState(updatedProfile);
    
    // Instant localStorage save for performance
    storage.setSignupData(updatedProfile);
    
    // Queue background sync
    syncManager.addSyncOperation(async () => {
      await syncToBackend(updatedProfile);
    });
  };

  // Set complete profile
  const setProfile = (newProfile: SignupData) => {
    // Ensure currency is set based on country
    if (newProfile.country && !newProfile.currency) {
      newProfile.currency = getCurrency(newProfile.country);
    }

    // Set performance flags
    newProfile.isDataSynced = false;
    newProfile.lastSyncTime = Date.now();

    setProfileState(newProfile);
    setIsDataReady(true);
    
    // Instant localStorage save
    storage.setSignupData(newProfile);
    
    // Queue background sync
    syncManager.addSyncOperation(async () => {
      await syncToBackend(newProfile);
    });
  };

  // Clear profile
  const clearProfile = () => {
    setProfileState(null);
    setIsDataReady(false);
    storage.clearSignupData();
  };

  // Sync profile with business settings from auth context
  const syncProfileWithBusiness = (business: any) => {
    if (!business || !profile) return;

    const updatedProfile = {
      ...profile,
      dailyTarget: business.settings?.daily_target || profile.dailyTarget,
      businessId: business.id,
      businessName: business.business_name,
      country: business.country,
      industry: business.industry,
      currency: business.home_currency || profile.currency
    };

    console.log('Syncing profile with business settings:', {
      businessDailyTarget: business.settings?.daily_target,
      profileDailyTarget: profile.dailyTarget,
      updatedDailyTarget: updatedProfile.dailyTarget
    });

    setProfileState(updatedProfile);
    storage.setSignupData(updatedProfile);
  };

  // Sync to backend (placeholder for future Supabase integration)
  const syncToBackend = async (profileData?: SignupData): Promise<void> => {
    const dataToSync = profileData || profile;
    if (!dataToSync) return;

    try {
      // Future Supabase integration will go here
      console.log('Syncing profile to backend:', dataToSync);
      
      // Simulate backend sync delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mark as synced
      const syncedProfile = { ...dataToSync, isDataSynced: true, lastSyncTime: Date.now() };
      setProfileState(syncedProfile);
      storage.setSignupData(syncedProfile);
      
    } catch (error) {
      console.warn('Backend sync failed:', error);
    }
  };

  // Get country-specific helper
  const getCountryInfo = () => {
    if (!profile?.country) return null;
    return getCountryConfig(profile.country);
  };

  const value: BusinessProfileContextType = {
    profile,
    isLoading,
    updateProfile,
    setProfile,
    clearProfile,
    syncToBackend: () => syncToBackend(),
    syncProfileWithBusiness,
    isDataReady,
    businessId: profile?.businessId || null
  };

  return (
    <BusinessProfileContext.Provider value={value}>
      {children}
    </BusinessProfileContext.Provider>
  );
}

export function useBusinessProfile() {
  const context = useContext(BusinessProfileContext);
  if (context === undefined) {
    throw new Error('useBusinessProfile must be used within a BusinessProfileProvider');
  }
  return context;
}

// Helper hook for country-specific data
export function useCountryData() {
  const { profile } = useBusinessProfile();
  
  if (!profile?.country) return null;
  
  return getCountryConfig(profile.country);
}

// Helper hook for currency formatting
export function useCurrency() {
  const { profile } = useBusinessProfile();
  
  if (!profile?.country) return null;
  
  return {
    currency: profile.currency,
    symbol: getCountryConfig(profile.country).currencySymbol,
    formatAmount: (amount: number) => {
      const symbol = getCountryConfig(profile.country).currencySymbol;
      return `${symbol} ${amount.toLocaleString()}`;
    }
  };
}
