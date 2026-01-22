import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full text-center">
            <AlertCircle className="w-16 h-16 text-danger-500 mx-auto mb-4" />
            <h1 className="text-h2 font-bold text-neutral-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-body text-neutral-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn btn-primary"
            >
              Reload Page
            </button>
            <div className="mt-4 text-small text-neutral-500">
              <p>If this persists, check:</p>
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Browser console for errors (F12)</li>
                <li>Environment variables are set</li>
                <li>All dependencies are installed</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


