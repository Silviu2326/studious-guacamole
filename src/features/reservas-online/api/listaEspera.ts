import { ListaEspera, Reserva } from '../types';
import { createReserva } from './reservas';

/**
 * Almacenamiento mock en memoria de lista de espera
 * En producción, esto se almacenaría en una base de datos
 */
let mockListaEspera: ListaEspera[] = [
  {
    id: 'le1',
    claseId: 'clase1',
    claseNombre: 'Spinning',
    clienteId: 'cliente1',
    clienteNombre: 'Juan Pérez',
    fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
    hora: '10:00',
    posicion: 1,
    notificado: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'le2',
    claseId: 'clase1',
    claseNombre: 'Spinning',
    clienteId: 'cliente2',
    clienteNombre: 'María García',
    fecha: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    hora: '10:00',
    posicion: 2,
    notificado: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'le3',
    claseId: 'clase2',
    claseNombre: 'Boxeo',
    clienteId: 'cliente3',
    clienteNombre: 'Carlos Ruiz',
    fecha: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    hora: '12:00',
    posicion: 1,
    notificado: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Obtiene todas las entradas de la lista de espera
 * 
 * @param role - Rol del usuario ('entrenador' o 'gimnasio')
 * @param claseId - ID de la clase (opcional, para filtrar por clase)
 * @returns Promise con la lista de entradas ordenadas por prioridad
 */
export const getListaEspera = async (
  role: 'entrenador' | 'gimnasio' = 'gimnasio',
  claseId?: string
): Promise<ListaEspera[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let lista = [...mockListaEspera];
  
  // Filtrar por clase si se proporciona
  if (claseId) {
    lista = lista.filter(le => le.claseId === claseId);
  }
  
  // Para entrenadores, no hay lista de espera (solo para gimnasios)
  if (role === 'entrenador') {
    return [];
  }
  
  // Ordenar por posición (menor número = mayor prioridad) y fecha de creación
  lista.sort((a, b) => {
    if (a.posicion !== b.posicion) {
      return a.posicion - b.posicion;
    }
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
  
  return lista;
};

/**
 * Agrega un cliente a la lista de espera
 * 
 * @param data - Datos de la entrada a agregar
 * @returns Promise con la entrada creada
 */
export const agregarAListaEspera = async (
  data: Omit<ListaEspera, 'id' | 'posicion' | 'notificado' | 'createdAt'>
): Promise<ListaEspera> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Verificar si el cliente ya está en la lista de espera para la misma clase y fecha
  const existe = mockListaEspera.find(le => 
    le.clienteId === data.clienteId &&
    le.claseId === data.claseId &&
    le.fecha.getTime() === data.fecha.getTime() &&
    le.hora === data.hora
  );
  
  if (existe) {
    throw new Error('El cliente ya está en la lista de espera para esta clase y horario');
  }
  
  // Calcular posición (número de entradas para la misma clase + 1)
  const entradasMismaClase = mockListaEspera.filter(
    le => le.claseId === data.claseId && 
    le.fecha.getTime() === data.fecha.getTime() &&
    le.hora === data.hora
  ).length;
  
  const nuevaEntrada: ListaEspera = {
    ...data,
    id: `le${Date.now()}`,
    posicion: entradasMismaClase + 1,
    notificado: false,
    createdAt: new Date(),
  };
  
  mockListaEspera.push(nuevaEntrada);
  
  return nuevaEntrada;
};

/**
 * Elimina un cliente de la lista de espera
 * 
 * @param id - ID de la entrada a eliminar
 * @returns Promise que se resuelve cuando la entrada ha sido eliminada
 */
export const eliminarDeListaEspera = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockListaEspera.findIndex(le => le.id === id);
  
  if (index === -1) {
    throw new Error('Entrada no encontrada');
  }
  
  const entradaEliminada = mockListaEspera[index];
  mockListaEspera.splice(index, 1);
  
  // Reorganizar posiciones de las entradas restantes para la misma clase
  reorganizarPosiciones(entradaEliminada.claseId, entradaEliminada.fecha, entradaEliminada.hora);
};

/**
 * Mueve un cliente de la lista de espera a una reserva cuando hay espacio disponible
 * 
 * @param entradaId - ID de la entrada de lista de espera
 * @param fechaReserva - Fecha de la reserva a crear
 * @param horaInicio - Hora de inicio de la reserva
 * @param horaFin - Hora de fin de la reserva
 * @param entrenadorId - ID del entrenador (opcional)
 * @returns Promise con la reserva creada
 */
export const moverAListaEsperaAReserva = async (
  entradaId: string,
  fechaReserva: Date,
  horaInicio: string,
  horaFin: string,
  entrenadorId?: string
): Promise<Reserva> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const entrada = mockListaEspera.find(le => le.id === entradaId);
  
  if (!entrada) {
    throw new Error('Entrada de lista de espera no encontrada');
  }
  
  // Crear la reserva
  const reserva = await createReserva({
    clienteId: entrada.clienteId,
    entrenadorId: entrenadorId || 'entrenador1',
    fechaInicio: fechaReserva,
    fechaFin: fechaReserva,
    horaInicio,
    horaFin,
    tipo: 'clase-grupal',
    claseId: entrada.claseId,
    claseNombre: entrada.claseNombre,
    estado: 'confirmada',
    origen: 'manual',
    esOnline: false,
    precio: 15, // Precio por defecto, debería venir de la clase
    pagado: false,
    clienteNombre: entrada.clienteNombre,
  }, entrenadorId);
  
  // Eliminar de la lista de espera
  await eliminarDeListaEspera(entradaId);
  
  return reserva;
};

/**
 * Actualiza la posición de un cliente en la lista de espera
 * 
 * @param entradaId - ID de la entrada
 * @param nuevaPosicion - Nueva posición (1 = mayor prioridad)
 * @returns Promise con la entrada actualizada
 */
export const actualizarPosicionListaEspera = async (
  entradaId: string,
  nuevaPosicion: number
): Promise<ListaEspera> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const entrada = mockListaEspera.find(le => le.id === entradaId);
  
  if (!entrada) {
    throw new Error('Entrada no encontrada');
  }
  
  // Validar que la nueva posición sea válida
  const entradasMismaClase = mockListaEspera.filter(
    le => le.claseId === entrada.claseId &&
    le.fecha.getTime() === entrada.fecha.getTime() &&
    le.hora === entrada.hora
  ).length;
  
  if (nuevaPosicion < 1 || nuevaPosicion > entradasMismaClase) {
    throw new Error(`La posición debe estar entre 1 y ${entradasMismaClase}`);
  }
  
  // Actualizar posición
  entrada.posicion = nuevaPosicion;
  
  // Reorganizar posiciones de las demás entradas
  reorganizarPosiciones(entrada.claseId, entrada.fecha, entrada.hora);
  
  return entrada;
};

/**
 * Marca una entrada como notificada
 * 
 * @param entradaId - ID de la entrada
 * @returns Promise con la entrada actualizada
 */
export const marcarComoNotificado = async (entradaId: string): Promise<ListaEspera> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const entrada = mockListaEspera.find(le => le.id === entradaId);
  
  if (!entrada) {
    throw new Error('Entrada no encontrada');
  }
  
  entrada.notificado = true;
  
  return entrada;
};

/**
 * Reorganiza las posiciones de las entradas de lista de espera para una clase específica
 * 
 * @param claseId - ID de la clase
 * @param fecha - Fecha de la clase
 * @param hora - Hora de la clase
 */
const reorganizarPosiciones = (claseId: string, fecha: Date, hora: string): void => {
  const entradasMismaClase = mockListaEspera
    .filter(le => 
      le.claseId === claseId &&
      le.fecha.getTime() === fecha.getTime() &&
      le.hora === hora
    )
    .sort((a, b) => {
      // Ordenar por fecha de creación (más antiguas primero)
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  
  entradasMismaClase.forEach((entrada, index) => {
    entrada.posicion = index + 1;
  });
};

/**
 * Obtiene estadísticas de la lista de espera
 * 
 * @param role - Rol del usuario
 * @returns Promise con estadísticas
 */
export const getEstadisticasListaEspera = async (
  role: 'entrenador' | 'gimnasio' = 'gimnasio'
): Promise<{
  total: number;
  porClase: Array<{ claseId: string; claseNombre: string; cantidad: number }>;
  notificados: number;
  pendientes: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (role === 'entrenador') {
    return {
      total: 0,
      porClase: [],
      notificados: 0,
      pendientes: 0,
    };
  }
  
  const total = mockListaEspera.length;
  const notificados = mockListaEspera.filter(le => le.notificado).length;
  const pendientes = total - notificados;
  
  // Agrupar por clase
  const porClaseMap = new Map<string, { claseId: string; claseNombre: string; cantidad: number }>();
  
  mockListaEspera.forEach(le => {
    const existente = porClaseMap.get(le.claseId);
    if (existente) {
      existente.cantidad++;
    } else {
      porClaseMap.set(le.claseId, {
        claseId: le.claseId,
        claseNombre: le.claseNombre,
        cantidad: 1,
      });
    }
  });
  
  return {
    total,
    porClase: Array.from(porClaseMap.values()),
    notificados,
    pendientes,
  };
};

