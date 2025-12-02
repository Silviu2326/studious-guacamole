// Tipos para el sistema de Gastos & Proveedores

export interface Gasto {
  id: string;
  fecha: Date;
  proveedorId?: string;
  proveedor?: string;
  categoria: string;
  concepto: string;
  monto: number;
  tipo: 'operativo' | 'inversion' | 'mantenimiento';
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';
  estado: 'pendiente' | 'aprobado' | 'pagado' | 'rechazado';
  factura?: string;
  descripcion?: string;
  presupuestoAsignado?: string;
  usuario: string;
  fechaAprobacion?: Date;
  fechaPago?: Date;
  observaciones?: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion?: string;
  tipo: 'productos' | 'servicios' | 'mantenimiento' | 'servicios_generales';
  calificacion: number; // 1-5
  numeroOrdenes: number;
  montoTotal: number;
  fechaUltimaOrden?: Date;
  notas?: string;
  activo: boolean;
  categorias: string[];
  condicionesPago?: string;
  descuentosAplicables?: number;
}

export interface CategoriaGasto {
  id: string;
  nombre: string;
  tipo: 'operativo' | 'inversion' | 'mantenimiento';
  descripcion?: string;
  presupuestoAsignado?: number;
  presupuestoMensual?: number;
  color?: string;
  icono?: string;
  activa: boolean;
}

export interface OrdenCompra {
  id: string;
  numero: string;
  fecha: Date;
  proveedorId: string;
  proveedor?: string;
  items: ItemOrdenCompra[];
  subtotal: number;
  impuestos: number;
  total: number;
  estado: 'pendiente' | 'enviada' | 'recibida' | 'aprobada' | 'rechazada' | 'pagada';
  fechaEntregaEsperada?: Date;
  fechaEntregaReal?: Date;
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';
  condicionesEntrega?: string;
  observaciones?: string;
  usuario: string;
  fechaAprobacion?: Date;
}

export interface ItemOrdenCompra {
  id: string;
  producto: string;
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  impuesto?: number;
}

export interface CostoMantenimiento {
  id: string;
  fecha: Date;
  equipoMaquina: string;
  proveedorId: string;
  proveedor?: string;
  tipo: 'preventivo' | 'correctivo' | 'emergencia';
  costo: number;
  descripcion?: string;
  proximoServicio?: Date;
  frecuencia?: string;
  estado: 'programado' | 'en_proceso' | 'completado' | 'cancelado';
}

export interface Presupuesto {
  id: string;
  periodo: 'mensual' | 'trimestral' | 'anual';
  año: number;
  mes?: number;
  categoriaId: string;
  categoria?: string;
  montoAsignado: number;
  montoGastado: number;
  montoDisponible: number;
  porcentajeUsado: number;
  alertas: boolean;
  limiteAlerta?: number; // porcentaje
}

export interface EvaluacionProveedor {
  id: string;
  proveedorId: string;
  fecha: Date;
  calificacion: number; // 1-5
  criterios: {
    calidad: number;
    precio: number;
    servicio: number;
    puntualidad: number;
    comunicacion: number;
  };
  comentarios?: string;
  usuario: string;
  ordenCompraId?: string;
}

export interface ReporteGastos {
  id: string;
  fechaInicio: Date;
  fechaFin: Date;
  periodo: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
  totalGastos: number;
  gastosPorCategoria: {
    [categoria: string]: number;
  };
  gastosPorTipo: {
    operativo: number;
    inversion: number;
    mantenimiento: number;
  };
  gastosPorProveedor: {
    [proveedorId: string]: {
      nombre: string;
      total: number;
      numeroOrdenes: number;
    };
  };
  tendencias: {
    mes: string;
    monto: number;
  }[];
  topProveedores: {
    proveedorId: string;
    nombre: string;
    montoTotal: number;
  }[];
}

// Filtros y búsquedas
export interface FiltroGastos {
  fechaInicio?: Date;
  fechaFin?: Date;
  categoria?: string;
  tipo?: 'operativo' | 'inversion' | 'mantenimiento';
  proveedorId?: string;
  estado?: 'pendiente' | 'aprobado' | 'pagado' | 'rechazado';
  metodoPago?: 'efectivo' | 'transferencia' | 'tarjeta' | 'cheque';
  montoMin?: number;
  montoMax?: number;
}

export interface FiltroProveedores {
  tipo?: 'productos' | 'servicios' | 'mantenimiento' | 'servicios_generales';
  calificacionMin?: number;
  activo?: boolean;
  categoria?: string;
  busqueda?: string;
}

export interface FiltroOrdenesCompra {
  fechaInicio?: Date;
  fechaFin?: Date;
  proveedorId?: string;
  estado?: 'pendiente' | 'enviada' | 'recibida' | 'aprobada' | 'rechazada' | 'pagada';
  numero?: string;
}

