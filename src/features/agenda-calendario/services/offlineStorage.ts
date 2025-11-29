/**
 * Servicio para almacenamiento offline usando IndexedDB
 * 
 * NOTA: Este es un mock para pruebas de UX. La sincronización real con el backend
 * se implementaría más adelante cuando se integre con la API real.
 * 
 * Funcionalidades:
 * - Almacenamiento local de citas cuando no hay conexión
 * - Cola de acciones pendientes para sincronizar cuando vuelva la conexión
 * - Detección automática del estado de conexión
 */
const DB_NAME = 'agenda-calendario-db';
const DB_VERSION = 1;
const STORE_CITAS = 'citas';
const STORE_BLOQUEOS = 'bloqueos';
const STORE_PENDING = 'pending-changes';

interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

let db: IDBDatabase | null = null;

export const initOfflineStorage = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Crear store de citas
      if (!database.objectStoreNames.contains(STORE_CITAS)) {
        const citasStore = database.createObjectStore(STORE_CITAS, { keyPath: 'id' });
        citasStore.createIndex('fechaInicio', 'fechaInicio', { unique: false });
      }

      // Crear store de bloqueos
      if (!database.objectStoreNames.contains(STORE_BLOQUEOS)) {
        const bloqueosStore = database.createObjectStore(STORE_BLOQUEOS, { keyPath: 'id' });
        bloqueosStore.createIndex('fechaInicio', 'fechaInicio', { unique: false });
      }

      // Crear store de cambios pendientes
      if (!database.objectStoreNames.contains(STORE_PENDING)) {
        const pendingStore = database.createObjectStore(STORE_PENDING, { keyPath: 'id' });
        pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
};

// Guardar citas offline
export const saveCitasOffline = async (citas: any[]): Promise<void> => {
  if (!db) {
    await initOfflineStorage();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_CITAS], 'readwrite');
    const store = transaction.objectStore(STORE_CITAS);

    const promises = citas.map((cita) => {
      return new Promise<void>((resolve, reject) => {
        const request = store.put(cita);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    Promise.all(promises)
      .then(() => resolve())
      .catch(reject);
  });
};

// Obtener citas offline
export const getCitasOffline = async (): Promise<any[]> => {
  if (!db) {
    await initOfflineStorage();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_CITAS], 'readonly');
    const store = transaction.objectStore(STORE_CITAS);
    const request = store.getAll();

    request.onsuccess = () => {
      // Convertir fechas de string a Date si es necesario
      // IndexedDB puede almacenar Date directamente, pero al serializar/deserializar
      // pueden convertirse a strings, así que las convertimos de vuelta
      const citas = request.result.map((cita: any) => {
        if (typeof cita.fechaInicio === 'string') {
          cita.fechaInicio = new Date(cita.fechaInicio);
        }
        if (cita.fechaFin && typeof cita.fechaFin === 'string') {
          cita.fechaFin = new Date(cita.fechaFin);
        }
        // Convertir fechas en recurrencia si existe
        if (cita.recurrencia) {
          if (cita.recurrencia.fechaInicio && typeof cita.recurrencia.fechaInicio === 'string') {
            cita.recurrencia.fechaInicio = new Date(cita.recurrencia.fechaInicio);
          }
          if (cita.recurrencia.fechaFinOpcional && typeof cita.recurrencia.fechaFinOpcional === 'string') {
            cita.recurrencia.fechaFinOpcional = new Date(cita.recurrencia.fechaFinOpcional);
          }
          if (cita.recurrencia.excepciones) {
            cita.recurrencia.excepciones = cita.recurrencia.excepciones.map((ex: any) => 
              typeof ex === 'string' ? new Date(ex) : ex
            );
          }
        }
        // Convertir fechas en historial si existe
        if (cita.historial) {
          cita.historial = cita.historial.map((hist: any) => ({
            ...hist,
            fecha: hist.fecha && typeof hist.fecha === 'string' ? new Date(hist.fecha) : hist.fecha,
          }));
        }
        return cita;
      });
      resolve(citas);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Agregar cambio pendiente
export const addPendingChange = async (change: PendingChange): Promise<void> => {
  if (!db) {
    await initOfflineStorage();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_PENDING], 'readwrite');
    const store = transaction.objectStore(STORE_PENDING);
    const request = store.put(change);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Obtener cambios pendientes
export const getPendingChanges = async (): Promise<PendingChange[]> => {
  if (!db) {
    await initOfflineStorage();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_PENDING], 'readonly');
    const store = transaction.objectStore(STORE_PENDING);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

// Eliminar cambio pendiente
export const removePendingChange = async (id: string): Promise<void> => {
  if (!db) {
    await initOfflineStorage();
  }

  return new Promise((resolve, reject) => {
    const transaction = db!.transaction([STORE_PENDING], 'readwrite');
    const store = transaction.objectStore(STORE_PENDING);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Encola una acción para sincronizar cuando vuelva la conexión
 * 
 * NOTA: Esta es una función mock para pruebas de UX. En producción,
 * la sincronización real se implementaría cuando se integre con la API.
 * 
 * @param accion - Objeto con la información de la acción a encolar
 * @param accion.type - Tipo de acción: 'create', 'update' o 'delete'
 * @param accion.data - Datos de la cita (para create/update) o ID (para delete)
 */
export const queueAccionOffline = async (accion: {
  type: 'create' | 'update' | 'delete';
  data: any;
}): Promise<void> => {
  const pendingChange: PendingChange = {
    id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: accion.type,
    data: accion.data,
    timestamp: Date.now(),
  };

  return addPendingChange(pendingChange);
};

// Verificar si hay conexión
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Registrar listener de conexión
export const onOnlineStatusChange = (callback: (online: boolean) => void): (() => void) => {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};


