self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("wasm-todo-cache-v1").then(cache => {
            return cache.addAll([
                "/WODO-WASM-ToDoList/index.html",
                "/WODO-WASM-ToDoList/todo.js",
                "/WODO-WASM-ToDoList/todo.wasm",
                "/WODO-WASM-ToDoList/manifest.json",
                "/WODO-WASM-ToDoList/"
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
