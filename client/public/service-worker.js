const CACHE_NAME = "vite-react-cache-v2";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installerer...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Cacher statiske assets...");
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Aktiverer...");

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Sletter gammel cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!event.request.url.includes("/api/")) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return new Response("Offline - og ikke i cache", {
            status: 503,
            statusText: "Offline",
          });
        });
    })
  );
});

// Håndter beskeder fra klienter
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    console.log("[Service Worker] Springer ventetid over...");
    self.skipWaiting();
  }
});
