'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import SplashScreen from '@/components/SplashScreen';

export default function BeezeeAppRoot() {
  const router = useRouter();
  const { loading } = useUnifiedAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    // Direct redirection to the universal entry point
    router.replace('/Beezee-App/auth/get-started');
  }, [mounted, loading, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}
