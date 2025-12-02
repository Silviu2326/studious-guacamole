import { AnalyticsOcupacion, MetricasOcupacion, ComparativaOcupacion, ConfiguracionMetaOcupacion, ProyeccionIngresos, DashboardFinancieroAgenda, RangoFechas, ContextoMetricas, TipoCita } from '../types';
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
export const calcularHorasDisponibles = async (
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
export const calcularHorasTrabajadas = (citas: Cita[]): number => {
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
export const calcularHorasReservadas = (citas: Cita[]): number => {
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

// ============================================================================
// DASHBOARD FINANCIERO DE AGENDA
// ============================================================================

/**
 * Obtiene el dashboard financiero completo de la agenda
 * 
 * Esta función consolida múltiples métricas financieras relacionadas con las sesiones:
 * - Ingresos totales, por sesión y ticket medio
 * - Cancelaciones y no-shows
 * - Ocupación y rendimiento
 * - Comparativas con períodos anteriores
 * 
 * @param rangoFechas - Rango de fechas para el análisis
 * @param contexto - Contexto con userId, role, entrenadorId, etc.
 * @returns Dashboard financiero completo con todos los KPIs
 * 
 * @remarks
 * VÍNCULOS CON OTROS MÓDULOS EN UN BACKEND REAL:
 * 
 * 1. MÓDULO DE FINANZAS:
 *    - Obtener ingresos reales desde facturas/pagos registrados
 *    - Consultar saldos pendientes y deudas de clientes
 *    - Calcular impuestos y comisiones
 *    - Endpoint: GET /api/finanzas/ingresos-agenda?rangoFechas=...&userId=...
 * 
 * 2. MÓDULO DE CLIENTES:
 *    - Obtener historial de pagos por cliente
 *    - Consultar planes y suscripciones activas
 *    - Calcular LTV (Lifetime Value) de clientes
 *    - Endpoint: GET /api/clientes/{id}/historial-financiero
 * 
 * 3. MÓDULO DE FACTURACIÓN:
 *    - Obtener facturas emitidas por sesiones
 *    - Consultar estado de pagos (pagado, pendiente, vencido)
 *    - Calcular proyecciones de ingresos
 *    - Endpoint: GET /api/facturacion/sesiones?rangoFechas=...
 * 
 * 4. BASE DE DATOS:
 *    - Consultas optimizadas con índices en fechas, estados, tipos de sesión
 *    - Agregaciones SQL para cálculo eficiente de métricas
 *    - Cache de resultados para períodos frecuentemente consultados
 * 
 * EJEMPLO DE INTEGRACIÓN BACKEND:
 * ```typescript
 * // Backend (Node.js + Express + PostgreSQL)
 * app.get('/api/agenda/dashboard-financiero', async (req, res) => {
 *   const { fechaInicio, fechaFin, userId } = req.query;
 *   
 *   // Consultar múltiples fuentes en paralelo
 *   const [citas, pagos, facturas, clientes] = await Promise.all([
 *     db.query('SELECT * FROM citas WHERE fecha_inicio BETWEEN $1 AND $2 AND user_id = $3', 
 *              [fechaInicio, fechaFin, userId]),
 *     db.query('SELECT * FROM pagos WHERE fecha BETWEEN $1 AND $2 AND user_id = $3',
 *              [fechaInicio, fechaFin, userId]),
 *     db.query('SELECT * FROM facturas WHERE fecha_emision BETWEEN $1 AND $2 AND user_id = $3',
 *              [fechaInicio, fechaFin, userId]),
 *     db.query('SELECT * FROM clientes WHERE user_id = $1', [userId])
 *   ]);
 *   
 *   // Calcular métricas agregadas
 *   const dashboard = calcularDashboardFinanciero(citas, pagos, facturas, clientes);
 *   res.json(dashboard);
 * });
 * ```
 */
export const getDashboardFinancieroAgenda = async (
  rangoFechas: RangoFechas,
  contexto: ContextoMetricas = {}
): Promise<DashboardFinancieroAgenda> => {
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
        citasFiltradas = citasFiltradas;
      }
      
      // Calcular métricas de ocupación
      const horasDisponibles = await calcularHorasDisponibles(fechaInicio, fechaFin, userId || entrenadorId);
      const horasTrabajadas = calcularHorasTrabajadas(citasFiltradas);
      
      // Obtener configuración para precios
      const config = await getConfiguracionMetaOcupacion(userId);
      
      // Calcular estadísticas básicas
      const totalSesiones = citasFiltradas.length;
      const sesionesCompletadas = citasFiltradas.filter(c => c.estado === 'completada').length;
      const sesionesCanceladas = citasFiltradas.filter(c => c.estado === 'cancelada').length;
      const sesionesPendientes = citasFiltradas.filter(c => 
        c.estado === 'confirmada' || c.estado === 'reservada'
      ).length;
      const noShows = citasFiltradas.filter(c => c.estado === 'noShow').length;
      
      // Calcular tasas
      const tasaCancelacion = totalSesiones > 0
        ? Math.round((sesionesCanceladas / totalSesiones) * 100 * 10) / 10
        : 0;
      
      const tasaNoShow = totalSesiones > 0
        ? Math.round((noShows / totalSesiones) * 100 * 10) / 10
        : 0;
      
      // Calcular ingresos (usando precio promedio de configuración o datos mock)
      const ingresosTotales = sesionesCompletadas * config.precioPromedioSesion;
      const ingresosPorSesion = sesionesCompletadas > 0
        ? ingresosTotales / sesionesCompletadas
        : config.precioPromedioSesion;
      
      // Ticket medio = ingresos totales / número de sesiones completadas
      const ticketMedio = sesionesCompletadas > 0
        ? ingresosTotales / sesionesCompletadas
        : config.precioPromedioSesion;
      
      // Calcular ingresos pendientes (sesiones confirmadas pero no completadas)
      const ingresosPendientes = sesionesPendientes * config.precioPromedioSesion;
      
      // Calcular ocupación promedio
      const ocupacionPromedio = horasDisponibles > 0
        ? Math.round((horasTrabajadas / horasDisponibles) * 100 * 10) / 10
        : 0;
      
      // Calcular ingresos por tipo de sesión
      const ingresosPorTipoMap = new Map<TipoCita, { cantidad: number; ingresos: number }>();
      
      citasFiltradas
        .filter(c => c.estado === 'completada')
        .forEach(cita => {
          const tipo = cita.tipo || 'sesion-1-1';
          const actual = ingresosPorTipoMap.get(tipo) || { cantidad: 0, ingresos: 0 };
          ingresosPorTipoMap.set(tipo, {
            cantidad: actual.cantidad + 1,
            ingresos: actual.ingresos + config.precioPromedioSesion,
          });
        });
      
      const ingresosPorTipoSesion = Array.from(ingresosPorTipoMap.entries())
        .map(([tipo, datos]) => ({
          tipo,
          cantidad: datos.cantidad,
          ingresos: datos.ingresos,
          porcentaje: sesionesCompletadas > 0
            ? Math.round((datos.cantidad / sesionesCompletadas) * 100 * 10) / 10
            : 0,
        }))
        .sort((a, b) => b.ingresos - a.ingresos);
      
      // Calcular comparativa con período anterior
      const diasDiferencia = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      const fechaInicioAnterior = new Date(fechaInicio);
      fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - diasDiferencia);
      const fechaFinAnterior = new Date(fechaInicioAnterior);
      fechaFinAnterior.setDate(fechaFinAnterior.getDate() + diasDiferencia - 1);
      
      const citasAnteriores = await getCitas(fechaInicioAnterior, fechaFinAnterior, role);
      const sesionesCompletadasAnteriores = citasAnteriores.filter(c => c.estado === 'completada').length;
      const ingresosAnteriores = sesionesCompletadasAnteriores * config.precioPromedioSesion;
      
      const crecimientoIngresos = ingresosAnteriores > 0
        ? Math.round(((ingresosTotales - ingresosAnteriores) / ingresosAnteriores) * 100 * 10) / 10
        : sesionesCompletadas > 0 ? 100 : 0;
      
      const crecimientoSesiones = sesionesCompletadasAnteriores > 0
        ? Math.round(((sesionesCompletadas - sesionesCompletadasAnteriores) / sesionesCompletadasAnteriores) * 100 * 10) / 10
        : sesionesCompletadas > 0 ? 100 : 0;
      
      // Determinar tendencia
      let tendencia: 'subiendo' | 'bajando' | 'estable';
      if (crecimientoIngresos > 5) {
        tendencia = 'subiendo';
      } else if (crecimientoIngresos < -5) {
        tendencia = 'bajando';
      } else {
        tendencia = 'estable';
      }
      
      // Formatear período
      const esSemana = diasDiferencia <= 7;
      const periodo = esSemana
        ? `Semana del ${fechaInicio.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}`
        : fechaInicio.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
      
      const dashboard: DashboardFinancieroAgenda = {
        periodo,
        fechaInicio,
        fechaFin,
        ingresosTotales,
        ingresosPorSesion,
        ticketMedio,
        totalSesiones,
        sesionesCompletadas,
        sesionesCanceladas,
        tasaCancelacion,
        noShows,
        tasaNoShow,
        ingresosPendientes,
        sesionesPendientes,
        ocupacionPromedio,
        horasTrabajadas,
        horasDisponibles,
        crecimientoIngresos,
        crecimientoSesiones,
        tendencia,
        ingresosPorTipoSesion,
      };
      
      setTimeout(() => {
        resolve(dashboard);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo dashboard financiero de agenda:', error);
      // Retornar dashboard vacío en caso de error
      setTimeout(() => {
        resolve({
          periodo: '',
          fechaInicio: rangoFechas.fechaInicio,
          fechaFin: rangoFechas.fechaFin,
          ingresosTotales: 0,
          ingresosPorSesion: 0,
          ticketMedio: 0,
          totalSesiones: 0,
          sesionesCompletadas: 0,
          sesionesCanceladas: 0,
          tasaCancelacion: 0,
          noShows: 0,
          tasaNoShow: 0,
          ingresosPendientes: 0,
          sesionesPendientes: 0,
          ocupacionPromedio: 0,
          horasTrabajadas: 0,
          horasDisponibles: 0,
          tendencia: 'estable',
          ingresosPorTipoSesion: [],
        });
      }, 300);
    }
  });
};
