/*
 * TinyVerse service worker — P10 (dukungan offline)
 *
 * Strategi:
 *  - Navigasi halaman (mode "navigate"): network-first, fallback ke cache,
 *    lalu ke halaman /offline.html bila keduanya gagal.
 *  - Aset statis ber-hash (/_next/static/...): cache-first (isinya immutable).
 *  - GET same-origin lain: stale-while-revalidate.
 *
 * Naikkan CACHE_VERSION setiap kali file inti berubah agar cache lama dibersihkan.
 */
const CACHE_VERSION = "tinyverse-v5"
const OFFLINE_URL = "/offline.html"
const PRECACHE_URLS = [OFFLINE_URL, "/manifest.webmanifest", "/icon.svg"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting()
})

function isStaticAsset(url) {
  return url.pathname.startsWith("/_next/static/")
}

self.addEventListener("fetch", (event) => {
  const req = event.request
  if (req.method !== "GET") return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // Navigasi halaman: network-first -> cache -> offline.html
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req)
          const cache = await caches.open(CACHE_VERSION)
          cache.put(req, fresh.clone())
          return fresh
        } catch (err) {
          const cache = await caches.open(CACHE_VERSION)
          const cached = await cache.match(req)
          return cached || (await cache.match(OFFLINE_URL))
        }
      })(),
    )
    return
  }

  // Aset statis ber-hash: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_VERSION)
        const cached = await cache.match(req)
        if (cached) return cached
        const fresh = await fetch(req)
        cache.put(req, fresh.clone())
        return fresh
      })(),
    )
    return
  }

  // GET same-origin lain: stale-while-revalidate
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION)
      const cached = await cache.match(req)
      const network = fetch(req)
        .then((res) => {
          cache.put(req, res.clone())
          return res
        })
        .catch(() => cached)
      return cached || network
    })(),
  )
})
