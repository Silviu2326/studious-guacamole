/**
 * Archivo de barril que centraliza la lógica de negocio de facturación y cobros.
 * 
 * Este archivo exporta todas las funciones y tipos necesarios desde los diferentes
 * módulos de la API de facturación y cobros, proporcionando un punto de entrada
 * único y centralizado para acceder a toda la funcionalidad del módulo.
 * 
 * IMPORTANTE: Los archivos facturasVencidas.ts y suscripcionesRecurrentes.ts deben
 * existir en este directorio. Si no existen, deben crearse o moverse desde otro
 * directorio (p. ej., desde facturacin-cobros/api/).
 * 
 * Uso:
 * ```typescript
 * import { getFacturas, crearFactura } from '@/features/facturacion-cobros/api';
 * import { cobrosAPI, facturasAPI } from '@/features/facturacion-cobros/api';
 * ```
 */

// ============================================================================
// FACTURAS
// ============================================================================
export {
  getFacturas,
  getFacturaById,
  crearFactura,
  actualizarFactura,
  cancelarFactura,
} from './facturas';

// ============================================================================
// COBROS
// ============================================================================
export {
  getCobrosPorFactura,
  registrarCobro,
  eliminarCobro,
  getHistorialPagosCliente,
  cobrosAPI,
} from './cobros';

// ============================================================================
// FACTURAS VENCIDAS
// ============================================================================
export {
  obtenerFacturasVencidas,
  enviarNotificacionesFacturasVencidas,
  obtenerConfiguracionNotificacionesVencidas,
  actualizarConfiguracionNotificacionesVencidas,
  obtenerEstadisticasFacturasVencidas,
  getFacturasVencidas,
  getResumenImpagos,
  marcarComoEnSeguimiento,
  type FacturaVencida,
  type ConfiguracionNotificacionesVencidas,
} from './facturasVencidas';

// ============================================================================
// INGRESOS
// ============================================================================
export {
  getIngresosPorPeriodo,
  getResumenFacturacion,
  ingresosAPI,
  type FiltroIngresosPorPeriodo,
} from './ingresos';

// ============================================================================
// INGRESOS POR SERVICIO
// ============================================================================
export {
  getIngresosPorServicio,
  ingresosPorServicioAPI,
  type FiltroIngresosPorServicio,
} from './ingresosPorServicio';

// ============================================================================
// LINKS DE PAGO
// ============================================================================
export {
  crearLinkPago,
  getLinkPagoPorSlug,
  expirarLinkPago,
  marcarLinkPagoComoUsado,
} from './linksPago';

// ============================================================================
// NOTIFICACIONES
// ============================================================================
export {
  getNotificacionesFacturacion,
  notificacionesAPI,
} from './notificaciones';

// ============================================================================
// RECORDATORIOS
// ============================================================================
export {
  enviarRecordatorioManual,
  getRecordatoriosEnviados,
  recordatoriosAPI,
} from './recordatorios';

// ============================================================================
// RECORDATORIOS AUTOMÁTICOS
// ============================================================================
export {
  getConfiguracionRecordatoriosAuto,
  guardarConfiguracionRecordatoriosAuto,
  simularRecordatoriosPendientes,
  recordatoriosAutomaticosAPI,
} from './recordatoriosAutomaticos';

// ============================================================================
// SUSCRIPCIONES RECURRENTES
// ============================================================================
export {
  suscripcionesRecurrentesAPI,
} from './suscripcionesRecurrentes';

// ============================================================================
// PAQUETES
// ============================================================================
export {
  getPaquetesFacturacion,
  crearPaquete,
  actualizarPaquete,
  desactivarPaquete,
} from './paquetes';

// ============================================================================
// PLANTILLAS
// ============================================================================
export {
  getPlantillasFactura,
  crearPlantillaFactura,
  actualizarPlantillaFactura,
  establecerPlantillaPorDefecto,
} from './plantillas';

// ============================================================================
// RECIBOS POR EMAIL
// ============================================================================
export {
  enviarFacturaPorEmail,
  enviarReciboCobroPorEmail,
  getEnviosRecibos,
  recibosEmailAPI,
} from './recibosEmail';

