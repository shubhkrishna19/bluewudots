// Service Worker for Bluewud OTS - PWA Offline Support
// Full implementation ready for copy to public/sw.js

const CACHE_VERSION = 'v1_ots_bluewud';
const CRITICAL_ASSETS = ['/', '/index.html', '/favicon.ico', '/manifest.json'];
const API_ENDPOINTS = ['/api/orders', '/api/dealers', '/api/sku-master'];

// Install - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      console.log('[SW] Caching assets');
      return cache.addAll(CRITICAL_ASSETS).catch(err => {
        console.warn('[SW] Asset cache failed:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_VERSION)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch - intelligent caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // API: Network first, fallback to cache
  if (API_ENDPOINTS.some((ep) => url.pathname.startsWith(ep))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Assets: Cache first, fallback to network
  if (/\.(js|css|png|jpg|gif|svg|woff|woff2)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // HTML: Network first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
  }
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_VERSION);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    return new Response('Not Found', { status: 404 });
  }
}

console.log('[SW] Service Worker ready for offline support');

export default { CACHE_VERSION };
