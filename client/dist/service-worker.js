const CACHE_NAME = "vite-react-cache-v6"; // Skift versionsnummer ved opdateringer
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installerer...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Cacher statiske assets...");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[Service Worker] Springer ventetid over...");
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Aktiverer...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("[Service Worker] Sletter gammel cache:", cache);
              return caches.delete(cache);
            }
          })
        )
      )
      .then(() => {
        console.log("[Service Worker] Tager kontrol over alle klienter...");
        return self.clients.claim(); // Tvinger alle åbne faner til at bruge den nye SW
      })
      .then(() => {
        self.clients.matchAll().then((clients) => {
          clients.forEach(
            (client) => client.postMessage({ type: "RELOAD_PAGE" }) // Beder klienten genindlæse siden
          );
        });
      })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Undgå at cache API-responser eller dynamiske data
  if (url.origin === location.origin && !url.pathname.startsWith("/api/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            return new Response("Offline - og ikke i cache", {
              status: 503,
              statusText: "Offline",
            });
          });
      })
    );
  }
});

// Håndter beskeder fra klienter
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    console.log("[Service Worker] Springer ventetid over...");
    self.skipWaiting();
  }
});
