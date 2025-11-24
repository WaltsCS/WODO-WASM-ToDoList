const CACHE_NAME = "wodo-cache-v3";

//auto-detects prefix (/WODO-WASM-ToDoList)
const ROOT = self.location.pathname.replace(/\/sw\.js$/, "");

const OFFLINE_FALLBACK = `${ROOT}/offline.html`;

const ASSETS = [
  `${ROOT}/index.html`,
  `${ROOT}/todo.js`,
  `${ROOT}/todo.wasm`,
  `${ROOT}/manifest.json`,
  `${ROOT}/offline.html`,
  `${ROOT}/icons/icon-192.png`,
  `${ROOT}/icons/icon-512.png`
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("wasm-todo-cache-v1").then(cache => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

//(activate) cleans old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});


//(fetch) network w/ fallback for caching/offline page
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cacheRes => {
          return cacheRes || caches.match(OFFLINE_FALLBACK);
        });
      })
  );
});
