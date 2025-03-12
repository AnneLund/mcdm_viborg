// service-worker.js

// Caching strategi: cache de nødvendige filer ved installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/styles.css", "/app.js"]);
    })
  );
});

// Fetch event handler: Returner cachet indhold, hvis tilgængeligt
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if exists, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});

// Aktivér service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = ["v1"];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
