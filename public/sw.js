// public/sw.js

// 캐시 이름 (버전 관리용)
const CACHE_NAME = 'lecture-scheduler-v1';

// 캐싱할 파일 목록 (오프라인에서 실행될 때 필요한 파일들)
// Vite 빌드 환경에서는 파일명이 해시로 바뀌므로, 여기서는 메인 경로만 지정합니다.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/image_231e32.png',
  '/image_231e52.png'
];

// 1. 설치 (Install): 캐시 초기화
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 요청 가로채기 (Fetch): 오프라인 상태에서도 캐시된 내용을 반환
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 있으면 반환, 없으면 네트워크 요청
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// 3. 활성화 (Activate): 이전 버전 캐시 정리
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
