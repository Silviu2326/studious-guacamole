/**
 * API para gestionar duraciones de sesión configuradas
 * 
 * DOCUMENTACIÓN: Relación con reservas
 * =====================================
 * 
 * Las duraciones de sesión configuradas se utilizan al crear reservas:
 * 
 * 1. CONFIGURACIÓN POR TIPO DE SESIÓN:
 *    - Cada tipo de sesión (PlantillaSesion) puede tener duraciones permitidas
 *    - Las duraciones se configuran en minutos (ej: [30, 45, 60, 90])
 *    - Esto restringe qué duraciones están disponibles al crear una reserva
 * 
 * 2. USO EN RESERVAS:
 *    - Cuando se crea una reserva, se selecciona una duración permitida
 *    - La duración determina la diferencia entre fechaInicio y fechaFin
 *    - Las reservas completadas mantienen su duración original para análisis
 * 
 * 3. NOTA:
 *    - Las reservas completadas y canceladas no modifican las configuraciones
 *    - Las configuraciones son independientes y se aplican a nuevas reservas
 *    - Sin embargo, se pueden analizar las duraciones más utilizadas en reservas
 *      completadas para ajustar las configuraciones
 */

import { DuracionSesionConfig } from '../types';

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

// ============================================================================
// FUNCIONES PARA DuracionSesionConfig
// ============================================================================

/**
 * Obtiene la configuración de duraciones permitidas para un tipo de sesión
 * 
 * @param tipoSesionId - ID del tipo de sesión (PlantillaSesion)
 * @returns La configuración de duraciones permitidas, o null si no existe
 * 
 * @example
 * ```typescript
 * const config = await getDuracionSesionConfig('tipo-sesion-1');
 * // { tipoSesionId: 'tipo-sesion-1', duracionesPermitidasMinutos: [30, 45, 60] }
 * ```
 * 
 * @remarks
 * Esta función gestiona las duraciones permitidas para cada tipo de sesión.
 * Los datos se almacenan en localStorage en formato mock.
 * En producción, se conectaría con un backend REST/GraphQL.
 */
export const getDuracionSesionConfig = async (
  tipoSesionId: string
): Promise<DuracionSesionConfig | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const storageKey = `duracion-sesion-config-${tipoSesionId}`;
  const configStorage = localStorage.getItem(storageKey);

  if (!configStorage) {
    // Por defecto, retornar configuración con duraciones comunes
    const configPorDefecto: DuracionSesionConfig = {
      tipoSesionId,
      duracionesPermitidasMinutos: [30, 45, 60, 90], // Duraciones comunes en minutos
    };
    
    // Guardar la configuración por defecto
    await guardarDuracionSesionConfig(configPorDefecto);
    return configPorDefecto;
  }

  try {
    const configData = JSON.parse(configStorage);
    return configData as DuracionSesionConfig;
  } catch (error) {
    console.error('Error cargando configuración de duraciones:', error);
    return null;
  }
};

/**
 * Guarda la configuración de duraciones permitidas para un tipo de sesión
 * 
 * @param config - La configuración de duraciones a guardar
 * @returns La configuración guardada
 * 
 * @example
 * ```typescript
 * const config: DuracionSesionConfig = {
 *   tipoSesionId: 'tipo-sesion-1',
 *   duracionesPermitidasMinutos: [45, 60, 90]
 * };
 * await guardarDuracionSesionConfig(config);
 * ```
 * 
 * @remarks
 * Esta función permite actualizar las duraciones permitidas para un tipo de sesión.
 * Las duraciones deben estar en minutos y se validan antes de guardar.
 */
export const guardarDuracionSesionConfig = async (
  config: DuracionSesionConfig
): Promise<DuracionSesionConfig> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Validar que las duraciones sean números positivos
  const duracionesValidadas = config.duracionesPermitidasMinutos
    .filter(duracion => duracion > 0 && Number.isInteger(duracion))
    .sort((a, b) => a - b); // Ordenar de menor a mayor

  const configValidada: DuracionSesionConfig = {
    tipoSesionId: config.tipoSesionId,
    duracionesPermitidasMinutos: duracionesValidadas,
  };

  const storageKey = `duracion-sesion-config-${config.tipoSesionId}`;
  localStorage.setItem(storageKey, JSON.stringify(configValidada));

  return configValidada;
};


