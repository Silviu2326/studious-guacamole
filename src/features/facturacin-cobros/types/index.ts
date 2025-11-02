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
  };
  items: ItemFactura[];
  subtotal: number;
  descuentos: number;
  impuestos: number;
  total: number;
  tipo: TipoFactura;
  estado: EstadoFactura;
  metodoPago?: MetodoPago;
  pagos: Pago[];
  montoPendiente: number;
  recordatoriosEnviados: number;
  ultimoRecordatorio?: Date;
  notas?: string;
  usuarioCreacion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
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

