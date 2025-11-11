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

export interface PlantillaCheckInNutricional {
  id: string;
  nombre: string;
  descripcion?: string;
  preguntas: PreguntaCampo[];
  creadaPor: 'entrenador' | 'sistema';
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEYS = {
  PLANTILLAS: 'checkins_nutricionales_plantillas',
  PLANTILLA_ACTIVA_POR_CLIENTE: 'checkins_nutricionales_plantilla_activa_por_cliente',
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

export async function getPlantillas(): Promise<PlantillaCheckInNutricional[]> {
  const items = read<PlantillaCheckInNutricional[]>(STORAGE_KEYS.PLANTILLAS, []);
  return Promise.resolve(items);
}

export async function crearPlantilla(input: Omit<PlantillaCheckInNutricional, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlantillaCheckInNutricional> {
  const items = read<PlantillaCheckInNutricional[]>(STORAGE_KEYS.PLANTILLAS, []);
  const nueva: PlantillaCheckInNutricional = {
    ...input,
    id: `tpl_ci_nut_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  items.push(nueva);
  write(STORAGE_KEYS.PLANTILLAS, items);
  return Promise.resolve(nueva);
}

export async function actualizarPlantilla(id: string, updates: Partial<PlantillaCheckInNutricional>): Promise<PlantillaCheckInNutricional | null> {
  const items = read<PlantillaCheckInNutricional[]>(STORAGE_KEYS.PLANTILLAS, []);
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
  const items = read<PlantillaCheckInNutricional[]>(STORAGE_KEYS.PLANTILLAS, []);
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

export async function getPlantillaActivaPorCliente(clienteId: string): Promise<PlantillaCheckInNutricional | null> {
  const mapping = read<Record<string, string>>(STORAGE_KEYS.PLANTILLA_ACTIVA_POR_CLIENTE, {});
  const plantillaId = mapping[clienteId];
  if (!plantillaId) return Promise.resolve(null);
  const all = read<PlantillaCheckInNutricional[]>(STORAGE_KEYS.PLANTILLAS, []);
  const tpl = all.find(p => p.id === plantillaId) || null;
  return Promise.resolve(tpl);
}

// Sugerir una plantilla base por defecto
export async function ensureDefaultTemplates(): Promise<void> {
  const existing = read<PlantillaCheckInNutricional[]>(STORAGE_KEYS.PLANTILLAS, []);
  if (existing.length > 0) return;
  const base: Omit<PlantillaCheckInNutricional, 'id' | 'createdAt' | 'updatedAt'> = {
    nombre: 'Check-in nutricional estándar',
    descripcion: 'Campos adicionales comunes para check-ins nutricionales',
    creadaPor: 'sistema',
    preguntas: [
      {
        id: 'hidratacion',
        etiqueta: 'Vasos de agua consumidos',
        clave: 'vasos_agua',
        tipo: 'number',
        min: 0,
        max: 20,
        requerido: false,
        orden: 1,
        ayuda: 'Cantidad de vasos de agua (250ml)',
      },
      {
        id: 'suplementos',
        etiqueta: 'Suplementos tomados',
        clave: 'suplementos',
        tipo: 'textarea',
        requerido: false,
        orden: 2,
        ayuda: 'Lista de suplementos consumidos',
      },
      {
        id: 'nivel_energia',
        etiqueta: 'Nivel de energía',
        clave: 'nivel_energia',
        tipo: 'scale',
        min: 1,
        max: 10,
        requerido: false,
        orden: 3,
        ayuda: '1 muy baja, 10 máxima',
      },
      {
        id: 'digestion',
        etiqueta: 'Calidad de digestión',
        clave: 'digestion',
        tipo: 'select',
        requerido: false,
        orden: 4,
        opciones: [
          { value: 'excelente', label: 'Excelente' },
          { value: 'buena', label: 'Buena' },
          { value: 'regular', label: 'Regular' },
          { value: 'mala', label: 'Mala' },
        ],
        ayuda: 'Cómo te sentiste después de comer',
      },
    ],
  };
  await crearPlantilla(base);
}

