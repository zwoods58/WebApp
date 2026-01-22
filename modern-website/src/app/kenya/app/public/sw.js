/**
 * BeeZee Finance Service Worker
 * Provides offline functionality, caching, and background sync
 */

const CACHE_NAME = 'beezee-finance-test-v1.0.0';
const STATIC_CACHE = 'beezee-static-test-v1.0.0';
const DATA_CACHE = 'beezee-data-test-v1.0.0';

// Cache URLs - simplified for testing
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

// Test API endpoints
const API_ENDPOINTS = [
  '/api/transactions',
  '/api/products',
  '/api/reports'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DATA_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different request types
  if (request.method === 'GET') {
    // Handle static assets
    if (isStaticAsset(url.pathname)) {
      event.respondWith(handleStaticAsset(request));
    }
    // Handle API requests
    else if (isAPIRequest(url.pathname)) {
      event.respondWith(handleAPIRequest(request));
    }
    // Handle navigation requests
    else if (request.mode === 'navigate') {
      event.respondWith(handleNavigation(request));
    }
    // Handle other requests
    else {
      event.respondWith(handleOtherRequest(request));
    }
  }
  // Handle POST requests (for offline queue)
  else if (request.method === 'POST') {
    event.respondWith(handlePostRequest(request));
  }
});

/**
 * Handle static asset requests
 */
async function handleStaticAsset(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch static asset', error);
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback
    return new Response('Offline - No cached version available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

/**
 * Handle API requests
 */
async function handleAPIRequest(request) {
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DATA_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch API', error);
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator to response
      const offlineResponse = new Response(cachedResponse.body, {
        status: 200,
        statusText: 'OK (Offline)',
        headers: {
          ...cachedResponse.headers,
          'X-Offline': 'true'
        }
      });
      return offlineResponse;
    }
    
    // Return offline error
    return new Response(JSON.stringify({
      error: 'Network unavailable',
      offline: true,
      message: 'No cached data available'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * Handle navigation requests
 */
async function handleNavigation(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to navigate', error);
    
    // Return cached index.html
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return basic offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BeeZee Finance - Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline-icon { font-size: 72px; margin-bottom: 20px; }
            .message { color: #666; margin: 20px 0; }
            .retry-btn { background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="offline-icon">📱</div>
          <h1>You're Offline</h1>
          <p class="message">BeeZee Finance is working offline. Some features may be limited.</p>
          <button class="retry-btn" onclick="window.location.reload()">Retry Connection</button>
        </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
}

/**
 * Handle other requests
 */
async function handleOtherRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to fetch other request', error);
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Handle POST requests (offline queue)
 */
async function handlePostRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Failed to POST, queuing for sync', error);
    
    // Queue the request for background sync
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB for background sync
    await queueRequest(requestData);
    
    // Return queued response
    return new Response(JSON.stringify({
      queued: true,
      message: 'Request queued for when online'
    }), {
      status: 202,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(pathname) {
  return pathname.includes('/static/') ||
         pathname.includes('/icons/') ||
         pathname.includes('/assets/') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico');
}

/**
 * Check if request is for API
 */
function isAPIRequest(pathname) {
  return pathname.startsWith('/api/') || 
         API_ENDPOINTS.some(endpoint => pathname.startsWith(endpoint));
}

/**
 * Queue request for background sync
 */
async function queueRequest(requestData) {
  try {
    // Open IndexedDB
    const db = await openDB();
    
    // Add request to queue
    await db.add('requestQueue', requestData);
    
    // Register background sync
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      await self.registration.sync.register('background-sync');
    }
  } catch (error) {
    console.error('Service Worker: Failed to queue request', error);
  }
}

/**
 * Open IndexedDB
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BeeZeeFinanceDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create request queue store
      if (!db.objectStoreNames.contains('requestQueue')) {
        const store = db.createObjectStore('requestQueue', { 
          keyPath: 'timestamp', 
          autoIncrement: true 
        });
        store.createIndex('url', 'url', { unique: false });
      }
      
      // Create offline data store
      if (!db.objectStoreNames.contains('offlineData')) {
        db.createObjectStore('offlineData', { keyPath: 'id' });
      }
    };
  });
}

/**
 * Background sync event
 */
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(processRequestQueue());
  }
});

/**
 * Process request queue
 */
async function processRequestQueue() {
  try {
    const db = await openDB();
    const requests = await db.getAll('requestQueue');
    
    console.log(`Service Worker: Processing ${requests.length} queued requests`);
    
    for (const requestData of requests) {
      try {
        // Retry the request
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        if (response.ok) {
          // Remove from queue if successful
          await db.delete('requestQueue', requestData.timestamp);
          console.log('Service Worker: Request synced successfully');
        } else {
          console.error('Service Worker: Request sync failed', response.status);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync request', error);
      }
    }
    
    // Notify clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        processed: requests.length
      });
    });
  } catch (error) {
    console.error('Service Worker: Failed to process request queue', error);
  }
}

/**
 * Push notification event
 */
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'You have a new notification from BeeZee Finance',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.title = data.title || 'BeeZee Finance';
    options.data = { ...options.data, ...data };
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title || 'BeeZee Finance', options)
  );
});

/**
 * Notification click event
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    event.notification.close();
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/**
 * Message event (for communication with app)
 */
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION_RESPONSE',
      version: CACHE_NAME
    });
  }
});

/**
 * Periodic background sync (for periodic data updates)
 */
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered', event.tag);
  
  if (event.tag === 'periodic-sync') {
    event.waitUntil(
      // Perform periodic tasks like updating cached data
      updateCachedData()
    );
  }
});

/**
 * Update cached data
 */
async function updateCachedData() {
  try {
    // Update frequently accessed API endpoints
    for (const endpoint of API_ENDPOINTS) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const cache = await caches.open(DATA_CACHE);
          await cache.put(endpoint, response);
        }
      } catch (error) {
        console.error(`Service Worker: Failed to update ${endpoint}`, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Failed to update cached data', error);
  }
}

console.log('Service Worker: Loaded successfully');
