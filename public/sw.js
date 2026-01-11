const CACHE_NAME = 'lecture-scheduler-v1';

// 캐싱할 파일 목록 (정확한 파일명 필수)
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/favicon-96x96.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('캐시 저장 중...');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
