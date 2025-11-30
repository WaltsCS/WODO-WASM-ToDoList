//auto-update & versioning
//every new commit, bump up this number (notice blue side indicator)
const VERSION = "v5";  // <--- bump to v8, v9, etc.

const CACHE_NAME = `wodo-cache-${VERSION}`;

//auto-detects prefix (/WODO-WASM-ToDoList)
const ROOT = self.location.pathname.replace(/\/sw\.js$/, "");

const OFFLINE_FALLBACK = `${ROOT}/offline.html`;

const ASSETS = [
  `${ROOT}/index.html`,
  `${ROOT}/todo.js`,
  `${ROOT}/todo.wasm`,
  `${ROOT}/manifest.json`,
  `${ROOT}/offline.html`,
  `${ROOT}/random-data.png`,
  `${ROOT}/sample.png`
];

//cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );

  //immediately activate the new SW (auto-update)
  self.skipWaiting();
});

//(activate) cleans old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );

  //immediately take control of clients
  self.clients.claim();
});


//(fetch) network(1st) w/ fallback for caching/offline page(2nd)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(_ =>
        caches.match(event.request).then(cacheRes =>
          cacheRes || caches.match(OFFLINE_FALLBACK)
        )
      )
  );
});
