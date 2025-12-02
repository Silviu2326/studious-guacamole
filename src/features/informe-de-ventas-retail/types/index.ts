// Tipos TypeScript para el módulo de Informe de Ventas Retail

export interface VentaRetail {
  id: string;
  productoId: string;
  productoNombre: string;
  categoria: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  total: number;
  fecha: string;
  empleadoId: string;
  empleadoNombre: string;
  clienteId?: string;
  clienteNombre?: string;
  horario: string;
}

export interface ReporteRetail {
  periodo: {
    inicio: string;
    fin: string;
  };
  ventas: VentaRetail[];
  totalVentas: number;
  totalUnidades: number;
  ticketPromedio: number;
  tipoReporte: 'producto' | 'categoria' | 'periodo' | 'empleado' | 'horario' | 'cliente' | 'comparativa';
}

export interface AnalisisVentas {
  productosMasVendidos: {
    productoId: string;
    productoNombre: string;
    cantidadVendida: number;
    ingresos: number;
    tendencia: 'up' | 'down' | 'neutral';
  }[];
  tendencias: {
    fecha: string;
    ventas: number;
    unidades: number;
  }[];
  patronesEstacionales: {
    mes: string;
    ventas: number;
    porcentajeVariacion: number;
  }[];
  comparativaProductos: {
    productoId: string;
    productoNombre: string;
    ventasActual: number;
    ventasAnterior: number;
    variacion: number;
  }[];
}

export interface MetricaRetail {
  id: string;
  nombre: string;
  valor: number;
  unidad?: string;
  tendencia?: {
    valor: number;
    direccion: 'up' | 'down' | 'neutral';
    periodo: string;
  };
  tipo: 'conversion' | 'valor' | 'inventario' | 'rentabilidad' | 'rendimiento' | 'tiempo';
}

export interface MetricasRetailData {
  conversionRate: number;
  ticketPromedio: number;
  valorPorCliente: number;
  ltv: number;
  rotacionInventario: number;
  diasStock: number;
  stockMuerto: number;
  margenBruto: number;
  margenNeto: number;
  roiProducto: number;
  ventasPorEmpleado: number;
  ventasPorMetroCuadrado: number;
  ventasPorHora: {
    hora: string;
    ventas: number;
  }[];
  picosActividad: {
    hora: string;
    ventas: number;
  }[];
}

export interface ProductoRentabilidad {
  productoId: string;
  productoNombre: string;
  categoria: string;
  ingresos: number;
  costos: number;
  margenBruto: number;
  margenNeto: number;
  roi: number;
  costoAlmacenamiento: number;
  rotacion: number;
  recomendacion: 'aumentar-precio' | 'promocionar' | 'reducir-stock' | 'mantener' | 'eliminar';
}

export interface DashboardVentasData {
  kpis: {
    ventasTotales: number;
    ticketPromedio: number;
    conversionRate: number;
    unidadesVendidas: number;
    margenBruto: number;
    ventasPorEmpleado: number;
  };
  alertas: {
    id: string;
    tipo: 'bajo-stock' | 'baja-rotacion' | 'bajo-margen' | 'stock-muerto';
    mensaje: string;
    severidad: 'alta' | 'media' | 'baja';
  }[];
  recomendaciones: {
    id: string;
    tipo: 'precio' | 'stock' | 'promocion' | 'eliminacion';
    mensaje: string;
    accion: string;
  }[];
  tendencias: {
    fecha: string;
    ventas: number;
    unidades: number;
  }[];
}

export interface FiltrosReporte {
  periodo: {
    inicio: string;
    fin: string;
  };
  categoria?: string;
  productoId?: string;
  empleadoId?: string;
  tipoReporte?: ReporteRetail['tipoReporte'];
}

