"use client";

import React from 'react';
import { RefreshProvider } from '@/contexts/RefreshContext';
import { UnifiedAuthProvider } from '@/contexts/UnifiedAuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import SplashScreen from '@/components/SplashScreen';

interface AppLayoutProps {
  children: React.ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-studio-white">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-diffusion">
        <h2 className="text-xl font-bold text-obsidian mb-4">Something went wrong</h2>
        <p className="text-ghost-gray mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="w-full px-4 py-2 bg-system-blue text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UnifiedAuthProvider>
        <RefreshProvider>
          <SplashScreen />
          {children}
        </RefreshProvider>
      </UnifiedAuthProvider>
    </ErrorBoundary>
  );
}
