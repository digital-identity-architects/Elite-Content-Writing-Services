// Elite Content — service worker
// Strategy:
//  - Precache the app shell (HTML pages + CSS + JS + icons) on install.
//  - Network-first for HTML so users always see fresh content when online.
//  - Cache-first for static assets (CSS, JS, fonts, images).
//  - Offline fallback for navigation requests.

const VERSION = 'v1';
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/blog.html',
  '/contact.html',
  '/terms.html',
  '/privacy.html',
  '/blog/half-the-price-twice-the-output.html',
  '/blog/seo-content-that-ranks-in-2026.html',
  '/blog/ghostwriting-founders-on-linkedin.html',
  '/styles.css',
  '/script.js',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let third-party fonts hit the network

  // Navigation requests: network-first, cache fallback, then offline page.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          return res;
        })
    )
  );
});
