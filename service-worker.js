const CACHE_NAME = 'inspector-simple-v1';

self.addEventListener('install', (event) => {
  console.log('📦 نصب Service Worker');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker فعال شد');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // ذخیره در کش
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // آفلاین - از کش برگردان
        return caches.match(event.request)
          .then(response => response || caches.match('/index.html'));
      })
  );
});