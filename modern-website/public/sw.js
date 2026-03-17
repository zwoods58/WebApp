const CACHE_NAME = 'beezee-business-os-v2';
const STATIC_CACHE_NAME = 'beezee-static-v2';
const API_CACHE_NAME = 'beezee-api-v2';

// Cache all static assets and pages
const urlsToCache = [
  '/',
  '/Beezee-App/auth/signup',
  '/Beezee-App/auth/login',
  '/manifest.json',
  '/beezee-icon-192x192.png',
  '/beezee-icon-512x512.png',
  // All dashboard combinations
  '/Beezee-App/app/ke/retail',
  '/Beezee-App/app/ke/services',
  '/Beezee-App/app/ng/retail',
  '/Beezee-App/app/ng/services',
  '/Beezee-App/app/za/retail',
  '/Beezee-App/app/za/services',
  // Feature pages
  '/Beezee-App/app/[country]/[industry]/beehive',
  '/Beezee-App/app/[country]/[industry]/cash',
  '/Beezee-App/app/[country]/[industry]/stock',
  '/Beezee-App/app/[country]/[industry]/calendar',
  '/Beezee-App/app/[country]/[industry]/credit',
  '/Beezee-App/app/[country]/[industry]/transactions',
  '/Beezee-App/app/[country]/[industry]/services',
  '/Beezee-App/app/[country]/[industry]/reports',
  '/Beezee-App/app/[country]/[industry]/settings'
];

// API endpoints to cache
const apiEndpoints = [
  '/api/auth/signup',
  '/api/auth/login',
  '/api/transactions',
  '/api/expenses',
  '/api/beehive',
  '/api/service-worker',
  '/api/manifest'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache static pages and assets
      caches.open(STATIC_CACHE_NAME)
        .then(cache => {
          console.log('Opened static cache');
          return cache.addAll(urlsToCache);
        }),
      // Cache API responses
      caches.open(API_CACHE_NAME)
        .then(cache => {
          console.log('Opened API cache');
          return cache.addAll(apiEndpoints.map(endpoint => new Request(endpoint)));
        })
    ])
  );
});

// Fetch event - comprehensive offline handling
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different request types
  if (request.method === 'GET') {
    // Handle page requests
    if (url.pathname.startsWith('/Beezee-App') || url.pathname === '/') {
      event.respondWith(handlePageRequest(request));
    }
    // Handle API requests
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(handleAPIRequest(request));
    }
    // Handle static assets
    else {
      event.respondWith(handleStaticRequest(request));
    }
  } else {
    // Handle POST/PUT/DELETE requests (offline queuing)
    event.respondWith(handleMutationRequest(request));
  }
});

// Handle page requests with offline fallback
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful response
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    return caches.match('/Beezee-App/auth/signup');
  }
}

// Handle API requests with offline fallback
async function handleAPIRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful GET responses
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // Return offline response for API requests
    return new Response(JSON.stringify({
      error: 'Offline mode',
      offline: true,
      message: 'Request queued for sync when online'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful response
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return minimal offline asset
    return new Response('', { status: 404 });
  }
}

// Handle mutation requests (POST/PUT/DELETE)
async function handleMutationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Queue request for background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      // Store request in IndexedDB for background sync
      const requestData = {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        body: await request.text(),
        timestamp: Date.now()
      };
      
      // Store in IndexedDB (simplified - in real implementation use proper IndexedDB)
      const requests = JSON.parse(localStorage.getItem('offline-requests') || '[]');
      requests.push(requestData);
      localStorage.setItem('offline-requests', JSON.stringify(requests));
      
      // Register for background sync
      self.registration.sync.register('background-sync');
    }
    
    // Return queued response
    return new Response(JSON.stringify({
      success: true,
      queued: true,
      message: 'Request queued for sync when online'
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Keep only current caches
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Enhanced background sync for offline operations
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(processOfflineQueue());
  }
});

// Process offline queue when back online
async function processOfflineQueue() {
  try {
    // Get queued requests from storage
    const requests = JSON.parse(localStorage.getItem('offline-requests') || '[]');
    
    if (requests.length === 0) {
      console.log('No offline requests to process');
      return;
    }

    console.log(`Processing ${requests.length} offline requests`);

    // Process each request
    for (const requestData of requests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });

        if (response.ok) {
          console.log(`Offline request succeeded: ${requestData.method} ${requestData.url}`);
        } else {
          console.error(`Offline request failed: ${requestData.method} ${requestData.url}`, response.status);
        }
      } catch (error) {
        console.error(`Error processing offline request: ${requestData.method} ${requestData.url}`, error);
      }
    }

    // Clear processed requests
    localStorage.setItem('offline-requests', JSON.stringify([]));
    
    // Notify clients that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        processedCount: requests.length
      });
    });

  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Enhanced push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New business update',
    icon: '/beezee-icon-192x192.png',
    badge: '/beezee-icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/beezee-icon-96x96.png'
      },
      {
        action: 'sync',
        title: 'Sync Now',
        icon: '/beezee-icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BeeZee', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/Beezee-App/auth/signup')
    );
  } else if (event.action === 'sync') {
    event.waitUntil(
      processOfflineQueue().then(() => {
        return clients.openWindow('/Beezee-App/auth/signup');
      })
    );
  }
});

// Clean up old localStorage references (service workers can't access localStorage directly)
// In a real implementation, use IndexedDB instead
console.log('BeeZee Service Worker v2 loaded - Offline-first architecture enabled');
