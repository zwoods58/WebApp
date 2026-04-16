"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Store, Utensils, Car, Scissors, Ruler, Wrench, Laptop, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/LanguageContext';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { useToastContext } from '@/providers/ToastProvider';
import { useBusinessProfile } from '@/contexts/BusinessProfileContext';

interface HeaderProps {
  industry: string;
  country: string;
}

export default function Header({ industry, country }: HeaderProps) {
  const router = useRouter();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [showLangSelector, setShowLangSelector] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { business } = useUnifiedAuth();
  const { profile } = useBusinessProfile();
  const { showInfo } = useToastContext();
  
  // Get industry labels using translation keys
  const getIndustryLabel = (industryKey: string) => {
    const translations = {
      retail: t('retail.title'),
      food: t('food.title'), 
      transport: t('transport.title'),
      salon: t('salon.title'),
      tailor: t('tailor.title'),
      repairs: t('repairs.title'),
      freelance: t('freelance.title')
    };
    return translations[industryKey as keyof typeof translations] || 'Business';
  };

  const industryIcons = {
    retail: Store,
    food: Utensils,
    transport: Car,
    salon: Scissors,
    tailor: Ruler,
    repairs: Wrench,
    freelance: Laptop
  };
  
  const IndustryIcon = industryIcons[industry as keyof typeof industryIcons] || Store;
  const industryName = getIndustryLabel(industry);

  // Get business name from signup data or fallback
  const businessName = profile?.businessName || business?.business_name || 'My Business';

  // Check if we're on the home dashboard
  const pathname = usePathname();
  const isHomeDashboard = pathname?.endsWith(`/${country}/${industry}`) || pathname?.endsWith(`/${country}/${industry}/`);

  // Available languages for the current country
  const getCountryLanguages = () => {
    const countryLanguages: Record<string, Array<{ code: string; name: string; nativeName: string; flag: string }>> = {
      'KE': [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
        { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' }
      ],
      'ZA': [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
        { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flag: '🇿🇦' },
        { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦' },
        { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', flag: '🇿🇦' }
      ],
      'NG': [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
        { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
        { code: 'ig', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
        { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' }
      ],
      'GH': [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇭' },
        { code: 'tw', name: 'Twi', nativeName: 'Twi', flag: '🇬🇭' }
      ],
      'UG': [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇬' },
        { code: 'lg', name: 'Luganda', nativeName: 'Luganda', flag: '🇺🇬' }
      ],
      'RW': [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇷🇼' },
        { code: 'rw', name: 'Kinyarwanda', nativeName: 'Kinyarwanda', flag: '🇷🇼' }
      ],
      'TZ': [
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇹🇿' },
        { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿' }
      ],
      'CI': [
        { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇨🇮' },
        { code: 'dy', name: 'Dioula', nativeName: 'Diouula', flag: '🇨🇮' },
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇨🇮' }
      ]
    };

    // Convert country to uppercase for proper matching
    const upperCountry = (country || '').toUpperCase();
    return countryLanguages[upperCountry] || [{ code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' }];
  };

  const availableLanguages = getCountryLanguages();
  const currentLangObj = availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];

  // Helper function to get translated language name
  const getLanguageName = (langCode: string) => {
    const languageKeyMap: Record<string, string> = {
      'en': 'lang.english',
      'sw': 'lang.swahili',
      'ha': 'lang.hausa',
      'yo': 'lang.yoruba',
      'ig': 'lang.igbo',
      'zu': 'lang.zulu',
      'xh': 'lang.xhosa',
      'af': 'lang.afrikaans',
      'tw': 'lang.twi',
      'rw': 'lang.kinyarwanda',
      'lg': 'lang.luganda',
      'fr': 'lang.french',
      'dy': 'lang.dioula'
    };
    
    const key = languageKeyMap[langCode] || `lang.${langCode}`;
    return t(key, langCode.charAt(0).toUpperCase() + langCode.slice(1)); // Fallback to capitalized code
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangSelector(false);
      }
    };

    if (showLangSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangSelector]);

  return (
    <>
      <header className="relative top-0 left-0 right-0 z-[60] bg-[var(--bg)] safe-area-top">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
          {/* Back Button - Hidden on home dashboard */}
          {!isHomeDashboard && (
            <button
              onClick={() => router.back()}
              className="p-2.5 -ml-2 rounded-xl hover:bg-[var(--powder)]/10 active:scale-95 transition-all duration-200 no-select button-touch flex items-center text-[var(--powder-dark)]"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
          )}

          {/* Title Area */}
          <div className={`flex items-center justify-center pointer-events-none ${!isHomeDashboard ? 'flex-1' : ''}`}>
            <IndustryIcon size={20} className="text-[var(--text-1)] mr-2" strokeWidth={2.5} />
            {isHomeDashboard && (
              <span className="text-[var(--text-1)] font-medium text-sm">
                {businessName}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => {
                setShowLangSelector(!showLangSelector);
              }}
              className="p-2.5 -mr-2 rounded-xl hover:bg-[var(--powder)]/10 active:scale-95 transition-all duration-200 no-select button-touch text-[var(--powder)]"
            >
              <Globe size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Language Selector Dropdown */}
      {showLangSelector && (
        <div className="fixed inset-0 z-[70] flex items-start justify-end pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden min-w-[200px] animate-fade-in">
            <div className="py-1">
              <div className="px-3 py-2 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('language.select')}
                </h3>
              </div>
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangSelector(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                    currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{getLanguageName(lang.code)}</div>
                    <div className="text-xs text-gray-500">{lang.nativeName}</div>
                  </div>
                  {currentLanguage === lang.code && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
    </>
  );
}
