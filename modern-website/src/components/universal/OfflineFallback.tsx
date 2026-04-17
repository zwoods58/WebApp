import React from 'react';

interface OfflineFallbackProps {
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

/**
 * Fallback component shown when offline and no cached data is available
 * Provides clear user feedback and retry mechanism
 */
export function OfflineFallback({ 
  message = "No cached data available offline",
  showRetry = true,
  onRetry
}: OfflineFallbackProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="text-6xl mb-4">📡</div>
      <h2 className="text-xl font-semibold mb-2 text-[var(--text)]">You're Offline</h2>
      <p className="text-[var(--text-secondary)] mb-4 max-w-md">
        {message}
      </p>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Please connect to the internet to load this page.
      </p>
      {showRetry && (
        <button 
          onClick={handleRetry}
          className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          Retry
        </button>
      )}
    </div>
  );
}

export default OfflineFallback;

