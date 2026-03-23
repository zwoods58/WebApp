/**
 * Beezee App Service Worker - User-Specific Caching
 * Caches routes based on user's country and industry after login
 */

const CACHE_VERSION = 'v28';
const STATIC_CACHE = `beezee-static-${CACHE_VERSION}`;
const API_CACHE = `beezee-api-${CACHE_VERSION}`;
const PAGE_CACHE = `beezee-pages-${CACHE_VERSION}`;
const RSC_CACHE = `beezee-rsc-${CACHE_VERSION}`;

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
              cacheName !== PAGE_CACHE &&
              cacheName !== RSC_CACHE) {
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
  ];
  
  console.log(`[SW] 📦 Starting to cache ${routesToCache.length} routes for: ${country}/${industry}`);
  
  const cache = await caches.open(PAGE_CACHE);
  const rscCache = await caches.open(RSC_CACHE);
  let cached = 0;
  let failed = 0;
  
  for (const route of routesToCache) {
    try {
      // Fetch HTML version (for initial page load)
      const htmlResponse = await fetch(route, {
        headers: {
          'Accept': 'text/html',
        }
      });
      
      if (htmlResponse.ok) {
        await cache.put(route, htmlResponse.clone());
        cached++;
        console.log(`[SW] ✅ Cached HTML: ${route}`);
        
        // Also fetch and cache RSC version (for client-side navigation)
        try {
          const rscResponse = await fetch(route, {
            headers: {
              'RSC': '1',
              'Next-Router-State-Tree': '%5B%22%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
            }
          });
          
          if (rscResponse.ok) {
            await rscCache.put(route, rscResponse.clone());
            console.log(`[SW] ✅ Cached RSC: ${route}`);
          }
        } catch (rscErr) {
          console.log(`[SW] ⚠️ RSC cache skipped for: ${route}`);
        }
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
  // RSC Requests (client navigation)
  // ============================================================
  if (url.searchParams.has('_rsc')) {
    event.respondWith(
      (async () => {
        const cacheKey = url.pathname;
        
        // Try RSC cache first
        const rscCache = await caches.open(RSC_CACHE);
        const rscCached = await rscCache.match(cacheKey);
        if (rscCached) {
          console.log('[SW] ✅ Serving RSC from cache:', cacheKey);
          return rscCached;
        }
        
        // Fetch from network and cache
        const response = await fetch(request);
        if (response.ok) {
          rscCache.put(cacheKey, response.clone());
          console.log('[SW] 📦 Cached RSC:', cacheKey);
        }
        return response;
      })()
    );
    return;
  }
  
  // ============================================================
  // HTML Pages - Cache on first visit
  // ============================================================
  if (request.destination === 'document' || 
      url.pathname === '/' ||
      url.pathname.startsWith('/Beezee-App/')) {
    event.respondWith(
      (async () => {
        const cacheKey = url.pathname;
        
        // Try cache first
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
  // Static Assets - Cache First
  // ============================================================
  if (url.pathname.match(/\.(js|css|json|png|jpg|jpeg|svg|ico)$/) ||
      url.pathname.includes('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request);
      })
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