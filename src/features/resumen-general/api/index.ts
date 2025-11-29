/**
 * Archivo barrel para las APIs del módulo resumen-general
 * 
 * Este archivo centraliza todas las exportaciones de tipos e interfaces y funciones
 * de las APIs del dashboard, facilitando la reutilización de los datos del dashboard
 * desde cualquier componente de la feature sin necesidad de importar archivo por archivo.
 * 
 * Uso recomendado:
 * ```typescript
 * import { DashboardMetrics, getMetrics, Alert, getAlerts } from '../api';
 * ```
 */

// Tipos e interfaces principales
export type { DashboardMetrics } from './metrics';
export type { ClientStatus } from './client-status';
export type { FinancialSummary, MonthFinancialData } from './financial';
export type { Alert, AlertType, AlertSeverity } from './alerts';
export type { Task } from './tasks';

// Funciones de API
export { getMetrics } from './metrics';
export { getClientStatus, getQuickStats } from './client-status';
export { getFinancialSummary } from './financial';
export { getAlerts } from './alerts';
export { getTasks, updateTask } from './tasks';

