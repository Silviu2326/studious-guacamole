import { PlantillaSesion, TipoCita } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const STORAGE_KEY = 'agenda_plantillas_sesiones';

// Plantillas por defecto
const PLANTILLAS_DEFAULT: PlantillaSesion[] = [
  {
    id: '1',
    nombre: 'Sesión PT Estándar',
    tipo: 'sesion-1-1',
    duracion: 60,
    precio: 50,
    notas: 'Entrenamiento personalizado estándar. Enfoque en técnica y progresión.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    nombre: 'Sesión PT Intensiva',
    tipo: 'sesion-1-1',
    duracion: 90,
    precio: 75,
    notas: 'Sesión intensiva de 90 minutos. Ideal para objetivos específicos y evaluaciones avanzadas.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    nombre: 'Evaluación Inicial',
    tipo: 'evaluacion',
    duracion: 60,
    precio: 40,
    notas: 'Evaluación completa de condición física, objetivos y planificación inicial.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    nombre: 'Videollamada Consulta',
    tipo: 'videollamada',
    duracion: 30,
    precio: 25,
    notas: 'Consulta rápida vía videollamada. Revisión de progreso y ajustes al programa.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    nombre: 'Sesión PT Express',
    tipo: 'sesion-1-1',
    duracion: 45,
    precio: 40,
    notas: 'Sesión rápida de 45 minutos. Perfecta para mantenimiento y ajustes.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Cargar plantillas del localStorage o usar las por defecto
const cargarPlantillas = (): PlantillaSesion[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convertir fechas de string a Date
      return parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Error cargando plantillas:', error);
  }
  return PLANTILLAS_DEFAULT;
};

// Guardar plantillas en localStorage
const guardarPlantillas = (plantillas: PlantillaSesion[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plantillas));
  } catch (error) {
    console.error('Error guardando plantillas:', error);
  }
};

// Inicializar plantillas si no existen
const inicializarPlantillas = (): void => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    guardarPlantillas(PLANTILLAS_DEFAULT);
  }
};

// Inicializar al cargar el módulo
inicializarPlantillas();

export const getPlantillas = async (): Promise<PlantillaSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return cargarPlantillas();
};

export const getPlantillaById = async (id: string): Promise<PlantillaSesion | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const plantillas = cargarPlantillas();
  return plantillas.find(p => p.id === id) || null;
};

export const crearPlantilla = async (plantilla: Omit<PlantillaSesion, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlantillaSesion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const plantillas = cargarPlantillas();
  const nuevaPlantilla: PlantillaSesion = {
    ...plantilla,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  plantillas.push(nuevaPlantilla);
  guardarPlantillas(plantillas);
  return nuevaPlantilla;
};

export const actualizarPlantilla = async (id: string, plantilla: Partial<Omit<PlantillaSesion, 'id' | 'createdAt'>>): Promise<PlantillaSesion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const plantillas = cargarPlantillas();
  const index = plantillas.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error('Plantilla no encontrada');
  }
  
  plantillas[index] = {
    ...plantillas[index],
    ...plantilla,
    updatedAt: new Date(),
  };
  
  guardarPlantillas(plantillas);
  return plantillas[index];
};

export const eliminarPlantilla = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const plantillas = cargarPlantillas();
  const filtradas = plantillas.filter(p => p.id !== id);
  
  // Asegurar que siempre haya al menos 5 plantillas
  if (filtradas.length < 5) {
    throw new Error('No se puede eliminar. Debe haber al menos 5 plantillas.');
  }
  
  guardarPlantillas(filtradas);
};


