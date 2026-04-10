'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import smartTranslate from '../translations/smart-translation';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  t: (key: string, defaultText?: string, vars?: Record<string, any>) => string;
  isRTL: boolean;
  supportedLanguages: string[];
  nativeNames: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
  industry?: string;
  country?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, industry = 'retail', country }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const supportedLanguages = ['en', 'sw', 'ha', 'yo', 'ig', 'zu', 'xh', 'af', 'tw', 'rw', 'lg', 'fr', 'dy'];
  
  const nativeNames: Record<string, string> = {
    en: 'English',
    sw: 'Kiswahili',
    ha: 'Hausa',
    yo: 'Yorùbá',
    ig: 'Igbo',
    zu: 'isiZulu',
    xh: 'isiXhosa',
    af: 'Afrikaans',
    tw: 'Twi',
    rw: 'Kinyarwanda',
    lg: 'Luganda',
    fr: 'Français',
    dy: 'Diouula'
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('beezee_language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else if (!savedLanguage && country) {
      // Set default language based on country
      const countryDefaults: Record<string, string> = {
        'CI': 'fr', // Côte d'Ivoire defaults to French
        'KE': 'en',
        'NG': 'en',
        'GH': 'en',
        'UG': 'en',
        'RW': 'en',
        'TZ': 'en',
        'ZA': 'en'
      };
      const defaultLang = countryDefaults[country] || 'en';
      setCurrentLanguage(defaultLang);
      localStorage.setItem('beezee_language', defaultLang);
    }
  }, [country]);

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setCurrentLanguage(lang);
      localStorage.setItem('beezee_language', lang);
    }
  };

  const t = (key: string, defaultText?: string, vars?: Record<string, any>) => {
    return smartTranslate(key, currentLanguage, industry, defaultText, vars);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        setLanguage, 
        t, 
        isRTL: false, 
        supportedLanguages,
        nativeNames 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
