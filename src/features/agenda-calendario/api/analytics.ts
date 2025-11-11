import { AnalyticsOcupacion, MetricasOcupacion, ComparativaOcupacion, ConfiguracionMetaOcupacion, ProyeccionIngresos } from '../types';
import { getCitas } from './calendario';
import { getHorarioTrabajoActual } from './horariosTrabajo';
import { Cita } from '../types';

// Mock data storage (en producción sería una base de datos)
let configuracionMetaOcupacion: ConfiguracionMetaOcupacion | null = null;

/**
 * Obtiene la configuración de meta de ocupación
 */
export const getConfiguracionMetaOcupacion = async (
  userId?: string
): Promise<ConfiguracionMetaOcupacion> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!configuracionMetaOcupacion) {
        configuracionMetaOcupacion = {
          id: 'config-meta-ocupacion-1',
          userId,
          metaSemanal: 80,
          metaMensual: 75,
          precioPromedioSesion: 50,
          activo: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      resolve(configuracionMetaOcupacion);
    }, 300);
  });
};

/**
 * Actualiza la configuración de meta de ocupación
 */
export const actualizarConfiguracionMetaOcupacion = async (
  config: Partial<ConfiguracionMetaOcupacion>,
  userId?: string
): Promise<ConfiguracionMetaOcupacion> => {
  return new Promise(async (resolve) => {
    const configActual = await getConfiguracionMetaOcupacion(userId);
    const configActualizada: ConfiguracionMetaOcupacion = {
      ...configActual,
      ...config,
      id: configActual.id,
      updatedAt: new Date(),
    };
    
    setTimeout(() => {
      configuracionMetaOcupacion = configActualizada;
      resolve(configActualizada);
    }, 300);
  });
};

/**
 * Calcula las horas disponibles en un período basado en el horario de trabajo
 */
const calcularHorasDisponibles = async (
  fechaInicio: Date,
  fechaFin: Date,
  userId?: string
): Promise<number> => {
  try {
    const horarioTrabajo = await getHorarioTrabajoActual(userId);
    if (!horarioTrabajo) {
      return 0;
    }

    let horasDisponibles = 0;
    const fechaActual = new Date(fechaInicio);
    
    while (fechaActual <= fechaFin) {
      const diaSemana = fechaActual.getDay();
      const diaHorario = horarioTrabajo.dias.find(d => d.diaSemana === diaSemana);
      
      if (diaHorario && diaHorario.disponible) {
        // Calcular horas disponibles en este día
        diaHorario.rangos.forEach(rango => {
          const [horaInicio, minutoInicio] = rango.horaInicio.split(':').map(Number);
          const [horaFin, minutoFin] = rango.horaFin.split(':').map(Number);
          const horas = horaFin - horaInicio + (minutoFin - minutoInicio) / 60;
          horasDisponibles += horas;
        });
      }
      
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    return horasDisponibles;
  } catch (error) {
    console.error('Error calculando horas disponibles:', error);
    return 0;
  }
};

/**
 * Calcula las horas trabajadas en un período (sesiones completadas)
 */
const calcularHorasTrabajadas = (citas: Cita[]): number => {
  return citas
    .filter(c => c.estado === 'completada')
    .reduce((total, cita) => {
      const horas = (new Date(cita.fechaFin).getTime() - new Date(cita.fechaInicio).getTime()) / (1000 * 60 * 60);
      return total + horas;
    }, 0);
};

/**
 * Calcula las horas reservadas en un período (sesiones confirmadas)
 */
const calcularHorasReservadas = (citas: Cita[]): number => {
  return citas
    .filter(c => c.estado === 'confirmada' || c.estado === 'completada')
    .reduce((total, cita) => {
      const horas = (new Date(cita.fechaFin).getTime() - new Date(cita.fechaInicio).getTime()) / (1000 * 60 * 60);
      return total + horas;
    }, 0);
};

/**
 * Obtiene métricas de ocupación para un período específico
 */
export const getMetricasOcupacion = async (
  fechaInicio: Date,
  fechaFin: Date,
  userId?: string
): Promise<MetricasOcupacion> => {
  return new Promise(async (resolve) => {
    try {
      const citas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      const horasDisponibles = await calcularHorasDisponibles(fechaInicio, fechaFin, userId);
      const horasTrabajadas = calcularHorasTrabajadas(citas);
      const horasReservadas = calcularHorasReservadas(citas);
      
      const porcentajeOcupacion = horasDisponibles > 0
        ? Math.round((horasTrabajadas / horasDisponibles) * 100)
        : 0;
      
      const sesionesCompletadas = citas.filter(c => c.estado === 'completada').length;
      const sesionesConfirmadas = citas.filter(c => c.estado === 'confirmada' || c.estado === 'completada').length;
      const sesionesCanceladas = citas.filter(c => c.estado === 'cancelada').length;
      
      // Calcular ingresos estimados (usando precio promedio de la configuración)
      const config = await getConfiguracionMetaOcupacion(userId);
      const ingresosEstimados = sesionesCompletadas * config.precioPromedioSesion;
      
      // Formatear período
      const esSemana = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24) <= 7;
      const periodo = esSemana
        ? `Semana ${getSemanaDelAnio(fechaInicio)} - ${fechaInicio.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`
        : fechaInicio.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      
      const metricas: MetricasOcupacion = {
        periodo,
        fechaInicio,
        fechaFin,
        horasDisponibles,
        horasTrabajadas,
        horasReservadas,
        porcentajeOcupacion,
        totalSesiones: citas.length,
        sesionesCompletadas,
        sesionesConfirmadas,
        sesionesCanceladas,
        ingresosEstimados,
      };
      
      setTimeout(() => {
        resolve(metricas);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo métricas de ocupación:', error);
      // Retornar métricas vacías en caso de error
      setTimeout(() => {
        resolve({
          periodo: '',
          fechaInicio,
          fechaFin,
          horasDisponibles: 0,
          horasTrabajadas: 0,
          horasReservadas: 0,
          porcentajeOcupacion: 0,
          totalSesiones: 0,
          sesionesCompletadas: 0,
          sesionesConfirmadas: 0,
          sesionesCanceladas: 0,
          ingresosEstimados: 0,
        });
      }, 300);
    }
  });
};

/**
 * Obtiene métricas de ocupación semanal
 */
export const getMetricasOcupacionSemanal = async (
  fechaInicio: Date,
  semanas: number = 4,
  userId?: string
): Promise<MetricasOcupacion[]> => {
  return new Promise(async (resolve) => {
    try {
      const metricas: MetricasOcupacion[] = [];
      
      for (let i = semanas - 1; i >= 0; i--) {
        const inicioSemana = new Date(fechaInicio);
        inicioSemana.setDate(inicioSemana.getDate() - (i * 7));
        inicioSemana.setHours(0, 0, 0, 0);
        
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(finSemana.getDate() + 6);
        finSemana.setHours(23, 59, 59, 999);
        
        const metrica = await getMetricasOcupacion(inicioSemana, finSemana, userId);
        metricas.push(metrica);
      }
      
      setTimeout(() => {
        resolve(metricas);
      }, 500);
    } catch (error) {
      console.error('Error obteniendo métricas de ocupación semanal:', error);
      resolve([]);
    }
  });
};

/**
 * Obtiene métricas de ocupación mensual
 */
export const getMetricasOcupacionMensual = async (
  fechaInicio: Date,
  meses: number = 3,
  userId?: string
): Promise<MetricasOcupacion[]> => {
  return new Promise(async (resolve) => {
    try {
      const metricas: MetricasOcupacion[] = [];
      
      for (let i = meses - 1; i >= 0; i--) {
        const inicioMes = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth() - i, 1);
        inicioMes.setHours(0, 0, 0, 0);
        
        const finMes = new Date(inicioMes.getFullYear(), inicioMes.getMonth() + 1, 0);
        finMes.setHours(23, 59, 59, 999);
        
        const metrica = await getMetricasOcupacion(inicioMes, finMes, userId);
        metricas.push(metrica);
      }
      
      setTimeout(() => {
        resolve(metricas);
      }, 500);
    } catch (error) {
      console.error('Error obteniendo métricas de ocupación mensual:', error);
      resolve([]);
    }
  });
};

/**
 * Obtiene comparativa de ocupación entre períodos
 */
export const getComparativaOcupacion = async (
  fechaInicioActual: Date,
  fechaFinActual: Date,
  userId?: string
): Promise<ComparativaOcupacion | null> => {
  return new Promise(async (resolve) => {
    try {
      const periodoActual = await getMetricasOcupacion(fechaInicioActual, fechaFinActual, userId);
      
      // Calcular período anterior (mismo rango de días)
      const diasDiferencia = Math.ceil((fechaFinActual.getTime() - fechaInicioActual.getTime()) / (1000 * 60 * 60 * 24));
      const fechaInicioAnterior = new Date(fechaInicioActual);
      fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - diasDiferencia);
      const fechaFinAnterior = new Date(fechaInicioAnterior);
      fechaFinAnterior.setDate(fechaFinAnterior.getDate() + diasDiferencia - 1);
      
      const periodoAnterior = await getMetricasOcupacion(fechaInicioAnterior, fechaFinAnterior, userId);
      
      const diferenciaPorcentaje = periodoAnterior.porcentajeOcupacion > 0
        ? Math.round(((periodoActual.porcentajeOcupacion - periodoAnterior.porcentajeOcupacion) / periodoAnterior.porcentajeOcupacion) * 100)
        : 0;
      
      const diferenciaHoras = periodoActual.horasTrabajadas - periodoAnterior.horasTrabajadas;
      
      let tendencia: 'subiendo' | 'bajando' | 'estable';
      if (diferenciaPorcentaje > 5) {
        tendencia = 'subiendo';
      } else if (diferenciaPorcentaje < -5) {
        tendencia = 'bajando';
      } else {
        tendencia = 'estable';
      }
      
      const comparativa: ComparativaOcupacion = {
        periodoActual,
        periodoAnterior,
        diferenciaPorcentaje,
        diferenciaHoras,
        tendencia,
      };
      
      setTimeout(() => {
        resolve(comparativa);
      }, 500);
    } catch (error) {
      console.error('Error obteniendo comparativa de ocupación:', error);
      resolve(null);
    }
  });
};

/**
 * Obtiene proyección de ingresos basada en ocupación
 */
export const getProyeccionIngresos = async (
  fechaInicio: Date,
  fechaFin: Date,
  userId?: string
): Promise<ProyeccionIngresos | null> => {
  return new Promise(async (resolve) => {
    try {
      const metricas = await getMetricasOcupacion(fechaInicio, fechaFin, userId);
      const config = await getConfiguracionMetaOcupacion(userId);
      
      const ocupacionActual = metricas.porcentajeOcupacion;
      const ocupacionProyectada = config.metaSemanal; // Usar meta semanal como proyección
      
      const ingresosActuales = metricas.ingresosEstimados;
      const horasParaMeta = (metricas.horasDisponibles * ocupacionProyectada) / 100;
      const horasNecesarias = Math.max(0, horasParaMeta - metricas.horasTrabajadas);
      const sesionesNecesarias = Math.ceil(horasNecesarias / 1); // Asumiendo 1 hora por sesión promedio
      const ingresosProyectados = (horasParaMeta / 1) * config.precioPromedioSesion;
      
      const diferenciaIngresos = ingresosProyectados - ingresosActuales;
      
      const proyeccion: ProyeccionIngresos = {
        periodo: metricas.periodo,
        ocupacionActual,
        ocupacionProyectada,
        ingresosActuales,
        ingresosProyectados,
        diferenciaIngresos,
        metaOcupacion: config.metaSemanal,
        horasNecesariasParaMeta: horasNecesarias,
        sesionesNecesariasParaMeta: sesionesNecesarias,
      };
      
      setTimeout(() => {
        resolve(proyeccion);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo proyección de ingresos:', error);
      resolve(null);
    }
  });
};

/**
 * Helper: Obtiene el número de semana del año
 */
const getSemanaDelAnio = (fecha: Date): number => {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * Función legacy para compatibilidad
 */
export const getAnalyticsOcupacion = async (
  fechaInicio: Date,
  fechaFin: Date,
  role: 'entrenador' | 'gimnasio'
): Promise<AnalyticsOcupacion[]> => {
  return new Promise(async (resolve) => {
    try {
      const metricas = await getMetricasOcupacion(fechaInicio, fechaFin);
      const analytics: AnalyticsOcupacion = {
        periodo: metricas.periodo,
        totalCitas: metricas.totalSesiones,
        citasConfirmadas: metricas.sesionesConfirmadas,
        citasCompletadas: metricas.sesionesCompletadas,
        ocupacionPromedio: metricas.porcentajeOcupacion,
        ingresosEstimados: metricas.ingresosEstimados,
      };
      
      setTimeout(() => {
        resolve([analytics]);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo analytics de ocupación:', error);
      resolve([]);
    }
  });
};
