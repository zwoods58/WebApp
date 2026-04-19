'use client';

// This page handles the redirect from Supabase after a user clicks
// the email confirmation link. Supabase appends a code or token to
// the URL. This page exchanges that code for a live session.
//
// After exchange, onAuthStateChange in SupabaseAuthContext fires SIGNED_IN,
// which loads business data and sets isAuthenticated: true.
// Then we redirect to the dashboard.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase automatically reads the token from the URL hash/query
      // when getSession() is called. This completes the PKCE flow.
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('[AuthCallback] Session exchange error:', error);
        router.replace('/Beezee-App/auth/login?error=confirmation_failed');
        return;
      }

      if (session) {
        // Session established. onAuthStateChange will fire SIGNED_IN
        // in SupabaseAuthContext, which loads business data automatically.
        // Redirect to the app root — let routing logic handle country/industry.
        console.log('[AuthCallback] Session confirmed, redirecting to app...');

        // Read cached country/industry from localStorage set during signup
        let destination = '/Beezee-App/app';
        try {
          const cached = localStorage.getItem('beezee_user_data');
          if (cached) {
            const { country, industry } = JSON.parse(cached);
            if (country && industry) {
              destination = `/Beezee-App/app/${country.toLowerCase()}/${industry.toLowerCase()}`;
            }
          }
        } catch {
          // Ignore parse errors, use default destination
        }

        router.replace(destination);
      } else {
        // No session after exchange — token may be expired or already used
        console.warn('[AuthCallback] No session after exchange');
        router.replace('/Beezee-App/auth/login?error=link_expired');
      }
    };

    handleCallback();
  }, [router]);

  // Show spinner while the session exchange is happening
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-[var(--powder-dark)] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[var(--text-3)]">Confirming your account...</p>
    </div>
  );
}
