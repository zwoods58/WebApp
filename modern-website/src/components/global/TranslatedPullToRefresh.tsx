"use client";

import React from 'react';
import GlobalPullToRefresh from './GlobalPullToRefresh';
import { useLanguage } from '@/hooks/LanguageContext';

interface TranslatedPullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
}

/**
 * Wrapper around GlobalPullToRefresh that adds translation support
 * when used within a LanguageProvider context (e.g., in Beezee-App)
 */
export default function TranslatedPullToRefresh({
  children,
  onRefresh,
  threshold
}: TranslatedPullToRefreshProps) {
  // This component is only used where LanguageProvider exists
  const { t } = useLanguage();
  
  // We'll pass translated text as props to GlobalPullToRefresh in the future
  // For now, just render the base component
  return (
    <GlobalPullToRefresh onRefresh={onRefresh} threshold={threshold}>
      {children}
    </GlobalPullToRefresh>
  );
}
