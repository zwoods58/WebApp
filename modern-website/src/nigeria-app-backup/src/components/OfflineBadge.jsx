import { useOfflineStore } from '../store/offlineStore';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBadge() {
  const { isOnline, syncPending, unsyncedCount } = useOfflineStore();

  if (isOnline && !syncPending && unsyncedCount === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <WifiOff size={16} />
          <span className="text-sm font-medium">Offline</span>
        </div>
      )}

      {syncPending && (
        <div className="bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 mt-2">
          <RefreshCw size={16} className="animate-spin" />
          <span className="text-sm font-medium">Syncing...</span>
        </div>
      )}

      {unsyncedCount > 0 && isOnline && !syncPending && (
        <div className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 mt-2">
          <span className="text-sm font-medium">
            {unsyncedCount} unsynced transaction{unsyncedCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}


