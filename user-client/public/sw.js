const CACHE_NAME = "a2z-pwa-v2";

// Assets to pre-cache on install
const PRECACHE_ASSETS = ["/", "/login", "/offline.html"];

// Install — pre-cache shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — network-first strategy with cache fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension, _next/webpack-hmr (dev), and API requests
  if (
    request.url.includes("chrome-extension") ||
    request.url.includes("_next/webpack-hmr") ||
    request.url.includes("/api/")
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone and cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(request).then((cached) => {
          if (cached) return cached;

          // For navigation requests, return the offline page
          if (request.mode === "navigate") {
            return caches.match("/offline.html");
          }

          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      })
  );
});
