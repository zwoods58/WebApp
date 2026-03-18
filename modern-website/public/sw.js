const CACHE_NAME = 'beezee-app-shell-v1'

// App shell files to pre-cache — HTML routes, JS bundles, CSS, fonts, icons
const APP_SHELL = [
  '/',
  '/Beezee-App',
  '/Beezee-App/auth/login',
  '/Beezee-App/auth/signup',
  '/manifest.json',
  '/beezee-icon-192x192.png',
  '/beezee-icon-512x512.png',
  '/beezee-icon-96x96.png',
  '/beezee-icon-72x72.png',
  '/beezee-icon-128x128.png',
  '/beezee-icon-144x144.png',
  '/beezee-icon-152x152.png',
  '/beezee-icon-384x384.png'
]

// ─── Install: pre-cache app shell ───────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching app shell...')
      return cache.addAll(APP_SHELL)
    })
  )
  self.skipWaiting()
})

// ─── Activate: clean up old caches ──────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => {
        console.log('[SW] Deleting old cache:', k)
        return caches.delete(k)
      }))
    )
  )
  self.clients.claim()
})

// ─── Fetch: network-first for API, cache-first for app shell ────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Never intercept Supabase or external API calls — always go to network
  if (
    url.hostname.includes('supabase') ||
    url.hostname.includes('httpbin') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/') // Next.js API routes
  ) {
    return
  }

  // For navigation (HTML) — serve from cache, fall back to network
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          console.log('[SW] Serving from cache:', request.url)
          return cached
        }
        return fetch(request).catch(() => {
          // If network fails and no cache, serve the app shell
          return caches.match('/Beezee-App')
        })
      })
    )
    return
  }

  // For static assets — cache first, fall back to network
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        console.log('[SW] Serving static asset from cache:', request.url)
        return cached
      }
      return fetch(request)
    })
  )
})

// ─── Background Sync ─────────────────────────────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-beezee-queue') {
    console.log('[SW] Background sync triggered')
    event.waitUntil(flushQueue())
  }
})

async function flushQueue() {
  try {
    // Open IndexedDB directly in the SW context
    const db = await openIDB()
    const tx = db.transaction('pending-actions', 'readonly')
    const store = tx.objectStore('pending-actions')
    const index = store.index('priority')
    const actions = await getAllFromIndex(index)

    if (actions.length === 0) {
      console.log('[SW] No actions to sync')
      return
    }

    console.log(`[SW] Syncing ${actions.length} queued actions`)

    let successCount = 0
    let failureCount = 0

    for (const action of actions) {
      try {
        await dispatchAction(action)
        // Remove from queue on success
        const deleteTx = db.transaction('pending-actions', 'readwrite')
        deleteTx.objectStore('pending-actions').delete(action.id)
        await deleteTx.done
        successCount++
        console.log(`[SW] Synced action: ${action.operation} [${action.idempotencyKey}]`)
      } catch (err) {
        failureCount++
        console.warn('[SW] Failed to sync action, will retry:', action.operation, err)
        // Leave in queue — Background Sync will retry
      }
    }

    // Notify all open clients that sync is complete
    const clients = await self.clients.matchAll({ includeUncontrolled: true })
    clients.forEach(client => client.postMessage({ 
      type: 'SYNC_COMPLETE',
      successCount,
      failureCount,
      total: actions.length
    }))

    console.log(`[SW] Sync complete: ${successCount} succeeded, ${failureCount} failed`)
  } catch (error) {
    console.error('[SW] Queue flush failed:', error)
  }
}

// dispatchAction — calls the appropriate API endpoint based on action type
// Mirror the routing logic from your existing offlineSyncHandler.ts here
async function dispatchAction(action) {
  const headers = {
    'Content-Type': 'application/json',
    'Idempotency-Key': action.idempotencyKey,
  }

  const endpointMap = {
    cash: '/api/transactions',
    inventory: '/api/inventory',
    calendar: '/api/calendar',
    credit: '/api/credit',
    beehive: '/api/beehive',
  }

  const endpoint = endpointMap[action.type]
  if (!endpoint) throw new Error(`Unknown action type: ${action.type}`)

  console.log(`[SW] Dispatching ${action.type} action to ${endpoint}`)

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      operation: action.operation,
      payload: action.payload,
      timestamp: action.timestamp,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

// ─── Minimal IndexedDB helpers for SW context (no idb package in SW) ────────
function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('beezee-offline-db', 1)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
    req.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('pending-actions')) {
        const store = db.createObjectStore('pending-actions', {
          keyPath: 'id',
          autoIncrement: true,
        })
        store.createIndex('priority', 'priority')
        store.createIndex('idempotencyKey', 'idempotencyKey', { unique: true })
        store.createIndex('timestamp', 'timestamp')
        store.createIndex('type', 'type')
      }
      if (!db.objectStoreNames.contains('failed-actions')) {
        const failedStore = db.createObjectStore('failed-actions', {
          keyPath: 'id',
          autoIncrement: true,
        })
        failedStore.createIndex('timestamp', 'timestamp')
        failedStore.createIndex('type', 'type')
      }
    }
  })
}

function getAllFromIndex(index) {
  return new Promise((resolve, reject) => {
    const req = index.getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

// ─── Message handling for client communication ─────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('[SW] Beezee Service Worker loaded - PWA architecture enabled')
