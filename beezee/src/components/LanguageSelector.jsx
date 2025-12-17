import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'zu', label: 'isiZulu' },
  { code: 'xh', label: 'isiXhosa' },
  { code: 'st', label: 'Sesotho' },
  { code: 'tn', label: 'Setswana' },
  { code: 'nso', label: 'Sepedi' },
  { code: 'nr', label: 'isiNdebele' },
  { code: 'ss', label: 'siSwati' },
  { code: 've', label: 'Tshivenda' },
  { code: 'ts', label: 'Xitsonga' },
];

export default function LanguageSelector() {
  const { user } = useAuthStore();
  const { i18n, t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState(i18n.language || 'en');

  useEffect(() => {
    setValue(i18n.language || 'en');
  }, [i18n.language]);

  const handleChange = async (lang) => {
    setValue(lang);
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
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
}

