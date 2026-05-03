'use client'

import { useState, useEffect } from 'react'
import type { SupportedLocale } from '@/types'

const DEFAULT_LOCALE: SupportedLocale = 'en'

interface LanguageState {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  t: (key: string, params?: Record<string, string>) => string
}

// Simple translation function (replace with actual translation system)
const translations: Record<SupportedLocale, Record<string, string>> = {
  en: {
    'welcome': 'Welcome',
    'dashboard': 'Dashboard',
    'appointments': 'Appointments',
    'cash': 'Cash',
    'credit': 'Credit',
    'more': 'More',
    'settings': 'Settings',
    'logout': 'Logout',
  },
  sw: {
    'welcome': 'Karibu',
    'dashboard': 'Dashibodi',
    'appointments': 'Miadi',
    'cash': 'Pesa',
    'credit': 'Mikopo',
    'more': 'Zaidi',
    'settings': 'Mipangilio',
    'logout': 'Toka',
  },
  rw: {
    'welcome': 'Murakaza neza',
    'dashboard': 'Ibihindagishika',
    'appointments': 'Amahugurwa',
    'cash': 'Amafaranga',
    'credit': 'Inguzanyo',
    'more': 'Ibindi',
    'settings': 'Igenamiterere',
    'logout': 'Gusohoka',
  },
  fr: {
    'welcome': 'Bienvenue',
    'dashboard': 'Tableau de bord',
    'appointments': 'Rendez-vous',
    'cash': 'Espèces',
    'credit': 'Crédit',
    'more': 'Plus',
    'settings': 'Paramètres',
    'logout': 'Déconnexion',
  },
  so: {
    'welcome': 'Soo dhawoow',
    'dashboard': 'Dashboard',
    'appointments': 'Ballan',
    'cash': 'Lacag',
    'credit': 'Dayactir',
    'more': 'Dheeraad',
    'settings': 'Goobaha',
    'logout': 'Ka tago',
  },
  pt: {
    'welcome': 'Bem-vindo',
    'dashboard': 'Painel',
    'appointments': 'Compromissos',
    'cash': 'Dinheiro',
    'credit': 'Crédito',
    'more': 'Mais',
    'settings': 'Configurações',
    'logout': 'Sair',
  },
}

export function useLanguage(): LanguageState {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE)

  useEffect(() => {
    // Get locale from localStorage or browser
    const saved = localStorage.getItem('beezee-locale') as SupportedLocale
    if (saved && translations[saved]) {
      setLocaleState(saved)
    } else {
      // Get from browser
      const browserLang = navigator.language.split('-')[0] as SupportedLocale
      if (translations[browserLang]) {
        setLocaleState(browserLang)
      }
    }
  }, [])

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale)
    localStorage.setItem('beezee-locale', newLocale)
  }

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[locale]?.[key] || translations[DEFAULT_LOCALE]?.[key] || key

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value)
      })
    }

    return translation
  }

  return {
    locale,
    setLocale,
    t,
  }
}
