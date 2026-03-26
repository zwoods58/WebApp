/**
 * Beezee App Service Worker - User-Specific Caching
 * Caches routes based on user's country and industry after login
 */

const CACHE_VERSION = 'v29';
const STATIC_CACHE = `beezee-static-${CACHE_VERSION}`;
const API_CACHE = `beezee-api-${CACHE_VERSION}`;
const PAGE_CACHE = `beezee-pages-${CACHE_VERSION}`;

// Default fallback routes (before login)
const DEFAULT_ROUTES = [
  '/',
  '/manifest.json',
  '/Beezee-App/auth/login',
  '/Beezee-App/auth/signup',  // ✅ Corrected signup route
];

// Store user's country and industry in SW memory
let userCountry = null;
let userIndustry = null;

console.log('[SW] User-specific caching mode - waiting for login');

// ============================================================
// INSTALL - Cache only default routes (FAST!)
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  console.log('[SW] Caching default routes:', DEFAULT_ROUTES);
  
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => {
      return cache.addAll(DEFAULT_ROUTES);
    }).then(() => {
      console.log('[SW] Install complete');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('[SW] Install failed:', error);
      return self.skipWaiting();
    })
  );
});

// ============================================================
// ACTIVATE - Clean up old caches
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== API_CACHE && 
              cacheName !== PAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// ============================================================
// MESSAGE HANDLER - Receive user routes from app
// ============================================================
self.addEventListener('message', (event) => {
  const { type, country, industry } = event.data;
  
  if (type === 'CACHE_USER_ROUTES') {
    console.log('[SW] Received user routes:', { country, industry });
    userCountry = country;
    userIndustry = industry;
    
    // Cache user's routes in background
    event.waitUntil(cacheUserRoutes(country, industry));
  }
});

// ============================================================
// Cache user's specific routes (their country + industry)
// ============================================================
async function cacheUserRoutes(country, industry) {
  const routesToCache = [
    `/Beezee-App/app/${country}/${industry}`,           // Dashboard
    `/Beezee-App/app/${country}/${industry}/cash`,      // Cash transactions
    `/Beezee-App/app/${country}/${industry}/credit`,    // Credit management
    `/Beezee-App/app/${country}/${industry}/services`,  // Services
    `/Beezee-App/app/${country}/${industry}/stock`,     // Stock/inventory
    `/Beezee-App/app/${country}/${industry}/beehive`,   // Beehive
    `/Beezee-App/app/${country}/${industry}/calendar`,  // Calendar
    `/Beezee-App/app/${country}/${industry}/reports`,   // Reports
    `/Beezee-App/app/${country}/${industry}/more`,      // More page
    `/Beezee-App/app/${country}/${industry}/settings`,  // Settings
  ];
  
  console.log(`[SW] 📦 Starting to cache ${routesToCache.length} routes for: ${country}/${industry}`);
  
  const cache = await caches.open(PAGE_CACHE);
  let cached = 0;
  let failed = 0;
  
  for (const route of routesToCache) {
    try {
      // Fetch HTML version only (RSC should never be cached)
      const htmlResponse = await fetch(route, {
        headers: {
          'Accept': 'text/html',
        }
      });
      
      if (htmlResponse.ok) {
        await cache.put(route, htmlResponse.clone());
        cached++;
        console.log(`[SW] ✅ Cached HTML: ${route}`);
      } else {
        failed++;
        console.warn(`[SW] ❌ Failed (${htmlResponse.status}): ${route}`);
      }
    } catch (err) {
      failed++;
      console.warn(`[SW] ❌ Error: ${route}`, err.message);
    }
  }
  
  console.log(`[SW] 🎉 User routes caching complete! ✅ ${cached} cached, ❌ ${failed} failed`);
  
  // Pre-cache critical Next.js chunks for offline support
  console.log('[SW] 📦 Pre-caching critical Next.js chunks...');
  const criticalChunks = [
    '/_next/static/chunks/webpack.js',
    '/_next/static/chunks/main.js',
    '/_next/static/chunks/pages/_app.js',
  ];
  
  const staticCache = await caches.open(STATIC_CACHE);
  let chunksCached = 0;
  
  for (const chunk of criticalChunks) {
    try {
      const response = await fetch(chunk);
      if (response.ok) {
        await staticCache.put(chunk, response.clone());
        chunksCached++;
        console.log(`[SW] ✅ Cached chunk: ${chunk}`);
      }
    } catch (err) {
      console.warn(`[SW] ⚠️ Failed to cache chunk: ${chunk}`, err.message);
    }
  }
  
  console.log(`[SW] 🎉 Chunk caching complete! ✅ ${chunksCached}/${criticalChunks.length} chunks cached`);
}

// ============================================================
// Generate routes for current user (if known)
// ============================================================
function getUserRoutes() {
  if (userCountry && userIndustry) {
    return [
      ...DEFAULT_ROUTES,
      `/Beezee-App/app/${userCountry}/${userIndustry}`,
      `/Beezee-App/app/${userCountry}/${userIndustry}/cash`,
      `/Beezee-App/app/${userCountry}/${userIndustry}/credit`,
      `/Beezee-App/app/${userCountry}/${userIndustry}/services`,
      `/Beezee-App/app/${userCountry}/${userIndustry}/stock`,
      `/Beezee-App/app/${userCountry}/${userIndustry}/beehive`,
      `/Beezee-App/app/${userCountry}/${userIndustry}/calendar`,
      `/Beezee-App/app/${userCountry}/${userIndustry}/reports`,
    ];
  }
  return DEFAULT_ROUTES;
}

// ============================================================
// FETCH - Serve from cache, cache new pages as visited
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET
  if (request.method !== 'GET') return;
  
  // Skip Next.js internal
  if (url.pathname.startsWith('/__next') || 
      url.pathname.includes('webpack') ||
      url.pathname.includes('hot-update')) {
    return;
  }
  
  // Skip prefetch requests
  if (url.searchParams.has('next-router-prefetch') ||
      url.searchParams.has('next-router-segment-prefetch')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // ============================================================
  // RSC Requests (client navigation) - NEVER CACHE
  // ============================================================
  if (url.searchParams.has('_rsc') || request.headers.get('RSC') === '1') {
    // RSC requests should NEVER be cached - always fetch fresh from network
    console.log('[SW] 📡 Fetching RSC from network (no cache):', url.pathname);
    event.respondWith(fetch(request));
    return;
  }
  
  // ============================================================
  // HTML Pages
  // ============================================================
  if (request.destination === 'document' || 
      url.pathname === '/' ||
      url.pathname.startsWith('/Beezee-App/')) {
    event.respondWith(
      (async () => {
        const cacheKey = url.pathname;
        
        // Dashboard routes: Offline-aware cache-first with background update
        if (url.pathname.startsWith('/Beezee-App/app/')) {
          // Try cache first for instant response
          const cached = await caches.match(cacheKey);
          
          // If offline or cached, serve from cache immediately
          if (!navigator.onLine || cached) {
            if (cached) {
              console.log('[SW] ✅ Serving dashboard from cache:', cacheKey);
              
              // If online, update cache in background (don't wait)
              if (navigator.onLine) {
                event.waitUntil(
                  fetch(request).then(response => {
                    if (response.ok) {
                      caches.open(PAGE_CACHE).then(cache => {
                        cache.put(cacheKey, response.clone());
                        console.log('[SW] � Updated cache in background:', cacheKey);
                      });
                    }
                  }).catch(() => {
                    console.log('[SW] ⚠️ Background update failed (offline):', cacheKey);
                  })
                );
              }
              
              return cached;
            }
            
            // Offline and not cached - can't serve
            if (!navigator.onLine) {
              console.log('[SW] ❌ Offline and not cached:', cacheKey);
              throw new Error('Offline and page not cached');
            }
          }
          
          // Online and not cached - fetch from network
          try {
            console.log('[SW] �📡 Fetching dashboard from network:', cacheKey);
            const response = await fetch(request);
            if (response.ok) {
              const cache = await caches.open(PAGE_CACHE);
              cache.put(cacheKey, response.clone());
              console.log('[SW] 📦 Cached dashboard HTML:', cacheKey);
            }
            return response;
          } catch (error) {
            // Network failed - try cache as last resort
            console.log('[SW] ⚠️ Network failed, trying cache:', cacheKey);
            if (cached) {
              console.log('[SW] ✅ Serving dashboard from cache (fallback):', cacheKey);
              return cached;
            }
            throw error;
          }
        }
        
        // Auth pages: Cache-first for speed
        const cached = await caches.match(cacheKey);
        if (cached) {
          console.log('[SW] ✅ Serving HTML from cache:', cacheKey);
          return cached;
        }
        
        // Not in cache, fetch and store
        console.log('[SW] 📡 Fetching HTML from network:', cacheKey);
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(PAGE_CACHE);
          cache.put(cacheKey, response.clone());
          console.log('[SW] 📦 Cached HTML:', cacheKey);
        }
        return response;
      })()
    );
    return;
  }
  
  // ============================================================
  // Static Assets - Cache First with Cache-on-Fetch
  // ============================================================
  if (url.pathname.match(/\.(js|css|json|png|jpg|jpeg|svg|ico)$/) ||
      url.pathname.includes('/_next/static/')) {
    event.respondWith(
      (async () => {
        // Try cache first
        const cached = await caches.match(request);
        if (cached) {
          console.log('[SW] ✅ Serving static from cache:', url.pathname);
          return cached;
        }
        
        // Fetch from network and cache
        try {
          console.log('[SW] 📡 Fetching static asset:', url.pathname);
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
            console.log('[SW] 📦 Cached static asset:', url.pathname);
          }
          return response;
        } catch (error) {
          console.log('[SW] ❌ Static asset failed offline:', url.pathname);
          
          // For JS chunks, return a minimal error script instead of hanging
          if (url.pathname.endsWith('.js')) {
            return new Response(
              'console.error("Offline: Failed to load chunk - " + "' + url.pathname + '");',
              { 
                status: 503,
                headers: { 'Content-Type': 'application/javascript' }
              }
            );
          }
          
          // For other assets, throw the error
          throw error;
        }
      })()
    );
    return;
  }
  
  // ============================================================
  // API calls - Network First
  // ============================================================
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'OFFLINE' }), { status: 503 });
        }
      })()
    );
    return;
  }
  
  // ============================================================
  // Everything else
  // ============================================================
  event.respondWith(fetch(request).catch(() => new Response('Offline', { status: 503 })));
});