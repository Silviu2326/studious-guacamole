import { Cita, TipoCita } from '../types';
import { getCitas } from './calendario';
import { getConfiguracionMetaOcupacion } from './analytics';

export interface MetricasSesiones {
  totalSesiones: number;
  sesionesPorTipo: {
    tipo: TipoCita;
    cantidad: number;
    porcentaje: number;
  }[];
  sesionesPorHorario: {
    horario: string; // "09:00", "10:00", etc.
    cantidad: number;
    porcentaje: number;
  }[];
  sesionesPorDiaSemana: {
    diaSemana: string; // "Lunes", "Martes", etc.
    diaNumero: number; // 0-6
    cantidad: number;
    porcentaje: number;
  }[];
  ingresosGenerados: number;
  promedioSesionesPorDia: number;
  comparativaMesAnterior: {
    mesActual: number;
    mesAnterior: number;
    diferencia: number;
    porcentajeCambio: number;
    tendencia: 'subiendo' | 'bajando' | 'estable';
  };
  tendencias: {
    fecha: string;
    totalSesiones: number;
    ingresos: number;
  }[];
}

export interface TendenciaSemanal {
  semana: string;
  totalSesiones: number;
  ingresos: number;
  promedioDiario: number;
}

/**
 * Obtiene métricas completas de sesiones para un período
 */
export const getMetricasSesiones = async (
  fechaInicio: Date,
  fechaFin: Date,
  userId?: string
): Promise<MetricasSesiones> => {
  return new Promise(async (resolve) => {
    try {
      const citas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      const config = await getConfiguracionMetaOcupacion(userId);
      
      // Calcular total de sesiones
      const totalSesiones = citas.length;
      
      // Calcular sesiones por tipo
      const sesionesPorTipoMap = new Map<TipoCita, number>();
      citas.forEach(cita => {
        const count = sesionesPorTipoMap.get(cita.tipo) || 0;
        sesionesPorTipoMap.set(cita.tipo, count + 1);
      });
      
      const sesionesPorTipo = Array.from(sesionesPorTipoMap.entries()).map(([tipo, cantidad]) => ({
        tipo,
        cantidad,
        porcentaje: totalSesiones > 0 ? Math.round((cantidad / totalSesiones) * 100) : 0,
      })).sort((a, b) => b.cantidad - a.cantidad);
      
      // Calcular sesiones por horario (agrupadas por hora)
      const sesionesPorHorarioMap = new Map<string, number>();
      citas.forEach(cita => {
        const hora = new Date(cita.fechaInicio).getHours();
        const horario = `${hora.toString().padStart(2, '0')}:00`;
        const count = sesionesPorHorarioMap.get(horario) || 0;
        sesionesPorHorarioMap.set(horario, count + 1);
      });
      
      const sesionesPorHorario = Array.from(sesionesPorHorarioMap.entries())
        .map(([horario, cantidad]) => ({
          horario,
          cantidad,
          porcentaje: totalSesiones > 0 ? Math.round((cantidad / totalSesiones) * 100) : 0,
        }))
        .sort((a, b) => a.horario.localeCompare(b.horario));
      
      // Calcular sesiones por día de semana
      const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const sesionesPorDiaSemanaMap = new Map<number, number>();
      citas.forEach(cita => {
        const diaSemana = new Date(cita.fechaInicio).getDay();
        const count = sesionesPorDiaSemanaMap.get(diaSemana) || 0;
        sesionesPorDiaSemanaMap.set(diaSemana, count + 1);
      });
      
      const sesionesPorDiaSemana = Array.from(sesionesPorDiaSemanaMap.entries())
        .map(([diaNumero, cantidad]) => ({
          diaSemana: nombresDias[diaNumero],
          diaNumero,
          cantidad,
          porcentaje: totalSesiones > 0 ? Math.round((cantidad / totalSesiones) * 100) : 0,
        }))
        .sort((a, b) => a.diaNumero - b.diaNumero);
      
      // Calcular ingresos generados (solo sesiones completadas)
      const sesionesCompletadas = citas.filter(c => c.estado === 'completada');
      const ingresosGenerados = sesionesCompletadas.length * config.precioPromedioSesion;
      
      // Calcular promedio de sesiones por día
      const diasDiferencia = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const promedioSesionesPorDia = diasDiferencia > 0 ? Math.round((totalSesiones / diasDiferencia) * 10) / 10 : 0;
      
      // Calcular comparativa con mes anterior
      const mesAnteriorInicio = new Date(fechaInicio);
      mesAnteriorInicio.setMonth(mesAnteriorInicio.getMonth() - 1);
      const mesAnteriorFin = new Date(fechaFin);
      mesAnteriorFin.setMonth(mesAnteriorFin.getMonth() - 1);
      
      const citasMesAnterior = await getCitas(mesAnteriorInicio, mesAnteriorFin, 'entrenador');
      const sesionesCompletadasMesAnterior = citasMesAnterior.filter(c => c.estado === 'completada');
      const totalMesAnterior = citasMesAnterior.length;
      const totalMesActual = totalSesiones;
      
      const diferencia = totalMesActual - totalMesAnterior;
      const porcentajeCambio = totalMesAnterior > 0
        ? Math.round((diferencia / totalMesAnterior) * 100)
        : 0;
      
      let tendencia: 'subiendo' | 'bajando' | 'estable';
      if (porcentajeCambio > 5) {
        tendencia = 'subiendo';
      } else if (porcentajeCambio < -5) {
        tendencia = 'bajando';
      } else {
        tendencia = 'estable';
      }
      
      // Calcular tendencias (últimas 4 semanas)
      const tendencias: { fecha: string; totalSesiones: number; ingresos: number }[] = [];
      const fechaActual = new Date(fechaFin);
      
      for (let i = 3; i >= 0; i--) {
        const fechaInicioSemana = new Date(fechaActual);
        fechaInicioSemana.setDate(fechaInicioSemana.getDate() - (i * 7));
        fechaInicioSemana.setHours(0, 0, 0, 0);
        
        const fechaFinSemana = new Date(fechaInicioSemana);
        fechaFinSemana.setDate(fechaFinSemana.getDate() + 6);
        fechaFinSemana.setHours(23, 59, 59, 999);
        
        const citasSemana = await getCitas(fechaInicioSemana, fechaFinSemana, 'entrenador');
        const sesionesCompletadasSemana = citasSemana.filter(c => c.estado === 'completada');
        const ingresosSemana = sesionesCompletadasSemana.length * config.precioPromedioSesion;
        
        tendencias.push({
          fecha: fechaInicioSemana.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
          totalSesiones: citasSemana.length,
          ingresos: ingresosSemana,
        });
      }
      
      const metricas: MetricasSesiones = {
        totalSesiones,
        sesionesPorTipo,
        sesionesPorHorario,
        sesionesPorDiaSemana,
        ingresosGenerados,
        promedioSesionesPorDia,
        comparativaMesAnterior: {
          mesActual: totalMesActual,
          mesAnterior: totalMesAnterior,
          diferencia,
          porcentajeCambio,
          tendencia,
        },
        tendencias,
      };
      
      setTimeout(() => {
        resolve(metricas);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo métricas de sesiones:', error);
      // Retornar métricas vacías en caso de error
      setTimeout(() => {
        resolve({
          totalSesiones: 0,
          sesionesPorTipo: [],
          sesionesPorHorario: [],
          sesionesPorDiaSemana: [],
          ingresosGenerados: 0,
          promedioSesionesPorDia: 0,
          comparativaMesAnterior: {
            mesActual: 0,
            mesAnterior: 0,
            diferencia: 0,
            porcentajeCambio: 0,
            tendencia: 'estable',
          },
          tendencias: [],
        });
      }, 300);
    }
  });
};

/**
 * Obtiene métricas de sesiones para el mes actual
 */
export const getMetricasSesionesMesActual = async (
  userId?: string
): Promise<MetricasSesiones> => {
  const fechaActual = new Date();
  const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
  const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
  fechaFin.setHours(23, 59, 59, 999);
  
  return getMetricasSesiones(fechaInicio, fechaFin, userId);
};

/**
 * Obtiene tendencias semanales
 */
export const getTendenciasSemanales = async (
  semanas: number = 8,
  userId?: string
): Promise<TendenciaSemanal[]> => {
  return new Promise(async (resolve) => {
    try {
      const tendencias: TendenciaSemanal[] = [];
      const fechaActual = new Date();
      const config = await getConfiguracionMetaOcupacion(userId);
      
      for (let i = semanas - 1; i >= 0; i--) {
        const fechaInicioSemana = new Date(fechaActual);
        fechaInicioSemana.setDate(fechaInicioSemana.getDate() - (i * 7));
        fechaInicioSemana.setHours(0, 0, 0, 0);
        
        // Ajustar al lunes de esa semana
        const diaSemana = fechaInicioSemana.getDay();
        const diff = diaSemana === 0 ? -6 : 1 - diaSemana;
        fechaInicioSemana.setDate(fechaInicioSemana.getDate() + diff);
        
        const fechaFinSemana = new Date(fechaInicioSemana);
        fechaFinSemana.setDate(fechaFinSemana.getDate() + 6);
        fechaFinSemana.setHours(23, 59, 59, 999);
        
        const citasSemana = await getCitas(fechaInicioSemana, fechaFinSemana, 'entrenador');
        const sesionesCompletadasSemana = citasSemana.filter(c => c.estado === 'completada');
        const ingresosSemana = sesionesCompletadasSemana.length * config.precioPromedioSesion;
        
        tendencias.push({
          semana: `Sem ${fechaInicioSemana.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`,
          totalSesiones: citasSemana.length,
          ingresos: ingresosSemana,
          promedioDiario: Math.round((citasSemana.length / 7) * 10) / 10,
        });
      }
      
      setTimeout(() => {
        resolve(tendencias);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo tendencias semanales:', error);
      resolve([]);
    }
  });
};


