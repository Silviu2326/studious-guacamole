/**
 * Índice centralizado del módulo de API para la feature "Objetivos y Rendimiento"
 * 
 * Este archivo centraliza todas las funciones y tipos de la lógica de negocio simulada
 * relacionada con objetivos, métricas, rendimiento y reportes. En producción, estas
 * funciones se conectarían con endpoints REST/GraphQL de un backend real.
 */

// ============================================================================
// MÉTRICAS Y KPIs
// ============================================================================
// Funciones para gestionar KPIs y métricas
export {
  getKPIs,
  getKPI,
  updateKPIVisibility,
  updateKPITarget,
  createCustomMetric,
  updateKPI,
  getMetricsByCategory,
} from './metrics';

// ============================================================================
// OBJETIVOS
// ============================================================================
// Utilidades de cálculo de progreso y CRUD de objetivos
export {
  calculateObjectiveProgress,
  getObjectives,
  getObjective,
  createObjective,
  updateObjective,
  deleteObjective,
  getObjectiveProgress,
} from './objectives';

// ============================================================================
// RENDIMIENTO
// ============================================================================
// Funciones para obtener datos de rendimiento y comparaciones
export {
  getPerformanceOverview,
  comparePeriods,
  getPerformanceMetrics,
  getPerformanceDashboard,
  comparePerformance,
} from './performance';

// ============================================================================
// REPORTES
// ============================================================================
// Funciones para generar, listar y descargar reportes
export {
  getReports,
  generateReport,
  simulateDownload,
  getReport,
  getReportStatus,
} from './reports';

