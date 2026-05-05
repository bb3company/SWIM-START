const CACHE_NAME = 'swimstart-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png', // เพิ่มบรรทัดนี้เพื่อให้จำโลโก้
  './hero.jpg'  // เพิ่มบรรทัดนี้เพื่อให้จำรูปหน้าแรก
];

// ติดตั้ง Service Worker และเซฟไฟล์พื้นฐาน
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ดักจับการโหลดไฟล์ (ถ้ามีเน็ตให้โหลดและจำไว้ ถ้าไม่มีเน็ตให้ดึงที่จำไว้ออกมาใช้)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(err => console.log('Offline mode:', err));
    })
  );
});