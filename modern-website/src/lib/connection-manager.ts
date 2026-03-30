import { db } from './database';
import { swManager } from './serviceWorker';
import { syncManager } from './sync-manager';
import { syncProcessor } from './sync-processor';

type ConnectionCallback = (isOnline: boolean) => void;

let listeners: ConnectionCallback[] = [];
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let checkInterval: NodeJS.Timeout | null = null;

/**
 * Test actual connectivity (not just device network)
 */
async function testConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('/manifest.json', {
      method: 'HEAD',
      cache: 'no-cache',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Set online state and notify listeners
 */
async function setOnline(online: boolean): Promise<void> {
  if (isOnline === online) return;
  
  isOnline = online;
  console.log(`[Network] State changed: ${online ? 'online' : 'offline'}`);
  
  // Notify service worker of offline status change
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({
        type: 'OFFLINE_STATUS',
        isOffline: !online
      });
      console.log(`[Network] 📡 Notified service worker: ${online ? 'ONLINE' : 'OFFLINE'}`);
    } catch (err) {
      console.warn('[Network] Could not notify service worker of status change:', err);
    }
  }
  
  // Notify all listeners
  listeners.forEach(listener => listener(online));
  
  // Trigger sync when coming online
  if (online) {
    await triggerSync();
  }
}

/**
 * Trigger sync of offline operations
 */
async function triggerSync(): Promise<void> {
  console.log('[Network] Connection restored, triggering sync through sync manager');
  
  // Use sync manager instead of direct sync processor calls
  await syncManager.requestSync('connection-restored');
}

/**
 * Start periodic connectivity check
 */
function startConnectivityCheck(): void {
  if (checkInterval) clearInterval(checkInterval);
  
  checkInterval = setInterval(async () => {
    const isActuallyOnline = await testConnectivity();
    if (isActuallyOnline !== isOnline) {
      await setOnline(isActuallyOnline);
    }
  }, 30000);
}

/**
 * Initialize connection monitoring
 */
export async function initConnectionMonitoring(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // Set up browser events
  window.addEventListener('online', async () => {
    const isActuallyOnline = await testConnectivity();
    await setOnline(isActuallyOnline);
  });
  
  window.addEventListener('offline', async () => {
    await setOnline(false);
  });
  
  // Start periodic checks
  startConnectivityCheck();
  
  // Initial check
  const initialStatus = await testConnectivity();
  await setOnline(initialStatus);
  
  // Service worker registration is now handled globally in BodyWrapper
  // Just set up background sync if SW is available
  if ('serviceWorker' in navigator) {
    // Try background sync but don't block
    swManager.registerBackgroundSync().catch(err => {
      console.warn('[Network] Background sync not available:', err);
    });
  }
  
  // Start automatic sync processor (runs every 10 seconds when online)
  syncProcessor.startAutoSync(10000);
  
  // Check for pending operations on startup
  const pendingCount = await db.getPendingCount(await getCurrentBusinessId());
  if (pendingCount > 0 && isOnline) {
    console.log(`[Network] Found ${pendingCount} pending operations on startup`);
    await syncManager.requestSync('startup-check');
  }
}

/**
 * Clean up connection monitoring
 */
export function cleanupConnectionMonitoring(): void {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
  
  // Stop sync processor
  syncProcessor.stopAutoSync();
  
  listeners = [];
}

/**
 * Register callback for connection changes
 */
export function onConnectionChange(callback: ConnectionCallback): () => void {
  listeners.push(callback);
  
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
}

/**
 * Get current online status
 */
export function getOnlineStatus(): boolean {
  return isOnline;
}

/**
 * Manual connectivity check
 */
export async function checkConnectivity(): Promise<boolean> {
  const status = await testConnectivity();
  await setOnline(status);
  return status;
}

/**
 * Get current business ID from localStorage
 */
async function getCurrentBusinessId(): Promise<string> {
  if (typeof window === 'undefined') return '';
  
  const auth = localStorage.getItem('beezee_unified_auth');
  if (auth) {
    try {
      const parsed = JSON.parse(auth);
      return parsed.businessId || '';
    } catch {
      return '';
    }
  }
  return '';
}