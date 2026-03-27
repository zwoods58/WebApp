/**
 * Beezee App Service Worker - Smart User-Specific Caching
 * Pre-caches public pages, then caches user routes after login
 */

const CACHE_VERSION = 'v38';
const STATIC_CACHE = `beezee-static-${CACHE_VERSION}`;
const API_CACHE = `beezee-api-${CACHE_VERSION}`;
const PAGE_CACHE = `beezee-pages-${CACHE_VERSION}`;

// Public routes that can be cached during install (no auth required)
const PUBLIC_ROUTES = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/Beezee-App/',
  '/Beezee-App/setup',
  // PWA Icons
  '/beezee-icon-16x16.png',
  '/beezee-icon-32x32.png',
  '/beezee-icon-72x72.png',
  '/beezee-icon-96x96.png',
  '/beezee-icon-128x128.png',
  '/beezee-icon-144x144.png',
  '/beezee-icon-152x152.png',
  '/beezee-icon-192x192.png',
  '/beezee-icon-384x384.png',
  '/beezee-icon-512x512.png',
  '/favicon.ico',
  '/beezee-logo.png',
];

// Store user's country and industry in SW memory
let userCountry = null;
let userIndustry = null;

// Offline state detection
let isOffline = false;

// Listen for online/offline events
self.addEventListener('online', () => {
  isOffline = false;
  console.log('[SW] 🌐 Back online');
});

self.addEventListener('offline', () => {
  isOffline = true;
  console.log('[SW] 📴 Gone offline - switching to cache-only mode');
});

// Check initial state
if (typeof navigator !== 'undefined') {
  isOffline = !navigator.onLine;
}

// Development mode detection
const IS_DEV = self.location.hostname === 'localhost' || 
               self.location.hostname === '127.0.0.1';

// Auth endpoints that should NEVER be cached
const AUTH_ENDPOINTS = [
  '/api/auth/',
  '/api/signup',
  '/api/verify-pin',
  '/api/login',
];

if (IS_DEV) {
  console.log('[SW] 🔧 Development mode detected - aggressive cache invalidation enabled');
}

console.log('[SW] Smart caching mode - will cache user routes after login');

// ============================================================
// INSTALL - Cache only public pages (FAST!)
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  console.log('[SW] Caching public routes:', PUBLIC_ROUTES);
  
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => {
      return cache.addAll(PUBLIC_ROUTES);
    }).then(() => {
      console.log('[SW] ✅ Public routes cached');
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
// MESSAGE HANDLER - Handle messages from app
// ============================================================
self.addEventListener('message', (event) => {
  const { type, country, industry } = event.data;
  
  // Handle user route caching after login
  if (type === 'CACHE_USER_ROUTES') {
    console.log('[SW] 📦 Received user routes:', { country, industry });
    userCountry = country;
    userIndustry = industry;
    
    // Cache user's routes in background (don't block)
    event.waitUntil(cacheUserRoutes(country, industry));
  }
  
  // Handle manual update trigger from "Update Now" button
  if (type === 'SKIP_WAITING') {
    console.log('[SW] 🔄 SKIP_WAITING received - activating new version...');
    self.skipWaiting();
    
    // Notify all clients that new SW is activated
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'SW_ACTIVATED' });
      });
      console.log('[SW] ✅ Notified', clients.length, 'clients of activation');
    });
  }
});

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Fetch with timeout - prevents hanging even if navigator.onLine is wrong
 * This is a safety net for unreliable offline detection
 */
async function fetchWithTimeout(request, timeout = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn('[SW] ⏱️ Request timeout after', timeout, 'ms:', request.url);
      throw new Error('Network timeout');
    }
    throw error;
  }
}

/**
 * Fetch from cache only - no network attempts
 * Returns cached response or null
 */
async function fetchFromCacheOnly(request) {
  const cached = await caches.match(request);
  if (cached) {
    console.log('[SW] ✅ Cache hit:', request.url);
    return cached;
  }
  console.log('[SW] ❌ Cache miss:', request.url);
  return null;
}

/**
 * Extract all chunk URLs from HTML response
 * Parses <script src="..."> and <link href="..."> tags
 */
async function extractChunksFromHTML(htmlText, baseUrl) {
  const chunks = new Set();
  
  // Match <script src="...">
  const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = scriptRegex.exec(htmlText)) !== null) {
    const src = match[1];
    if (src.startsWith('/_next/') || src.startsWith('/')) {
      chunks.add(new URL(src, baseUrl).href);
    }
  }
  
  // Match <link rel="stylesheet" href="...">
  const linkRegex = /<link[^>]+href=["']([^"']+)["'][^>]*>/g;
  while ((match = linkRegex.exec(htmlText)) !== null) {
    const href = match[1];
    if (href.endsWith('.css') && (href.startsWith('/_next/') || href.startsWith('/'))) {
      chunks.add(new URL(href, baseUrl).href);
    }
  }
  
  return Array.from(chunks);
}

/**
 * Calculate total cache size
 */
async function calculateCacheSize() {
  const cacheNames = [STATIC_CACHE, API_CACHE, PAGE_CACHE];
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    try {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    } catch (err) {
      console.warn(`[SW] Error calculating size for ${cacheName}:`, err);
    }
  }
  
  return totalSize;
}

// ============================================================
// Cache user's specific routes (their country + industry)
// ============================================================
async function cacheUserRoutes(country, industry) {
  console.log(`[SW] 📦 Starting to cache routes for authenticated user...`);
  
  // Wait 2 seconds for session to fully establish after login
  await new Promise(resolve => setTimeout(resolve, 2000));
  
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
  
  console.log(`[SW] 📦 Starting to cache ${routesToCache.length} routes + chunks for: ${country}/${industry}`);
  
  const pageCache = await caches.open(PAGE_CACHE);
  const staticCache = await caches.open(STATIC_CACHE);
  let cached = 0;
  let failed = 0;
  let totalChunks = 0;
  
  for (const route of routesToCache) {
    try {
      // Fetch HTML page with cache control
      const htmlResponse = await fetch(route, {
        headers: {
          'Accept': 'text/html',
          'Cache-Control': 'no-cache',
        },
        credentials: 'include',
      });
      
      // Only cache if response is 200 and doesn't redirect to login
      if (!htmlResponse.ok || 
          htmlResponse.status !== 200 || 
          htmlResponse.url.includes('/auth/login')) {
        failed++;
        console.warn(`[SW] ❌ Skipped (redirect or error): ${route}`);
        continue;
      }
      
      // Cache the HTML page
      await pageCache.put(route, htmlResponse.clone());
      cached++;
      console.log(`[SW] ✅ Cached page (${cached}/${routesToCache.length}): ${route}`);
      
      // Extract and cache chunks
      const htmlText = await htmlResponse.text();
      const chunks = await extractChunksFromHTML(htmlText, self.location.origin);
      
      console.log(`[SW] 📦 Found ${chunks.length} chunks for ${route}`);
      totalChunks += chunks.length;
      
      // Cache each chunk
      for (const chunkUrl of chunks) {
        try {
          const chunkResponse = await fetch(chunkUrl);
          if (chunkResponse.ok) {
            await staticCache.put(chunkUrl, chunkResponse.clone());
            console.log(`[SW] ✅ Cached chunk: ${new URL(chunkUrl).pathname}`);
          }
        } catch (chunkError) {
          console.warn(`[SW] ⚠️ Failed to cache chunk: ${chunkUrl}`, chunkError.message);
        }
      }
      
      // Small delay to avoid overwhelming server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (err) {
      failed++;
      console.warn(`[SW] ❌ Error caching ${route}:`, err.message);
    }
  }
  
  console.log(`[SW] 🎉 Caching complete! ✅ ${cached} pages, ${totalChunks} chunks, ❌ ${failed} failed`);
  
  // Cache static assets after routes
  await cacheStaticAssets();
  
  // Calculate and log cache size
  const totalSize = await calculateCacheSize();
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`[SW] 💾 Total cache size: ${sizeMB} MB`);
  
  if (totalSize > 50 * 1024 * 1024) { // 50MB
    console.warn(`[SW] ⚠️ Cache size exceeds 50MB! Consider cleanup.`);
  }
}

// ============================================================
// Cache static assets (JS chunks, CSS)
// ============================================================
async function cacheStaticAssets() {
  console.log('[SW] 📦 Caching static assets...');
  
  try {
    // Fetch the homepage to extract asset URLs
    const response = await fetch('/');
    const html = await response.text();
    
    // Extract all .js and .css file paths from the HTML
    const assetRegex = /(?:src|href)="([^"]*\.(?:js|css))"/g;
    const assets = [];
    let match;
    while ((match = assetRegex.exec(html)) !== null) {
      const assetPath = match[1];
      if (assetPath.startsWith('/_next/') && !assets.includes(assetPath)) {
        assets.push(assetPath);
      }
    }
    
    console.log(`[SW] Found ${assets.length} static assets to cache`);
    
    const staticCache = await caches.open(STATIC_CACHE);
    let assetsCached = 0;
    
    for (const asset of assets) {
      try {
        const assetResponse = await fetch(asset);
        if (assetResponse.ok) {
          await staticCache.put(asset, assetResponse);
          assetsCached++;
        }
      } catch (err) {
        console.warn(`[SW] ⚠️ Failed to cache asset: ${asset}`);
      }
    }
    
    console.log(`[SW] ✅ Cached ${assetsCached}/${assets.length} static assets`);
  } catch (err) {
    console.error('[SW] Failed to cache static assets:', err);
  }
}

// ============================================================
// FETCH - Cache First for everything
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET
  if (request.method !== 'GET') return;
  
  // Skip non-HTTP(S) requests (chrome-extension, etc.)
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
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
  // RSC Requests - NEVER CACHE (always network)
  // ============================================================
  if (url.searchParams.has('_rsc')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // ============================================================
  // HTML Pages - Cache-only when offline, cache-first with timeout when online
  // ============================================================
  if (request.destination === 'document' || 
      url.pathname === '/' ||
      url.pathname.startsWith('/Beezee-App/')) {
    event.respondWith(
      (async () => {
        const cacheKey = url.pathname;
        
        // OFFLINE: Cache-only mode (instant!)
        if (isOffline || !navigator.onLine) {
          const cached = await caches.match(cacheKey);
          if (cached) {
            console.log('[SW] ✅ Serving from cache (offline):', cacheKey);
            return cached;
          }
          
          // Not cached - return offline.html
          console.log('[SW] ❌ Page not cached, serving offline.html:', cacheKey);
          const offlinePage = await caches.match('/offline.html');
          return offlinePage || new Response('Offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        // ONLINE: Try cache first, then network WITH TIMEOUT
        const cached = await caches.match(cacheKey);
        if (cached) {
          console.log('[SW] ✅ Serving from cache:', cacheKey);
          return cached;
        }
        
        try {
          // Use fetchWithTimeout as fallback for unreliable navigator.onLine
          console.log('[SW] 📡 Fetching from network:', cacheKey);
          const response = await fetchWithTimeout(request, 5000); // 5s timeout for HTML
          if (response.ok) {
            const cache = await caches.open(PAGE_CACHE);
            cache.put(cacheKey, response.clone());
          }
          return response;
        } catch (error) {
          // Network failed or timed out - return offline.html
          console.log('[SW] ❌ Network failed/timeout, serving offline.html');
          const offlinePage = await caches.match('/offline.html');
          return offlinePage || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }
  
  // ============================================================
  // Static Assets (JS, CSS, Images) - Cache-only when offline
  // ============================================================
  if (url.pathname.match(/\.(js|css|json|png|jpg|jpeg|svg|ico|woff|woff2)$/) ||
      url.pathname.includes('/_next/static/')) {
    event.respondWith(
      (async () => {
        // OFFLINE: Cache-only mode (instant!)
        if (isOffline || !navigator.onLine) {
          const cached = await fetchFromCacheOnly(request);
          if (cached) return cached;
          
          // Missing chunk - return empty module to prevent hang
          if (url.pathname.endsWith('.js')) {
            return new Response(
              `console.warn("Offline: Chunk not available - ${url.pathname}");`,
              { headers: { 'Content-Type': 'application/javascript' } }
            );
          }
          
          // Missing asset - return 503
          return new Response('Offline', { status: 503 });
        }
        
        // ONLINE: Try cache first, then network WITH TIMEOUT
        const cached = await caches.match(request);
        if (cached) {
          console.log('[SW] ✅ Serving static from cache:', url.pathname);
          return cached;
        }
        
        try {
          // Use fetchWithTimeout as fallback for unreliable navigator.onLine
          console.log('[SW] 📡 Fetching static asset:', url.pathname);
          const response = await fetchWithTimeout(request, 3000); // 3s timeout for assets
          if (response.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          // Network failed or timed out - return empty module for JS, 503 for others
          console.log('[SW] ❌ Network failed/timeout for asset:', url.pathname);
          if (url.pathname.endsWith('.js')) {
            return new Response(
              `console.warn("Offline: Chunk not available - ${url.pathname}");`,
              { headers: { 'Content-Type': 'application/javascript' } }
            );
          }
          throw error;
        }
      })()
    );
    return;
  }
  
  // ============================================================
  // Auth APIs - NEVER cache, always fetch fresh
  // ============================================================
  const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => 
    url.pathname.includes(endpoint)
  );
  
  if (isAuthEndpoint) {
    event.respondWith(fetch(request));
    return;
  }
  
  // ============================================================
  // API calls - Cache-only when offline, cache-then-network when online
  // ============================================================
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase.co')) {
    event.respondWith(
      (async () => {
        // OFFLINE: Return cached data only
        if (isOffline || !navigator.onLine) {
          const cached = await fetchFromCacheOnly(request);
          if (cached) return cached;
          
          return new Response(JSON.stringify({ error: 'OFFLINE' }), { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // ONLINE: Try cache first, then network WITH TIMEOUT
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }
        
        // No cache - fetch from network
        try {
          const networkResponse = await fetchWithTimeout(request, 3000);
          if (networkResponse.ok) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          console.log('[SW] ❌ API network failed/timeout:', request.url);
          return new Response(JSON.stringify({ error: 'OFFLINE' }), { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
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