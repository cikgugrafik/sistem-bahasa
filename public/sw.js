const CACHE_NAME = 'sistem-bahasa-cache-v1';

// Masa install, kita suruh dia sedia
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Ini ejen penapis. Kalau gambar (webp/png), dia simpan dalam memory browser bimbit
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Kita cuma cache gambar nota cikgu supaya laju
  if (url.pathname.startsWith('/pages/') || url.pathname.endsWith('.webp') || url.pathname.endsWith('.png')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Bagi gambar dari memory (Laju gila!)
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  }
});