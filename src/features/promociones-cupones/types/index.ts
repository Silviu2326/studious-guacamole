// Tipos para el módulo de Promociones y Cupones

export interface Promocion {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'descuento_porcentaje' | 'descuento_fijo' | '2x1' | '3x2' | 'envio_gratis' | 'producto_gratis';
  valor: number; // Porcentaje o cantidad fija según el tipo
  fechaInicio: Date;
  fechaFin: Date;
  activa: boolean;
  aplicaA: 'todos' | 'categoria' | 'producto' | 'marca';
  categoriaId?: string;
  productoId?: string;
  marca?: string;
  minimoCompra?: number;
  maximoUso?: number;
  usoActual: number;
  destacada: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface CodigoPromocional {
  id: string;
  codigo: string;
  descripcion: string;
  tipo: 'descuento_porcentaje' | 'descuento_fijo' | 'envio_gratis';
  valor: number;
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
  usoMaximo: number;
  usoActual: number;
  usoPorCliente: number;
  minimoCompra?: number;
  productosExcluidos?: string[];
  categoriasExcluidas?: string[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Cupon {
  id: string;
  codigo: string;
  descripcion: string;
  tipo: 'descuento_porcentaje' | 'descuento_fijo' | 'envio_gratis' | 'producto_gratis';
  valor: number;
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
  usado: boolean;
  fechaUso?: Date;
  clienteId?: string;
  fechaCreacion: Date;
}

export interface PackTienda {
  id: string;
  nombre: string;
  descripcion: string;
  productos: Array<{
    productoId: string;
    cantidad: number;
    precioUnitario: number;
  }>;
  precioTotal: number;
  precioOriginal: number;
  descuento: number;
  imagen?: string;
  activo: boolean;
  destacado: boolean;
  stock: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface DescuentoProducto {
  id: string;
  productoId: string;
  nombreProducto: string;
  descuentoPorcentaje: number;
  precioOriginal: number;
  precioConDescuento: number;
  fechaInicio: Date;
  fechaFin: Date;
  activo: boolean;
  destacado: boolean;
  fechaCreacion: Date;
}

export interface FiltrosPromociones {
  busqueda?: string;
  tipo?: Promocion['tipo'];
  activa?: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
  destacada?: boolean;
}

export interface FiltrosCodigos {
  busqueda?: string;
  tipo?: CodigoPromocional['tipo'];
  activo?: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface FiltrosCupones {
  busqueda?: string;
  tipo?: Cupon['tipo'];
  activo?: boolean;
  usado?: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
}

export interface OrdenPromociones {
  campo: 'nombre' | 'fechaCreacion' | 'fechaInicio' | 'fechaFin' | 'usoActual' | 'valor';
  direccion: 'asc' | 'desc';
}

export interface PromocionesResponse {
  datos: Promocion[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface CodigosResponse {
  datos: CodigoPromocional[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface CuponesResponse {
  datos: Cupon[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface PromocionFormData {
  nombre: string;
  descripcion: string;
  tipo: Promocion['tipo'];
  valor: number;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  aplicaA: Promocion['aplicaA'];
  categoriaId?: string;
  productoId?: string;
  marca?: string;
  minimoCompra?: number;
  maximoUso?: number;
  destacada: boolean;
}

export interface CodigoFormData {
  codigo: string;
  descripcion: string;
  tipo: CodigoPromocional['tipo'];
  valor: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  usoMaximo: number;
  usoPorCliente: number;
  minimoCompra?: number;
  productosExcluidos?: string[];
  categoriasExcluidas?: string[];
}

