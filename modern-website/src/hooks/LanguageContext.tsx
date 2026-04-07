'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import smartTranslate from '../translations/smart-translation.js';

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
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, industry = 'retail' }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Debug: Log industry parameter
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('LanguageContext Debug - Industry parameter:', industry);
    }
  }, [industry]);

  const supportedLanguages = ['en', 'sw', 'ha', 'yo', 'ig', 'zu', 'xh', 'af', 'tw', 'rw', 'lg'];
  
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
    lg: 'Luganda'
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('beezee_language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setCurrentLanguage(lang);
      localStorage.setItem('beezee_language', lang);
    }
  };

  const t = (key: string, defaultText?: string, vars?: Record<string, any>) => {
    // Debug: Log industry parameter for appointment keys
    if (key.startsWith('appointments.') && process.env.NODE_ENV === 'development') {
      console.log('Translation Debug:', { key, language: currentLanguage, industry, defaultText });
    }
    
    const result = smartTranslate(key, currentLanguage, industry, defaultText, vars);
    
    // Debug: Log result for appointment keys
    if (key.startsWith('appointments.') && process.env.NODE_ENV === 'development') {
      console.log('Translation Result:', result);
    }
    
    return result;
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
