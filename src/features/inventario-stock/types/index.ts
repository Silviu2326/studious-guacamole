// Tipos para el sistema de Inventario & Stock

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  categoria: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo?: number;
  unidad: string;
  precioCompra?: number;
  precioVenta?: number;
  proveedor?: string;
  ubicacion?: string;
  tieneCaducidad: boolean;
  fechaCaducidad?: Date;
  fechaUltimaEntrada?: Date;
  fechaUltimaSalida?: Date;
  estado: 'disponible' | 'agotado' | 'bajo_stock' | 'vencido' | 'deshabilitado';
  notas?: string;
}

export interface MovimientoStock {
  id: string;
  fecha: Date;
  productoId: string;
  productoNombre: string;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'transferencia';
  cantidad: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  motivo: string;
  referencia?: string; // Número de factura, orden, etc.
  usuario: string;
  ubicacionOrigen?: string;
  ubicacionDestino?: string;
  costoUnitario?: number;
  observaciones?: string;
}

export interface AlertaStock {
  id: string;
  tipo: 'stock_bajo' | 'caducidad_proxima' | 'caducidad_vencida' | 'stock_agotado';
  productoId: string;
  productoNombre: string;
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  mensaje: string;
  fechaGeneracion: Date;
  fechaVencimiento?: Date;
  diasParaVencimiento?: number;
  stockActual?: number;
  stockMinimo?: number;
  resuelta: boolean;
  fechaResolucion?: Date;
}

export interface ConfiguracionAlertas {
  alertaStockBajo: boolean;
  diasAlertaCaducidad: number[]; // [30, 60, 90] días antes
  notificacionesEmail: boolean;
  notificacionesSMS: boolean;
  notificacionesPush: boolean;
  limiteStockBajo: number; // Porcentaje sobre stock mínimo
}

export interface ReporteInventario {
  id: string;
  fecha: Date;
  tipo: 'stock_completo' | 'movimientos' | 'caducidades' | 'alertas' | 'analisis';
  periodo: 'diario' | 'semanal' | 'mensual' | 'personalizado';
  productos: number;
  valorTotal?: number;
  productosBajoStock: number;
  productosProximosVencer: number;
  productosVencidos: number;
  movimientosTotales: number;
  datos: any; // Datos específicos del reporte
}

export interface AuditoriaInventario {
  id: string;
  fecha: Date;
  usuario: string;
  ubicacion?: string;
  productosAuditados: AuditoriaProducto[];
  diferenciasEncontradas: number;
  estado: 'en_proceso' | 'completada' | 'revisada';
  observaciones?: string;
}

export interface AuditoriaProducto {
  productoId: string;
  productoNombre: string;
  stockSistema: number;
  stockFisico: number;
  diferencia: number;
  observaciones?: string;
}

export interface CategoriaProducto {
  id: string;
  nombre: string;
  descripcion?: string;
  tipoAlertaCaducidad: '30' | '60' | '90' | 'sin_caducidad';
  requiereCaducidad: boolean;
}

// Filtros y búsquedas
export interface FiltroProductos {
  busqueda?: string;
  categoria?: string;
  estado?: Producto['estado'];
  stockBajo?: boolean;
  proximosVencer?: boolean;
  ubicacion?: string;
  proveedor?: string;
}

export interface FiltroMovimientos {
  fechaInicio?: Date;
  fechaFin?: Date;
  productoId?: string;
  tipo?: MovimientoStock['tipo'];
  usuario?: string;
  ubicacion?: string;
}

export interface FiltroAlertas {
  tipo?: AlertaStock['tipo'];
  severidad?: AlertaStock['severidad'];
  resuelta?: boolean;
  productoId?: string;
}
