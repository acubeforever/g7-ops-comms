const CACHE_NAME = "g7-ops-comms-v1";
const SHELL_FILES = ["./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// App shell (HTML/manifest/icons) is cached for offline install.
// Firestore's own SDK handles its network calls and offline queuing separately.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (SHELL_FILES.some((f) => url.pathname.endsWith(f.replace("./", "")))) {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
