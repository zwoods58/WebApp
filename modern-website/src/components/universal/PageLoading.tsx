'use client';

import React from 'react';

interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function PageLoading({ 
  message = 'Loading...', 
  fullScreen = false 
}: PageLoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Simple Logo/Icon */}
      <div className="relative">
        <div className="w-12 h-12 bg-[var(--powder-light)]/30 rounded-2xl flex items-center justify-center text-[var(--powder-dark)] animate-pulse">
          <span className="text-xl font-bold">BZ</span>
        </div>
        {/* Loading dots around the logo */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--powder-dark)] rounded-full animate-bounce animation-delay-0"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[var(--powder-dark)] rounded-full animate-bounce animation-delay-150"></div>
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-[var(--powder-dark)] rounded-full animate-bounce animation-delay-300"></div>
      </div>

      {/* Loading Message */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-[var(--text-2)]">
          {message}
        </p>
        
        {/* Loading Dots */}
        <div className="flex justify-center gap-1">
          <div className="w-1.5 h-1.5 bg-[var(--powder-dark)] rounded-full animate-bounce-dot animation-delay-0"></div>
          <div className="w-1.5 h-1.5 bg-[var(--powder-dark)] rounded-full animate-bounce-dot animation-delay-150"></div>
          <div className="w-1.5 h-1.5 bg-[var(--powder-dark)] rounded-full animate-bounce-dot animation-delay-300"></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[var(--bg)] flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      {content}
    </div>
  );
}

// Quick inline loading spinner for buttons/forms
export function InlineLoading({ size = 'small' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6', 
    large: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-[var(--powder-dark)]/20 border-t-[var(--powder-dark)] rounded-full animate-spin`} />
  );
}

// Minimal loading bar for page transitions
export function PageLoadingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[var(--bg2)] z-50">
      <div className="h-full bg-[var(--powder-dark)] animate-slide-in-right" 
           style={{
             width: '30%',
             animation: 'slidePulse 1.5s ease-in-out infinite'
           }}>
      </div>
    </div>
  );
}
