const CACHE_NAME = "my-site-cache-v6";
const urlsToCache = [
  "/prabodh1231.github.io/plagisrism_app/",
  "/prabodh1231.github.io/plagisrism_app/index.html",
  "/prabodh1231.github.io/plagisrism_app/style.css",
  "/prabodh1231.github.io/plagisrism_app/js/plag.js",
  "/prabodh1231.github.io/plagisrism_app/js/plag-worker.js",
  "/prabodh1231.github.io/plagisrism_app/js/mammoth.browser.js",
  "/prabodh1231.github.io/plagisrism_app/js/pdf.mjs",
  "/prabodh1231.github.io/plagisrism_app/js/pdf.worker.mjs",
  "/prabodh1231.github.io/plagisrism_app/images/icon512.png",
  "/prabodh1231.github.io/plagisrism_app/images/icon128.png",
];

// Install the service worker and cache all specified files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercept fetch requests and serve from cache if available
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return the response from the cached version
      if (response) {
        return response;
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response as it's a stream that can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
          // You could return a custom offline page here
        });
    })
  );
});

// Clean up old caches when a new service worker activates
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheWhitelist.indexOf(cacheName) === -1)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
