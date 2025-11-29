// API para gestionar fechas no disponibles (bloqueos de fecha completa)

import { FechaNoDisponible } from '../types';

/**
 * Obtiene todas las fechas no disponibles
 * 
 * @param entrenadorId - ID del entrenador (opcional si aplicaA es 'centro')
 * @param centroId - ID del centro (opcional si aplicaA es 'entrenador')
 * @param fechaInicio - Fecha de inicio para filtrar (opcional)
 * @param fechaFin - Fecha de fin para filtrar (opcional)
 * @returns Lista de fechas no disponibles
 * 
 * @remarks
 * Esta es una función mock que simplifica el CRUD de fechas no disponibles.
 * En producción, se conectaría con un backend que maneja múltiples contextos
 * (entrenadores, centros) y validaciones más complejas.
 */
export const getFechasNoDisponibles = async (
  entrenadorId?: string,
  centroId?: string,
  fechaInicio?: Date,
  fechaFin?: Date
): Promise<FechaNoDisponible[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Determinar la clave de almacenamiento según el contexto
  const storageKey = entrenadorId 
    ? `fechas-no-disponibles-${entrenadorId}`
    : centroId 
    ? `fechas-no-disponibles-centro-${centroId}`
    : null;

  if (!storageKey) {
    return [];
  }

  const fechasStorage = localStorage.getItem(storageKey);

  if (!fechasStorage) {
    return [];
  }

  try {
    const fechasData = JSON.parse(fechasStorage);
    let fechas: FechaNoDisponible[] = fechasData.map((f: any) => ({
      ...f,
      fechaInicio: new Date(f.fechaInicio || f.fecha), // Compatibilidad con formato antiguo
      fechaFin: new Date(f.fechaFin || f.fecha), // Compatibilidad con formato antiguo
      fecha: f.fecha ? new Date(f.fecha) : new Date(f.fechaInicio || f.fecha), // Alias para compatibilidad
      createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
      updatedAt: f.updatedAt ? new Date(f.updatedAt) : new Date(),
    }));

    // Filtrar por rango de fechas si se proporciona
    if (fechaInicio && fechaFin) {
      fechas = fechas.filter(f => {
        const inicio = new Date(fechaInicio);
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);
        
        // Verificar si el rango de la fecha no disponible se solapa con el rango solicitado
        const fechaNoDisponibleInicio = new Date(f.fechaInicio);
        fechaNoDisponibleInicio.setHours(0, 0, 0, 0);
        const fechaNoDisponibleFin = new Date(f.fechaFin);
        fechaNoDisponibleFin.setHours(23, 59, 59, 999);
        
        return !(fechaNoDisponibleFin < inicio || fechaNoDisponibleInicio > fin);
      });
    }

    return fechas;
  } catch (error) {
    console.error('Error cargando fechas no disponibles:', error);
    return [];
  }
};

/**
 * Crea una nueva fecha no disponible
 * 
 * @param data - Datos de la fecha no disponible
 * @returns Fecha no disponible creada
 * 
 * @remarks
 * Esta es una función mock que simplifica la creación de fechas no disponibles.
 * En producción, se conectaría con un backend que valida rangos de fechas,
 * solapamientos y permisos.
 */
export const crearFechaNoDisponible = async (
  data: Omit<FechaNoDisponible, 'id' | 'createdAt' | 'updatedAt'>
): Promise<FechaNoDisponible> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Validar que tenga al menos entrenadorId o centroId según aplicaA
  if (data.aplicaA === 'entrenador' && !data.entrenadorId) {
    throw new Error('entrenadorId es requerido cuando aplicaA es "entrenador"');
  }
  if (data.aplicaA === 'centro' && !data.centroId) {
    throw new Error('centroId es requerido cuando aplicaA es "centro"');
  }

  // Determinar la clave de almacenamiento
  const storageKey = data.entrenadorId 
    ? `fechas-no-disponibles-${data.entrenadorId}`
    : `fechas-no-disponibles-centro-${data.centroId}`;

  const fechasStorage = localStorage.getItem(storageKey);
  const fechas: FechaNoDisponible[] = fechasStorage
    ? JSON.parse(fechasStorage).map((f: any) => ({
        ...f,
        fechaInicio: new Date(f.fechaInicio || f.fecha),
        fechaFin: new Date(f.fechaFin || f.fecha),
        fecha: f.fecha ? new Date(f.fecha) : new Date(f.fechaInicio || f.fecha),
        createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
        updatedAt: f.updatedAt ? new Date(f.updatedAt) : new Date(),
      }))
    : [];

  // Normalizar fechas (solo día, sin hora)
  const fechaInicioNormalizada = new Date(data.fechaInicio);
  fechaInicioNormalizada.setHours(0, 0, 0, 0);
  const fechaFinNormalizada = new Date(data.fechaFin);
  fechaFinNormalizada.setHours(23, 59, 59, 999);

  // Crear nueva fecha no disponible
  const nuevaFecha: FechaNoDisponible = {
    id: `fecha-no-disponible-${Date.now()}`,
    fechaInicio: fechaInicioNormalizada,
    fechaFin: fechaFinNormalizada,
    motivo: data.motivo || 'Sin motivo especificado',
    aplicaA: data.aplicaA,
    entrenadorId: data.entrenadorId,
    centroId: data.centroId,
    fecha: fechaInicioNormalizada, // Alias para compatibilidad
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  fechas.push(nuevaFecha);

  // Guardar en localStorage
  localStorage.setItem(storageKey, JSON.stringify(fechas));

  return nuevaFecha;
};

/**
 * Marca una fecha como no disponible (función de compatibilidad)
 * 
 * @deprecated Usar crearFechaNoDisponible en su lugar
 */
export const marcarFechaNoDisponible = async (
  entrenadorId: string,
  fecha: Date,
  motivo?: string
): Promise<FechaNoDisponible> => {
  return await crearFechaNoDisponible({
    fechaInicio: fecha,
    fechaFin: fecha,
    motivo: motivo || 'Sin motivo especificado',
    aplicaA: 'entrenador',
    entrenadorId,
  });
};

/**
 * Elimina una fecha no disponible
 * 
 * @param fechaId - ID de la fecha no disponible a eliminar
 * @param entrenadorId - ID del entrenador (opcional)
 * @param centroId - ID del centro (opcional)
 * @returns void
 * 
 * @remarks
 * Esta es una función mock que simplifica la eliminación de fechas no disponibles.
 * En producción, se conectaría con un backend que valida permisos y elimina
 * de forma segura.
 */
export const eliminarFechaNoDisponible = async (
  fechaId: string,
  entrenadorId?: string,
  centroId?: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Determinar la clave de almacenamiento
  const storageKey = entrenadorId 
    ? `fechas-no-disponibles-${entrenadorId}`
    : centroId 
    ? `fechas-no-disponibles-centro-${centroId}`
    : null;

  if (!storageKey) {
    throw new Error('Se requiere entrenadorId o centroId');
  }

  const fechasStorage = localStorage.getItem(storageKey);

  if (!fechasStorage) {
    return;
  }

  try {
    const fechas: FechaNoDisponible[] = JSON.parse(fechasStorage);
    const fechasFiltradas = fechas.filter(f => f.id !== fechaId);
    localStorage.setItem(storageKey, JSON.stringify(fechasFiltradas));
  } catch (error) {
    console.error('Error eliminando fecha no disponible:', error);
    throw error;
  }
};

/**
 * Desmarca una fecha como no disponible (función de compatibilidad)
 * 
 * @deprecated Usar eliminarFechaNoDisponible en su lugar
 */
export const desmarcarFechaNoDisponible = async (
  entrenadorId: string,
  fechaId: string
): Promise<void> => {
  return await eliminarFechaNoDisponible(fechaId, entrenadorId);
};

/**
 * Actualiza una fecha no disponible existente
 * 
 * @param fechaId - ID de la fecha no disponible
 * @param data - Datos parciales a actualizar
 * @param entrenadorId - ID del entrenador (opcional)
 * @param centroId - ID del centro (opcional)
 * @returns Fecha no disponible actualizada
 */
export const actualizarFechaNoDisponible = async (
  fechaId: string,
  data: Partial<Omit<FechaNoDisponible, 'id' | 'createdAt'>>,
  entrenadorId?: string,
  centroId?: string
): Promise<FechaNoDisponible> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Determinar la clave de almacenamiento
  const storageKey = entrenadorId 
    ? `fechas-no-disponibles-${entrenadorId}`
    : centroId 
    ? `fechas-no-disponibles-centro-${centroId}`
    : null;

  if (!storageKey) {
    throw new Error('Se requiere entrenadorId o centroId');
  }

  const fechasStorage = localStorage.getItem(storageKey);
  if (!fechasStorage) {
    throw new Error('Fecha no disponible no encontrada');
  }

  try {
    const fechas: FechaNoDisponible[] = JSON.parse(fechasStorage).map((f: any) => ({
      ...f,
      fechaInicio: new Date(f.fechaInicio || f.fecha),
      fechaFin: new Date(f.fechaFin || f.fecha),
      fecha: f.fecha ? new Date(f.fecha) : new Date(f.fechaInicio || f.fecha),
      createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
      updatedAt: f.updatedAt ? new Date(f.updatedAt) : new Date(),
    }));

    const fechaIndex = fechas.findIndex(f => f.id === fechaId);
    if (fechaIndex === -1) {
      throw new Error('Fecha no disponible no encontrada');
    }

    // Normalizar fechas si se actualizan
    if (data.fechaInicio) {
      const fechaInicioNormalizada = new Date(data.fechaInicio);
      fechaInicioNormalizada.setHours(0, 0, 0, 0);
      data.fechaInicio = fechaInicioNormalizada;
      data.fecha = fechaInicioNormalizada; // Actualizar alias
    }
    if (data.fechaFin) {
      const fechaFinNormalizada = new Date(data.fechaFin);
      fechaFinNormalizada.setHours(23, 59, 59, 999);
      data.fechaFin = fechaFinNormalizada;
    }

    const fechaActualizada: FechaNoDisponible = {
      ...fechas[fechaIndex],
      ...data,
      updatedAt: new Date(),
    };

    fechas[fechaIndex] = fechaActualizada;
    localStorage.setItem(storageKey, JSON.stringify(fechas));

    return fechaActualizada;
  } catch (error) {
    console.error('Error actualizando fecha no disponible:', error);
    throw error;
  }
};

/**
 * Verifica si una fecha está marcada como no disponible
 * 
 * @param fecha - Fecha a verificar
 * @param entrenadorId - ID del entrenador (opcional)
 * @param centroId - ID del centro (opcional)
 * @returns true si la fecha está marcada como no disponible
 * 
 * @remarks
 * Esta es una función mock que simplifica la verificación de disponibilidad.
 * En producción, se conectaría con un backend que verifica rangos de fechas
 * y múltiples contextos de forma eficiente.
 */
export const esFechaNoDisponible = async (
  fecha: Date,
  entrenadorId?: string,
  centroId?: string
): Promise<boolean> => {
  const fechaNormalizada = new Date(fecha);
  fechaNormalizada.setHours(0, 0, 0, 0);

  const fechasNoDisponibles = await getFechasNoDisponibles(entrenadorId, centroId);
  return fechasNoDisponibles.some(f => {
    const fechaInicio = new Date(f.fechaInicio);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(f.fechaFin);
    fechaFin.setHours(23, 59, 59, 999);
    
    // Verificar si la fecha está dentro del rango
    return fechaNormalizada >= fechaInicio && fechaNormalizada <= fechaFin;
  });
};

