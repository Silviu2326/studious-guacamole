// Tipos para el módulo de Catálogo de Productos

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal?: number;
  descuento?: number;
  categoria: string;
  subcategoria?: string;
  stock: number;
  stockMinimo: number;
  sku: string;
  codigo?: string;
  imagenes: string[];
  activo: boolean;
  destacado: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  proveedor?: string;
  marca?: string;
  unidadMedida: 'unidad' | 'kg' | 'litro' | 'gramo' | 'ml';
  tags: string[];
  especificaciones?: Record<string, string>;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  orden: number;
  activa: boolean;
  padre?: string; // ID de categoría padre para jerarquía
  subcategorias?: Categoria[];
  cantidadProductos: number;
}

export interface MovimientoStock {
  id: string;
  productoId: string;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'venta' | 'devolucion';
  cantidad: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  motivo: string;
  fecha: Date;
  usuario: string;
  referencia?: string; // ID de venta, compra, etc.
}

export interface AlertaStock {
  id: string;
  productoId: string;
  tipo: 'stock_bajo' | 'sin_stock' | 'stock_critico';
  mensaje: string;
  fecha: Date;
  leida: boolean;
  accionRequerida: boolean;
}

export interface FiltrosProductos {
  busqueda?: string;
  categoria?: string;
  subcategoria?: string;
  precioMin?: number;
  precioMax?: number;
  enStock?: boolean;
  activos?: boolean;
  destacados?: boolean;
  marca?: string;
  proveedor?: string;
  tags?: string[];
}

export interface OrdenProductos {
  campo: 'nombre' | 'precio' | 'stock' | 'fechaCreacion' | 'categoria';
  direccion: 'asc' | 'desc';
}

export interface EstadisticasProductos {
  totalProductos: number;
  productosActivos: number;
  productosInactivos: number;
  productosSinStock: number;
  productosStockBajo: number;
  valorTotalInventario: number;
  categoriaConMasProductos: string;
  promedioPrecios: number;
}

export interface ConfiguracionCatalogo {
  mostrarPrecios: boolean;
  mostrarStock: boolean;
  permitirVentaSinStock: boolean;
  alertasStockBajo: boolean;
  umbralStockBajo: number;
  moneda: string;
  iva: number;
  formatoSku: string;
}

// Tipos para formularios
export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  subcategoria?: string;
  stock: number;
  stockMinimo: number;
  sku: string;
  imagenes: File[];
  activo: boolean;
  destacado: boolean;
  proveedor?: string;
  marca?: string;
  unidadMedida: 'unidad' | 'kg' | 'litro' | 'gramo' | 'ml';
  tags: string[];
  especificaciones?: Record<string, string>;
}

export interface CategoriaFormData {
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  padre?: string;
  activa: boolean;
}

// Tipos para respuestas de API
export interface ProductosResponse {
  productos: Producto[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface CategoriasResponse {
  categorias: Categoria[];
  total: number;
}

export interface EstadisticasResponse {
  estadisticas: EstadisticasProductos;
  alertas: AlertaStock[];
  movimientosRecientes: MovimientoStock[];
}