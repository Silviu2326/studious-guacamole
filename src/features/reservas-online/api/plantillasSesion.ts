// API para gestionar plantillas de sesión

import { PlantillaSesion } from '../types';

// Plantillas predefinidas comunes
export const PLANTILLAS_PREDEFINIDAS: Omit<PlantillaSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>[] = [
  {
    nombre: 'Sesión 1 a 1 - Presencial',
    descripcion: 'Sesión personal presencial de 1 hora',
    duracionMinutos: 60,
    precio: 50,
    tipoSesion: 'presencial',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    orden: 1,
  },
  {
    nombre: 'Sesión 1 a 1 - Videollamada',
    descripcion: 'Sesión personal online de 1 hora',
    duracionMinutos: 60,
    precio: 45,
    tipoSesion: 'videollamada',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    orden: 2,
  },
  {
    nombre: 'Sesión Rápida - Presencial',
    descripcion: 'Sesión rápida de 30 minutos',
    duracionMinutos: 30,
    precio: 35,
    tipoSesion: 'presencial',
    tipoEntrenamiento: 'sesion-1-1',
    activo: true,
    orden: 3,
  },
  {
    nombre: 'Fisioterapia - Presencial',
    descripcion: 'Sesión de fisioterapia de 1 hora',
    duracionMinutos: 60,
    precio: 60,
    tipoSesion: 'presencial',
    tipoEntrenamiento: 'fisio',
    activo: true,
    orden: 4,
  },
  {
    nombre: 'Nutrición - Videollamada',
    descripcion: 'Consulta nutricional online de 45 minutos',
    duracionMinutos: 45,
    precio: 40,
    tipoSesion: 'videollamada',
    tipoEntrenamiento: 'nutricion',
    activo: true,
    orden: 5,
  },
];

/**
 * Obtiene las plantillas de sesión configuradas para un entrenador
 */
export const getPlantillasSesion = async (entrenadorId: string): Promise<PlantillaSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const storageKey = `plantillas-sesion-${entrenadorId}`;
  const plantillasStorage = localStorage.getItem(storageKey);

  if (!plantillasStorage) {
    // Crear plantillas por defecto
    const plantillasPorDefecto: PlantillaSesion[] = PLANTILLAS_PREDEFINIDAS.map((p, index) => ({
      ...p,
      id: `plantilla-${entrenadorId}-${index}`,
      entrenadorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await guardarPlantillasSesion(entrenadorId, plantillasPorDefecto);
    return plantillasPorDefecto;
  }

  try {
    const plantillasData = JSON.parse(plantillasStorage);
    return plantillasData.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
  } catch (error) {
    console.error('Error cargando plantillas de sesión:', error);
    return [];
  }
};

/**
 * Guarda las plantillas de sesión configuradas
 */
export const guardarPlantillasSesion = async (
  entrenadorId: string,
  plantillas: PlantillaSesion[]
): Promise<PlantillaSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const storageKey = `plantillas-sesion-${entrenadorId}`;
  const plantillasActualizadas = plantillas.map(p => ({
    ...p,
    updatedAt: new Date(),
  }));

  localStorage.setItem(storageKey, JSON.stringify(plantillasActualizadas));
  return plantillasActualizadas;
};

/**
 * Obtiene una plantilla de sesión por ID
 */
export const getPlantillaSesionPorId = async (
  entrenadorId: string,
  plantillaId: string
): Promise<PlantillaSesion | null> => {
  const plantillas = await getPlantillasSesion(entrenadorId);
  return plantillas.find(p => p.id === plantillaId) || null;
};

/**
 * Crea una nueva plantilla de sesión
 */
export const crearPlantillaSesion = async (
  entrenadorId: string,
  plantilla: Omit<PlantillaSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>
): Promise<PlantillaSesion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const plantillas = await getPlantillasSesion(entrenadorId);
  const maxOrden = plantillas.length > 0 ? Math.max(...plantillas.map(p => p.orden)) : 0;

  const nuevaPlantilla: PlantillaSesion = {
    ...plantilla,
    id: `plantilla-${Date.now()}`,
    entrenadorId,
    orden: maxOrden + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const plantillasActualizadas = [...plantillas, nuevaPlantilla];
  await guardarPlantillasSesion(entrenadorId, plantillasActualizadas);
  return nuevaPlantilla;
};

/**
 * Actualiza una plantilla de sesión
 */
export const actualizarPlantillaSesion = async (
  entrenadorId: string,
  plantillaId: string,
  cambios: Partial<Omit<PlantillaSesion, 'id' | 'entrenadorId' | 'createdAt' | 'updatedAt'>>
): Promise<PlantillaSesion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const plantillas = await getPlantillasSesion(entrenadorId);
  const plantillaIndex = plantillas.findIndex(p => p.id === plantillaId);

  if (plantillaIndex === -1) {
    throw new Error('Plantilla no encontrada');
  }

  const plantillaActualizada: PlantillaSesion = {
    ...plantillas[plantillaIndex],
    ...cambios,
    updatedAt: new Date(),
  };

  const plantillasActualizadas = [...plantillas];
  plantillasActualizadas[plantillaIndex] = plantillaActualizada;
  await guardarPlantillasSesion(entrenadorId, plantillasActualizadas);
  return plantillaActualizada;
};

/**
 * Elimina una plantilla de sesión
 */
export const eliminarPlantillaSesion = async (
  entrenadorId: string,
  plantillaId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const plantillas = await getPlantillasSesion(entrenadorId);
  const plantillasActualizadas = plantillas.filter(p => p.id !== plantillaId);
  await guardarPlantillasSesion(entrenadorId, plantillasActualizadas);
};

/**
 * Obtiene las plantillas activas de un entrenador
 */
export const getPlantillasSesionActivas = async (entrenadorId: string): Promise<PlantillaSesion[]> => {
  const plantillas = await getPlantillasSesion(entrenadorId);
  return plantillas
    .filter(p => p.activo)
    .sort((a, b) => a.orden - b.orden);
};

/**
 * Calcula el precio de una sesión basado en la plantilla, tipo de sesión y modalidad
 * Esta función implementa la lógica de precios diferenciados según tipo de sesión y modalidad
 * El precio base de la plantilla ya está configurado para su duración específica
 */
export const calcularPrecioSesion = (
  precioBase: number,
  tipoSesion: 'presencial' | 'videollamada',
  duracionMinutos: number,
  multiplicadorModalidad?: number
): number => {
  let precio = precioBase;

  // Aplicar multiplicador de modalidad si existe (para videollamada generalmente es menor)
  // Esto permite tener precios diferenciados según la modalidad (presencial vs videollamada)
  if (multiplicadorModalidad !== undefined) {
    precio = precio * multiplicadorModalidad;
  } else if (tipoSesion === 'videollamada') {
    // Por defecto, videollamada tiene un 10% de descuento
    precio = precio * 0.9;
  }

  // Nota: No ajustamos el precio por duración aquí porque el precioBase de la plantilla
  // ya está configurado para su duración específica. Si se necesita ajustar por duración,
  // se debe crear una plantilla diferente con ese precio específico.

  return Math.round(precio * 100) / 100; // Redondear a 2 decimales
};

/**
 * Obtiene el precio de una sesión basado en la plantilla seleccionada
 */
export const getPrecioPorPlantilla = async (
  entrenadorId: string,
  plantillaId: string,
  tipoSesionOverride?: 'presencial' | 'videollamada',
  duracionOverride?: number
): Promise<number> => {
  const plantilla = await getPlantillaSesionPorId(entrenadorId, plantillaId);
  if (!plantilla) {
    throw new Error('Plantilla no encontrada');
  }

  const tipoSesion = tipoSesionOverride || plantilla.tipoSesion;
  const duracion = duracionOverride || plantilla.duracionMinutos;

  // Calcular precio basado en la plantilla
  // Para videollamada, aplicar un descuento del 10% por defecto si no hay multiplicador específico
  const multiplicadorModalidad = tipoSesion === 'videollamada' ? 0.9 : 1.0;
  
  return calcularPrecioSesion(plantilla.precio, tipoSesion, duracion, multiplicadorModalidad);
};

