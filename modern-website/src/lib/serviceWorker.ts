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
        scope: '/'
      });
      
      console.log('[SW] Registered with scope:', this.registration.scope);
      
      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.notifyUpdateAvailable();
            }
          });
        }
      });
      
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
    // Dispatch event for UI
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  }
  
  getState(): string | null {
    return navigator.serviceWorker.controller?.state || null;
  }
}

export const swManager = ServiceWorkerManager.getInstance();
