"use client";

import { ReactNode } from 'react';
import Image from 'next/image';
import { QueryProvider } from '@/providers/QueryProvider';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="auth-layout h-screen bg-[var(--bg)] text-[var(--text-1)] flex flex-col overflow-hidden">
      {/* Header logo - consistent across all auth pages */}
      <div className="flex justify-center items-center pt-16 pb-1 flex-shrink-0">
        <div className="relative">
          <Image
            src="/beezee-icon-192x192.png"
            alt="BeeZee Icon"
            width={120}
            height={120}
            className="rounded-xl shadow-lg"
            priority
          />
        </div>
      </div>
      
      {/* Page content */}
      <div className="flex-1 min-h-0">
        {children}
      </div>
    </div>
    </QueryProvider>
  );
}

