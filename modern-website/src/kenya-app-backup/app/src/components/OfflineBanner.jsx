import { WifiOff } from 'lucide-react';
import { announceToScreenReader } from '../utils/accessibility';
import { useOfflineStore } from '../store/offlineStore';

/**
 * Offline Banner Component
 * Shows when user is offline with sync status
 */
export default function OfflineBanner({ pendingCountOverride = null }) {
  const { isOnline, syncPending } = useOfflineStore();

  if (isOnline) {
    return null;
  }

  announceToScreenReader('You are now offline. Changes will sync when connected.', 'assertive');
  const pendingCount = pendingCountOverride ?? (syncPending ? 1 : 0);

  return (
    <div
      className="offline-banner"
      role="alert"
      aria-live="assertive"
      aria-label="Offline status"
    >
      <div className="offline-banner-content">
        <WifiOff 
          size={20} 
          className="offline-banner-icon animate-pulse" 
          aria-hidden="true"
        />
        <div className="offline-banner-text">
          <span className="offline-banner-title">You're offline</span>
          {pendingCount > 0 && (
            <span className="offline-banner-subtitle">
              {pendingCount} item{pendingCount !== 1 ? 's' : ''} waiting to sync
            </span>
          )}
          {pendingCount === 0 && (
            <span className="offline-banner-subtitle">
              Changes will sync when connected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}



