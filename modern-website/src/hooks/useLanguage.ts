"use client";

import React, { useContext, useState, useEffect } from 'react';
import smartTranslate from '@/translations/smart-translation';

interface LanguageContextType {
  t: (key: string, defaultText?: string, vars?: Record<string, any>) => string;
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback implementation if context is not available
    return {
      t: (key: string, defaultText?: string, vars?: Record<string, any>) => {
        // Try to get current language from localStorage or default to 'en'
        const language = typeof window !== 'undefined' 
          ? localStorage.getItem('beezee_language') || 'en'
          : 'en';
        
        // Get industry from localStorage or default to 'retail'
        const industry = typeof window !== 'undefined' 
          ? localStorage.getItem('beezee_industry') || 'retail'
          : 'retail';
        
        return smartTranslate(key, language, industry, defaultText, vars);
      },
      language: 'en',
      setLanguage: () => {}
    };
  }
  return context;
}

export function LanguageProvider({ 
  children, 
  industry = 'retail', 
  country = 'ke' 
}: { 
  children: React.ReactNode; 
  industry?: string; 
  country?: string; 
}) {
  const [language, setLanguage] = React.useState(() => {
    if (typeof window !== 'undefined') {
      // Determine language from country
      const countryLanguageMap: Record<string, string> = {
        'ke': 'en',
        'ng': 'en',
        'gh': 'en',
        'tz': 'sw',
        'ug': 'en',
        'rw': 'en',
        'ci': 'fr',
        'za': 'en'
      };
      
      return localStorage.getItem('beezee_language') || countryLanguageMap[country.toLowerCase()] || 'en';
    }
    return 'en';
  });

  const t = (key: string, defaultText?: string, vars?: Record<string, any>) => {
    return smartTranslate(key, language, industry, defaultText, vars);
  };

  const handleSetLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('beezee_language', newLanguage);
    }
  };

  const value: LanguageContextType = {
    t,
    language,
    setLanguage: handleSetLanguage
  };

  return React.createElement(
    LanguageContext.Provider,
    { value },
    children
  );
}


