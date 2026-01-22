import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, WifiOff, CloudOff, XCircle } from 'lucide-react';
import { announceToScreenReader } from '../utils/accessibility';

/**
 * Enhanced Error State Component
 * Shows errors with retry logic and exponential backoff
 */
export default function ErrorState({
  type = 'generic',
  title,
  message,
  onRetry,
  onDismiss,
  retryCount = 0,
  maxRetries = 3,
  showRetry = true,
  showDismiss = true,
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryDelay, setRetryDelay] = useState(0);

  useEffect(() => {
    if (retryCount > 0 && retryCount < maxRetries) {
      // Calculate exponential backoff delay
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 30000);
      setRetryDelay(Math.ceil(delay / 1000));
      
      const interval = setInterval(() => {
        setRetryDelay(prev => Math.max(0, prev - 1));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [retryCount, maxRetries]);

  const handleRetry = async () => {
    if (isRetrying || retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    announceToScreenReader('Retrying...', 'polite');
    
    try {
      if (onRetry) {
        await onRetry();
      }
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'network':
        return <WifiOff size={64} className="text-warning-coral" />;
      case 'server':
        return <CloudOff size={64} className="text-warning-coral" />;
      case 'generic':
      default:
        return <AlertCircle size={64} className="text-warning-coral" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Lost';
      case 'server':
        return 'Server Error';
      default:
        return 'Something Went Wrong';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'network':
        return "Couldn't connect to the server. Don't worry - your data is safe. We'll try again automatically.";
      case 'server':
        return 'The server is having trouble right now. Please try again in a moment.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const canRetry = retryCount < maxRetries && showRetry;
  const retryText = retryDelay > 0 
    ? `Retry in ${retryDelay}s`
    : isRetrying 
    ? 'Retrying...'
    : 'Try Again';

  return (
    <div 
      className="error-state"
      role="alert"
      aria-live="assertive"
    >
      <div className="error-state-icon">
        {getIcon()}
      </div>
      
      <h2 className="error-state-title">
        {title || getDefaultTitle()}
      </h2>
      
      <p className="error-state-message">
        {message || getDefaultMessage()}
      </p>

      {retryCount > 0 && retryCount < maxRetries && (
        <div className="error-state-retry-info">
          <span>Attempt {retryCount} of {maxRetries}</span>
        </div>
      )}

      {retryCount >= maxRetries && (
        <div className="error-state-max-retries">
          <XCircle size={20} />
          <span>Maximum retry attempts reached</span>
        </div>
      )}

      <div className="error-state-actions">
        {canRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying || retryDelay > 0}
            className="error-state-retry-button"
            aria-label={retryText}
          >
            {isRetrying ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <RefreshCw size={20} />
            )}
            {retryText}
          </button>
        )}
        
        {showDismiss && onDismiss && (
          <button
            onClick={onDismiss}
            className="error-state-dismiss-button"
            aria-label="Dismiss error"
          >
            Continue Offline
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Network Error Modal Component
 * Enhanced modal with better styling and animations
 */
export function NetworkErrorModal({ isOpen, onRetry, onContinueOffline, retryCount = 0 }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onContinueOffline} aria-hidden="true" />
      <div className="confirmation-modal network-error-modal" role="dialog" aria-modal="true" aria-labelledby="network-error-title">
        <div className="network-error-icon-container">
          <WifiOff size={64} className="network-error-icon" />
        </div>
        <h2 id="network-error-title" className="confirmation-title">Oops!</h2>
        <p className="confirmation-description">
          Couldn't connect to the server.
          <br />
          Don't worry - your data is safe.
          <br />
          We'll try again automatically.
        </p>
        <div className="confirmation-actions">
          <button
            onClick={onRetry}
            className="confirmation-button"
            aria-label="Try Again Now"
            disabled={retryCount >= 3}
          >
            <RefreshCw size={20} className={retryCount > 0 ? "animate-spin" : ""} />
            {retryCount > 0 ? `Retrying... (${retryCount}/3)` : 'Try Again Now'}
          </button>
          <button
            onClick={onContinueOffline}
            className="confirmation-button cancel-button"
            aria-label="Continue Offline"
          >
            Continue Offline
          </button>
        </div>
      </div>
    </>
  );
}

