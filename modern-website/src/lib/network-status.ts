/**
 * Simple network status utility
 * Uses browser's native online/offline detection
 */

export function getNetworkStatus(): boolean {
  return typeof window !== 'undefined' ? navigator.onLine : true;
}

export function isOffline(): boolean {
  return !getNetworkStatus();
}

/**
 * Fast connectivity check for sync operations
 * Uses browser's native online/offline detection
 * Follows the architecture: NO Google favicon tests (slow, CORS issues)
 */
export async function testInternetConnectivity(): Promise<boolean> {
  return typeof window !== 'undefined' ? navigator.onLine : true;
}
