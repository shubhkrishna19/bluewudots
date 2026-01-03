// Service Worker for Bluewud OTS PWA
const CACHE_VERSION = '2.0';
const STATIC_CACHE = 'bluewud-static-v' + CACHE_VERSION;
const RUNTIME_CACHE = 'bluewud-runtime-v' + CACHE_VERSION;
const API_CACHE = 'bluewud-api-v' + CACHE_VERSION;

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/vite.svg'
];

// API endpoints to cache with stale-while-revalidate
const API_PATTERNS = [
    '/server/bridgex',
    '/api/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing v' + CACHE_VERSION);
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating v' + CACHE_VERSION);
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => !name.includes('v' + CACHE_VERSION))
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Determine caching strategy based on request type
const isApiRequest = (url) => API_PATTERNS.some(pattern => url.includes(pattern));

// Fetch event - smart caching strategies
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    const url = event.request.url;

    // API Requests: Stale-While-Revalidate
    if (isApiRequest(url)) {
        event.respondWith(
            caches.open(API_CACHE).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }

    // Static Assets: Cache First, Network Fallback
    if (STATIC_ASSETS.some(asset => url.endsWith(asset)) || url.includes('/assets/')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || fetch(event.request).then((response) => {
                    return caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
        return;
    }

    // Navigation & Other: Network First, Cache Fallback
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) return cachedResponse;
                        // Fallback to index.html for SPA navigation
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Handle push notifications (future use)
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const options = {
        body: data.body || 'New update from Bluewud OTS',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Bluewud OTS', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});
// Handle message to skip waiting
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
