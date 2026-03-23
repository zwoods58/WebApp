// Client-side offline fallback script
// This provides additional offline support when service worker is not available

(function() {
  'use strict';

  // Environment detection
  const getEnvironment = () => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isNetworkIP = /^192\.168\./.test(hostname) || /^10\./.test(hostname);
    const isProduction = !isLocalhost && !isNetworkIP;
    const isHTTPS = window.location.protocol === 'https:';
    
    return { isLocalhost, isNetworkIP, isProduction, isHTTPS };
  };

  // Enhanced connectivity testing
  const testConnectivity = async () => {
    try {
      const response = await fetch('/manifest.json', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Offline state manager
  const OfflineManager = {
    isOffline: !navigator.onLine,
    lastOnlineTime: Date.now(),
    retryCount: 0,
    maxRetries: 5,
    
    init() {
      console.log('🔧 [OfflineManager] Initializing client-side offline support...');
      
      // Listen for browser online/offline events
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      
      // Periodic connectivity check
      setInterval(this.checkConnectivity.bind(this), 30000);
      
      // Initial connectivity check
      this.checkConnectivity();
    },
    
    handleOnline() {
      console.log('🌐 [OfflineManager] Browser reports online');
      this.isOffline = false;
      this.retryCount = 0;
      this.notifyOnline();
    },
    
    handleOffline() {
      console.log('📵 [OfflineManager] Browser reports offline');
      this.isOffline = true;
      this.notifyOffline();
    },
    
    async checkConnectivity() {
      const hasConnectivity = await testConnectivity();
      const browserOnline = navigator.onLine;
      
      if (hasConnectivity !== browserOnline) {
        console.log('⚠️ [OfflineManager] Browser state vs actual connectivity mismatch:', {
          browserOnline,
          hasConnectivity
        });
      }
      
      if (hasConnectivity && this.isOffline) {
        console.log('✅ [OfflineManager] Connectivity restored');
        this.isOffline = false;
        this.retryCount = 0;
        this.notifyOnline();
      } else if (!hasConnectivity && !this.isOffline) {
        console.log('❌ [OfflineManager] Connectivity lost');
        this.isOffline = true;
        this.notifyOffline();
      }
    },
    
    notifyOnline() {
      window.dispatchEvent(new CustomEvent('connection-status-check', {
        detail: { isOnline: true, timestamp: Date.now() }
      }));
      
      window.dispatchEvent(new CustomEvent('network-status-change', {
        detail: { isOnline: true, timestamp: Date.now() }
      }));
    },
    
    notifyOffline() {
      window.dispatchEvent(new CustomEvent('connection-status-check', {
        detail: { isOnline: false, timestamp: Date.now() }
      }));
      
      window.dispatchEvent(new CustomEvent('network-status-change', {
        detail: { isOnline: false, timestamp: Date.now() }
      }));
    },
    
    // Enhanced error handling for fetch requests
    enhanceFetch() {
      const originalFetch = window.fetch;
      
      window.fetch = async (...args) => {
        try {
          const response = await originalFetch(...args);
          
          // If we get a successful response but we thought we were offline
          if (response.ok && this.isOffline) {
            console.log('🔄 [OfflineManager] Fetch succeeded, updating online status');
            this.isOffline = false;
            this.notifyOnline();
          }
          
          return response;
        } catch (error) {
          // If fetch fails and we thought we were online
          if (!this.isOffline) {
            console.log('❌ [OfflineManager] Fetch failed, checking connectivity');
            this.checkConnectivity();
          }
          
          throw error;
        }
      };
    }
  };

  // Enhanced error boundary for client-side errors
  const setupErrorHandling = () => {
    window.addEventListener('error', (event) => {
      const error = event.error;
      if (error && OfflineManager.isNetworkError(error)) {
        console.log('🚨 [OfflineManager] Network error detected:', error.message);
        OfflineManager.checkConnectivity();
      }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      if (error && OfflineManager.isNetworkError(error)) {
        console.log('🚨 [OfflineManager] Network promise rejection detected:', error.message);
        OfflineManager.checkConnectivity();
      }
    });
  };

  // Network error detection
  OfflineManager.isNetworkError = (error) => {
    const networkErrorMessages = [
      'Failed to fetch',
      'NetworkError',
      'network error',
      'fetch failed',
      'connection',
      'offline',
      'timeout',
      'ECONNREFUSED',
      'ENOTFOUND',
      'ERR_INTERNET_DISCONNECTED',
      'ERR_NAME_NOT_RESOLVED',
      'ERR_CONNECTION_REFUSED',
      'ERR_NETWORK_CHANGED',
      'ERR_SOCKET_TIMEOUT'
    ];
    
    return networkErrorMessages.some(msg => 
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  };

  // Service worker fallback
  const setupServiceWorkerFallback = () => {
    if (!('serviceWorker' in navigator)) {
      console.log('❌ [OfflineManager] Service Worker not supported');
      return;
    }

    // Check service worker status periodically
    setInterval(async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        const isActive = !!registration?.active;
        
        if (!isActive && !OfflineManager.isOffline) {
          console.log('⚠️ [OfflineManager] Service Worker not active, attempting re-registration');
          
          try {
            await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            console.log('✅ [OfflineManager] Service Worker re-registered successfully');
          } catch (error) {
            console.log('❌ [OfflineManager] Service Worker re-registration failed:', error);
          }
        }
      } catch (error) {
        console.log('❌ [OfflineManager] Service Worker check failed:', error);
      }
    }, 60000); // Check every minute
  };

  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      OfflineManager.init();
      OfflineManager.enhanceFetch();
      setupErrorHandling();
      setupServiceWorkerFallback();
    });
  } else {
    OfflineManager.init();
    OfflineManager.enhanceFetch();
    setupErrorHandling();
    setupServiceWorkerFallback();
  }

  // Make OfflineManager available globally
  window.BeezeeOfflineManager = OfflineManager;
  
  console.log('✅ [OfflineManager] Client-side offline fallback initialized');
})();
