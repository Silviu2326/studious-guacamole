// API para gestionar duraciones de sesión configuradas

export interface DuracionSesion {
  id: string;
  entrenadorId: string;
  duracionMinutos: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  activo: boolean;
  orden: number;
  createdAt: Date;
  updatedAt: Date;
}

// Duraciones predefinidas comunes
export const DURACIONES_PREDEFINIDAS: Omit<DuracionSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>[] = [
  {
    duracionMinutos: 30,
    nombre: '30 minutos',
    descripcion: 'Sesión rápida',
    precio: 35,
    activo: true,
    orden: 1,
  },
  {
    duracionMinutos: 45,
    nombre: '45 minutos',
    descripcion: 'Sesión estándar',
    precio: 45,
    activo: true,
    orden: 2,
  },
  {
    duracionMinutos: 60,
    nombre: '1 hora',
    descripcion: 'Sesión completa',
    precio: 50,
    activo: true,
    orden: 3,
  },
  {
    duracionMinutos: 90,
    nombre: '1.5 horas',
    descripcion: 'Sesión extendida',
    precio: 70,
    activo: true,
    orden: 4,
  },
];

/**
 * Obtiene las duraciones de sesión configuradas para un entrenador
 */
export const getDuracionesSesion = async (entrenadorId: string): Promise<DuracionSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const storageKey = `duraciones-sesion-${entrenadorId}`;
  const duracionesStorage = localStorage.getItem(storageKey);

  if (!duracionesStorage) {
    // Crear duraciones por defecto
    const duracionesPorDefecto: DuracionSesion[] = DURACIONES_PREDEFINIDAS.map((d, index) => ({
      ...d,
      id: `duracion-${entrenadorId}-${index}`,
      entrenadorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await guardarDuracionesSesion(entrenadorId, duracionesPorDefecto);
    return duracionesPorDefecto;
  }

  try {
    const duracionesData = JSON.parse(duracionesStorage);
    return duracionesData.map((d: any) => ({
      ...d,
      createdAt: new Date(d.createdAt),
      updatedAt: new Date(d.updatedAt),
    }));
  } catch (error) {
    console.error('Error cargando duraciones de sesión:', error);
    return [];
  }
};

/**
 * Guarda las duraciones de sesión configuradas
 */
export const guardarDuracionesSesion = async (
  entrenadorId: string,
  duraciones: DuracionSesion[]
): Promise<DuracionSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const storageKey = `duraciones-sesion-${entrenadorId}`;
  const duracionesActualizadas = duraciones.map(d => ({
    ...d,
    updatedAt: new Date(),
  }));

  localStorage.setItem(storageKey, JSON.stringify(duracionesActualizadas));
  return duracionesActualizadas;
};

/**
 * Obtiene la duración de sesión por defecto (la primera activa)
 */
export const getDuracionSesionPorDefecto = async (entrenadorId: string): Promise<DuracionSesion | null> => {
  const duraciones = await getDuracionesSesion(entrenadorId);
  const duracionesActivas = duraciones
    .filter(d => d.activo)
    .sort((a, b) => a.orden - b.orden);

  return duracionesActivas.length > 0 ? duracionesActivas[0] : null;
};

/**
 * Obtiene una duración de sesión por ID
 */
export const getDuracionSesionPorId = async (
  entrenadorId: string,
  duracionId: string
): Promise<DuracionSesion | null> => {
  const duraciones = await getDuracionesSesion(entrenadorId);
  return duraciones.find(d => d.id === duracionId) || null;
};

/**
 * Obtiene una duración de sesión por minutos
 */
export const getDuracionSesionPorMinutos = async (
  entrenadorId: string,
  minutos: number
): Promise<DuracionSesion | null> => {
  const duraciones = await getDuracionesSesion(entrenadorId);
  return duraciones.find(d => d.duracionMinutos === minutos && d.activo) || null;
};


