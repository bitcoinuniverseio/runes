/**
 * Runes Documentation Platform Service Worker (v3.0.0)
 * Offline-first caching with network fallback
 */

const CACHE_NAME = 'runes-docs-v3.0.0';

const PRECACHE_URLS = [
  '/runes/',
  '/runes/index.html',
  '/runes/specification.html',
  '/runes/reference.html',
  '/runes/guide.html',
  '/runes/vectors.html',
  '/runes/decoder.html',
  '/runes/studio.html',
  '/runes/learn.html',
  '/runes/learn/basics.html',
  '/runes/learn/inspect.html',
  '/runes/learn/transfer.html',
  '/runes/learn/mint.html',
  '/runes/learn/etch.html',
  '/runes/learn/developers.html',
  '/runes/learn/indexers.html',
  '/runes/wizards/transfer.html',
  '/runes/wizards/mint.html',
  '/runes/wizards/etch.html',
  '/runes/atlas.html',
  '/runes/conformance.html',
  '/runes/developers.html',
  '/runes/agents.html',
  '/runes/provenance.html',
  '/runes/versions.html',
  '/runes/status.html',
  '/runes/offline.html',
  '/runes/changelog.html',
  '/runes/search-index.json',
  '/runes/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('Pre-cache error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback for HTML navigation
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/runes/offline.html');
        }
      });
    })
  );
});
