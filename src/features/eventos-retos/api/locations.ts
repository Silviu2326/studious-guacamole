/**
 * API para gestión de ubicaciones y salas
 * 
 * ============================================================================
 * RELACIÓN CON EVENTOS PRESENCIALES
 * ============================================================================
 * 
 * Las ubicaciones (Location) se vinculan con eventos presenciales (Event) a través
 * del campo `ubicacionId` en la interfaz Event.
 * 
 * Ejemplo de uso:
 * ```typescript
 * const evento: Event = {
 *   id: 'evt_123',
 *   tipo: 'presencial',
 *   ubicacionId: 'loc_456', // Referencia a Location.id
 *   // ... otros campos
 * };
 * 
 * // Para obtener la ubicación del evento:
 * const ubicacion = await getLocationById(evento.ubicacionId);
 * ```
 * 
 * NOTA: Los eventos presenciales deben tener `tipo: 'presencial'` y un `ubicacionId`
 * válido. La verificación de conflictos de horario solo se aplica a eventos presenciales.
 * 
 * ============================================================================
 * UBICACIONES FRECUENTES
 * ============================================================================
 * 
 * Las ubicaciones frecuentes son aquellas marcadas con `esUbicacionFrecuente: true`.
 * Estas aparecen primero en los selectores y formularios de creación de eventos.
 * 
 * Ejemplos de ubicaciones frecuentes comunes:
 * - Sala Principal: Sala principal de entrenamiento con equipamiento completo
 * - Sala Secundaria: Sala adicional para clases grupales
 * - Terraza: Espacio exterior para entrenamientos al aire libre
 * - Estudio de Yoga: Espacio tranquilo para yoga y pilates
 * - Sala de Spinning: Sala especializada para clases de spinning
 * 
 * ============================================================================
 */

import { Location } from '../types';
import { getEvents } from './events';

/**
 * Interfaz para representar un conflicto de horario
 */
export interface ScheduleConflict {
  eventoId: string;
  eventoNombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacionId: string;
  ubicacionNombre: string;
}

/**
 * Resultado detallado de verificación de conflictos
 */
export interface ConflictCheckResult {
  tieneConflictos: boolean;
  conflictos: ScheduleConflict[];
  ubicacion: Location | null;
}

// ============================================================================
// CRUD DE UBICACIONES
// ============================================================================

/**
 * Obtiene todas las ubicaciones disponibles
 * 
 * @returns Lista de todas las ubicaciones
 */
export const getLocations = async (): Promise<Location[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const locationsStorage = localStorage.getItem('locations-eventos');
  if (!locationsStorage) {
    // Crear ubicaciones de ejemplo (ubicaciones frecuentes)
    const ubicacionesEjemplo: Location[] = [
      {
        id: 'loc_1',
        nombre: 'Sala Principal',
        direccion: 'Planta baja, entrada principal',
        capacidadMaxima: 50,
        notas: 'Sala principal de entrenamiento con equipamiento completo. Incluye pesas, barras y máquinas de cardio.',
        esUbicacionFrecuente: true,
      },
      {
        id: 'loc_2',
        nombre: 'Sala Secundaria',
        direccion: 'Planta baja, ala este',
        capacidadMaxima: 30,
        notas: 'Sala adicional para clases grupales y entrenamientos funcionales.',
        esUbicacionFrecuente: true,
      },
      {
        id: 'loc_3',
        nombre: 'Terraza',
        direccion: 'Planta superior, acceso exterior',
        capacidadMaxima: 40,
        notas: 'Espacio exterior para entrenamientos al aire libre. Ideal para clases de yoga, pilates y entrenamientos funcionales.',
        esUbicacionFrecuente: true,
      },
      {
        id: 'loc_4',
        nombre: 'Estudio de Yoga',
        direccion: 'Planta primera, sala tranquila',
        capacidadMaxima: 20,
        notas: 'Espacio tranquilo y acogedor para yoga y pilates. Equipado con colchonetas, bloques y cintas.',
        esUbicacionFrecuente: true,
      },
      {
        id: 'loc_5',
        nombre: 'Sala de Spinning',
        direccion: 'Planta baja, sala especializada',
        capacidadMaxima: 25,
        notas: 'Sala especializada para clases de spinning con bicicletas estáticas y sistema de sonido.',
        esUbicacionFrecuente: true,
      },
      {
        id: 'loc_6',
        nombre: 'Sala de Boxeo',
        direccion: 'Sótano, área de combate',
        capacidadMaxima: 15,
        notas: 'Sala equipada con sacos de boxeo, guantes y material de entrenamiento de combate.',
        esUbicacionFrecuente: false,
      },
    ];
    localStorage.setItem('locations-eventos', JSON.stringify(ubicacionesEjemplo));
    return ubicacionesEjemplo;
  }

  try {
    return JSON.parse(locationsStorage);
  } catch (error) {
    console.error('Error cargando ubicaciones:', error);
    return [];
  }
};

/**
 * Obtiene una ubicación por su ID
 * 
 * @param id ID de la ubicación
 * @returns La ubicación encontrada o null si no existe
 */
export const getLocationById = async (id: string): Promise<Location | null> => {
  const locations = await getLocations();
  return locations.find(loc => loc.id === id) || null;
};

/**
 * Crea una nueva ubicación
 * 
 * @param data Datos de la ubicación a crear (sin id)
 * @returns La ubicación creada con su ID asignado
 */
export const createLocation = async (
  data: Omit<Location, 'id'>
): Promise<Location> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const locations = await getLocations();
  
  // Generar ID único
  const nuevoId = `loc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  const nuevaUbicacion: Location = {
    ...data,
    id: nuevoId,
  };
  
  locations.push(nuevaUbicacion);
  localStorage.setItem('locations-eventos', JSON.stringify(locations));
  
  return nuevaUbicacion;
};

/**
 * Actualiza una ubicación existente
 * 
 * @param id ID de la ubicación a actualizar
 * @param changes Campos a actualizar (parcial)
 * @returns La ubicación actualizada
 * @throws Error si la ubicación no existe
 */
export const updateLocation = async (
  id: string,
  changes: Partial<Omit<Location, 'id'>>
): Promise<Location> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const locations = await getLocations();
  const indice = locations.findIndex(loc => loc.id === id);
  
  if (indice === -1) {
    throw new Error(`Ubicación con ID ${id} no encontrada`);
  }
  
  locations[indice] = {
    ...locations[indice],
    ...changes,
  };
  
  localStorage.setItem('locations-eventos', JSON.stringify(locations));
  
  return locations[indice];
};

/**
 * Elimina una ubicación
 * 
 * NOTA: En producción, se debería verificar que no haya eventos asociados
 * a esta ubicación antes de eliminarla, o implementar soft delete.
 * 
 * @param id ID de la ubicación a eliminar
 * @throws Error si la ubicación no existe
 */
export const deleteLocation = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const locations = await getLocations();
  const ubicacionesFiltradas = locations.filter(loc => loc.id !== id);
  
  if (ubicacionesFiltradas.length === locations.length) {
    throw new Error(`Ubicación con ID ${id} no encontrada`);
  }
  
  localStorage.setItem('locations-eventos', JSON.stringify(ubicacionesFiltradas));
};

/**
 * Marca o desmarca una ubicación como frecuente
 * 
 * Las ubicaciones frecuentes aparecen primero en los selectores de ubicación
 * y son las más utilizadas en el gimnasio.
 * 
 * @param id ID de la ubicación
 * @param esFrecuente true para marcar como frecuente, false para desmarcar
 * @returns La ubicación actualizada
 */
export const markLocationAsFrequent = async (
  id: string,
  esFrecuente: boolean
): Promise<Location> => {
  return updateLocation(id, { esUbicacionFrecuente: esFrecuente });
};

/**
 * Obtiene solo las ubicaciones frecuentes
 * 
 * @returns Lista de ubicaciones marcadas como frecuentes
 */
export const getFrequentLocations = async (): Promise<Location[]> => {
  const locations = await getLocations();
  return locations.filter(loc => loc.esUbicacionFrecuente);
};

// ============================================================================
// CAPACIDAD Y CONFLICTOS DE HORARIO
// ============================================================================

/**
 * Obtiene la capacidad máxima de una ubicación
 * 
 * @param locationId ID de la ubicación
 * @returns La capacidad máxima o 0 si la ubicación no existe
 */
export const getLocationCapacity = async (locationId: string): Promise<number> => {
  const location = await getLocationById(locationId);
  return location?.capacidadMaxima || 0;
};

/**
 * Verifica conflictos de horario para una ubicación en un rango de fechas
 * 
 * Esta función utiliza los eventos existentes (obtenidos de events.ts mediante getEvents)
 * para detectar solapamientos de horario en la misma ubicación.
 * 
 * Un conflicto ocurre cuando:
 * - Dos eventos presenciales comparten la misma ubicación (ubicacionId)
 * - Sus rangos de fecha/hora se solapan (se superponen en el tiempo)
 * 
 * Ejemplo de solapamiento:
 * - Evento A: 10:00 - 11:00
 * - Evento B: 10:30 - 11:30
 * -> Conflicto: se solapan entre 10:30 y 11:00
 * 
 * @param locationId ID de la ubicación a verificar
 * @param rangoFechaHora Objeto con fechaInicio y fechaFin del evento a verificar
 * @param eventoIdExcluir (Opcional) ID del evento a excluir de la verificación (útil al editar un evento existente)
 * @returns Lista de eventos en conflicto
 */
export const verificarConflictosHorario = async (
  locationId: string,
  rangoFechaHora: {
    fechaInicio: Date;
    fechaFin: Date;
  },
  eventoIdExcluir?: string
): Promise<ScheduleConflict[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Obtener la ubicación para validar que existe
  const ubicacion = await getLocationById(locationId);
  if (!ubicacion) {
    return [];
  }
  
  // Obtener todos los eventos usando getEvents de events.ts
  const eventos = await getEvents();
  
  const conflictos: ScheduleConflict[] = [];
  const { fechaInicio, fechaFin } = rangoFechaHora;
  
  eventos.forEach((evento) => {
    // Excluir el evento actual si se está editando
    if (eventoIdExcluir && evento.id === eventoIdExcluir) {
      return;
    }
    
    // Solo verificar eventos presenciales (los únicos que usan ubicaciones)
    if (evento.tipo !== 'presencial') {
      return;
    }
    
    // Verificar si el evento usa la misma ubicación
    // Compatibilidad: verificar tanto ubicacionId como ubicacion (nombre) para compatibilidad con datos antiguos
    const mismoUbicacion = 
      evento.ubicacionId === locationId || 
      evento.ubicacion === ubicacion.nombre;
    
    if (!mismoUbicacion) {
      return;
    }
    
    // Convertir fechas del evento a objetos Date si no lo son
    const eventoFechaInicio = evento.fechaInicio instanceof Date 
      ? evento.fechaInicio 
      : new Date(evento.fechaInicio);
    
    const eventoFechaFin = evento.fechaFin 
      ? (evento.fechaFin instanceof Date ? evento.fechaFin : new Date(evento.fechaFin))
      : eventoFechaInicio; // Si no hay fechaFin, usar fechaInicio como fin
    
    // Verificar solapamiento de horarios
    // Dos rangos se solapan si:
    // - El inicio del nuevo rango está dentro del rango existente, O
    // - El fin del nuevo rango está dentro del rango existente, O
    // - El nuevo rango contiene completamente el rango existente
    const haySolapamiento = 
      (fechaInicio >= eventoFechaInicio && fechaInicio <= eventoFechaFin) ||
      (fechaFin >= eventoFechaInicio && fechaFin <= eventoFechaFin) ||
      (fechaInicio <= eventoFechaInicio && fechaFin >= eventoFechaFin);
    
    if (haySolapamiento) {
      conflictos.push({
        eventoId: evento.id,
        eventoNombre: evento.nombre,
        fechaInicio: eventoFechaInicio,
        fechaFin: eventoFechaFin,
        ubicacionId: locationId,
        ubicacionNombre: ubicacion.nombre,
      });
    }
  });
  
  return conflictos;
};

/**
 * Verifica conflictos de horario y retorna un resultado detallado
 * 
 * Esta función proporciona más información que verificarConflictosHorario,
 * incluyendo la ubicación completa y un booleano para facilitar la verificación.
 * 
 * @param locationId ID de la ubicación a verificar
 * @param rangoFechaHora Objeto con fechaInicio y fechaFin del evento a verificar
 * @param eventoIdExcluir (Opcional) ID del evento a excluir de la verificación
 * @returns Resultado detallado con información del conflicto
 */
export const checkScheduleConflicts = async (
  locationId: string,
  rangoFechaHora: {
    fechaInicio: Date;
    fechaFin: Date;
  },
  eventoIdExcluir?: string
): Promise<ConflictCheckResult> => {
  const conflictos = await verificarConflictosHorario(
    locationId,
    rangoFechaHora,
    eventoIdExcluir
  );
  
  const ubicacion = await getLocationById(locationId);
  
  return {
    tieneConflictos: conflictos.length > 0,
    conflictos,
    ubicacion,
  };
};

// ============================================================================
// COMPATIBILIDAD HACIA ATRÁS (Backward Compatibility)
// ============================================================================
// 
// Las siguientes exportaciones mantienen compatibilidad con código existente
// que usa los nombres en español. Se recomienda migrar al uso de las funciones
// en inglés (getLocations, createLocation, etc.) en el futuro.
// ============================================================================

/**
 * @deprecated Usar getLocations() en su lugar
 */
export const getUbicaciones = getLocations;

/**
 * @deprecated Usar getFrequentLocations() en su lugar
 */
export const getUbicacionesFrecuentes = getFrequentLocations;

/**
 * @deprecated Usar createLocation() en su lugar
 */
export const crearUbicacion = async (
  data: Omit<Location, 'id'>
): Promise<Location> => {
  return createLocation(data);
};

/**
 * @deprecated Usar updateLocation() en su lugar
 */
export const actualizarUbicacion = async (
  id: string,
  datos: Partial<Omit<Location, 'id'>>
): Promise<Location> => {
  return updateLocation(id, datos);
};

/**
 * @deprecated Usar deleteLocation() en su lugar
 */
export const eliminarUbicacion = deleteLocation;

/**
 * @deprecated Usar markLocationAsFrequent() en su lugar
 */
export const marcarUbicacionFrecuente = markLocationAsFrequent;

/**
 * @deprecated Usar getLocationCapacity() en su lugar
 */
export const getCapacidadMaximaUbicacion = getLocationCapacity;

/**
 * Tipo alias para compatibilidad con código existente
 * @deprecated Usar Location de types/index.ts en su lugar
 */
export type Ubicacion = Location;

/**
 * Tipo alias para compatibilidad con código existente
 * @deprecated Usar ScheduleConflict en su lugar
 */
export type ConflictoHorario = ScheduleConflict;

