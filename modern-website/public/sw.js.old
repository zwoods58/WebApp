// Fixed Service Worker Fetch Event Handler
// This replaces the broken fetch event in sw.js

// Add this to your existing sw.js, replacing the entire fetch event listener

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // ============================================================
  // Skip non-GET requests and internal Next.js requests
  // ============================================================
  if (event.request.method !== 'GET') return;
  if (url.pathname.includes('/_next/static/chunks/')) return;
  if (url.pathname.includes('/_next/image')) return;
  if (url.searchParams.has('__nextDataReq')) return;
  
  // ============================================================
  // Auth APIs - NEVER cache, always fetch fresh
  // ============================================================
  const isAuthEndpoint = AUTH_ENDPOINTS.some(endpoint => 
    url.pathname.includes(endpoint)
  );
  
  if (isAuthEndpoint) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // ============================================================
  // API Endpoints - Cache-then-network (return cached instantly, update in background)
  // ============================================================
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        // OFFLINE: Simple cache lookup
        if (isOffline || !navigator.onLine) {
          const cached = await caches.match(event.request);
          if (cached) {
            console.log('[SW] Serving cached API response:', url.pathname);
            return cached;
          }
          
          // Return empty data for common endpoints
          if (url.pathname.includes('/api/transactions')) {
            return new Response(JSON.stringify([]), { 
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          console.log('[SW] No cached API data found for:', url.pathname);
          return new Response(JSON.stringify({ error: 'OFFLINE' }), { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // ONLINE: Cache-then-network (return cached instantly, update in background)
        const cached = await caches.match(event.request);
        
        // Fetch in background
        const fetchPromise = fetchWithTimeout(event.request, 5000).then(async (networkResponse) => {
          if (networkResponse.ok) {
            const cache = await caches.open(API_CACHE);
            cache.put(event.request, networkResponse.clone());
            console.log('[SW] Updated cached API:', url.pathname);
          }
          return networkResponse;
        }).catch((error) => {
          console.warn('[SW] Background API fetch failed:', url.pathname);
          return null;
        });
        
        // Return cached instantly if available
        if (cached) {
          console.log('[SW] Serving cached API (background update):', url.pathname);
          // Don't await - let it update in background
          fetchPromise.catch(() => {});
          return cached;
        }
        
        // No cache, wait for network
        console.log('[SW] Fetching API from network:', url.pathname);
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
  // Supabase calls - NEVER CACHE (let TanStack Query handle it)
  // ============================================================
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      (async () => {
        // OFFLINE: Block Supabase when offline
        if (isOffline || !navigator.onLine) {
          console.log('[SW] OFFLINE MODE - Blocking Supabase request:', url.pathname);
          return new Response(
            JSON.stringify({ error: 'OFFLINE', message: 'App is offline - using cached data from IndexedDB' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
        
        // ONLINE: Just pass through - no caching
        console.log('[SW] Online - Passing through Supabase request:', url.pathname);
        try {
          const response = await fetchWithTimeout(event.request, 10000);
          return response;
        } catch (error) {
          console.log('[SW] Supabase fetch failed, treating as offline');
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
  // Everything else - Pass through
  // ============================================================
  event.respondWith(fetch(event.request).catch(() => new Response('Offline', { status: 503 })));
});
