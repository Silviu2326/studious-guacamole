export type TipoCampo =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'select'
  | 'scale';

export interface OpcionCampo {
  value: string;
  label: string;
}

export interface PreguntaCampo {
  id: string;
  etiqueta: string;
  clave: string; // key to store data
  tipo: TipoCampo;
  requerido?: boolean;
  opciones?: OpcionCampo[];
  min?: number;
  max?: number;
  orden?: number;
  ayuda?: string;
}

export interface PlantillaCheckIn {
  id: string;
  nombre: string;
  descripcion?: string;
  preguntas: PreguntaCampo[];
  creadaPor: 'entrenador' | 'sistema';
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEYS = {
  PLANTILLAS: 'checkins_plantillas',
  PLANTILLA_ACTIVA_POR_CLIENTE: 'checkins_plantilla_activa_por_cliente',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function getPlantillas(): Promise<PlantillaCheckIn[]> {
  const items = read<PlantillaCheckIn[]>(STORAGE_KEYS.PLANTILLAS, []);
  return Promise.resolve(items);
}

export async function crearPlantilla(input: Omit<PlantillaCheckIn, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlantillaCheckIn> {
  const items = read<PlantillaCheckIn[]>(STORAGE_KEYS.PLANTILLAS, []);
  const nueva: PlantillaCheckIn = {
    ...input,
    id: `tpl_ci_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(nueva);
  write(STORAGE_KEYS.PLANTILLAS, items);
  return Promise.resolve(nueva);
}

export async function actualizarPlantilla(id: string, updates: Partial<PlantillaCheckIn>): Promise<PlantillaCheckIn | null> {
  const items = read<PlantillaCheckIn[]>(STORAGE_KEYS.PLANTILLAS, []);
  const idx = items.findIndex(p => p.id === id);
  if (idx === -1) return Promise.resolve(null);
  items[idx] = {
    ...items[idx],
    ...updates,
    id: items[idx].id,
    updatedAt: new Date().toISOString(),
  };
  write(STORAGE_KEYS.PLANTILLAS, items);
  return Promise.resolve(items[idx]);
}

export async function eliminarPlantilla(id: string): Promise<boolean> {
  const items = read<PlantillaCheckIn[]>(STORAGE_KEYS.PLANTILLAS, []);
  const next = items.filter(p => p.id !== id);
  write(STORAGE_KEYS.PLANTILLAS, next);
  return Promise.resolve(next.length !== items.length);
}

export async function setPlantillaActivaParaCliente(clienteId: string, plantillaId: string | null): Promise<void> {
  const mapping = read<Record<string, string>>(STORAGE_KEYS.PLANTILLA_ACTIVA_POR_CLIENTE, {});
  if (plantillaId) {
    mapping[clienteId] = plantillaId;
  } else {
    delete mapping[clienteId];
  }
  write(STORAGE_KEYS.PLANTILLA_ACTIVA_POR_CLIENTE, mapping);
  return Promise.resolve();
}

export async function getPlantillaActivaPorCliente(clienteId: string): Promise<PlantillaCheckIn | null> {
  const mapping = read<Record<string, string>>(STORAGE_KEYS.PLANTILLA_ACTIVA_POR_CLIENTE, {});
  const plantillaId = mapping[clienteId];
  if (!plantillaId) return Promise.resolve(null);
  const all = read<PlantillaCheckIn[]>(STORAGE_KEYS.PLANTILLAS, []);
  const tpl = all.find(p => p.id === plantillaId) || null;
  return Promise.resolve(tpl);
}

// Sugerir una plantilla base por defecto
export async function ensureDefaultTemplates(): Promise<void> {
  const existing = read<PlantillaCheckIn[]>(STORAGE_KEYS.PLANTILLAS, []);
  if (existing.length > 0) return;
  const base: Omit<PlantillaCheckIn, 'id' | 'createdAt' | 'updatedAt'> = {
    nombre: 'Check-in estándar',
    descripcion: 'Campos adicionales comunes para check-ins',
    creadaPor: 'sistema',
    preguntas: [
      {
        id: 'energia',
        etiqueta: 'Nivel de energía',
        clave: 'energia',
        tipo: 'scale',
        min: 1,
        max: 10,
        requerido: false,
        orden: 1,
        ayuda: '1 muy baja, 10 máxima',
      },
      {
        id: 'suenio',
        etiqueta: 'Horas de sueño',
        clave: 'suenio_horas',
        tipo: 'number',
        min: 0,
        max: 24,
        requerido: false,
        orden: 2,
      },
      {
        id: 'molestias',
        etiqueta: 'Molestias adicionales',
        clave: 'molestias',
        tipo: 'textarea',
        requerido: false,
        orden: 3,
      },
    ],
  };
  await crearPlantilla(base);
}


