/**
 * Archivo de barril (barrel file) para la API de Agenda y Calendario
 * 
 * Este índice agrupa y exporta toda la lógica de negocio simulada relacionada
 * con la gestión de agenda y calendario. En producción, estas funciones se
 * reemplazarían con llamadas reales a endpoints de una API REST/GraphQL.
 * 
 * Módulos incluidos:
 * - Calendario: Gestión de citas (CRUD, recurrencias)
 * - Disponibilidad: Bloqueos de agenda y cálculo de slots disponibles
 * - Horarios de Trabajo: Configuración de horarios y plantillas
 * - Sesiones: Historial y tipos de sesión
 * - Recordatorios: Configuración y envío de recordatorios
 * - Métricas de Sesiones: Estadísticas y análisis de sesiones
 * - Analytics: Métricas de ocupación y dashboards financieros
 * - Sincronización de Calendario: Integración con calendarios externos (Google, Outlook)
 * - Lista de Espera: Gestión de lista de espera de clientes
 */

// ============================================================================
// CALENDARIO - Gestión de citas
// ============================================================================
export {
  getCitas,
  createCita,
  crearCita,
  updateCita,
  deleteCita,
  expandirRecurrencia,
  type GetCitasParams,
} from './calendario';

// ============================================================================
// DISPONIBILIDAD - Bloqueos y slots disponibles
// ============================================================================
export {
  getDisponibilidad,
  getBloqueos,
  crearBloqueo,
  actualizarBloqueo,
  eliminarBloqueo,
  getBloqueosAgenda,
  crearBloqueoAgenda,
  eliminarBloqueoAgenda,
  calcularSlotsDisponibles,
  type ContextoBloqueosAgenda,
  type ParamsCalcularSlotsDisponibles,
} from './disponibilidad';

// ============================================================================
// HORARIOS DE TRABAJO - Configuración de horarios
// ============================================================================
export {
  getHorarioTrabajoActual,
  guardarHorarioTrabajo,
  getPlantillasHorario,
  guardarPlantillaHorario,
  eliminarPlantillaHorario,
  aplicarPlantillaHorario,
  esHorarioDisponible,
  getHorariosTrabajo,
  saveHorariosTrabajo,
  validarHorarioTrabajo,
  type ContextoHorariosTrabajo,
} from './horariosTrabajo';

// ============================================================================
// SESIONES - Historial y tipos de sesión
// ============================================================================
export {
  getHistorialSesionesCliente,
  getTiposSesion,
  createTipoSesion,
  updateTipoSesion,
  deleteTipoSesion,
  type SesionHistorial,
  type EstadisticasCliente,
  type FiltroHistorial,
} from './sesiones';

// ============================================================================
// RECORDATORIOS - Configuración y envío
// ============================================================================
export {
  getConfiguracionRecordatorios,
  saveConfiguracionRecordatorios,
  actualizarConfiguracionRecordatorios,
  getPreferenciasRecordatorioCliente,
  actualizarPreferenciasRecordatorioCliente,
  getHistorialRecordatorios,
  enviarRecordatorio,
  personalizarMensaje,
  getTodasPreferenciasClientes,
  simularRecordatoriosPendientes,
  type ContextoRecordatorios,
} from './recordatorios';

// ============================================================================
// MÉTRICAS DE SESIONES - Estadísticas y análisis
// ============================================================================
export {
  getMetricasSesiones,
  getMetricasSesionesMesActual,
  getTendenciasSemanales,
  getMetricasOcupacion as getMetricasOcupacionConContexto,
  getSeriesOcupacionPorDia,
  type MetricasSesiones,
  type TendenciaSemanal,
  type SerieOcupacionPorDia,
  type RangoFechas,
  type ContextoMetricas,
} from './metricasSesiones';

// ============================================================================
// ANALYTICS - Métricas de ocupación y dashboards financieros
// ============================================================================
export {
  getConfiguracionMetaOcupacion,
  actualizarConfiguracionMetaOcupacion,
  calcularHorasDisponibles,
  calcularHorasTrabajadas,
  calcularHorasReservadas,
  getMetricasOcupacion,
  getMetricasOcupacionSemanal,
  getMetricasOcupacionMensual,
  getComparativaOcupacion,
  getProyeccionIngresos,
  getAnalyticsOcupacion,
  getDashboardFinancieroAgenda,
} from './analytics';

// ============================================================================
// SINCRONIZACIÓN DE CALENDARIO - Integración con calendarios externos
// ============================================================================
export {
  getConexionesCalendario,
  conectarGoogleCalendar,
  conectarOutlookCalendar,
  desconectarCalendario,
  getCalendariosDisponibles,
  guardarConexionCalendario,
  sincronizarEventos,
  convertirEventosEnBloqueos,
  getConfiguracionSincronizacion,
  guardarConfiguracionSincronizacion,
  crearEventoExterno,
  actualizarEventoExterno,
  eliminarEventoExterno,
  getPrimeraConexionActiva,
  sincronizarCitaAutomaticamente,
  actualizarCitaAutomaticamente,
  eliminarCitaAutomaticamente,
  getIntegracionesCalendario,
  conectarCalendarioExterno,
  desconectarCalendarioExterno,
  sincronizarAhora,
} from './sincronizacionCalendario';

// ============================================================================
// LISTA DE ESPERA - Gestión de lista de espera
// ============================================================================
export {
  getListaEspera,
  addEntradaListaEspera,
  removeEntradaListaEspera,
  asignarHuecoDesdeListaEspera,
} from './listaEspera';

