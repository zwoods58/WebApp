'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';

export default function BeezeeAppRoot() {
  const router = useRouter();
  const { isAuthenticated, user, loading } = useUnifiedAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirect authenticated users to their dashboard
        const country = user.country || 'kenya';
        const industry = user.industry || 'retail';
        router.replace(`/Beezee-App/app/${country}/${industry}`);
      } else {
        // Redirect unauthenticated users to login
        router.replace('/Beezee-App/auth/login');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Show splash screen while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#4A8DB8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">Loading BeeZee...</p>
      </div>
    </div>
  );
}
