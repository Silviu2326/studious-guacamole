/**
 * Archivo de barril que centraliza el acceso a la lógica de negocio simulada
 * de morosidad y pagos pendientes.
 * 
 * Este archivo exporta todas las funciones y tipos necesarios desde los
 * diferentes módulos de la API, proporcionando un punto de entrada único
 * y organizado para el consumo de la funcionalidad de gestión de pagos
 * pendientes y morosidad.
 */

// Exportaciones desde morosidad.ts
export {
  morosidadAPI,
  clientesMorososAPI,
  calcularNivelRiesgo
} from './morosidad';

// Exportaciones desde planesPago.ts
export {
  planesPagoAPI
} from './planesPago';

// Exportaciones desde recordatorios.ts
export {
  recordatoriosAPI,
  recordatoriosMorosidadAPI,
  type FiltrosRecordatoriosProgramados
} from './recordatorios';

// Exportaciones desde recordatoriosContacto.ts
export {
  recordatoriosContactoAPI,
  contactosCobroAPI
} from './recordatoriosContacto';

// Exportaciones desde reportesMensuales.ts
export {
  reportesMensualesAPI
} from './reportesMensuales';

// Exportaciones desde seguimiento.ts
export {
  seguimientoAPI,
  accionesCobroAPI
} from './seguimiento';

