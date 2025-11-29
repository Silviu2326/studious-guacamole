import { Cita, TipoCita, MetricasOcupacion } from '../types';
import { getCitas } from './calendario';
import { getConfiguracionMetaOcupacion, calcularHorasDisponibles, calcularHorasTrabajadas, calcularHorasReservadas } from './analytics';

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

// Tipos importados desde types/index.ts
// Se reexportan aquí para compatibilidad con código existente
export type { RangoFechas, ContextoMetricas } from '../types';

/**
 * Serie temporal de ocupación por día
 */
export interface SerieOcupacionPorDia {
  fecha: Date;
  ocupacion: number; // Porcentaje de ocupación
  horasTrabajadas: number;
  horasDisponibles: number;
  horasReservadas: number;
  totalSesiones: number;
  sesionesCompletadas: number;
  sesionesCanceladas: number;
  noShows: number;
  ingresosEstimados: number;
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

// ============================================================================
// DATOS MOCK PARA DIFERENTES ESCENARIOS
// ============================================================================

/**
 * Datos mock para entrenadores y gimnasios con diferentes niveles de ocupación y facturación
 * 
 * Estos datos representan escenarios realistas:
 * - Entrenador principiante: ocupación baja (~40%), precio medio
 * - Entrenador intermedio: ocupación media (~65%), precio medio-alto
 * - Entrenador experto: ocupación alta (~85%), precio alto
 * - Gimnasio pequeño: ocupación media-baja (~50%), múltiples servicios
 * - Gimnasio grande: ocupación alta (~80%), múltiples entrenadores
 */
interface PerfilMockOcupacion {
  userId: string;
  nombre: string;
  tipo: 'entrenador' | 'gimnasio';
  nivelOcupacion: 'bajo' | 'medio' | 'alto';
  porcentajeOcupacionBase: number; // 0-100
  precioPromedioSesion: number;
  sesionesPorSemana: number;
  tasaNoShow: number; // 0-100
  tasaCancelacion: number; // 0-100
}

const perfilesMockOcupacion: PerfilMockOcupacion[] = [
  {
    userId: 'trainer-novice-1',
    nombre: 'Entrenador Principiante',
    tipo: 'entrenador',
    nivelOcupacion: 'bajo',
    porcentajeOcupacionBase: 40,
    precioPromedioSesion: 35,
    sesionesPorSemana: 12,
    tasaNoShow: 15,
    tasaCancelacion: 10,
  },
  {
    userId: 'trainer-intermediate-1',
    nombre: 'Entrenador Intermedio',
    tipo: 'entrenador',
    nivelOcupacion: 'medio',
    porcentajeOcupacionBase: 65,
    precioPromedioSesion: 50,
    sesionesPorSemana: 20,
    tasaNoShow: 10,
    tasaCancelacion: 7,
  },
  {
    userId: 'trainer-expert-1',
    nombre: 'Entrenador Experto',
    tipo: 'entrenador',
    nivelOcupacion: 'alto',
    porcentajeOcupacionBase: 85,
    precioPromedioSesion: 75,
    sesionesPorSemana: 30,
    tasaNoShow: 5,
    tasaCancelacion: 3,
  },
  {
    userId: 'gym-small-1',
    nombre: 'Gimnasio Pequeño',
    tipo: 'gimnasio',
    nivelOcupacion: 'medio',
    porcentajeOcupacionBase: 50,
    precioPromedioSesion: 40,
    sesionesPorSemana: 80,
    tasaNoShow: 12,
    tasaCancelacion: 8,
  },
  {
    userId: 'gym-large-1',
    nombre: 'Gimnasio Grande',
    tipo: 'gimnasio',
    nivelOcupacion: 'alto',
    porcentajeOcupacionBase: 80,
    precioPromedioSesion: 45,
    sesionesPorSemana: 200,
    tasaNoShow: 8,
    tasaCancelacion: 5,
  },
];

/**
 * Obtiene el perfil mock basado en userId o genera uno por defecto
 */
const obtenerPerfilMock = (userId?: string, role?: 'entrenador' | 'gimnasio'): PerfilMockOcupacion => {
  if (userId) {
    const perfil = perfilesMockOcupacion.find(p => p.userId === userId);
    if (perfil) return perfil;
  }
  
  // Perfil por defecto según el role
  const perfilDefault = role === 'gimnasio'
    ? perfilesMockOcupacion.find(p => p.tipo === 'gimnasio' && p.nivelOcupacion === 'medio')
    : perfilesMockOcupacion.find(p => p.tipo === 'entrenador' && p.nivelOcupacion === 'medio');
  
  return perfilDefault || perfilesMockOcupacion[1]; // Entrenador intermedio por defecto
};

// ============================================================================
// FUNCIONES DE MÉTRICAS DE OCUPACIÓN
// ============================================================================

/**
 * Obtiene métricas de ocupación para un período específico
 * 
 * @param rangoFechas - Rango de fechas para el análisis
 * @param contexto - Contexto con userId, role, entrenadorId, etc.
 * @returns Métricas de ocupación completas
 * 
 * @remarks
 * En un backend real, esta función se vincularía con:
 * - Módulo de Finanzas: para obtener ingresos reales por sesión
 * - Módulo de Clientes: para obtener datos de clientes y sus historiales
 * - Módulo de Horarios: para calcular horas disponibles precisas
 * - Base de datos: para consultar citas reales con índices optimizados
 */
export const getMetricasOcupacion = async (
  rangoFechas: RangoFechas,
  contexto: ContextoMetricas = {}
): Promise<MetricasOcupacion> => {
  return new Promise(async (resolve) => {
    try {
      const { fechaInicio, fechaFin } = rangoFechas;
      const { userId, role = 'entrenador', entrenadorId, centroId } = contexto;
      
      // Obtener citas del período
      const citas = await getCitas(fechaInicio, fechaFin, role);
      
      // Filtrar por entrenador o centro si se especifica
      let citasFiltradas = citas;
      if (entrenadorId) {
        citasFiltradas = citas.filter(c => c.entrenador?.id === entrenadorId);
      }
      if (centroId) {
        // En producción, esto filtraría por centroId
        citasFiltradas = citasFiltradas;
      }
      
      // Calcular horas disponibles, trabajadas y reservadas
      const horasDisponibles = await calcularHorasDisponibles(fechaInicio, fechaFin, userId || entrenadorId);
      const horasTrabajadas = calcularHorasTrabajadas(citasFiltradas);
      const horasReservadas = calcularHorasReservadas(citasFiltradas);
      
      // Obtener perfil mock para generar datos realistas
      const perfil = obtenerPerfilMock(userId, role);
      
      // Calcular porcentaje de ocupación
      const porcentajeOcupacion = horasDisponibles > 0
        ? Math.round((horasTrabajadas / horasDisponibles) * 100)
        : 0;
      
      // Usar perfil mock si no hay suficientes datos reales
      const ocupacionMedia = horasDisponibles > 0 
        ? porcentajeOcupacion 
        : perfil.porcentajeOcupacionBase;
      
      // Calcular estadísticas de sesiones
      const sesionesCompletadas = citasFiltradas.filter(c => c.estado === 'completada').length;
      const sesionesConfirmadas = citasFiltradas.filter(c => c.estado === 'confirmada' || c.estado === 'completada').length;
      const sesionesCanceladas = citasFiltradas.filter(c => c.estado === 'cancelada').length;
      const noShows = citasFiltradas.filter(c => c.estado === 'noShow').length;
      
      // Calcular ingresos estimados
      const config = await getConfiguracionMetaOcupacion(userId);
      const precioPromedio = perfil.precioPromedioSesion || config.precioPromedioSesion;
      const ingresosEstimados = sesionesCompletadas * precioPromedio;
      const ingresosPorSesion = sesionesCompletadas > 0 
        ? ingresosEstimados / sesionesCompletadas 
        : precioPromedio;
      
      // Formatear período
      const esSemana = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24) <= 7;
      const periodo = esSemana
        ? `Semana del ${fechaInicio.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`
        : fechaInicio.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      
      // Calcular ocupación por día si es un período corto (≤30 días)
      const diasDiferencia = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      let ocupacionPorDia: Array<{
        fecha: Date;
        ocupacion: number;
        horasTrabajadas: number;
        horasDisponibles: number;
      }> | undefined;
      
      if (diasDiferencia <= 30) {
        ocupacionPorDia = [];
        const fechaActual = new Date(fechaInicio);
        
        while (fechaActual <= fechaFin) {
          const inicioDia = new Date(fechaActual);
          inicioDia.setHours(0, 0, 0, 0);
          const finDia = new Date(fechaActual);
          finDia.setHours(23, 59, 59, 999);
          
          const citasDia = citasFiltradas.filter(c => {
            const fechaCita = new Date(c.fechaInicio);
            return fechaCita >= inicioDia && fechaCita <= finDia;
          });
          
          const horasDisponiblesDia = await calcularHorasDisponibles(inicioDia, finDia, userId || entrenadorId);
          const horasTrabajadasDia = calcularHorasTrabajadas(citasDia);
          const ocupacionDia = horasDisponiblesDia > 0
            ? Math.round((horasTrabajadasDia / horasDisponiblesDia) * 100)
            : 0;
          
          ocupacionPorDia.push({
            fecha: new Date(fechaActual),
            ocupacion: ocupacionDia,
            horasTrabajadas: horasTrabajadasDia,
            horasDisponibles: horasDisponiblesDia,
          });
          
          fechaActual.setDate(fechaActual.getDate() + 1);
        }
      }
      
      const metricas: MetricasOcupacion = {
        periodo,
        fechaInicio,
        fechaFin,
        ocupacionMedia,
        ocupacionPorDia,
        noShows,
        cancelaciones: sesionesCanceladas,
        ingresosPorSesion,
        horasDisponibles,
        horasTrabajadas,
        horasReservadas,
        porcentajeOcupacion,
        totalSesiones: citasFiltradas.length,
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
          fechaInicio: rangoFechas.fechaInicio,
          fechaFin: rangoFechas.fechaFin,
          ocupacionMedia: 0,
          noShows: 0,
          cancelaciones: 0,
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
 * Obtiene una serie temporal de ocupación por día
 * 
 * @param rangoFechas - Rango de fechas para el análisis
 * @param contexto - Contexto con userId, role, etc.
 * @returns Serie temporal con datos de ocupación día por día
 * 
 * @remarks
 * Esta función es útil para visualizar tendencias en gráficos de línea.
 * En un backend real, se optimizaría con agregaciones de base de datos.
 */
export const getSeriesOcupacionPorDia = async (
  rangoFechas: RangoFechas,
  contexto: ContextoMetricas = {}
): Promise<SerieOcupacionPorDia[]> => {
  return new Promise(async (resolve) => {
    try {
      const { fechaInicio, fechaFin } = rangoFechas;
      const { userId, role = 'entrenador', entrenadorId, centroId } = contexto;
      
      // Obtener perfil mock
      const perfil = obtenerPerfilMock(userId, role);
      const config = await getConfiguracionMetaOcupacion(userId);
      const precioPromedio = perfil.precioPromedioSesion || config.precioPromedioSesion;
      
      // Obtener todas las citas del período
      const citas = await getCitas(fechaInicio, fechaFin, role);
      
      // Filtrar por entrenador o centro si se especifica
      let citasFiltradas = citas;
      if (entrenadorId) {
        citasFiltradas = citas.filter(c => c.entrenador?.id === entrenadorId);
      }
      if (centroId) {
        citasFiltradas = citasFiltradas;
      }
      
      const serie: SerieOcupacionPorDia[] = [];
      const fechaActual = new Date(fechaInicio);
      
      while (fechaActual <= fechaFin) {
        const inicioDia = new Date(fechaActual);
        inicioDia.setHours(0, 0, 0, 0);
        const finDia = new Date(fechaActual);
        finDia.setHours(23, 59, 59, 999);
        
        // Filtrar citas del día
        const citasDia = citasFiltradas.filter(c => {
          const fechaCita = new Date(c.fechaInicio);
          return fechaCita >= inicioDia && fechaCita <= finDia;
        });
        
        // Calcular métricas del día
        const horasDisponiblesDia = await calcularHorasDisponibles(inicioDia, finDia, userId || entrenadorId);
        const horasTrabajadasDia = calcularHorasTrabajadas(citasDia);
        const horasReservadasDia = calcularHorasReservadas(citasDia);
        
        const ocupacion = horasDisponiblesDia > 0
          ? Math.round((horasTrabajadasDia / horasDisponiblesDia) * 100)
          : 0;
        
        const sesionesCompletadas = citasDia.filter(c => c.estado === 'completada').length;
        const sesionesCanceladas = citasDia.filter(c => c.estado === 'cancelada').length;
        const noShows = citasDia.filter(c => c.estado === 'noShow').length;
        
        const ingresosEstimados = sesionesCompletadas * precioPromedio;
        
        serie.push({
          fecha: new Date(fechaActual),
          ocupacion,
          horasTrabajadas: horasTrabajadasDia,
          horasDisponibles: horasDisponiblesDia,
          horasReservadas: horasReservadasDia,
          totalSesiones: citasDia.length,
          sesionesCompletadas,
          sesionesCanceladas,
          noShows,
          ingresosEstimados,
        });
        
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
      
      setTimeout(() => {
        resolve(serie);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo serie de ocupación por día:', error);
      setTimeout(() => {
        resolve([]);
      }, 300);
    }
  });
};


