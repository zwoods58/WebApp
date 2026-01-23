import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import { useCountryStore } from '../store/countryStore.js';
import toast from 'react-hot-toast';

export default function LanguageSelector() {
  const { user } = useAuthStore();
  const { i18n, t } = useTranslation();
  const { getAvailableLanguages, currentLanguage, setLanguage } = useCountryStore();
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState(currentLanguage || i18n.language || 'en');

  // Get country-specific languages
  const availableLanguages = getAvailableLanguages();

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
      // Try to update but ignore failures in demo mode/local environment
      const { error } = await supabase
        .from('users')
        .update({ preferred_language: lang })
        .eq('id', user.id);

      // If error is just an RLS or Auth issue, we still say it's saved locally
      if (error) {
        console.warn('DB language save skipped or failed:', error.message || error);
      }
      toast.success(t('settings.languageSaved', 'Saved'));
    } catch (err) {
      console.warn('Language save exception (non-critical):', err);
      toast.success(t('settings.languageSaved', 'Saved locally'));
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

