// Tipos para el sistema de Facturación & Cobros

export type EstadoFactura = 'pendiente' | 'parcial' | 'pagada' | 'vencida' | 'cancelada';
export type TipoFactura = 'servicios' | 'productos' | 'recurrente' | 'paquetes' | 'eventos' | 'adicionales' | 'correccion';
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'cheque' | 'online';

export interface ItemFactura {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  impuesto?: number;
  subtotal: number;
  tipo: 'servicio' | 'producto';
}

export type TipoDescuento = 'porcentaje' | 'monto_fijo' | 'motivo_predefinido';
export type MotivoDescuento = 'referido' | 'promocion' | 'fidelidad' | 'primera_compra' | 'volumen' | 'otro';

export interface DescuentoFactura {
  tipo: TipoDescuento;
  valor?: number; // Porcentaje o monto fijo
  motivo?: MotivoDescuento;
  descripcion?: string; // Descripción personalizada del descuento
}

export interface Factura {
  id: string;
  numeroFactura: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
  cliente: {
    id: string;
    nombre: string;
    email: string;
    nit?: string;
    direccion?: string;
    telefono?: string;
  };
  items: ItemFactura[];
  subtotal: number;
  descuentos: number;
  descuento?: DescuentoFactura; // Información del descuento aplicado
  impuestos: number;
  total: number;
  tipo: TipoFactura;
  estado: EstadoFactura;
  metodoPago?: MetodoPago;
  pagos: Pago[];
  montoPendiente: number;
  recordatoriosEnviados: number;
  ultimoRecordatorio?: Date;
  notas?: string; // Notas públicas visibles para el cliente
  notasInternas?: string; // Notas privadas solo visibles para el entrenador/administrador
  usuarioCreacion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  linkPagoId?: string; // ID del link de pago asociado
  suscripcionId?: string; // ID de la suscripción si fue generada automáticamente
}

export interface Pago {
  id: string;
  facturaId: string;
  fecha: Date;
  monto: number;
  metodoPago: MetodoPago;
  referencia?: string;
  comprobante?: string;
  usuario: string;
  notas?: string;
}

export interface RecordatorioPago {
  id: string;
  facturaId: string;
  fechaEnvio: Date;
  tipo: 'automatico' | 'manual';
  medio: 'email' | 'sms' | 'whatsapp';
  estado: 'enviado' | 'fallido' | 'pendiente';
  respuesta?: string;
  proximoEnvio?: Date;
}

export interface PlantillaFactura {
  id: string;
  nombre: string;
  descripcion?: string;
  logo?: string;
  colorPrincipal?: string;
  colorSecundario?: string;
  encabezado?: string;
  piePagina?: string;
  camposPersonalizados?: {
    [key: string]: string;
  };
  activa: boolean;
  fechaCreacion: Date;
}

export interface Cobro {
  id: string;
  facturaId: string;
  fechaCobro: Date;
  monto: number;
  metodoPago: MetodoPago;
  referencia: string;
  estado: 'pendiente' | 'confirmado' | 'rechazado';
  notas?: string;
  usuario: string;
}

export interface ReporteFacturacion {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  totalFacturado: number;
  totalCobrado: number;
  totalPendiente: number;
  facturasEmitidas: number;
  facturasPagadas: number;
  facturasVencidas: number;
  promedioTicket: number;
  facturasPorTipo: {
    [key in TipoFactura]: number;
  };
  cobrosPorMetodo: {
    [key in MetodoPago]: number;
  };
}

export interface FiltroFacturas {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  estado?: EstadoFactura;
  tipo?: TipoFactura;
  montoMin?: number;
  montoMax?: number;
  numeroFactura?: string;
}

export interface FiltroCobros {
  fechaInicio?: Date;
  fechaFin?: Date;
  facturaId?: string;
  metodoPago?: MetodoPago;
  estado?: 'pendiente' | 'confirmado' | 'rechazado';
}

export interface EstadisticasFacturacion {
  facturasPendientes: number;
  montoPendiente: number;
  facturasVencidas: number;
  montoVencido: number;
  facturasMesActual: number;
  montoFacturadoMes: number;
  facturasPagadasMes: number;
  montoCobradoMes: number;
  promedioDiasCobro: number;
}

// Tipos para facturación recurrente automática
export type FrecuenciaFacturacion = 'mensual' | 'semanal' | 'quincenal' | 'trimestral' | 'anual';
export type EstadoSuscripcion = 'activa' | 'pausada' | 'cancelada' | 'vencida';

export interface SuscripcionFacturacion {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  descripcion: string;
  monto: number;
  frecuencia: FrecuenciaFacturacion;
  fechaInicio: Date;
  fechaProximaFacturacion: Date;
  fechaFin?: Date;
  estado: EstadoSuscripcion;
  diaFacturacion: number; // Día del mes (1-31) o día de la semana (1-7) según frecuencia
  items: ItemFactura[];
  notas?: string;
  facturasGeneradas: string[]; // IDs de facturas generadas
  fechaCreacion: Date;
  fechaActualizacion: Date;
  usuarioCreacion: string;
  enviarAutomaticamente: boolean; // Si se envía automáticamente la factura al cliente
  mediosEnvio: ('email' | 'whatsapp')[]; // Medios por los que se envía la factura
}

export interface ConfiguracionFacturacionRecurrente {
  id: string;
  suscripcionId: string;
  activarRecordatorios: boolean;
  diasRecordatorio: number[]; // Días antes del vencimiento para enviar recordatorio
  plantillaEmail?: string;
  plantillaWhatsApp?: string;
}

// Tipos para links de pago
export type EstadoLinkPago = 'activo' | 'usado' | 'expirado' | 'cancelado';

export interface LinkPago {
  id: string;
  facturaId: string;
  token: string; // Token único para el link
  url: string; // URL completa del link de pago
  monto: number;
  estado: EstadoLinkPago;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  fechaUso?: Date;
  metodoPagoPermitido: ('tarjeta' | 'transferencia')[];
  referenciaPago?: string;
  notas?: string;
  creadoPor: string;
}

export interface PagoOnline {
  id: string;
  linkPagoId: string;
  facturaId: string;
  monto: number;
  metodoPago: 'tarjeta' | 'transferencia';
  estado: 'pendiente' | 'procesando' | 'completado' | 'rechazado' | 'reembolsado';
  referencia: string;
  datosPago?: {
    ultimos4Digitos?: string;
    nombreTitular?: string;
    banco?: string;
    numeroCuenta?: string;
  };
  fechaCreacion: Date;
  fechaProcesamiento?: Date;
  fechaCompletado?: Date;
  errores?: string[];
}

// Tipos para configuración de recordatorios automáticos
export interface ConfiguracionRecordatoriosAutomaticos {
  id: string;
  activo: boolean;
  recordatorio3DiasAntes: boolean;
  recordatorioDiaVencimiento: boolean;
  recordatorio3DiasDespues: boolean;
  mediosEnvio: ('email' | 'whatsapp')[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  usuarioCreacion: string;
}

// Tipos para calendario de ingresos
export interface IngresoDia {
  fecha: Date;
  ingresosEsperados: number; // Suma de facturas pendientes con vencimiento ese día
  ingresosReales: number; // Suma de cobros confirmados ese día
  facturasPendientes: Factura[];
  cobrosConfirmados: Cobro[];
}

export interface ProyeccionFinMes {
  ingresosEsperadosAcumulados: number;
  ingresosRealesAcumulados: number;
  ingresosEsperadosPendientes: number; // Facturas pendientes que aún no vencen
  proyeccionFinMes: number; // Proyección basada en tendencia
  diferencia: number; // Diferencia entre esperado y real
  porcentajeCumplimiento: number; // Porcentaje de ingresos reales vs esperados
}

// Re-exportar tipos de paquetes y plantillas
export * from './paquetes';
export * from './plantillas';

