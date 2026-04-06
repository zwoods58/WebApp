// Extend ServiceWorkerRegistration to include sync API
interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  sync?: SyncManager;
}

export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ExtendedServiceWorkerRegistration | null = null;
  
  private constructor() {}
  
  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }
  
  async register(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return false;
    }
    
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('[SW] ✅ Registered with scope:', this.registration.scope);
      console.log('[SW] 📍 Current page:', window.location.pathname);
      console.log('[SW] 🎮 Controller exists:', !!navigator.serviceWorker.controller);
      
      // Wait for controller to be available
      if (!navigator.serviceWorker.controller) {
        console.log('[SW] ⏳ Waiting for controller...');
        await new Promise<void>((resolve) => {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[SW] ✅ Controller now active!');
            resolve();
          }, { once: true });
          // Timeout after 5 seconds
          setTimeout(() => resolve(), 5000);
        });
      }
      
      // Enhanced update detection
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        console.log('[SW] Update found! New worker installing...');
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('[SW] New worker state:', newWorker.state);
            
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW] ✅ New version ready to activate');
              this.notifyUpdateAvailable();
            }
          });
        }
      });
      
      // Also check immediately if update is already waiting
      if (this.registration.waiting && navigator.serviceWorker.controller) {
        console.log('[SW] Update already waiting on registration');
        this.notifyUpdateAvailable();
      }
      
      return true;
    } catch (error: unknown) {
      console.error('[SW] Registration failed:', error);
      return false;
    }
  }
  
  async registerBackgroundSync(): Promise<boolean> {
    if (!this.registration || !('sync' in this.registration)) {
      // Background Sync is optional - only supported in Chrome/Edge
      console.debug('[SW] Background Sync not available (optional feature)');
      return false;
    }
    
    try {
      await this.registration.sync!.register('beezee-offline-sync');
      console.log('[SW] Background sync registered');
      return true;
    } catch (error: unknown) {
      console.error('[SW] Background sync failed:', error);
      return false;
    }
  }
  
  async triggerSync(): Promise<void> {
    if (this.registration && 'sync' in this.registration && this.registration.sync) {
      await this.registration.sync.register('beezee-offline-sync');
    }
  }
  
  private notifyUpdateAvailable(): void {
    console.log('[SW] Dispatching update available event');
    
    // Get current version from API for accurate version reporting
    this.getCurrentVersion().then(currentVersion => {
      window.dispatchEvent(new CustomEvent('sw-update-available', {
        detail: { 
          timestamp: Date.now(),
          version: currentVersion
        }
      }));
    }).catch(() => {
      // Fallback to static version if API fails
      window.dispatchEvent(new CustomEvent('sw-update-available', {
        detail: { 
          timestamp: Date.now(),
          version: 'v108'
        }
      }));
    });
  }
  
  private async getCurrentVersion(): Promise<string> {
    try {
      const response = await fetch('/api/version-check');
      const data = await response.json();
      return data.cleanVersion || 'v108';
    } catch (error) {
      console.warn('[SW] Failed to get current version:', error);
      return 'v108';
    }
  }
  
  getState(): string | null {
    return navigator.serviceWorker.controller?.state || null;
  }
  
  async notifyUserRoutes(country: string, industry: string): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({
        type: 'CACHE_USER_ROUTES',
        country: country.toLowerCase(),
        industry: industry.toLowerCase()
      });
      console.log('[SW] Notified service worker to cache user routes:', { country, industry });
    } catch (error) {
      console.error('[SW] Failed to notify service worker:', error);
    }
  }
}

export const swManager = ServiceWorkerManager.getInstance();

// Helper function for notifying service worker about user routes
export async function notifyServiceWorker(country: string, industry: string): Promise<void> {
  await swManager.notifyUserRoutes(country, industry);
}
