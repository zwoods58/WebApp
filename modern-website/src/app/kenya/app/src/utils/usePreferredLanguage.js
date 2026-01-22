import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { supabase } from './supabase';

export function usePreferredLanguage() {
  const { user } = useAuthStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('preferred_language')
        .eq('id', user.id)
        .maybeSingle();
      if (error && Object.keys(error).length > 0) {
        console.warn('Failed to load preferred language', error);
        return;
      }
      if (data?.preferred_language) {
        if (i18n && typeof i18n.changeLanguage === 'function') {
          i18n.changeLanguage(data.preferred_language);
        }
        localStorage.setItem('i18nextLng', data.preferred_language);
        document.documentElement.lang = data.preferred_language;
      }

    };
    load();
  }, [user, i18n]);
}

