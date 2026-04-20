"use client";

import { ReactNode } from 'react';
import Image from 'next/image';
import { QueryProvider } from '@/providers/QueryProvider';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryProvider>
      <SupabaseAuthProvider>
        <div className="auth-layout min-h-full bg-[var(--bg)] text-[var(--text-1)] flex flex-col">
      {/* Header logo - consistent across all auth pages */}
      <div className="flex justify-center items-center pt-12 pb-1 flex-shrink-0">
        <div className="relative">
          <Image
            src="/beezee-icon-192x192.png"
            alt="BeeZee Icon"
            width={100}
            height={100}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>
      </div>
      
      {/* Page content — allow natural growth & scroll */}
      <div className="flex-1">
        {children}
      </div>
    </div>
      </SupabaseAuthProvider>
    </QueryProvider>
  );
}

