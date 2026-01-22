import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { useCountryStore, useAvailableLanguages, useCurrentLanguage } from '../store/countryStore.js';
import toast from 'react-hot-toast';

export default function LanguageSelector() {
  const { user } = useAuthStore();
  const { i18n, t } = useTranslation();
  const { setLanguage } = useCountryStore();
  const availableLanguages = useAvailableLanguages();
  const currentLanguage = useCurrentLanguage();
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState(currentLanguage || i18n.language || 'en');

  // Fallback to English if no languages available
  const languagesToShow = availableLanguages.length > 0 
    ? availableLanguages 
    : [{ code: 'en', name: 'English', default: true }];

  useEffect(() => {
    setValue(currentLanguage || i18n.language || 'en');
  }, [currentLanguage, i18n.language]);

  const handleChange = async (lang) => {
    setValue(lang);
    
    // Update country store language
    setLanguage(lang);
    
    // Update i18next
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    document.documentElement.lang = lang;
    
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ preferred_language: lang })
        .eq('id', user.id);
      if (error) throw error;
      toast.success(t('settings.languageSaved', 'Language saved'));
    } catch (error) {
      console.error('Error saving language:', error);
      toast.error(t('settings.languageSaveFailed', 'Failed to save language'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-language">
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {t('settings.language', 'Language')}
      </label>
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={saving}
        className="description-input"
      >
        {languagesToShow.map((lang) => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
    </div>
  );
}

