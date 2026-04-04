'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a hydration error (#418)
    if (error.message?.includes('418') || error.message?.includes('hydration')) {
      return { hasError: true, error };
    }
    return { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Hydration error caught:', error);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI for hydration failures
      return this.props.fallback || (
        <div className="p-4 text-center">
          <p className="text-red-600">Something went wrong loading this component.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
