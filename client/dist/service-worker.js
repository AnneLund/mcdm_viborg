self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache
        .addAll(["/", "/index.html", "/styles.css", "/app.js"])
        .catch((error) => {
          console.error("Cache error:", error);
        });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch((err) => {
          console.error("Fetch error:", err);
          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
          });
        })
      );
    })
  );
});

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
