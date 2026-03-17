"use client";

import React from 'react';
import { RefreshProvider } from '@/contexts/RefreshContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <RefreshProvider>
      {children}
    </RefreshProvider>
  );
}
