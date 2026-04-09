/**
 * Beezee App Service Worker - Smart User-Specific Caching
 * Pre-caches public pages, then caches user routes after login
 */

// Dynamic version that will be fetched from API
let CACHE_VERSION = 'v110';
let CURRENT_VERSION = 'v110';

// Helper function to get current version from API
async function getCurrentVersion() {
  try {
    const response = await fetch('/api/version-check');
    const data = await response.json();
    return data.version || 'v110';
  } catch (error) {
    console.warn('[SW] Failed to fetch current version, using fallback:', error);
    return 'v110';
  }
}

// Update cache names dynamically
function updateCacheNames(version) {
  CACHE_VERSION = version;
  CURRENT_VERSION = version;
  return {
    STATIC_CACHE: `beezee-static-${version}`,
    API_CACHE: `beezee-api-${version}`,
    PAGE_CACHE: `beezee-pages-${version}`
  };
}

// Initialize cache names
let cacheNames = updateCacheNames(CACHE_VERSION);
let STATIC_CACHE = cacheNames.STATIC_CACHE;
let API_CACHE = cacheNames.API_CACHE;
let PAGE_CACHE = cacheNames.PAGE_CACHE;
const BASE_PATH = '/Beezee-App';

// RSC Request Throttling
let activeRSCRequests = 0;
const MAX_CONCURRENT_RSC = 2;

// Public routes that can be cached during install (no auth required)
const PUBLIC_ROUTES = [
  BASE_PATH + '/',
  '/manifest.json',
  '/offline.html',
  '/Beezee-App/',
  '/Beezee-App/setup',
  // PWA Icons (at root level)
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

// Google Fonts to cache (cross-origin)
// These fonts are loaded from globals.css and beezee.module.css
const GOOGLE_FONTS = [
  // Figtree (from globals.css) - Regular weight
  'https://fonts.gstatic.com/s/figtree/v9/_Xms-HUzqDCFdgfMm4S9DQ.woff2',
  
  // Poppins (from beezee.module.css) - Multiple weights for better coverage
  'https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2', // Regular
  'https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrJJfecg.woff2',   // Medium
  'https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2', // Bold
  
  // Inter (from beezee.module.css) - Multiple weights for better coverage
  'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2', // Regular
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',  // Medium
  'https://fonts.gstatic.com/s/inter/v20/UcBB3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', // Bold
  
  // Additional fallback fonts that might be requested
  'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7.woff2', // Italic
  'https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrJJfecg.woff2',   // Medium Italic
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

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING requested - activating new version');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'OFFLINE_STATUS') {
    isOffline = event.data.isOffline;
    console.log('[SW] 📊 Offline status updated from main thread:', isOffline ? 'OFFLINE' : 'ONLINE');
  }
  
  if (event.data && event.data.type === 'CACHE_USER_ROUTES') {
    userCountry = event.data.country;
    userIndustry = event.data.industry;
    console.log('[SW] User routes updated:', { userCountry, userIndustry });
  }
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
// INSTALL - Cache static assets and sync version
// ============================================================
self.addEventListener('install', (event) => {
  console.log(`[SW] 🚀 Installing service worker...`);
  
  // Fetch current version from API and update cache names
  event.waitUntil(
    (async () => {
      try {
        // Get dynamic version from API
        const currentVersion = await getCurrentVersion();
        console.log(`[SW] � Installing service worker version: ${currentVersion}`);
        
        // Update cache names with current version
        cacheNames = updateCacheNames(currentVersion);
        STATIC_CACHE = cacheNames.STATIC_CACHE;
        API_CACHE = cacheNames.API_CACHE;
        PAGE_CACHE = cacheNames.PAGE_CACHE;
        
        console.log(`[SW] 🔄 Updated cache names to version: ${currentVersion}`);
        
        // Clear old caches before installing new ones
        const cacheNamesList = await caches.keys();
        const oldCaches = cacheNamesList.filter(name => 
          name.includes('beezee-') && !name.includes(currentVersion)
        );
        
        console.log('[SW] 🧹 Clearing old caches:', oldCaches);
        await Promise.all(oldCaches.map(name => caches.delete(name)));
        
        // Install new caches
        const staticCache = await caches.open(STATIC_CACHE);
        console.log('[SW] 📦 Caching static assets...');
        
        let cachedCount = 0;
        let failedCount = 0;
        
        for (const route of PUBLIC_ROUTES) {
          try {
            const response = await fetch(route);
            if (response.ok) {
              await staticCache.put(route, response);
              cachedCount++;
            } else {
              failedCount++;
              console.warn(`[SW] ⚠️ Failed to cache ${route}: ${response.status}`);
            }
          } catch (err) {
            failedCount++;
            console.warn(`[SW] ⚠️ Error caching ${route}:`, err.message);
          }
        }
        
        console.log(`[SW] ✅ Cached ${cachedCount}/${PUBLIC_ROUTES.length} assets (${failedCount} failed)`);
        
        // ✅ USER CONTROL: Don't force activation - wait for user consent
        // await self.skipWaiting(); // REMOVED: Let user control activation
        
        // Notify all clients that an update is available (but don't force activation)
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATE_AVAILABLE',
            version: currentVersion
          });
        });
        
        console.log(`[SW] 📢 Notified ${clients.length} clients of update availability (version: ${currentVersion})`);
      } catch (error) {
        console.warn('[SW] ⚠️ Install phase error:', error);
      }
    })()
  );
});

// ============================================================
// ACTIVATE: Clean old caches and claim clients
// ============================================================
self.addEventListener('activate', (event) => {
  console.log(`[SW] 🔄 Activating ${CACHE_VERSION}...`);
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        name.includes('beezee-') && !name.includes(CACHE_VERSION)
      );
      
      await Promise.all(oldCaches.map(name => {
        console.log(`[SW] 🗑️ Deleting old cache: ${name}`);
        return caches.delete(name);
      }));
      
      // ✅ USER CONTROL: Don't force client control - wait for user consent
      // await clients.claim(); // REMOVED: Let user control activation
      
      console.log(`[SW] ✅ Service worker ${CURRENT_VERSION} activated (waiting for user consent to claim clients)`);
      
      // Only notify clients if this was user-triggered activation
      if (event.userTriggered) {
        // Notify all clients that a new version is active
        const clientsList = await self.clients.matchAll();
        clientsList.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATE_ACTIVATED',
            version: CURRENT_VERSION
          });
        });
        console.log(`[SW] 📢 User-triggered activation complete - notified ${clientsList.length} clients`);
      }
    })()
  );
});

// ============================================================
// MESSAGE HANDLER - Handle messages from app
// ============================================================
self.addEventListener('message', (event) => {
  console.log('[SW] 📨 MESSAGE RECEIVED:', event.data);
  console.log('[SW] 📨 Message source:', event.source);
  console.log('[SW] 📨 Message origin:', event.origin);
  
  const { type, country, industry } = event.data;
  
  // Handle user route caching after login
  if (type === 'CACHE_USER_ROUTES') {
    console.log('[SW] 📦 Received CACHE_USER_ROUTES message!');
    console.log('[SW] 📦 User routes data:', { country, industry });
    console.log('[SW] 📦 Current stored routes:', { userCountry, userIndustry });
    
    // Update stored user info
    userCountry = country;
    userIndustry = industry;
    
    console.log('[SW] 🚀 Starting cacheUserRoutes...');
    
    // Cache user's routes in background (don't block)
    event.waitUntil(
      cacheUserRoutes(country, industry).then(() => {
        console.log('[SW] ✅ cacheUserRoutes completed successfully!');
      }).catch(error => {
        console.error('[SW] ❌ cacheUserRoutes failed:', error);
      })
    );
    
    // Send immediate response
    event.ports[0]?.postMessage({ 
      type: 'CACHE_ROUTES_STARTED',
      country, 
      industry 
    });
    
    return;
  }
  
  // Handle update check request
  if (type === 'CHECK_UPDATE') {
    console.log('[SW] 🔍 CHECK_UPDATE received - checking for new version...');
    event.waitUntil(
      (async () => {
        const registration = await self.registration;
        await registration.update();
        console.log('[SW] ✅ Update check completed');
      })()
    );
    return;
  }
  
  // Handle manual update trigger from "Update Now" button - USER CONTROLLED ACTIVATION
  if (type === 'SKIP_WAITING') {
    console.log('[SW] 🔄 USER REQUESTED UPDATE - activating new version with user consent...');
    
    // Notify client that update is starting
    if (event.source) {
      event.source.postMessage({ type: 'SW_UPDATE_STARTED' });
    }
    
    // ✅ USER CONTROL: Only activate when user explicitly requests
    self.skipWaiting();
    
    // Claim clients after user-triggered activation
    self.clients.claim().then(() => {
      console.log('[SW] ✅ User-triggered activation - claimed clients');
      
      // Notify all clients that new SW is activated with current version
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ 
            type: 'SW_ACTIVATED',
            version: CURRENT_VERSION 
          });
        });
        console.log('[SW] ✅ User-controlled activation complete - notified', clients.length, 'clients of version', CURRENT_VERSION);
      });
    }).catch(error => {
      console.error('[SW] ❌ Error claiming clients after user activation:', error);
    });
  }
  
  // Log unknown message types
  console.log('[SW] ❓ Unknown message type:', type);
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

// Helper function to generate offline page
function generateOfflinePage() {
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>BeeZee - Offline</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: #f9fafb; }
          .container { max-width: 400px; margin: 50px auto; text-align: center; }
          .icon { width: 48px; height: 48px; margin: 0 auto 20px; background: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; }
          .offline-text { color: #92400e; font-size: 18px; font-weight: 600; margin-bottom: 10px; }
          .message { color: #6b7280; margin-bottom: 20px; }
          .refresh-btn { background: #f59e0b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📱</div>
          <div class="offline-text">You're Offline</div>
          <div class="message">Cached page not available. Please check your connection and try again.</div>
          <button class="refresh-btn" onclick="window.location.reload()">Refresh</button>
        </div>
      </body>
    </html>
  `, { 
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

/**
 * Fetch from cache only - no network attempts
 * Returns cached response or null
 * Validates JS files to prevent serving corrupted cache
 */
async function fetchFromCacheOnly(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Validate JS files to prevent syntax errors from corrupted cache
    const url = new URL(request.url);
    if (url.pathname.endsWith('.js')) {
      try {
        const text = await cached.clone().text();
        // Basic validation: check if file is not empty and doesn't start with error messages
        if (!text || text.length < 10 || text.startsWith('<!DOCTYPE') || text.includes('503 Service Unavailable')) {
          console.log('[SW] ⚠️ Corrupted JS cache detected, removing:', request.url);
          const cache = await caches.open(STATIC_CACHE);
          await cache.delete(request);
          return null;
        }
      } catch (err) {
        console.log('[SW] ⚠️ Cache validation failed, removing:', request.url);
        const cache = await caches.open(STATIC_CACHE);
        await cache.delete(request);
        return null;
      }
    }
    console.log('[SW] ✅ Cache hit:', request.url);
    return cached;
  }
  console.log('[SW] ❌ Cache miss:', request.url);
  return null;
}

/**
 * Extract all chunk URLs from HTML response
 * Parses <script src="..."> and <link href="..."> tags
 * Also extracts font files (.woff2) from inline styles and CSS
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
  
  // Match font files in HTML (woff2, woff)
  const fontRegex = /["']([^"']*\.(woff2|woff))["']/g;
  while ((match = fontRegex.exec(htmlText)) !== null) {
    const fontUrl = match[1];
    if (fontUrl.startsWith('/_next/') || fontUrl.startsWith('/')) {
      chunks.add(new URL(fontUrl, baseUrl).href);
    }
  }
  
  // ADDITION: Pre-cache common Next.js chunk patterns that might be dynamically loaded
  const commonChunks = [
    '/_next/static/chunks/[turbopack]_browser_dev_hmr-client_hmr-client_ts_*.js',
    '/_next/static/chunks/src_*_*.js',
    '/_next/static/chunks/node_modules_*_*.js',
    '/_next/static/chunks/_*.js',
    '/_next/static/media/*_*.woff2'
  ];
  
  // Try to fetch and cache common chunk patterns
  for (const pattern of commonChunks) {
    try {
      // Convert pattern to actual URLs by checking what's available
      if (pattern.includes('*')) {
        // For patterns with wildcards, we'll try common variations
        if (pattern.includes('src_*_*.js')) {
          // Try to find actual src chunks from the HTML
          const srcChunkRegex = /\/_next\/static\/chunks\/src_[a-f0-9]+\.js/g;
          const srcMatches = htmlText.match(srcChunkRegex);
          if (srcMatches) {
            srcMatches.forEach(chunk => {
              chunks.add(new URL(chunk, baseUrl).href);
            });
          }
        }
        if (pattern.includes('node_modules_*_*.js')) {
          // Try to find actual node_modules chunks
          const nodeChunkRegex = /\/_next\/static\/chunks\/node_modules_[a-f0-9]+\.js/g;
          const nodeMatches = htmlText.match(nodeChunkRegex);
          if (nodeMatches) {
            nodeMatches.forEach(chunk => {
              chunks.add(new URL(chunk, baseUrl).href);
            });
          }
        }
        if (pattern.includes('media/*_*.woff2')) {
          // Try to find actual font files
          const fontChunkRegex = /\/_next\/static\/media\/[a-f0-9]+-s\.[a-f0-9]+\.woff2/g;
          const fontMatches = htmlText.match(fontChunkRegex);
          if (fontMatches) {
            fontMatches.forEach(chunk => {
              chunks.add(new URL(chunk, baseUrl).href);
            });
          }
        }
      }
    } catch (err) {
      // Ignore errors in pattern matching
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
  console.log(`[SW] 📦 cacheUserRoutes called with:`, { country, industry });
  console.log(`[SW] 📦 Starting to cache routes for authenticated user...`);
  
  // Wait 2 seconds for session to fully establish after login
  console.log(`[SW] ⏳ Waiting 2 seconds for session to establish...`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(`[SW] ⏰ Session wait complete, starting caching...`);
  
  const routesToCache = [
    `/Beezee-App/app/${country}/${industry}`,           // Dashboard
    `/Beezee-App/app/${country}/${industry}/cash`,      // Cash transactions
    `/Beezee-App/app/${country}/${industry}/credit`,    // Credit management
    `/Beezee-App/app/${country}/${industry}/services`,  // Services
    `/Beezee-App/app/${country}/${industry}/stock`,     // Stock/inventory
    `/Beezee-App/app/${country}/${industry}/beehive`,   // Beehive
    `/Beezee-App/app/${country}/${industry}/appointments`,  // Appointments
    `/Beezee-App/app/${country}/${industry}/reports`,   // Reports
    `/Beezee-App/app/${country}/${industry}/more`,      // More page
    `/Beezee-App/app/${country}/${industry}/settings`,  // Settings
    `/Beezee-App/app/${country}/${industry}/transactions`, // Transactions
  ];
  
  console.log(`[SW] 📦 Routes to cache:`, routesToCache);
  console.log(`[SW] 📦 Starting to cache ${routesToCache.length} routes + chunks for: ${country}/${industry}`);
  
  const pageCache = await caches.open(PAGE_CACHE);
  const staticCache = await caches.open(STATIC_CACHE);
  let cached = 0;
  let failed = 0;
  let totalChunks = 0;
  
  for (const route of routesToCache) {
    console.log(`[SW] 🔄 Processing route ${cached + failed + 1}/${routesToCache.length}: ${route}`);
    
    try {
      // Fetch HTML page with cache control
      console.log(`[SW] 📡 Fetching route: ${route}`);
      const htmlResponse = await fetch(route, {
        headers: {
          'Accept': 'text/html',
          'Cache-Control': 'no-cache',
        },
        credentials: 'include',
      });
      
      console.log(`[SW] 📊 Response for ${route}:`, {
        ok: htmlResponse.ok,
        status: htmlResponse.status,
        statusText: htmlResponse.statusText,
        url: htmlResponse.url,
        redirected: htmlResponse.redirected
      });
      
      // Only cache if response is 200 and doesn't redirect to login
      if (!htmlResponse.ok || 
          htmlResponse.status !== 200 || 
          htmlResponse.url.includes('/auth/login')) {
        failed++;
        console.warn(`[SW] ❌ Skipped (redirect or error): ${route}`, {
          ok: htmlResponse.ok,
          status: htmlResponse.status,
          url: htmlResponse.url,
          isLoginRedirect: htmlResponse.url.includes('/auth/login')
        });
        continue;
      }
      
      // Cache the HTML page with pathname as key
      const cacheKey = new URL(route, self.location.origin).pathname;
      await pageCache.put(cacheKey, htmlResponse.clone());
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
          // Use CORS mode for cross-origin resources (like Google Fonts)
          const isExternal = !chunkUrl.startsWith(self.location.origin);
          const chunkResponse = await fetch(chunkUrl, isExternal ? { mode: 'cors' } : {});
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
  
  // Cache Google Fonts
  await cacheGoogleFonts();
  
  // Cache static assets after routes
  await cacheStaticAssets();
  
  // ADDITION: Force cache all discovered chunks for comprehensive offline support
  await cacheAllDiscoveredChunks();
  
  // Calculate and log cache size
  const totalSize = await calculateCacheSize();
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log(`[SW] 💾 Total cache size: ${sizeMB} MB`);
  
  if (totalSize > 50 * 1024 * 1024) { // 50MB
    console.warn(`[SW] ⚠️ Cache size exceeds 50MB! Consider cleanup.`);
  }
}

// ============================================================
// Cache all discovered chunks for comprehensive offline support
// ============================================================
async function cacheAllDiscoveredChunks() {
  console.log('[SW] 📦 Caching all discovered chunks...');
  
  try {
    const staticCache = await caches.open(STATIC_CACHE);
    let chunksCached = 0;
    
    // Common Next.js chunk patterns that might be missed
    const commonChunkPatterns = [
      '/_next/static/chunks/src_',
      '/_next/static/chunks/node_modules_',
      '/_next/static/chunks/_',
      '/_next/static/chunks/[turbopack]_',
      '/_next/static/media/',
      '/_next/static/chunks/framework-',
      '/_next/static/chunks/main-',
      '/_next/static/chunks/webpack-',
      '/_next/static/chunks/pages/_app-',
      '/_next/static/chunks/pages/_document-'
    ];
    
    // Try to fetch and cache common chunk variations
    for (const pattern of commonChunkPatterns) {
      try {
        // For each pattern, try to find actual files by checking the current cache
        const existingKeys = await staticCache.keys();
        const matchingKeys = existingKeys.filter(key => 
          key.url.includes(pattern.replace('/_next/static/', ''))
        );
        
        // Cache any matching chunks found
        for (const key of matchingKeys) {
          try {
            const response = await staticCache.match(key);
            if (response && response.ok) {
              chunksCached++;
              console.log(`[SW] ✅ Verified cached chunk: ${key.url}`);
            }
          } catch (err) {
            console.warn(`[SW] ⚠️ Failed to verify chunk: ${key.url}`);
          }
        }
      } catch (err) {
        // Continue with next pattern
      }
    }
    
    // Also try to cache any chunks that might be dynamically loaded
    const dynamicChunks = [
      '/_next/static/chunks/src_app_Beezee-App_app_[country]_[industry]_appointments_page_tsx_*.js',
      '/_next/static/chunks/src_app_Beezee-App_app_[country]_[industry]_services_page_tsx_*.js',
      '/_next/static/chunks/src_app_Beezee-App_app_[country]_[industry]_credit_page_tsx_*.js',
      '/_next/static/chunks/src_893ea067._.js',
      '/_next/static/chunks/node_modules_31524f5e._.js'
    ];
    
    console.log(`[SW] ✅ Verified ${chunksCached} chunks in cache`);
    
  } catch (error) {
    console.warn('[SW] ⚠️ Error in cacheAllDiscoveredChunks:', error);
  }
}

// ============================================================
// Cache Google Fonts with CORS
// ============================================================
async function cacheGoogleFonts() {
  console.log('[SW] 📦 Caching Google Fonts...');
  const staticCache = await caches.open(STATIC_CACHE);
  let fontsCached = 0;
  
  for (const fontUrl of GOOGLE_FONTS) {
    try {
      const response = await fetch(fontUrl, { mode: 'cors' });
      if (response.ok) {
        await staticCache.put(fontUrl, response);
        fontsCached++;
        console.log(`[SW] ✅ Cached Google Font: ${fontUrl}`);
      }
    } catch (err) {
      console.warn(`[SW] ⚠️ Failed to cache Google Font: ${fontUrl}`);
    }
  }
  
  console.log(`[SW] ✅ Cached ${fontsCached}/${GOOGLE_FONTS.length} Google Fonts`);
}

// ============================================================
// Cache static assets (JS chunks, CSS)
// ============================================================
async function cacheStaticAssets() {
  console.log('[SW] 📦 Caching static assets...');
  
  try {
    // Fetch the homepage to extract asset URLs
    const response = await fetch(BASE_PATH + '/');
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
// Helper function to check if a route is a user route that should be cached
// ============================================================
function isUserRoute(pathname) {
  return pathname.startsWith('/Beezee-App/app/') && 
         (pathname.includes('/cash') ||
          pathname.includes('/credit') ||
          pathname.includes('/services') ||
          pathname.includes('/stock') ||
          pathname.includes('/beehive') ||
          pathname.includes('/appointments') ||
          pathname.includes('/reports') ||
          pathname.includes('/more') ||
          pathname.includes('/settings') ||
          pathname.match(/^\/Beezee-App\/app\/[^\/]+\/[^\/]+\/?$/)); // Dashboard route
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
  
  // Skip Next.js internal and HMR chunks
  if (url.pathname.startsWith('/__next') || 
      url.pathname.includes('webpack') ||
      url.pathname.includes('hot-update') ||
      url.pathname.includes('hmr-client') ||
      url.pathname.includes('[turbopack]')) {
    return;
  }
  
  // Skip prefetch requests
  if (url.searchParams.has('next-router-prefetch') ||
      url.searchParams.has('next-router-segment-prefetch')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // ============================================================
  // RSC Requests - Cache with offline support and throttling
  // ============================================================
  if (url.searchParams.has('_rsc')) {
    const swOffline = isOffline;
    const browserOffline = !navigator.onLine;
    const isActuallyOffline = swOffline || browserOffline;
    
    // Handle RSC request with throttling and caching
    event.respondWith(
      (async () => {
        // Throttle RSC requests to prevent flooding
        if (!isActuallyOffline) {
          while (activeRSCRequests >= MAX_CONCURRENT_RSC) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          activeRSCRequests++;
        }
        
        try {
          if (isActuallyOffline) {
            // Offline: Try to serve cached RSC response
            console.log('[SW] 📴 RSC request offline, checking cache:', url.pathname);
            
            // Try to find cached RSC response first
            const cachedRSC = await caches.match(request);
            if (cachedRSC) {
              console.log('[SW] ✅ Serving cached RSC response:', url.pathname);
              return cachedRSC;
            }
            
            // Try to find cached HTML for this route
            const basePath = url.pathname;
            const cacheKeys = [
              basePath,
              basePath + '/',
              basePath.replace(/\/$/, '')
            ];
            
            for (const key of cacheKeys) {
              const cached = await caches.match(key);
              if (cached) {
                console.log('[SW] ✅ Serving cached HTML for RSC request:', key);
                return cached;
              }
            }
            
            // No cached RSC - return lightweight empty response (not 503!)
            console.log('[SW] 📴 Returning empty RSC response (offline):', url.pathname);
            return new Response('[]', {
              status: 200,
              headers: {
                'Content-Type': 'text/x-component',
                'X-Offline': 'true'
              }
            });
          }
          
          // Online: Fetch and cache RSC response for offline use
          console.log('[SW] 🌐 Fetching and caching RSC request:', url.pathname);
          try {
            const response = await fetch(request);
            if (response.ok) {
              const cache = await caches.open(PAGE_CACHE);
              cache.put(request, response.clone());
              console.log('[SW] 💾 Cached RSC response:', url.pathname);
            }
            return response;
          } catch (error) {
            console.error('[SW] RSC fetch failed:', error);
            // Fallback to cached response
            const cached = await caches.match(request);
            if (cached) return cached;
            // Ultimate fallback: empty response
            return new Response('[]', { 
              status: 200,
              headers: { 'Content-Type': 'text/x-component' }
            });
          }
        } finally {
          // Decrement counter for online requests
          if (!isActuallyOffline) {
            activeRSCRequests--;
          }
        }
      })()
    );
    return;
  }
  
  // ============================================================
  // HTML Pages - Cache-first with offline support
  // ============================================================
  if (request.destination === 'document' || 
      url.pathname === '/' ||
      url.pathname.startsWith('/Beezee-App/')) {
    
    event.respondWith(
      (async () => {
        const cacheKey = url.pathname;
        
        // OFFLINE: Cache-only mode (instant!)
        const swOffline = isOffline;
        const browserOffline = !navigator.onLine;
        const isActuallyOffline = swOffline || browserOffline;
        
        console.log('[SW] 📊 Offline check:', {
          pathname: url.pathname,
          swOffline,
          browserOffline,
          isActuallyOffline,
          cacheKey
        });
        
        if (isActuallyOffline) {
          // Enhanced cache lookup - try multiple cache key variations
          const cacheKeys = [
            url.pathname,                    // Original pathname
            request.url,                    // Full request URL
            url.pathname + '/',              // With trailing slash
            url.pathname.replace(/\/$/, ''), // Without trailing slash
            BASE_PATH + url.pathname,        // With BASE_PATH prefix
            BASE_PATH + url.pathname + '/',  // With BASE_PATH and trailing slash
          ];
          
          console.log('[SW] 🔍 Trying cache keys for offline page:', { pathname: url.pathname, cacheKeys });
          
          // Try each cache key variation in current cache
          for (const key of cacheKeys) {
            const cached = await caches.match(key);
            if (cached) {
              console.log('[SW] ✅ Found cached page with key:', key);
              return cached;
            }
          }
          
          // Try cross-cache search (older versions) as fallback
          console.log('[SW] 🔍 Trying cross-cache search for offline page...');
          const cacheVersions = await caches.keys();
          for (const cacheName of cacheVersions) {
            if (cacheName.includes('beezee-pages') || cacheName.includes('beezee-static')) {
              try {
                const cache = await caches.open(cacheName);
                for (const key of cacheKeys) {
                  const cached = await cache.match(key);
                  if (cached) {
                    console.log('[SW] ✅ Found in cross-cache:', cacheName, 'with key:', key);
                    return cached;
                  }
                }
              } catch (err) {
                console.warn('[SW] ⚠️ Error accessing cache:', cacheName, err.message);
              }
            }
          }
          
          // Ultimate fallback - offline.html
          console.log('[SW] ❌ No cached page found, serving offline.html');
          const offlinePage = await caches.match(BASE_PATH + '/offline.html');
          if (offlinePage) {
            console.log('[SW] ✅ Serving offline.html');
            return offlinePage;
          }
          
          // Last resort - generated offline page
          console.log('[SW] ❌ No offline.html found, generating fallback page');
          return generateOfflinePage();
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
          if (response.ok && !response.url.includes('/auth/login')) {
            const cache = await caches.open(PAGE_CACHE);
            cache.put(cacheKey, response.clone());
          }
          return response;
        } catch (error) {
          // Network failed or timed out - try to serve from cache as fallback
          console.log('[SW] 📴 Network failed, trying cache fallback:', cacheKey);
          const cached = await caches.match(cacheKey);
          if (cached) {
            console.log('[SW] ✅ Serving from cache (network fallback):', cacheKey);
            return cached;
          }
          
          // No cache available - serve offline.html
          console.log('[SW] ❌ No cache available, serving offline.html');
          const offlinePage = await caches.match(BASE_PATH + '/offline.html');
          return offlinePage || generateOfflinePage();
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
          console.log('[SW] 📵 Offline mode - serving static asset:', url.pathname);
          
          const cached = await fetchFromCacheOnly(request);
          if (cached) {
            console.log('[SW] ✅ Serving static from cache (offline):', url.pathname);
            return cached;
          }
          
          // Missing chunk - return empty module to prevent hang
          if (url.pathname.endsWith('.js')) {
            return new Response(
              `console.warn("Offline: Chunk not available - ${url.pathname}");`,
              { headers: { 'Content-Type': 'application/javascript' } }
            );
          }
          
          console.log('[SW] ❌ Missing static asset offline:', url.pathname);
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
  // ✅ UPDATED: API calls - ONLY cache internal APIs, NOT Supabase
  // TanStack Query + IndexedDB handle Supabase data, so we just pass through
  // ============================================================
  
  // Internal APIs (/api/*) - Cache-then-network
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        // OFFLINE: Return cached data only
        if (isOffline || !navigator.onLine) {
          console.log('[SW] 📵 Offline mode - serving cached API data:', url.pathname);
          
          // Simple cache lookup
          const cached = await fetchFromCacheOnly(request);
          if (cached) {
            console.log('[SW] ✅ Serving cached API response:', url.pathname);
            return cached;
          }
          
          // Return empty data for common endpoints
          if (url.pathname.includes('/api/transactions')) {
            return new Response(JSON.stringify([]), { 
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          if (url.pathname.includes('/api/expenses')) {
            return new Response(JSON.stringify([]), { 
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          console.log('[SW] ❌ No cached API data found for:', url.pathname);
          return new Response(JSON.stringify({ error: 'OFFLINE' }), { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // ONLINE: Cache-then-network (return cached instantly, update in background)
        const cached = await caches.match(request);
        
        // Fetch in background
        const fetchPromise = fetchWithTimeout(request, 5000).then(async (networkResponse) => {
          if (networkResponse.ok) {
            const cache = await caches.open(API_CACHE);
            cache.put(request, networkResponse.clone());
            console.log('[SW] ✅ Updated cached API:', url.pathname);
          }
          return networkResponse;
        }).catch((error) => {
          console.warn('[SW] ⚠️ Background API fetch failed:', url.pathname);
          return null;
        });
        
        // Return cached instantly if available
        if (cached) {
          console.log('[SW] ✅ Serving cached API (background update):', url.pathname);
          // Don't await - let it update in background
          fetchPromise.catch(() => {});
          return cached;
        }
        
        // No cache, wait for network
        console.log('[SW] 📡 Fetching API from network:', url.pathname);
        const networkResponse = await fetchPromise;
        if (networkResponse) return networkResponse;
        
        return new Response(JSON.stringify({ error: 'OFFLINE' }), { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })()
    );
    return;
  }
  
  // ============================================================
  // ✅ UPDATED: Supabase calls - NEVER CACHE (let TanStack Query handle it)
  // ============================================================
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      (async () => {
        // OFFLINE: Multiple checks to ensure we block Supabase when offline
        const swOffline = isOffline;
        const browserOffline = !navigator.onLine;
        const isActuallyOffline = swOffline || browserOffline;
        
        if (isActuallyOffline) {
          console.log('[SW] 📴 OFFLINE MODE - Blocking Supabase request, TanStack Query will use IndexedDB:', url.pathname);
          return new Response(
            JSON.stringify({ error: 'OFFLINE', message: 'App is offline - using cached data from IndexedDB' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // ONLINE: Just pass through - no caching
        console.log('[SW] 🌐 Online - Passing through Supabase request:', url.pathname);
        try {
          const response = await fetchWithTimeout(request, 10000);
          return response;
        } catch (error) {
          console.log('[SW] ⚠️ Supabase fetch failed, treating as offline');
          return new Response(
            JSON.stringify({ error: 'OFFLINE', message: 'Network error - using cached data' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
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