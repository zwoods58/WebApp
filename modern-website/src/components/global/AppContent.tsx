"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import BottomNav from '@/components/universal/BottomNav';

interface AppContentProps {
  children: React.ReactNode;
}

export default function AppContent({ children }: AppContentProps) {
  const pathname = usePathname();
  
  // Extract country and industry from pathname
  const pathMatch = pathname.match(/\/Beezee-App\/app\/([^\/]+)\/([^\/]+)/);
  const country = pathMatch?.[1] || '';
  const industry = pathMatch?.[2] || '';

  // Debug logging
  console.log('AppContent Debug:', { pathname, country, industry, pathMatch });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {children}
      {/* Always show BottomNav for debugging - remove country/industry check temporarily */}
      <BottomNav industry={industry || 'retail'} country={country || 'nigeria'} />
    </div>
  );
}
