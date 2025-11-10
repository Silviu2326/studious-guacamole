// Service Worker para funcionalidad offline
const CACHE_NAME = 'agenda-calendario-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Eliminando cache antiguo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - devolver respuesta
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Verificar si la respuesta es válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // Si falla la petición, devolver una página offline
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-citas') {
    event.waitUntil(
      // Aquí iría la lógica de sincronización
      syncCitas()
    );
  }
});

async function syncCitas() {
  try {
    // Obtener citas pendientes de sincronización desde IndexedDB
    const pendingCitas = await getPendingCitas();
    
    // Sincronizar con el servidor
    for (const cita of pendingCitas) {
      try {
        await syncCita(cita);
        await removePendingCita(cita.id);
      } catch (error) {
        console.error('Error sincronizando cita:', error);
      }
    }
  } catch (error) {
    console.error('Error en sincronización:', error);
  }
}

async function getPendingCitas() {
  // Implementar lógica para obtener citas pendientes desde IndexedDB
  return [];
}

async function syncCita(cita) {
  // Implementar lógica para sincronizar cita con el servidor
  return Promise.resolve();
}

async function removePendingCita(citaId) {
  // Implementar lógica para eliminar cita pendiente de IndexedDB
  return Promise.resolve();
}


