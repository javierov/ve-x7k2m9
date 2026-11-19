/* Viaje a Europa: guarda la app en el móvil para usarla sin internet */
const V = "viaje-europa-v5";
const FILES = ["./", "index.html", "manifest.json", "icono.png", "icono-192.png", "favicon-32.png", "apple-touch-icon.png",
  "fotos/madrid.jpg", "fotos/barcelona.jpg", "fotos/paris.jpg", "fotos/florencia.jpg", "fotos/roma.jpg", "fotos/versalles.jpg",
  "fotos/secretos/s02-anglona.jpg", "fotos/secretos/s03-cerralbo.jpg", "fotos/secretos/s04-felip-neri.jpg", "fotos/secretos/s05-sant-pau.jpg", "fotos/secretos/s06-santa-creu.jpg", "fotos/secretos/s07-vivienne.jpg", "fotos/secretos/s08-cremieux.jpg", "fotos/secretos/s09-passe-muraille.jpg", "fotos/secretos/s10-buchette.jpg", "fotos/secretos/s11-san-miniato.jpg", "fotos/secretos/s12-cerradura.jpg", "fotos/secretos/s13-gianicolo.jpg", "fotos/secretos/s14-san-clemente.jpg", "fotos/secretos/s15-san-gines.jpg", "fotos/secretos/s16-moyano.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const font = /fonts\.(googleapis|gstatic)\.com/.test(r.url);
  if (new URL(r.url).origin !== location.origin && !font) return;
  /* página: primero la red (para recibir cambios), si no hay conexión, la copia guardada */
  if (r.mode === "navigate") { e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r).then(m => m || caches.match("index.html")))); return; }
  /* fotos, iconos y letras: primero la copia guardada */
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res; })));
});
