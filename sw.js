const CACHE_NAME = 'irbis-typing-v1';
const ASSETS_TO_CACHE = [
'./',
'./index.html',
'./style.css',
'./script.js',
'./keyboard.js',
'./levels.js',
'./pwa.js',
'./manifest.json',
'./icons/icon-192.png',
'./icons/icon-512.png',
'./img/icon.png',
'./img/forest.jpeg',
'./img/ice.jpeg',
'./img/lava.jpeg',
'./img/stone.jpeg',
'./img/run-1.png',
'./img/run-2.png',
'./img/run-3.png',
'./img/run-4.png',
'./img/run-5.png',
'./img/anemy-tornado.png',
'./img/anemy-tornado-2.png',
'./img/anemy-ice.png',
'./img/anemy-ice-2.png',
'./img/anemy-fire.png',
'./img/anemy-fire-2.png',
'./img/anemy-stone.png',
'./img/anemy-stone-2.png'
];
self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(ASSETS_TO_CACHE);
}).then(() => self.skipWaiting())
);
});
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((name) => {
if (name !== CACHE_NAME) {
return caches.delete(name);
}
})
);
}).then(() => self.clients.claim())
);
});
self.addEventListener('fetch', (event) => {
if (event.request.method !== 'GET') return;
if (!event.request.url.startsWith('http')) return;
event.respondWith(
fetch(event.request)
.then((networkResponse) => {
if (networkResponse && networkResponse.status === 200) {
const responseClone = networkResponse.clone();
caches.open(CACHE_NAME).then((cache) => {
cache.put(event.request, responseClone);
});
}
return networkResponse;
})
.catch(() => {
return caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
if (cachedResponse) {
return cachedResponse;
}
if (event.request.mode === 'navigate') {
return caches.match('./index.html') || caches.match('./');
}
});
})
);
});