self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("wasm-todo-cache-v1").then(cache => {
            return cache.addAll([
                "./index.html",
                "./todo.js",
                "./todo.wasm",
                "./manifest.json",
                "./"
            ]);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
