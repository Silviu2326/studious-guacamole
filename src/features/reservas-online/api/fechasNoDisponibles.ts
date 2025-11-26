// API para gestionar fechas no disponibles (bloqueos de fecha completa)

export interface FechaNoDisponible {
  id: string;
  entrenadorId: string;
  fecha: Date;
  motivo?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Obtiene todas las fechas no disponibles de un entrenador
 */
export const getFechasNoDisponibles = async (
  entrenadorId: string,
  fechaInicio?: Date,
  fechaFin?: Date
): Promise<FechaNoDisponible[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const storageKey = `fechas-no-disponibles-${entrenadorId}`;
  const fechasStorage = localStorage.getItem(storageKey);

  if (!fechasStorage) {
    return [];
  }

  try {
    const fechasData = JSON.parse(fechasStorage);
    let fechas: FechaNoDisponible[] = fechasData.map((f: any) => ({
      ...f,
      fecha: new Date(f.fecha),
      createdAt: new Date(f.createdAt),
      updatedAt: new Date(f.updatedAt),
    }));

    // Filtrar por rango de fechas si se proporciona
    if (fechaInicio && fechaFin) {
      fechas = fechas.filter(f => {
        const fecha = new Date(f.fecha);
        fecha.setHours(0, 0, 0, 0);
        const inicio = new Date(fechaInicio);
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);
        return fecha >= inicio && fecha <= fin;
      });
    }

    return fechas;
  } catch (error) {
    console.error('Error cargando fechas no disponibles:', error);
    return [];
  }
};

/**
 * Marca una fecha como no disponible
 */
export const marcarFechaNoDisponible = async (
  entrenadorId: string,
  fecha: Date,
  motivo?: string
): Promise<FechaNoDisponible> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const storageKey = `fechas-no-disponibles-${entrenadorId}`;
  const fechasStorage = localStorage.getItem(storageKey);
  const fechas: FechaNoDisponible[] = fechasStorage
    ? JSON.parse(fechasStorage).map((f: any) => ({
        ...f,
        fecha: new Date(f.fecha),
        createdAt: new Date(f.createdAt),
        updatedAt: new Date(f.updatedAt),
      }))
    : [];

  // Normalizar fecha (solo día, sin hora)
  const fechaNormalizada = new Date(fecha);
  fechaNormalizada.setHours(0, 0, 0, 0);

  // Verificar si la fecha ya está marcada como no disponible
  const fechaExistente = fechas.find(f => {
    const fFecha = new Date(f.fecha);
    fFecha.setHours(0, 0, 0, 0);
    return fFecha.getTime() === fechaNormalizada.getTime();
  });

  if (fechaExistente) {
    // Actualizar fecha existente
    fechaExistente.motivo = motivo;
    fechaExistente.updatedAt = new Date();
  } else {
    // Crear nueva fecha no disponible
    const nuevaFecha: FechaNoDisponible = {
      id: `fecha-no-disponible-${Date.now()}`,
      entrenadorId,
      fecha: fechaNormalizada,
      motivo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fechas.push(nuevaFecha);
  }

  // Guardar en localStorage
  localStorage.setItem(storageKey, JSON.stringify(fechas));

  return fechaExistente || fechas[fechas.length - 1];
};

/**
 * Desmarca una fecha como no disponible
 */
export const desmarcarFechaNoDisponible = async (
  entrenadorId: string,
  fechaId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const storageKey = `fechas-no-disponibles-${entrenadorId}`;
  const fechasStorage = localStorage.getItem(storageKey);

  if (!fechasStorage) {
    return;
  }

  try {
    const fechas: FechaNoDisponible[] = JSON.parse(fechasStorage);
    const fechasFiltradas = fechas.filter(f => f.id !== fechaId);
    localStorage.setItem(storageKey, JSON.stringify(fechasFiltradas));
  } catch (error) {
    console.error('Error desmarcando fecha no disponible:', error);
  }
};

/**
 * Verifica si una fecha está marcada como no disponible
 */
export const esFechaNoDisponible = async (
  entrenadorId: string,
  fecha: Date
): Promise<boolean> => {
  const fechaNormalizada = new Date(fecha);
  fechaNormalizada.setHours(0, 0, 0, 0);

  const fechasNoDisponibles = await getFechasNoDisponibles(entrenadorId);
  return fechasNoDisponibles.some(f => {
    const fFecha = new Date(f.fecha);
    fFecha.setHours(0, 0, 0, 0);
    return fFecha.getTime() === fechaNormalizada.getTime();
  });
};

