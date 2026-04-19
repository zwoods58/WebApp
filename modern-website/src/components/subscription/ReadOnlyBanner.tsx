'use client';

import React from 'react';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { AlertTriangle, Lock, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const ReadOnlyBanner: React.FC = () => {
  const { isReadOnly, subscription } = useUnifiedAuth();
  const router = useRouter();

  if (!isReadOnly) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-3 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-[100] animate-in slide-in-from-top duration-500">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm md:text-base">
            Account in Read-Only Mode
          </p>
          <p className="text-xs text-white/80">
            Subscription expired or payment failed. You can view data but cannot make new entries.
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => router.push('/subscription')}
        className="flex items-center gap-2 bg-white text-red-600 px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm"
      >
        <RefreshCcw className="w-4 h-4" />
        Reactivate Subscription
      </button>
    </div>
  );
};
