import { Cita, SesionTipo } from '../types';
import { getCitas } from './calendario';

export interface SesionHistorial {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  tipo: string;
  estado: string;
  notas?: string;
  asistencia?: 'asistio' | 'falto' | 'cancelado';
  clienteId?: string;
  clienteNombre?: string;
}

export interface EstadisticasCliente {
  totalSesiones: number;
  sesionesPasadas: number;
  sesionesPresentes: number;
  sesionesFuturas: number;
  sesionesAsistidas: number;
  sesionesFaltadas: number;
  sesionesCanceladas: number;
  tasaAsistencia: number; // Porcentaje (0-100)
}

export interface FiltroHistorial {
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: string;
  tipo?: string;
  asistencia?: 'asistio' | 'falto' | 'cancelado';
}

/**
 * Obtiene el historial completo de sesiones de un cliente
 */
export const getHistorialSesionesCliente = async (
  clienteId: string,
  filtros?: FiltroHistorial,
  userId?: string
): Promise<{ sesiones: SesionHistorial[]; estadisticas: EstadisticasCliente }> => {
  return new Promise(async (resolve) => {
    try {
      // Obtener todas las citas del cliente
      // En producción, esto haría una llamada específica a la API para obtener sesiones por cliente
      // Por ahora, obtenemos todas las citas y filtramos por cliente
      const fechaInicio = filtros?.fechaInicio || new Date(0); // Desde el inicio de los tiempos
      const fechaFin = filtros?.fechaFin || new Date('2099-12-31'); // Hasta el futuro
      
      const todasLasCitas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      
      // Filtrar por cliente
      let sesionesCliente = todasLasCitas.filter(cita => cita.clienteId === clienteId);
      
      // Aplicar filtros adicionales
      if (filtros?.estado) {
        sesionesCliente = sesionesCliente.filter(c => c.estado === filtros.estado);
      }
      if (filtros?.tipo) {
        sesionesCliente = sesionesCliente.filter(c => c.tipo === filtros.tipo);
      }
      if (filtros?.asistencia) {
        sesionesCliente = sesionesCliente.filter(c => c.asistencia === filtros.asistencia);
      }
      
      // Convertir a SesionHistorial
      const historial: SesionHistorial[] = sesionesCliente.map(cita => ({
        id: cita.id,
        fechaInicio: cita.fechaInicio,
        fechaFin: cita.fechaFin,
        tipo: cita.tipo,
        estado: cita.estado,
        notas: cita.notas,
        asistencia: cita.asistencia,
        clienteId: cita.clienteId,
        clienteNombre: cita.clienteNombre,
      }));
      
      // Ordenar por fecha (más recientes primero)
      historial.sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime());
      
      // Calcular estadísticas
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const sesionesPasadas = historial.filter(s => {
        const fecha = new Date(s.fechaFin);
        fecha.setHours(0, 0, 0, 0);
        return fecha < hoy;
      }).length;
      
      const sesionesPresentes = historial.filter(s => {
        const fechaInicio = new Date(s.fechaInicio);
        fechaInicio.setHours(0, 0, 0, 0);
        const fechaFin = new Date(s.fechaFin);
        fechaFin.setHours(23, 59, 59, 999);
        return fechaInicio <= hoy && fechaFin >= hoy;
      }).length;
      
      const sesionesFuturas = historial.filter(s => {
        const fecha = new Date(s.fechaInicio);
        fecha.setHours(0, 0, 0, 0);
        return fecha > hoy;
      }).length;
      
      const sesionesAsistidas = historial.filter(s => s.asistencia === 'asistio').length;
      const sesionesFaltadas = historial.filter(s => s.asistencia === 'falto').length;
      const sesionesCanceladas = historial.filter(s => s.asistencia === 'cancelado' || s.estado === 'cancelada').length;
      
      // Calcular tasa de asistencia (solo sobre sesiones pasadas que no fueron canceladas)
      const sesionesPasadasNoCanceladas = historial.filter(s => {
        const fecha = new Date(s.fechaFin);
        fecha.setHours(0, 0, 0, 0);
        return fecha < hoy && s.estado !== 'cancelada' && s.asistencia !== 'cancelado';
      });
      
      const tasaAsistencia = sesionesPasadasNoCanceladas.length > 0
        ? Math.round((sesionesAsistidas / sesionesPasadasNoCanceladas.length) * 100)
        : 0;
      
      const estadisticas: EstadisticasCliente = {
        totalSesiones: historial.length,
        sesionesPasadas,
        sesionesPresentes,
        sesionesFuturas,
        sesionesAsistidas,
        sesionesFaltadas,
        sesionesCanceladas,
        tasaAsistencia,
      };
      
      setTimeout(() => {
        resolve({ sesiones: historial, estadisticas });
      }, 300);
    } catch (error) {
      console.error('Error obteniendo historial de sesiones:', error);
      // Retornar datos vacíos en caso de error
      setTimeout(() => {
        resolve({
          sesiones: [],
          estadisticas: {
            totalSesiones: 0,
            sesionesPasadas: 0,
            sesionesPresentes: 0,
            sesionesFuturas: 0,
            sesionesAsistidas: 0,
            sesionesFaltadas: 0,
            sesionesCanceladas: 0,
            tasaAsistencia: 0,
          },
        });
      }, 300);
    }
  });
};

// ===== GESTIÓN DE TIPOS DE SESIÓN =====

/**
 * Datos mock de tipos de sesión
 * Estos son ejemplos de configuración de diferentes tipos de servicios
 */
let TIPOS_SESION_MOCK: SesionTipo[] = [
  {
    id: 'tipo-entrenamiento-1-1',
    nombre: 'Entrenamiento Personal 1:1',
    duracion: 60,
    capacidad: 1,
    precio: 50,
    color: '#3B82F6', // Azul
    permiteListaEspera: false,
    modalidad: 'presencial',
    notas: 'Sesión individual personalizada con el entrenador',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tipo-clase-grupal',
    nombre: 'Clase Grupal',
    duracion: 45,
    capacidad: 12,
    precio: 15,
    color: '#10B981', // Verde
    permiteListaEspera: true,
    modalidad: 'presencial',
    notas: 'Clase grupal con capacidad máxima de 12 participantes',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tipo-sesion-online',
    nombre: 'Sesión Online',
    duracion: 45,
    capacidad: 1,
    precio: 35,
    color: '#8B5CF6', // Púrpura
    permiteListaEspera: false,
    modalidad: 'online',
    notas: 'Sesión realizada mediante videollamada',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'tipo-valoracion-inicial',
    nombre: 'Valoración Inicial',
    duracion: 90,
    capacidad: 1,
    precio: 75,
    color: '#F59E0B', // Naranja
    permiteListaEspera: false,
    modalidad: 'presencial',
    notas: 'Sesión de evaluación inicial para nuevos clientes. Incluye análisis de condición física y objetivos.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

/**
 * Obtiene la lista completa de tipos de sesión disponibles
 * 
 * @returns Promise con la lista de tipos de sesión
 */
export const getTiposSesion = async (): Promise<SesionTipo[]> => {
  return new Promise((resolve) => {
    // Simular latencia de red
    setTimeout(() => {
      // Retornar una copia para evitar mutaciones directas
      resolve(JSON.parse(JSON.stringify(TIPOS_SESION_MOCK)));
    }, 300);
  });
};

/**
 * Crea un nuevo tipo de sesión
 * 
 * @param data - Datos del nuevo tipo de sesión (sin id, createdAt, updatedAt)
 * @returns Promise con el tipo de sesión creado
 */
export const createTipoSesion = async (
  data: Omit<SesionTipo, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SesionTipo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validaciones básicas
      if (!data.nombre || data.nombre.trim() === '') {
        reject(new Error('El nombre del tipo de sesión es requerido'));
        return;
      }
      
      if (data.duracion <= 0) {
        reject(new Error('La duración debe ser mayor a 0'));
        return;
      }
      
      if (data.capacidad <= 0) {
        reject(new Error('La capacidad debe ser mayor a 0'));
        return;
      }
      
      // Verificar si ya existe un tipo con el mismo nombre
      const existe = TIPOS_SESION_MOCK.some(
        tipo => tipo.nombre.toLowerCase() === data.nombre.toLowerCase()
      );
      
      if (existe) {
        reject(new Error('Ya existe un tipo de sesión con ese nombre'));
        return;
      }
      
      // Crear nuevo tipo de sesión
      const nuevoTipo: SesionTipo = {
        id: `tipo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Agregar a la lista
      TIPOS_SESION_MOCK.push(nuevoTipo);
      
      resolve(JSON.parse(JSON.stringify(nuevoTipo)));
    }, 300);
  });
};

/**
 * Actualiza un tipo de sesión existente
 * 
 * @param id - ID del tipo de sesión a actualizar
 * @param changes - Campos a actualizar (parcial)
 * @returns Promise con el tipo de sesión actualizado
 */
export const updateTipoSesion = async (
  id: string,
  changes: Partial<Omit<SesionTipo, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<SesionTipo> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const indice = TIPOS_SESION_MOCK.findIndex(tipo => tipo.id === id);
      
      if (indice === -1) {
        reject(new Error(`No se encontró el tipo de sesión con ID: ${id}`));
        return;
      }
      
      // Validaciones si se actualiza el nombre
      if (changes.nombre !== undefined) {
        if (changes.nombre.trim() === '') {
          reject(new Error('El nombre del tipo de sesión no puede estar vacío'));
          return;
        }
        
        // Verificar si ya existe otro tipo con el mismo nombre
        const existe = TIPOS_SESION_MOCK.some(
          (tipo, idx) => 
            idx !== indice && 
            tipo.nombre.toLowerCase() === changes.nombre!.toLowerCase()
        );
        
        if (existe) {
          reject(new Error('Ya existe otro tipo de sesión con ese nombre'));
          return;
        }
      }
      
      // Validaciones si se actualiza la duración
      if (changes.duracion !== undefined && changes.duracion <= 0) {
        reject(new Error('La duración debe ser mayor a 0'));
        return;
      }
      
      // Validaciones si se actualiza la capacidad
      if (changes.capacidad !== undefined && changes.capacidad <= 0) {
        reject(new Error('La capacidad debe ser mayor a 0'));
        return;
      }
      
      // Actualizar el tipo de sesión
      const tipoActualizado: SesionTipo = {
        ...TIPOS_SESION_MOCK[indice],
        ...changes,
        updatedAt: new Date(),
      };
      
      TIPOS_SESION_MOCK[indice] = tipoActualizado;
      
      resolve(JSON.parse(JSON.stringify(tipoActualizado)));
    }, 300);
  });
};

/**
 * Elimina un tipo de sesión
 * 
 * @param id - ID del tipo de sesión a eliminar
 * @returns Promise que se resuelve cuando se elimina exitosamente
 */
export const deleteTipoSesion = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const indice = TIPOS_SESION_MOCK.findIndex(tipo => tipo.id === id);
      
      if (indice === -1) {
        reject(new Error(`No se encontró el tipo de sesión con ID: ${id}`));
        return;
      }
      
      // En producción, aquí se debería verificar si hay citas asociadas
      // Por ahora, solo eliminamos el tipo
      TIPOS_SESION_MOCK.splice(indice, 1);
      
      resolve();
    }, 300);
  });
};

