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
 * Test actual internet connectivity (for critical operations)
 */
export async function testInternetConnectivity(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch('https://www.google.com/favicon.ico', {
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
