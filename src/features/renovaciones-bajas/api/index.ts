/**
 * Archivo de barril para exportar todas las funciones públicas del módulo de API
 * de Renovaciones y Bajas.
 * 
 * Este módulo incluye:
 * - Funciones de renovaciones de suscripciones
 * - Funciones de gestión de bajas de clientes
 * - Funciones de alertas de vencimiento
 * - Funciones de análisis de churn y retención
 */

// ============================================================================
// EXPORTACIONES DE RENOVACIONES
// ============================================================================

export {
  // Funciones principales
  getSuscripcionesProximasAVencer,
  procesarRenovacion,
  marcarComoRenovada,
  registrarRenovacionFallida,
  getHistorialRenovaciones,
  getMetricasRenovacion,
  
  // Funciones auxiliares
  cancelarRenovacion,
  enviarRecordatorio,
  
  // Nueva función principal con filtros
  getRenovaciones,
  
  // Funciones legacy (mantenidas para compatibilidad)
  getRenovacionesLegacy,
  procesarRenovacionLegacy,
} from './renovaciones';

// Exportar tipos de renovaciones
export type {
  FiltrosSuscripcionesProximas,
  FiltrosHistorialRenovaciones,
  OpcionesProcesarRenovacion,
  MetricasRenovacion,
} from './renovaciones';

// Exportar tipos de filtros desde types
export type {
  FiltrosRenovaciones,
} from '../types';

// ============================================================================
// EXPORTACIONES DE BAJAS
// ============================================================================

export {
  // Funciones principales de bajas
  registrarBaja,
  getBajas,
  getBajasRecientes,
  actualizarIntentoRetencion,
  getEstadisticasBajas,
  
  // Funciones de motivos de baja
  getMotivosBaja,
  crearMotivoBaja,
  actualizarMotivoBaja,
  eliminarMotivoBaja,
  
  // Funciones legacy (mantenidas para compatibilidad)
  procesarBaja,
  cancelarBaja,
  exportarBajas,
} from './bajas';

// ============================================================================
// EXPORTACIONES DE ALERTAS
// ============================================================================

export {
  getAlertasVencimiento,
  marcarAlertaComoLeida,
  marcarAlertaLeida,
  configurarDiasAnticipacion,
  getConfiguracionAlertas,
  procesarAlerta,
  descartarAlerta,
} from './alertas';

// ============================================================================
// EXPORTACIONES DE CHURN
// ============================================================================

export {
  // Funciones principales de análisis de churn
  getMetricasChurn,
  getSerieTemporalChurn,
  getChurnPorSegmento,
  predecirChurnClientes,
  
  // Funciones legacy (mantenidas para compatibilidad)
  getAnalisisChurn,
  exportarReporteChurn,
} from './churn';
