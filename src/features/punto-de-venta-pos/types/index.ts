// Tipos para el módulo de Punto de Venta POS

export interface ProductoPOS {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria?: string;
  stock?: number;
  imagen?: string;
  activo: boolean;
}

export interface ItemCarrito {
  producto: ProductoPOS;
  cantidad: number;
  subtotal: number;
  descuento?: number;
}

export interface Venta {
  id: string;
  numeroTicket: string;
  fecha: Date;
  items: ItemCarrito[];
  subtotal: number;
  impuestos: number;
  descuentoTotal: number;
  total: number;
  metodoPago: 'efectivo' | 'tarjeta' | 'mixto';
  estado: 'pendiente' | 'completada' | 'cancelada';
  clienteId?: string;
  vendedorId: string;
}

export interface Arqueo {
  id: string;
  fecha: Date;
  turno: 'mañana' | 'tarde' | 'noche';
  ventas: Venta[];
  totalEfectivo: number;
  totalTarjeta: number;
  totalVentas: number;
  totalEsperado: number;
  diferencia: number;
  estado: 'abierto' | 'cerrado';
  observaciones?: string;
}

export interface Ticket {
  id: string;
  ventaId: string;
  numeroTicket: string;
  contenido: string;
  impreso: boolean;
  fechaImpresion?: Date;
}

export interface FiltroVentas {
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: Venta['estado'];
  metodoPago?: Venta['metodoPago'];
  vendedorId?: string;
  buscar?: string;
}

