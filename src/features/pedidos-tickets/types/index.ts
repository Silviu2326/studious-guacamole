// Tipos para el módulo de Pedidos y Tickets

export interface Pedido {
  id: string;
  numeroPedido: string;
  clienteId: string;
  clienteNombre: string;
  fecha: Date;
  estado: 'pendiente' | 'confirmado' | 'procesando' | 'completado' | 'cancelado';
  items: PedidoItem[];
  subtotal: number;
  descuento: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'credito';
  ticketId?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PedidoItem {
  id: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  descuento?: number;
}

export interface Ticket {
  id: string;
  numeroTicket: string;
  pedidoId: string;
  tipo: 'venta' | 'devolucion' | 'cancelacion' | 'arqueo' | 'inventario';
  fecha: Date;
  montoTotal: number;
  metodoPago: string;
  items: TicketItem[];
  impreso: boolean;
  fechaImpresion?: Date;
  usuarioId: string;
  usuarioNombre: string;
  notas?: string;
  createdAt: Date;
}

export interface TicketItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Devolucion {
  id: string;
  numeroDevolucion: string;
  ticketId: string;
  numeroTicket: string;
  pedidoId: string;
  fecha: Date;
  motivo: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'completada';
  items: DevolucionItem[];
  montoTotal: number;
  metodoReembolso: 'efectivo' | 'tarjeta_original' | 'credito_cuenta';
  productosEstado: 'buen_estado' | 'defectuoso' | 'parcial';
  autorizadoPor?: string;
  procesadoPor?: string;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DevolucionItem {
  id: string;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  motivo: string;
  estado: 'buen_estado' | 'defectuoso';
  reembolsoAprobado: boolean;
}

export interface SeguimientoVenta {
  fecha: Date;
  totalVentas: number;
  cantidadPedidos: number;
  promedioTicket: number;
  productosVendidos: number;
  metodoPago: {
    efectivo: number;
    tarjeta: number;
    transferencia: number;
    credito: number;
  };
}

export interface ReportePedidos {
  periodo: string;
  totalVentas: number;
  totalPedidos: number;
  promedioTicket: number;
  productosMasVendidos: ProductoVenta[];
  categoriaVentas: CategoriaVenta[];
  tendencias: TendenciaVenta[];
  devoluciones: {
    total: number;
    monto: number;
    porcentaje: number;
  };
}

export interface ProductoVenta {
  productoId: string;
  productoNombre: string;
  cantidadVendida: number;
  ingresos: number;
}

export interface CategoriaVenta {
  categoria: string;
  cantidad: number;
  ingresos: number;
  porcentaje: number;
}

export interface TendenciaVenta {
  fecha: Date;
  ventas: number;
  pedidos: number;
}

export interface FiltroPedidos {
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: Pedido['estado'];
  metodoPago?: Pedido['metodoPago'];
  clienteId?: string;
  buscar?: string;
}

export interface FiltroTickets {
  fechaInicio?: Date;
  fechaFin?: Date;
  tipo?: Ticket['tipo'];
  impreso?: boolean;
  buscar?: string;
}

