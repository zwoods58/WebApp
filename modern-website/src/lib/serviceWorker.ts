// Simplified Service Worker functions - next-pwa-pack handles everything
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    console.log('[PWA] Service worker managed by next-pwa-pack');
    // The actual registration happens in PWAProvider
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
}

// Legacy exports for backward compatibility
export function notifyServiceWorker(country: string, industry: string): Promise<void> {
  console.log('[PWA] Service worker communication handled by next-pwa-pack');
  return Promise.resolve();
}

