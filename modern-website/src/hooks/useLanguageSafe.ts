import { useLanguage } from '@/hooks/LanguageContext';

/**
 * Hook that safely uses useLanguage with fallback for components
 * that might be used outside of LanguageProvider (e.g., landing pages)
 */
export const useLanguageSafe = () => {
  try {
    return useLanguage();
  } catch (error) {
    return {
      t: (key: string, fallback?: string) => fallback || key,
      currentLanguage: 'en',
      setLanguage: () => {},
      availableLanguages: ['en']
    };
  }
};
