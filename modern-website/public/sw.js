const CACHE_VERSION = "v110-3e8194a-1776593637181"; // temporary manual bump to test
const CACHE_NAME = `html-cache-${CACHE_VERSION}`;
const STATIC_ASSETS_CACHE = `static-assets-${CACHE_VERSION}`;
const CACHE_WHITELIST = [CACHE_NAME, STATIC_ASSETS_CACHE];
const TTL = 10 * 60 * 1000; // 10 minutes
const OFFLINE_URL = "/offline.html";

let cacheDisabled = false;
// Array of routes/patterns that are not cached
const CACHE_EXCLUDE = []; // ["/api/", "/admin", "/some-dynamic-route"]

function shouldCache(request) {
  return !CACHE_EXCLUDE.some((path) => request.url.includes(path));
}

const MESSAGE_EVENT_TYPES = {
  CACHE_CURRENT_HTML: "CACHE_CURRENT_HTML",
  REVALIDATE_URL: "REVALIDATE_URL",
  DISABLE_CACHE: "DISABLE_CACHE",
  ENABLE_CACHE: "ENABLE_CACHE",
  CLEAR_STATIC_CACHE: "CLEAR_STATIC_CACHE",
};

// Check: is it HTML
const isHTML = (request) => {
  const url = new URL(request.url);
  // Next.js RSC requests (ending in .rsc or having _rsc query param) should NOT be treated as HTML for caching
  if (url.searchParams.has('_rsc') || url.pathname.endsWith('.rsc')) {
    return false;
  }
  return request.headers.get("accept")?.includes("text/html");
};

// Single install listener
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_ASSETS_CACHE).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

// Single activate listener
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          const isOldCache =
            (cacheName.startsWith("html-cache-") || cacheName.startsWith("static-assets-")) &&
            !CACHE_WHITELIST.includes(cacheName);
          const isLegacyV2 = cacheName === "html-cache-v2" || cacheName === "static-assets-v2";
          if (isOldCache || isLegacyV2) {
            console.log("[SW] Purging stale cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Processing fetch requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (cacheDisabled || !shouldCache(request)) {
    return;
  }

  // HTML pages - Network First with Background Update
  if (isHTML(request)) {
    const url = new URL(request.url);
    // Normalize URL: collapse multiple slashes
    const normalizedPath = url.pathname.replace(/\/+/g, '/');
    const normalizedUrl = url.origin + normalizedPath + url.search;

    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(normalizedUrl);
        
        // If we are online, try network first
        if (navigator.onLine) {
          try {
            const response = await fetch(request);
            if (response.ok) {
              cache.put(normalizedUrl, response.clone());
              cache.put(
                normalizedUrl + ":ts",
                new Response(JSON.stringify({ ts: Date.now() }))
              );
            }
            return response;
          } catch (err) {
            console.log("[SW] Network fetch failed, falling back to cache:", normalizedUrl);
          }
        }

        // Offline or Network failed - return cached if available
        if (cached) {
          return cached;
        }

        // No cache - check for offline page
        const fallback = await caches.match(OFFLINE_URL);
        return fallback || new Response("Offline", { status: 503 });
      })
    );
  }

  // Static assets
  else {
    event.respondWith(
      caches.open(STATIC_ASSETS_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          return (
            cached ||
            fetch(request)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(request, response.clone()); //the body of the response can be read only once, so we clone it
                }
                return response;
              })
              .catch(() => undefined)
          );
        })
      )
    );
  }
});

// Processing messages from the client (SPA navigation and invalidation)
self.addEventListener("message", (event) => {
  const { type, url, ts, html } = event.data || {};

  // Global enable/disable caching
  if (type === MESSAGE_EVENT_TYPES.DISABLE_CACHE) {
    cacheDisabled = true;
  }
  if (type === MESSAGE_EVENT_TYPES.ENABLE_CACHE) {
    cacheDisabled = false;
  }

  // Fast activation of a new service worker
  if (type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  // Invalidation by URL to update the cache manually
  if (type === MESSAGE_EVENT_TYPES.REVALIDATE_URL && url) {
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const response = await fetch(url, { headers: { Accept: "text/html" } });
        await cache.put(url, response.clone());
        await cache.put(
          url + ":ts",
          new Response(JSON.stringify({ ts: Date.now() }))
        );
        console.log("[SW] Revalidated and updated cache for:", url);
      } catch (err) {
        console.error("[SW] Failed to revalidate cache for:", url, err);
      }
    });
  }

  // Clear static assets cache (for API data revalidation)
  if (type === MESSAGE_EVENT_TYPES.CLEAR_STATIC_CACHE) {
    console.log("[SW] Received CLEAR_STATIC_CACHE message");
    caches
      .open(STATIC_ASSETS_CACHE)
      .then(async (cache) => {
        const keys = await cache.keys();
        console.log(
          "[SW] Found",
          keys.length,
          "entries in static assets cache"
        );
        await Promise.all(keys.map((key) => cache.delete(key)));
        console.log("[SW] Cleared static assets cache");
      })
      .catch((err) => {
        console.error("[SW] Error clearing static assets cache:", err);
      });
  }

  // SPA: manually cache HTML, but only if TTL has expired or there is no cache

  // In SPA navigation does not require a full page reload
  // The service worker cannot automatically intercept HTML during SPA navigation
  // The client code must explicitly tell the service worker about the new page

  if (type === MESSAGE_EVENT_TYPES.CACHE_CURRENT_HTML && html && url) {
    if (cacheDisabled) {
      console.log("[SW] Skipping cache (cacheDisabled):", url);
      return;
    }

    const parsedUrl = new URL(url);
    const normalizedPath = parsedUrl.pathname.replace(/\/+/g, '/');
    const normalizedUrl = parsedUrl.origin + normalizedPath + parsedUrl.search;

    caches.open(CACHE_NAME).then(async (cache) => {
      const response = new Response(html, {
        headers: { "Content-Type": "text/html" },
      });

      await cache.put(normalizedUrl, response.clone());
      await cache.put(
        normalizedUrl + ":ts",
        new Response(JSON.stringify({ ts: ts || Date.now() }))
      );

      console.log("[SW] Cached current page:", normalizedUrl);
    });
  }
});
