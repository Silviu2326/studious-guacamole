// API para gestión de ubicaciones y salas

export interface Ubicacion {
  id: string;
  nombre: string;
  descripcion?: string;
  capacidadMaxima: number;
  tipo: 'sala' | 'espacio-exterior' | 'estudio' | 'otro';
  equipamiento?: string[];
  activa: boolean;
  frecuente: boolean; // Si es una ubicación de uso frecuente
  creadoPor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConflictoHorario {
  eventoId: string;
  eventoNombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacionId: string;
  ubicacionNombre: string;
}

/**
 * Obtiene todas las ubicaciones disponibles
 */
export const getUbicaciones = async (): Promise<Ubicacion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const ubicacionesStorage = localStorage.getItem('ubicaciones-eventos');
  if (!ubicacionesStorage) {
    // Crear ubicaciones de ejemplo
    const ubicacionesEjemplo: Ubicacion[] = [
      {
        id: '1',
        nombre: 'Sala Principal',
        descripcion: 'Sala principal de entrenamiento',
        capacidadMaxima: 50,
        tipo: 'sala',
        equipamiento: ['Pesas', 'Barras', 'Máquinas'],
        activa: true,
        frecuente: true,
        creadoPor: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        nombre: 'Sala de Spinning',
        descripcion: 'Sala especializada para clases de spinning',
        capacidadMaxima: 30,
        tipo: 'sala',
        equipamiento: ['Bicicletas estáticas', 'Sistema de sonido'],
        activa: true,
        frecuente: true,
        creadoPor: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        nombre: 'Estudio de Yoga',
        descripcion: 'Espacio tranquilo para yoga y pilates',
        capacidadMaxima: 20,
        tipo: 'estudio',
        equipamiento: ['Colchonetas', 'Bloques', 'Cintas'],
        activa: true,
        frecuente: false,
        creadoPor: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        nombre: 'Patio Exterior',
        descripcion: 'Área exterior para entrenamientos al aire libre',
        capacidadMaxima: 40,
        tipo: 'espacio-exterior',
        equipamiento: [],
        activa: true,
        frecuente: false,
        creadoPor: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    localStorage.setItem('ubicaciones-eventos', JSON.stringify(ubicacionesEjemplo));
    return ubicacionesEjemplo;
  }

  try {
    return JSON.parse(ubicacionesStorage).map((u: any) => ({
      ...u,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
    }));
  } catch (error) {
    console.error('Error cargando ubicaciones:', error);
    return [];
  }
};

/**
 * Obtiene ubicaciones frecuentes
 */
export const getUbicacionesFrecuentes = async (): Promise<Ubicacion[]> => {
  const ubicaciones = await getUbicaciones();
  return ubicaciones.filter(u => u.frecuente && u.activa);
};

/**
 * Crea una nueva ubicación
 */
export const crearUbicacion = async (ubicacion: Omit<Ubicacion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ubicacion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const ubicaciones = await getUbicaciones();
  const nuevaUbicacion: Ubicacion = {
    ...ubicacion,
    id: `ubicacion-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  ubicaciones.push(nuevaUbicacion);
  localStorage.setItem('ubicaciones-eventos', JSON.stringify(ubicaciones));
  
  return nuevaUbicacion;
};

/**
 * Actualiza una ubicación
 */
export const actualizarUbicacion = async (id: string, datos: Partial<Ubicacion>): Promise<Ubicacion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const ubicaciones = await getUbicaciones();
  const indice = ubicaciones.findIndex(u => u.id === id);
  
  if (indice === -1) {
    throw new Error('Ubicación no encontrada');
  }
  
  ubicaciones[indice] = {
    ...ubicaciones[indice],
    ...datos,
    updatedAt: new Date(),
  };
  
  localStorage.setItem('ubicaciones-eventos', JSON.stringify(ubicaciones));
  
  return ubicaciones[indice];
};

/**
 * Elimina una ubicación
 */
export const eliminarUbicacion = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const ubicaciones = await getUbicaciones();
  const ubicacionesFiltradas = ubicaciones.filter(u => u.id !== id);
  
  localStorage.setItem('ubicaciones-eventos', JSON.stringify(ubicacionesFiltradas));
};

/**
 * Marca/desmarca una ubicación como frecuente
 */
export const marcarUbicacionFrecuente = async (id: string, frecuente: boolean): Promise<Ubicacion> => {
  return actualizarUbicacion(id, { frecuente });
};

/**
 * Verifica conflictos de horario para una ubicación
 */
export const verificarConflictosHorario = async (
  ubicacionId: string,
  fechaInicio: Date,
  fechaFin: Date,
  eventoIdExcluir?: string // Para excluir el evento actual al editar
): Promise<ConflictoHorario[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Obtener eventos del localStorage
  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) {
    return [];
  }

  try {
    const eventos: any[] = JSON.parse(eventosStorage);
    const conflictos: ConflictoHorario[] = [];
    
    // Obtener nombre de la ubicación
    const ubicaciones = await getUbicaciones();
    const ubicacion = ubicaciones.find(u => u.id === ubicacionId);
    if (!ubicacion) {
      return [];
    }

    eventos.forEach((evento: any) => {
      // Excluir el evento actual si se está editando
      if (eventoIdExcluir && evento.id === eventoIdExcluir) {
        return;
      }

      // Solo verificar eventos presenciales
      if (evento.tipo !== 'presencial') {
        return;
      }

      // Verificar si usa la misma ubicación
      if (evento.ubicacionId === ubicacionId || evento.ubicacion === ubicacion.nombre) {
        const eventoFechaInicio = new Date(evento.fechaInicio);
        const eventoFechaFin = evento.fechaFin ? new Date(evento.fechaFin) : eventoFechaInicio;
        
        // Verificar solapamiento de horarios
        if (
          (fechaInicio >= eventoFechaInicio && fechaInicio <= eventoFechaFin) ||
          (fechaFin >= eventoFechaInicio && fechaFin <= eventoFechaFin) ||
          (fechaInicio <= eventoFechaInicio && fechaFin >= eventoFechaFin)
        ) {
          conflictos.push({
            eventoId: evento.id,
            eventoNombre: evento.nombre,
            fechaInicio: eventoFechaInicio,
            fechaFin: eventoFechaFin,
            ubicacionId,
            ubicacionNombre: ubicacion.nombre,
          });
        }
      }
    });

    return conflictos;
  } catch (error) {
    console.error('Error verificando conflictos:', error);
    return [];
  }
};

/**
 * Obtiene la capacidad máxima de una ubicación
 */
export const getCapacidadMaximaUbicacion = async (ubicacionId: string): Promise<number> => {
  const ubicaciones = await getUbicaciones();
  const ubicacion = ubicaciones.find(u => u.id === ubicacionId);
  return ubicacion?.capacidadMaxima || 0;
};


