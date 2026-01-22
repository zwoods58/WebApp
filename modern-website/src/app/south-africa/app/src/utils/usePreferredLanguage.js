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

      // South Africa Demo Mode Bypass
      if (user.id === 'demo-user-sa' || localStorage.getItem('beezee_za_demo_data')) {
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('preferred_language')
        .eq('id', user.id)
        .maybeSingle();
      if (error) {
        console.error('Failed to load preferred language', error);
        return;
      }
      if (data?.preferred_language) {
        i18n.changeLanguage(data.preferred_language);
        localStorage.setItem('i18nextLng', data.preferred_language);
        document.documentElement.lang = data.preferred_language;
      }
    };
    load();
  }, [user, i18n]);
}

