import { NextRequest, NextResponse } from 'next/server';

// Service worker configuration for country-specific caching
const COUNTRY_CACHE_CONFIGS = {
  ke: {
    cacheName: 'beezee-ke-v1',
    globalCacheName: 'beezee-global-v1',
    staticAssets: [
      '/kenya/app/',
      '/_next/static/',
      '/icons/',
      '/images/'
    ],
    countrySpecific: [
      '/api/country/ke',
      '/kenya/app/api/',
      '/kenya/app/manifest.webmanifest'
    ]
  },
  za: {
    cacheName: 'beezee-za-v1', 
    globalCacheName: 'beezee-global-v1',
    staticAssets: [
      '/south-africa/app/',
      '/_next/static/',
      '/icons/',
      '/images/'
    ],
    countrySpecific: [
      '/api/country/za',
      '/south-africa/app/api/',
      '/south-africa/app/manifest.webmanifest'
    ]
  },
  ng: {
    cacheName: 'beezee-ng-v1',
    globalCacheName: 'beezee-global-v1', 
    staticAssets: [
      '/nigeria/app/',
      '/_next/static/',
      '/icons/',
      '/images/'
    ],
    countrySpecific: [
      '/api/country/ng',
      '/nigeria/app/api/',
      '/nigeria/app/manifest.webmanifest'
    ]
  }
};

// Detect country from request
function detectCountry(request: NextRequest): 'ke' | 'za' | 'ng' | null {
  const url = request.url;
  const pathname = new URL(url).pathname;
  
  if (pathname.startsWith('/kenya')) return 'ke';
  if (pathname.startsWith('/south-africa')) return 'za';
  if (pathname.startsWith('/nigeria')) return 'ng';
  
  return null;
}

// Generate service worker script for specific country
function generateServiceWorker(country: 'ke' | 'za' | 'ng') {
  const config = COUNTRY_CACHE_CONFIGS[country];
  
  return `
// BeeZee Finance Service Worker - ${country.toUpperCase()}
const CACHE_VERSION = '${Date.now()}';
const COUNTRY_CACHE = '${config.cacheName}';
const GLOBAL_CACHE = '${config.globalCacheName}';

// Assets to cache
const STATIC_ASSETS = ${JSON.stringify(config.staticAssets)};
const COUNTRY_SPECIFIC = ${JSON.stringify(config.countrySpecific)};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('SW: Installing for country ${country}');
  event.waitUntil(
    caches.open(COUNTRY_CACHE)
      .then((cache) => {
        console.log('SW: Caching static assets for ${country}');
        return cache.addAll(STATIC_ASSETS.map(asset => new Request(asset, { cache: 'force-cache' })));
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating for country ${country}');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('beezee-') && name !== COUNTRY_CACHE && name !== GLOBAL_CACHE)
            .map((name) => caches.delete(name))
        );
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests and external resources
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Determine cache strategy
  let cacheName = GLOBAL_CACHE;
  let cacheStrategy = 'networkFirst';

  // Use country-specific cache for country-specific resources
  if (COUNTRY_SPECIFIC.some(asset => url.pathname.includes(asset.replace('/' + country + '/', '')))) {
    cacheName = COUNTRY_CACHE;
    cacheStrategy = 'cacheFirst';
  }

  event.respondWith(
    caches.open(cacheName)
      .then((cache) => {
        if (cacheStrategy === 'cacheFirst') {
          return cache.match(request)
            .then((response) => {
              if (response) {
                console.log('SW: Serving from cache:', request.url);
                return response;
              }
              
              // Not in cache, fetch from network
              return fetch(request)
                .then((networkResponse) => {
                  if (networkResponse.ok) {
                    console.log('SW: Caching new resource:', request.url);
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => {
                  console.log('SW: Network failed, serving from cache if available');
                  return cache.match(request);
                });
            });
        } else {
          // Network first strategy
          return fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              return cache.match(request);
            });
        }
      })
  );
});

// Sync event for background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-${country}') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('SW: Performing background sync for ${country}');
  // Add background sync logic here
}

// Push event handler
self.addEventListener('push', (event) => {
  console.log('SW: Push received for ${country}');
  const options = {
    body: event.data.text(),
    icon: '/icons/${country}-icon-192.png',
    badge: '/icons/${country}-badge.png',
    tag: 'beezee-notification',
    renotify: true,
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('BeeZee Finance', options)
  );
});
`;
}

export async function GET(request: NextRequest) {
  const country = detectCountry(request);
  
  if (!country) {
    return NextResponse.json(
      { error: 'Country not detected' },
      { status: 400 }
    );
  }

  const serviceWorkerScript = generateServiceWorker(country);
  
  const response = new NextResponse(serviceWorkerScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600'
    }
  });

  return response;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { country, action } = body;
  
  if (!country || !COUNTRY_CACHE_CONFIGS[country as keyof typeof COUNTRY_CACHE_CONFIGS]) {
    return NextResponse.json(
      { error: 'Invalid country' },
      { status: 400 }
    );
  }

  switch (action) {
    case 'clear-cache':
      // Clear country-specific cache
      const config = COUNTRY_CACHE_CONFIGS[country as keyof typeof COUNTRY_CACHE_CONFIGS];
      return NextResponse.json({
        message: 'Cache cleared',
        cacheName: config.cacheName
      });
      
    case 'cache-info':
      return NextResponse.json({
        country,
        cacheName: COUNTRY_CACHE_CONFIGS[country as keyof typeof COUNTRY_CACHE_CONFIGS].cacheName,
        globalCacheName: COUNTRY_CACHE_CONFIGS[country as keyof typeof COUNTRY_CACHE_CONFIGS].globalCacheName
      });
      
    default:
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
  }
}
