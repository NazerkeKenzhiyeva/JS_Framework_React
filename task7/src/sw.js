import { clientsClaim } from "workbox-core";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

const CACHE_VERSION = "v1";
const STATIC_CACHE = `streetala-static-${CACHE_VERSION}`;
const API_CACHE = `streetala-api-${CACHE_VERSION}`;
const PAGE_CACHE = `streetala-pages-${CACHE_VERSION}`;
const CURRENT_RUNTIME_CACHES = [STATIC_CACHE, API_CACHE, PAGE_CACHE];

// Workbox adds the built HTML, JS, CSS, icons and offline page here.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();

// Keep a new worker waiting until the user presses the update button.
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

// Remove old versioned runtime caches during activation.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names
        .filter((name) => name.startsWith("streetala-") && !CURRENT_RUNTIME_CACHES.includes(name))
        .map((name) => caches.delete(name)),
    )),
  );
});

// Cache-first: images, PWA icons and fonts rarely change.
registerRoute(
  ({ request }) => ["image", "font"].includes(request.destination),
  new CacheFirst({
    cacheName: STATIC_CACHE,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  }),
);

// Stale-while-revalidate: show cached public catalog data, then refresh it.
registerRoute(
  ({ url, request }) => request.method === "GET" && url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    cacheName: API_CACHE,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }),
    ],
  }),
);

// Network-first: navigation uses the newest page but remains available offline.
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: PAGE_CACHE,
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 7 * 24 * 60 * 60 }),
    ],
  }),
);

// Authentication URLs are intentionally not registered in any runtime cache.
setCatchHandler(async ({ event }) => {
  if (event.request.destination === "document") {
    return (await matchPrecache("/offline.html")) || Response.error();
  }
  return Response.error();
});
