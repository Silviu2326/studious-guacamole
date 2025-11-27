/**
 * Tipos TypeScript para el sistema de Facturación y Cobros
 * 
 * Este archivo define todas las interfaces y tipos principales utilizados
 * en el módulo de facturación, incluyendo facturas, líneas de factura,
 * cobros, estados, métricas y tipos auxiliares.
 */

// ============================================================================
// 1. TIPOS BASE Y ENUMS
// ============================================================================

/**
 * Estados posibles de una factura
 * Usado en: Listado de facturas, detalle de factura, filtros, reportes
 */
export type EstadoFactura = 
  | 'pendiente' 
  | 'pagada' 
  | 'parcialmentePagada' 
  | 'vencida' 
  | 'cancelada';

/**
 * Métodos de pago disponibles
 * Usado en: Formularios de cobro, reportes de pagos, filtros
 */
export type MetodoPago = 
  | 'efectivo' 
  | 'tarjeta' 
  | 'transferencia' 
  | 'paypal' 
  | 'stripe' 
  | 'otro';

/**
 * Origen de la factura (cómo fue generada)
 * Usado en: Filtros, reportes, historial de facturación
 */
export type OrigenFactura = 
  | 'manual' 
  | 'reserva' 
  | 'paquete' 
  | 'suscripcion';

/**
 * Rol en el sistema de facturación
 * Usado en: Permisos, vistas personalizadas, reportes por rol
 */
export type RolFacturacion = 'entrenador' | 'gimnasio';

/**
 * Estados posibles de un enlace de pago
 * Usado en: Gestión de enlaces de pago, validación de enlaces públicos
 */
export type EstadoLinkPago = 'activo' | 'expirado' | 'usado';

/**
 * Canales de comunicación para notificaciones y recordatorios
 * Usado en: Configuración de recordatorios, envío de notificaciones
 */
export type CanalNotificacion = 'email' | 'whatsapp' | 'sms';

/**
 * Tipos de notificaciones de facturación
 * Usado en: Historial de notificaciones, filtros de notificaciones
 */
export type TipoNotificacionFactura = 
  | 'nuevaFactura' 
  | 'recordatorio' 
  | 'pagoRecibido' 
  | 'facturaVencida';

/**
 * Estados de envío de una notificación
 * Usado en: Historial de notificaciones, reportes de envíos
 */
export type EstadoEnvio = 'enviado' | 'pendiente' | 'fallido' | 'cancelado';

/**
 * Frecuencia de facturación para suscripciones recurrentes
 * Usado en: Configuración de cobros recurrentes, suscripciones
 */
export type FrecuenciaFacturacion = 
  | 'diaria' 
  | 'semanal' 
  | 'quincenal' 
  | 'mensual' 
  | 'bimestral' 
  | 'trimestral' 
  | 'semestral' 
  | 'anual';

/**
 * Estado de una suscripción recurrente
 * Usado en: Gestión de suscripciones, listados, filtros
 */
export type EstadoSuscripcion = 
  | 'activa' 
  | 'pausada' 
  | 'cancelada' 
  | 'vencida' 
  | 'error_pago';

// ============================================================================
// 2. INTERFACES BASE
// ============================================================================

/**
 * Línea de factura - Representa un item individual en una factura
 * Usado en: Formularios de creación/edición de facturas, listado de items
 */
export interface LineaFactura {
  id: string;
  descripcion: string;
  servicioIdOpcional?: string; // ID del servicio si está asociado a uno
  cantidad: number;
  precioUnitario: number;
  descuentoOpcional?: number; // Descuento aplicado a esta línea
  impuestoOpcional?: number; // Impuesto aplicado a esta línea
  totalLinea: number; // Total calculado: (cantidad * precioUnitario - descuento) + impuesto
}

/**
 * Factura - Documento principal de facturación
 * Usado en: Listado de facturas, detalle de factura, formularios, reportes
 */
export interface Factura {
  id: string;
  numero: string; // Número único de factura
  clienteId: string; // ID del cliente
  nombreCliente: string; // Nombre del cliente (para evitar joins en listados)
  fechaEmision: Date; // Fecha en que se emitió la factura
  fechaVencimiento: Date; // Fecha límite de pago
  estado: EstadoFactura; // Estado actual de la factura
  lineas: LineaFactura[]; // Array de líneas de factura
  subtotal: number; // Suma de todas las líneas antes de impuestos y descuentos
  impuestos: number; // Total de impuestos aplicados
  total: number; // Total final de la factura
  saldoPendiente: number; // Monto aún pendiente de pago
  moneda: string; // Código de moneda (ej: 'EUR', 'USD', 'MXN')
  notasInternas?: string; // Notas visibles solo para administradores/entrenadores
  origen: OrigenFactura; // Origen de la factura
  creadaEn: Date; // Timestamp de creación
  actualizadaEn: Date; // Timestamp de última actualización
}

/**
 * Cobro - Registro de un pago realizado sobre una factura
 * Usado en: Historial de pagos, formularios de registro de cobros, reportes
 */
export interface Cobro {
  id: string;
  facturaId: string; // ID de la factura asociada
  fechaCobro: Date; // Fecha en que se realizó el cobro
  importe: number; // Monto cobrado
  metodoPago: MetodoPago; // Método utilizado para el pago
  referenciaExternaOpcional?: string; // Referencia externa (ej: número de transacción)
  observacionesOpcional?: string; // Observaciones adicionales sobre el cobro
  esCobroRecurrente: boolean; // Indica si es parte de un cobro recurrente/automático
}

/**
 * LinkPago - Enlace de pago público para compartir con clientes
 * Usado en: EnviarLinkPago.tsx, PaginaPagoPublica.tsx, gestión de enlaces de pago
 */
export interface LinkPago {
  id: string;
  facturaIdOpcional?: string; // ID de la factura asociada (opcional)
  clienteIdOpcional?: string; // ID del cliente asociado (opcional)
  slug: string; // Identificador único para la URL pública
  urlPublica: string; // URL completa del enlace de pago público
  importe: number; // Monto a pagar
  moneda: string; // Código de moneda (ej: 'EUR', 'USD', 'MXN')
  fechaExpiracion: Date; // Fecha límite de validez del enlace
  estado: EstadoLinkPago; // Estado actual del enlace (activo, expirado, usado)
  creadoEn: Date; // Timestamp de creación
}

// ============================================================================
// 3. MÉTRICAS Y VISTAS
// ============================================================================

/**
 * Resumen general de facturación
 * Usado en: Dashboard principal, widgets de resumen, reportes ejecutivos
 */
export interface ResumenFacturacion {
  totalFacturado: number; // Total facturado en el período
  totalCobrado: number; // Total cobrado en el período
  totalPendiente: number; // Total pendiente de cobro
  numeroFacturasPendientes: number; // Cantidad de facturas pendientes
  numeroFacturasVencidas: number; // Cantidad de facturas vencidas
  periodo: {
    fechaInicio: Date;
    fechaFin: Date;
  }; // Período de tiempo del resumen
}

/**
 * Ingresos agrupados por período
 * Usado en: Gráficos de ingresos, reportes temporales, análisis de tendencias
 */
export interface IngresoPorPeriodo {
  periodo: string | {
    mes: number;
    año: number;
  } | {
    fechaInicio: Date;
    fechaFin: Date;
  }; // Puede ser mes/año o rango de fechas
  totalIngresos: number; // Total de ingresos en el período
  numeroFacturas: number; // Cantidad de facturas en el período
  variacionPorcentualOpcional?: number; // Variación porcentual respecto al período anterior
}

/**
 * Ingresos agrupados por servicio
 * Usado en: Reportes de servicios más vendidos, análisis de rentabilidad por servicio
 */
export interface IngresoPorServicio {
  servicioId: string; // ID del servicio
  nombreServicio: string; // Nombre del servicio
  totalIngresos: number; // Total de ingresos generados por este servicio
  numeroFacturas: number; // Cantidad de facturas que incluyen este servicio
  ticketMedio: number; // Ticket medio (totalIngresos / numeroFacturas)
}

/**
 * Ingresos agrupados por día
 * Usado en: CalendarioIngresos.tsx para mostrar ingresos diarios en vista de calendario
 */
export interface IngresoDia {
  fecha: Date; // Fecha del día
  ingresosEsperados: number; // Ingresos esperados (facturas pendientes que vencen este día)
  ingresosReales: number; // Ingresos reales (cobros confirmados este día)
  facturasPendientes: Factura[]; // Facturas pendientes que vencen este día
  cobrosConfirmados: Cobro[]; // Cobros confirmados este día
}

// ============================================================================
// 4. FILTROS Y PARÁMETROS DE CONSULTA
// ============================================================================

/**
 * Filtros para consultas de facturas
 * Usado en: API de facturas, componentes de listado, reportes
 */
export interface FiltroFacturas {
  clienteId?: string; // Filtrar por ID de cliente
  estado?: EstadoFactura; // Filtrar por estado de la factura
  fechaInicio?: Date; // Fecha de inicio del rango de emisión
  fechaFin?: Date; // Fecha de fin del rango de emisión
  fechaVencimientoInicio?: Date; // Fecha de inicio del rango de vencimiento
  fechaVencimientoFin?: Date; // Fecha de fin del rango de vencimiento
  rol?: RolFacturacion; // Filtrar por rol (entrenador/gimnasio)
  origen?: OrigenFactura; // Filtrar por origen de la factura
  numeroFactura?: string; // Buscar por número de factura (búsqueda parcial)
  montoMinimo?: number; // Monto mínimo
  montoMaximo?: number; // Monto máximo
  saldoPendienteMinimo?: number; // Saldo pendiente mínimo
  saldoPendienteMaximo?: number; // Saldo pendiente máximo
}

/**
 * Configuración de recordatorios automáticos de pago
 * Usado en: ConfiguracionRecordatoriosAutomaticos.tsx, gestión de recordatorios automáticos
 */
export interface RecordatorioPagoConfig {
  diasAntesVencimiento: number; // Días antes del vencimiento para enviar recordatorio
  diasDespuesVencimiento: number; // Días después del vencimiento para enviar recordatorio
  frecuenciaDias: number; // Frecuencia en días para reenvío de recordatorios
  canales: CanalNotificacion[]; // Canales habilitados (email, whatsapp, sms)
}

/**
 * Notificación de factura - Registro de una notificación enviada
 * Usado en: Historial de notificaciones, reportes de comunicaciones, RecordatoriosPago.tsx
 */
export interface NotificacionFactura {
  id: string; // ID único de la notificación
  facturaId: string; // ID de la factura asociada
  tipo: TipoNotificacionFactura; // Tipo de notificación (nuevaFactura, recordatorio, pagoRecibido, facturaVencida)
  canal: CanalNotificacion; // Canal utilizado para el envío (email, whatsapp, sms)
  enviadoEn: Date; // Fecha y hora en que se envió la notificación
  estadoEnvio: EstadoEnvio; // Estado del envío (enviado, pendiente, fallido, cancelado)
}

/**
 * Filtros para consultas de notificaciones
 * Usado en: API de notificaciones, componentes de historial
 */
export interface FiltroNotificaciones {
  facturaId?: string; // Filtrar por ID de factura
  tipo?: TipoNotificacionFactura; // Filtrar por tipo de notificación
  canal?: CanalNotificacion; // Filtrar por canal
  estadoEnvio?: EstadoEnvio; // Filtrar por estado de envío
  fechaInicio?: Date; // Fecha de inicio del rango de envío
  fechaFin?: Date; // Fecha de fin del rango de envío
}

/**
 * Tipo de documento enviado por email
 * Usado en: EnvioReciboEmail para identificar qué tipo de documento se envió
 */
export type TipoDocumentoEmail = 'factura' | 'recibo' | 'recordatorio';

/**
 * Envío de recibo/factura por email - Registro de un envío de documento por correo electrónico
 * Usado en: HistorialPagosCliente.tsx, ModalPagoRapido.tsx, FacturacionManager.tsx
 * 
 * Representa el registro de cada intento de envío de una factura o recibo de pago por email.
 * Permite llevar un historial de todos los envíos realizados y su estado.
 */
export interface EnvioReciboEmail {
  id: string; // ID único del registro de envío
  facturaId: string; // ID de la factura asociada
  clienteId: string; // ID del cliente destinatario
  emailDestino: string; // Dirección de email a la que se envió
  tipo: TipoDocumentoEmail; // Tipo de documento: factura, recibo, o recordatorio
  enviadoEn: Date; // Fecha y hora en que se realizó el envío
  estadoEnvio: EstadoEnvio; // Estado del envío (enviado, pendiente, fallido, cancelado)
  mensajeErrorOpcional?: string; // Mensaje de error si el envío falló
}

/**
 * Filtros para consultas de envíos de recibos por email
 * Usado en: API de recibosEmail, componentes de historial de envíos
 */
export interface FiltroEnviosRecibos {
  facturaId?: string; // Filtrar por ID de factura
  clienteId?: string; // Filtrar por ID de cliente
  tipo?: TipoDocumentoEmail; // Filtrar por tipo de documento
  estadoEnvio?: EstadoEnvio; // Filtrar por estado de envío
  fechaInicio?: Date; // Fecha de inicio del rango de envío
  fechaFin?: Date; // Fecha de fin del rango de envío
  emailDestino?: string; // Filtrar por email destinatario (búsqueda parcial)
}

/**
 * Suscripción Recurrente - Configuración de cobros automáticos periódicos
 * Usado en: GestorSuscripcionesRecurrentes.tsx, ConfigurarCobrosRecurrentes.tsx
 * 
 * NOTA: A futuro se conectará con pasarelas de pago reales (Stripe, PayPal, etc.)
 * para procesar los cobros automáticamente.
 */
export interface SuscripcionRecurrente {
  id: string; // ID único de la suscripción
  clienteId: string; // ID del cliente asociado
  nombreCliente: string; // Nombre del cliente (para evitar joins en listados)
  descripcion: string; // Descripción del servicio/producto de la suscripción
  importe: number; // Monto a cobrar en cada ciclo
  moneda: string; // Código de moneda (ej: 'EUR', 'USD', 'MXN', 'COP')
  frecuencia: FrecuenciaFacturacion; // Frecuencia de facturación
  diaFacturacion: number; // Día del mes/semana en que se realiza el cobro (1-31 para mensual, 1-7 para semanal)
  metodoPagoPreferido: MetodoPago; // Método de pago preferido del cliente
  estado: EstadoSuscripcion; // Estado actual de la suscripción
  fechaInicio: Date; // Fecha en que comenzó la suscripción
  fechaProximoCobro: Date; // Fecha del próximo cobro programado
  fechaFin?: Date; // Fecha de finalización (si está cancelada o vencida)
  numeroCobrosRealizados: number; // Cantidad de cobros exitosos realizados
  numeroCobrosFallidos: number; // Cantidad de intentos de cobro fallidos
  notas?: string; // Notas adicionales sobre la suscripción
  creadaEn: Date; // Timestamp de creación
  actualizadaEn: Date; // Timestamp de última actualización
}

/**
 * Filtros para consultas de suscripciones recurrentes
 * Usado en: API de suscripciones, componentes de listado
 */
export interface FiltroSuscripciones {
  clienteId?: string; // Filtrar por ID de cliente
  estado?: EstadoSuscripcion; // Filtrar por estado
  frecuencia?: FrecuenciaFacturacion; // Filtrar por frecuencia
  metodoPago?: MetodoPago; // Filtrar por método de pago
  fechaProximoCobroInicio?: Date; // Fecha de inicio del rango de próximo cobro
  fechaProximoCobroFin?: Date; // Fecha de fin del rango de próximo cobro
}

// ============================================================================
// 5. RE-EXPORTAR TIPOS DE PAQUETES Y PLANTILLAS
// ============================================================================

/**
 * Re-exportar todos los tipos relacionados con paquetes de servicios
 * Ver: src/features/facturacion-cobros/types/paquetes.ts
 */
export * from './paquetes';

/**
 * Re-exportar todos los tipos relacionados con plantillas de facturas
 * Ver: src/features/facturacion-cobros/types/plantillas.ts
 */
export * from './plantillas';

