// Servicio para almacenamiento offline usando IndexedDB
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
      resolve(request.result);
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


