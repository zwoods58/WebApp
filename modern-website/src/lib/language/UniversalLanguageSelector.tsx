'use client'

import { useState } from 'react'
import { useLanguage } from './useLanguage'
import { COUNTRIES } from '@/lib/utils/countries'

interface UniversalLanguageSelectorProps {
  onLanguageChange?: (locale: string) => void
  className?: string
}

export default function UniversalLanguageSelector({ 
  onLanguageChange, 
  className = '' 
}: UniversalLanguageSelectorProps) {
  const { locale, setLocale, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageSelect = (newLocale: string) => {
    setLocale(newLocale as any)
    onLanguageChange?.(newLocale)
    setIsOpen(false)
  }

  // Get unique locales from countries
  const availableLocales = Array.from(new Set(COUNTRIES.map(c => c.locale)))
    .sort()

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
      >
        <span>{locale.toUpperCase()}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-50">
          <div className="py-1">
            {availableLocales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLanguageSelect(loc)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  locale === loc ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{loc.toUpperCase()}</span>
                  {locale === loc && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
