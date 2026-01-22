import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { COUNTRIES, getCountryByCode, getCountryByDialCode, getCountryLanguages, getDefaultLanguage } from '../config/countries.js';
import { detectCountryFromPhone } from '../utils/phoneFormatter.js';
import { countryStorage } from '../utils/countryStorage';

// Platform routing configuration
export const PLATFORM_CONFIG = {
  // Countries that require native apps (AMX integration)
  NATIVE_APP_COUNTRIES: ['KE', 'ZA'],

  // Countries that can use PWA
  PWA_COUNTRIES: ['NG'],

  // Platform detection
  requiresNativeApp: (countryCode) => {
    return PLATFORM_CONFIG.NATIVE_APP_COUNTRIES.includes(countryCode);
  },

  // Get app store URLs
  getAppStoreUrl: (countryCode) => {
    switch (countryCode) {
      case 'KE':
        return 'https://play.google.com/store/apps/details?id=com.beezee.kenya';
      case 'ZA':
        return 'https://play.google.com/store/apps/details?id=com.beezee.southafrica';
      case 'NG':
        return null; // Nigeria uses PWA only
      default:
        return null;
    }
  },

  // Get platform names
  getPlatformName: (countryCode) => {
    switch (countryCode) {
      case 'KE':
        return 'BeeZee Kenya (Native App)';
      case 'ZA':
        return 'BeeZee South Africa (Native App)';
      case 'NG':
        return 'BeeZee Nigeria (Web App)';
      default:
        return 'BeeZee (Web App)';
    }
  }
};

export const useCountryStore = create(
  persist(
    (set) => ({
      // Current active country - default to Kenya for Kenya app
      activeCountry: COUNTRIES.KE,

      // User's detected country (locked after registration)
      userCountry: null,

      // Whether country is locked (after registration)
      isCountryLocked: false,

      // Current language for user
      currentLanguage: getDefaultLanguage(COUNTRIES.KE),

      /**
       * Set the active country
       */
      setActiveCountry: (country) => {
        set({ activeCountry: country, userCountry: country });
        countryStorage.setItem('activeCountry', country);
      },

      /**
       * Lock the country (after registration)
       */
      lockCountry: () => {
        set({ isCountryLocked: true });
      },

      /**
       * Set the current language
       */
      setLanguage: (languageCode) => {
        set({ currentLanguage: languageCode });
        countryStorage.setItem('currentLanguage', languageCode);
      },

      /**
       * Clear country data (for logout)
       */
      clearCountry: () => {
        set({ 
          activeCountry: null, 
          userCountry: null, 
          currentLanguage: getDefaultLanguage(COUNTRIES.KE),
          isCountryLocked: false 
        });
        countryStorage.clear();
      },

      /**
       * Get platform information for the current country
       */
      getPlatformInfo: () => {
        const countryCode = countryStorage.getCountryCode();
        return {
          platformName: PLATFORM_CONFIG.getPlatformName(countryCode),
          appStoreUrl: PLATFORM_CONFIG.getAppStoreUrl(countryCode),
          requiresNativeApp: PLATFORM_CONFIG.requiresNativeApp(countryCode)
        };
      },

      /**
       * Check if current country requires native app
       */
      requiresNativeApp: () => {
        const countryCode = countryStorage.getCountryCode();
        return PLATFORM_CONFIG.NATIVE_APP_COUNTRIES.includes(countryCode);
      },

      /**
       * Redirect to platform-specific app store
       */
      redirectToPlatform: () => {
        const platformInfo = getPlatformInfo();
        if (platformInfo?.appStoreUrl) {
          window.open(platformInfo.appStoreUrl, '_blank');
        }
      },

      /**
       * Detect and set country from phone number
       */
      detectCountryFromPhone: (phoneNumber) => {
        const detectedCountry = detectCountryFromPhone(phoneNumber);
        if (detectedCountry) {
          set({ activeCountry: detectedCountry, userCountry: detectedCountry });
          countryStorage.setItem('activeCountry', detectedCountry);
          return true;
        }
        return false;
      },
      /**
       * Get pricing for a plan
       */
      getPricing: (planType) => {
        const state = useCountryStore.getState();
        if (!state.activeCountry || !state.activeCountry.pricing.plans[planType]) {
          return null;
        }

        return {
          ...state.activeCountry.pricing.plans[planType],
          billingCycle: state.activeCountry.pricing.billingCycle,
          trialDays: state.activeCountry.pricing.trialDays
        };
      },

      /**
       * Format currency amount
       */
      formatCurrency: (amount) => {
        const state = useCountryStore.getState();
        if (!state.activeCountry) {
          return amount.toString();
        }

        const { currency, locale } = state.activeCountry;

        // Handle cases where amount might be a string
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return amount;

        try {
          return new Intl.NumberFormat(locale.number || 'en-KE', {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          }).format(numAmount);
        } catch (e) {
          return `${currency.symbol} ${numAmount}`;
        }
      },

      /**
       * Format date
       */
      formatDate: (date) => {
        const state = useCountryStore.getState();
        if (!date) return '';
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (!state.activeCountry) return dateObj.toLocaleDateString();

        try {
          return new Intl.DateTimeFormat(state.activeCountry.locale?.date || 'en-KE').format(dateObj);
        } catch (e) {
          return dateObj.toLocaleDateString();
        }
      },

    }),
    {
      name: `${countryStorage.getCountryCode()}_country-storage`, // Namespaced!
      storage: createJSONStorage(() => countryStorage), // Use custom storage
    }
  )
);

// Selector hooks for common use cases
export const useCurrentCountry = () => useCountryStore((state) => state.activeCountry);
export const useCountryCode = () => useCountryStore((state) => state.userCountry?.code || state.activeCountry?.code);
export const useCurrency = () => useCountryStore((state) => state.activeCountry?.currency);
export const useIsCountryLocked = () => useCountryStore((state) => state.isCountryLocked);
export const useAvailableLanguages = () => useCountryStore((state) => state.activeCountry?.languages || []);
export const useCurrentLanguage = () => useCountryStore((state) => state.currentLanguage);
export const useCurrentLanguageInfo = () => useCountryStore((state) => {
  const { activeCountry, currentLanguage } = state;
  if (!activeCountry || !currentLanguage) return null;
  return activeCountry.languages.find(lang => lang.code === currentLanguage);
});
