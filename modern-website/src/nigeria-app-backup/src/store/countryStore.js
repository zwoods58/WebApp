import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { COUNTRIES, getCountryByCode, getCountryByDialCode, getCountryLanguages, getDefaultLanguage } from '../config/countries.js';
import { detectCountryFromPhone } from '../utils/phoneFormatter.js';

// Platform routing configuration
export const PLATFORM_CONFIG = {
  // Countries that require native apps (AMX integration)
  NATIVE_APP_COUNTRIES: ['KE', 'ZA'],

  // Countries that can use PWA
  PWA_COUNTRIES: ['NG'],

  // Platform detection
  requiresNativeApp: (countryCode) => {
    return ['KE', 'ZA'].includes(countryCode);
  },

  // Get app store URLs
  getAppStoreUrl: (countryCode) => {
    switch (countryCode) {
      case 'KE':
        return 'https://play.google.com/store/apps/details?id=com.beezee.kenya';
      case 'ZA':
        return 'https://play.google.com/store/apps/details?id=com.beezee.southafrica';
      default:
        return null;
    }
  },

  // Get platform name
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
    (set, get) => ({
      // Current active country - default to Nigeria for Nigeria app
      activeCountry: COUNTRIES.NG,

      // User's detected country (locked after registration)
      userCountry: null,

      // Whether country is locked (after registration)
      isCountryLocked: false,

      // Current language for the user - default to English for Nigeria
      currentLanguage: 'en',

      /**
       * Detect and set country from phone number
       * Only works if country is not locked
       */
      detectCountryFromPhone: (phoneNumber) => {
        const { isCountryLocked } = get();

        if (isCountryLocked) {
          console.warn('Country is locked, cannot change');
          return false;
        }

        const detectedCountry = detectCountryFromPhone(phoneNumber);

        if (detectedCountry) {
          set({
            activeCountry: detectedCountry,
            userCountry: detectedCountry.code,
            currentLanguage: detectedCountry.languages.find(lang => lang.default)?.code || 'en'
          });
          console.log(`Country detected: ${detectedCountry.name} (${detectedCountry.code})`);
          console.log(`Currency: ${detectedCountry.currency.symbol} ${detectedCountry.currency.code}`);
          console.log(`Default language: ${detectedCountry.languages.find(lang => lang.default)?.name || 'English'}`);
          return true;
        } else {
          console.warn('Unsupported country detected');
          set({ activeCountry: null, userCountry: null, currentLanguage: null });
          return false;
        }
      },

      /**
       * Set country manually (for testing or fallback)
       */
      setCountry: (countryCode) => {
        const { isCountryLocked } = get();

        if (isCountryLocked) {
          console.warn('Country is locked, cannot change');
          return false;
        }

        const country = getCountryByCode(countryCode);
        if (country) {
          set({
            activeCountry: country,
            userCountry: country.code,
            currentLanguage: country.languages.find(lang => lang.default)?.code || 'en'
          });
          console.log(`Country set manually: ${country.name}`);
          return true;
        } else {
          console.error('Invalid country code:', countryCode);
          return false;
        }
      },

      /**
       * Set language for the current country
       */
      setLanguage: (languageCode) => {
        const { activeCountry } = get();
        if (!activeCountry) {
          console.error('No active country set');
          return false;
        }

        const language = activeCountry.languages.find(lang => lang.code === languageCode);
        if (language) {
          set({ currentLanguage: languageCode });
          console.log(`Language set to: ${language.name} (${languageCode})`);
          return true;
        } else {
          console.error('Language not supported in current country:', languageCode);
          return false;
        }
      },

      /**
       * Get available languages for current country
       */
      getAvailableLanguages: () => {
        const { activeCountry } = get();
        return activeCountry?.languages || [];
      },

      /**
       * Get current language info
       */
      getCurrentLanguageInfo: () => {
        const { activeCountry, currentLanguage } = get();
        if (!activeCountry || !currentLanguage) return null;

        return activeCountry.languages.find(lang => lang.code === currentLanguage);
      },

      /**
       * Lock country (called after successful registration)
       */
      lockCountry: () => {
        const { userCountry } = get();

        if (!userCountry) {
          console.error('Cannot lock country - no country set');
          return false;
        }

        set({ isCountryLocked: true });
        console.log(`Country locked to: ${userCountry}`);
        return true;
      },

      /**
       * Unlock country (for testing only)
       */
      unlockCountry: () => {
        set({ isCountryLocked: false });
        console.log('Country unlocked');
      },

      /**
       * Reset country store
       */
      resetCountry: () => {
        set({
          activeCountry: null,
          userCountry: null,
          isCountryLocked: false
        });
        console.log('Country store reset');
      },

      /**
       * Get current country code
       */
      getCountryCode: () => {
        const { activeCountry } = get();
        return activeCountry?.code || null;
      },

      /**
       * Get current currency info
       */
      getCurrency: () => {
        const { activeCountry } = get();
        return activeCountry?.currency || null;
      },

      /**
       * Get pricing for a plan
       */
      getPricing: (planType) => {
        const { activeCountry } = get();
        if (!activeCountry || !activeCountry.pricing.plans[planType]) {
          return null;
        }

        return {
          ...activeCountry.pricing.plans[planType],
          billingCycle: activeCountry.pricing.billingCycle,
          trialDays: activeCountry.pricing.trialDays
        };
      },

      /**
       * Format currency amount
       */
      formatCurrency: (amount) => {
        const { activeCountry } = get();
        if (!activeCountry) {
          console.log('No active country, returning raw amount:', amount);
          return amount.toString();
        }

        const { currency, locale } = activeCountry;
        const formatted = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency.code,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(amount);

        console.log(`Formatting ${amount} as ${currency.code} using locale ${locale}: ${formatted}`);
        return formatted;
      },

      /**
       * Format date
       */
      formatDate: (date) => {
        const { activeCountry } = get();
        if (!activeCountry) return date.toLocaleDateString();

        return date.toLocaleDateString(activeCountry.locale);
      },

      /**
       * Format date with time
       */
      formatDateTime: (date) => {
        const { activeCountry } = get();
        if (!activeCountry) return date.toLocaleString();

        return date.toLocaleString(activeCountry.locale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },

      /**
       * Clear country store (for logout)
       */
      clearCountry: () => {
        set({
          activeCountry: null,
          userCountry: null,
          currentLanguage: null,
          isCountryLocked: false
        });
        console.log('Country store cleared');
      },

      /**
       * Get feature availability
       */
      hasFeature: (feature) => {
        const { activeCountry } = get();
        return activeCountry?.features?.[feature] || false;
      },

      /**
       * Check if current country requires native app
       */
      requiresNativeApp: () => {
        const { userCountry } = get();
        return PLATFORM_CONFIG.requiresNativeApp(userCountry);
      },

      /**
       * Get platform information for current country
       */
      getPlatformInfo: () => {
        const { userCountry } = get();
        return {
          requiresNativeApp: PLATFORM_CONFIG.requiresNativeApp(userCountry),
          platformName: PLATFORM_CONFIG.getPlatformName(userCountry),
          appStoreUrl: PLATFORM_CONFIG.getAppStoreUrl(userCountry),
          countryCode: userCountry
        };
      },

      /**
       * Redirect to appropriate platform
       */
      redirectToPlatform: () => {
        const { getPlatformInfo } = get();
        const platformInfo = getPlatformInfo();

        if (platformInfo.requiresNativeApp && platformInfo.appStoreUrl) {
          console.log(`Redirecting to native app: ${platformInfo.platformName}`);
          window.location.href = platformInfo.appStoreUrl;
          return true;
        }

        return false;
      }
    }),
    {
      name: 'beezee-ng-country-store', // Nigeria-specific storage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userCountry: state.userCountry,
        isCountryLocked: state.isCountryLocked,
        currentLanguage: state.currentLanguage
        // Don't persist activeCountry - it will be reconstructed from userCountry
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // If no userCountry is set, use the default country (Nigeria)
          if (!state.userCountry) {
            const defaultCountry = COUNTRIES.NG;
            state.activeCountry = defaultCountry;
            state.userCountry = defaultCountry.code;
            state.currentLanguage = defaultCountry.languages.find(lang => lang.default)?.code || 'en';
            console.log(`Country store initialized with default: ${defaultCountry.name}`);
          } else {
            // Reconstruct activeCountry from userCountry
            const country = getCountryByCode(state.userCountry);
            if (country) {
              state.activeCountry = country;
              // Ensure currentLanguage is valid for the country
              if (!state.currentLanguage || !country.languages.find(lang => lang.code === state.currentLanguage)) {
                state.currentLanguage = country.languages.find(lang => lang.default)?.code || 'en';
              }
              console.log(`Country store rehydrated: ${country.name}`);
              console.log(`Language restored: ${state.currentLanguage}`);
            }
          }
        }
      }
    }
  )
);

// Selector hooks for common use cases
export const useCurrentCountry = () => useCountryStore((state) => state.activeCountry);
export const useCountryCode = () => useCountryStore((state) => state.getCountryCode());
export const useCurrency = () => useCountryStore((state) => state.getCurrency());
export const useIsCountryLocked = () => useCountryStore((state) => state.isCountryLocked);
export const useAvailableLanguages = () => useCountryStore((state) => state.getAvailableLanguages());
export const useCurrentLanguage = () => useCountryStore((state) => state.currentLanguage);
export const useCurrentLanguageInfo = () => useCountryStore((state) => state.getCurrentLanguageInfo());
