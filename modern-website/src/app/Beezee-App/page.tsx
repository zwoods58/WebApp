'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import SplashScreen from '@/components/SplashScreen';

export default function BeezeeAppRoot() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useUnifiedAuth();
  const [splashDone, setSplashDone] = useState(false);

  // Called by SplashScreen once the animation finishes (or skipped)
  const handleSplashFinish = () => {
    setSplashDone(true);
  };

  useEffect(() => {
    // Wait for both the splash to finish AND auth state to resolve
    if (!splashDone || loading) return;

    if (isAuthenticated && user) {
      // Authenticated → go straight to dashboard
      const country = user.country || 'kenya';
      const industry = user.industry || 'retail';
      router.replace(`/Beezee-App/app/${country}/${industry}`);
    } else {
      // Not authenticated → show the Get Started onboarding page
      router.replace('/Beezee-App/get-started');
    }
  }, [splashDone, isAuthenticated, user, loading, router]);

  return (
    <>
      {/* Splash screen handles its own show/skip logic via sessionStorage */}
      <SplashScreen onFinish={handleSplashFinish} />

      {/* Fallback background while redirecting after splash */}
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[var(--powder-dark)]/30 border-t-[var(--powder-dark)] rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </>
  );
}
