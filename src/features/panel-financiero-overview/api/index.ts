/**
 * Archivo barrel que centraliza el acceso a la lógica de negocio simulada del panel financiero.
 * 
 * Este módulo exporta todas las funciones, tipos y objetos API necesarios para:
 * - Overview financiero general
 * - Gestión de ingresos
 * - Gestión de gastos y costes estructurales
 * - Análisis de rendimiento
 * - Alertas de pagos
 * - Análisis de rentabilidad
 * - Proyecciones financieras
 * - Generación y gestión de reportes personalizados
 * 
 * En producción, estas funciones se conectarían a un backend real.
 */

// Exportaciones desde overview.ts
export { overviewApi, getResumenFinancieroGeneral, getResumenAlertasPagos } from './overview';
export type { MetricasFinancieras, IngresosEntrenador, FacturacionGimnasio, RolFinanciero, TendenciaFinanciera } from '../types';

// Exportaciones desde ingresos.ts
export { ingresosApi } from './ingresos';
export type { FiltrosHistoricoIngresos } from '../types';

// Exportaciones desde gastos.ts
export { gastosApi } from './gastos';
export type { CostesEstructurales } from '../types';

// Exportaciones desde rendimiento.ts
export { rendimientoApi } from './rendimiento';
export type { RendimientoEntrenador, FiltrosComparativaMensual } from '../types';

// Exportaciones desde alertas.ts
export { 
  getAlertasPagos, 
  marcarAlertaComoLeida, 
  getClientesConPagosPendientes,
  alertasApi 
} from './alertas';
export type { 
  AlertaPago, 
  ClientePagoPendiente, 
  FiltrosAlertasPagos,
  FiltrosClientesPagosPendientes,
  NivelRiesgoPago,
  TipoAlertaPago,
  OrigenPago
} from '../types';

// Exportaciones desde rentabilidad.ts
export { getAnalisisRentabilidad, rentabilidadApi } from './rentabilidad';
export type { AnalisisRentabilidad, EstadoSaludFinanciera } from '../types';

// Exportaciones desde proyecciones.ts
export { proyeccionesApi, getProyeccionesFinancieras } from './proyecciones';
export type { FiltrosProyecciones } from './proyecciones';
export type { ProyeccionFinanciera, NivelConfianza, EscenarioProyeccion } from '../types';

// Exportaciones desde reportes.ts
export { generarReporteFinanciero, getReportesGenerados, reportesApi } from './reportes';
export type { ReportePersonalizado, ConfigGeneracionReporte, FiltrosReportesGenerados, FormatoReporte } from '../types';

