'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/hooks/LanguageContext';

interface UniversalLanguageSelectorProps {
  industry?: string;
  country?: string;
  className?: string;
  showFlag?: boolean;
  compact?: boolean;
}

const UniversalLanguageSelector: React.FC<UniversalLanguageSelectorProps> = ({
  industry,
  country,
  className = '',
  showFlag = true,
  compact = false
}) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<Array<{
    code: string;
    name: string;
    nativeName: string;
    flag?: string;
  }>>([]);
  const [dropdownPosition, setDropdownPosition] = useState<'right' | 'left'>('right');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get available languages for the current country
    const getCountryLanguages = () => {
      const countryLanguages: Record<string, Array<{ code: string; name: string; nativeName: string; flag?: string }>> = {
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
        ]
      };

      return countryLanguages[country || 'KE'] || countryLanguages['KE'];
    };

    setAvailableLanguages(getCountryLanguages());
  }, [country]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check viewport and adjust dropdown position
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const dropdownWidth = compact ? 150 : 200;
      const windowWidth = window.innerWidth;
      
      // If dropdown would go off the right edge, align to left
      if (rect.right + dropdownWidth > windowWidth) {
        setDropdownPosition('left');
      } else {
        setDropdownPosition('right');
      }
    }
  }, [isOpen, compact]);

  const currentLangObj = availableLanguages.find(lang => lang.code === currentLanguage);

  if (compact) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--powder)]/10 transition-colors w-full"
        >
          {showFlag && currentLangObj?.flag && <span className="text-xl">{currentLangObj.flag}</span>}
          <Globe size={16} className="text-[var(--text-2)]" />
          <span className="text-base font-bold text-[var(--text-1)]">{currentLangObj?.nativeName}</span>
        </button>

        {isOpen && (
          <div className={`absolute ${dropdownPosition === 'right' ? 'right-0' : 'left-0'} top-full mt-1 glass-strong border border-[var(--border)] rounded-lg shadow-float-lg z-[9999] min-w-[200px] max-w-[90vw]`}>
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-[var(--powder)]/10 transition-colors ${
                  currentLanguage === lang.code ? 'bg-[var(--powder)]/20 text-[var(--powder-dark)]' : 'text-[var(--text-1)]'
                }`}
              >
                {showFlag && <span className="text-xl">{lang.flag}</span>}
                <div className="flex-1">
                  <div className="text-base font-bold">{lang.nativeName}</div>
                  <div className="text-xs text-[var(--text-3)]">{lang.name}</div>
                </div>
                {currentLanguage === lang.code && (
                  <div className="w-2 h-2 bg-[var(--powder-dark)] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {showFlag && currentLangObj?.flag && (
          <span className="text-2xl">{currentLangObj.flag}</span>
        )}
        <div className="text-left">
          <div className="text-lg font-bold text-gray-900">{currentLangObj?.nativeName}</div>
          <div className="text-sm text-gray-500">{currentLangObj?.name}</div>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute ${dropdownPosition === 'right' ? 'right-0' : 'left-0'} top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-[250px] max-w-[90vw] max-h-64 overflow-y-auto`}>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-[var(--powder)]/10 transition-colors ${
                currentLanguage === lang.code ? 'bg-[var(--powder)]/20 text-[var(--powder-dark)]' : 'text-gray-700'
              }`}
            >
              {showFlag && <span className="text-2xl">{lang.flag}</span>}
              <div className="flex-1">
                <div className="text-lg font-bold">{lang.nativeName}</div>
                <div className="text-sm text-gray-500">{lang.name}</div>
              </div>
              {currentLanguage === lang.code && (
                <div className="w-2 h-2 bg-[var(--powder-dark)] rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversalLanguageSelector;
