import { Cita } from '../types';
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

