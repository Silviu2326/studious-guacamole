// ============================================================================
// TIPOS BASE DEL MÓDULO TIENDA ONLINE Y CHECKOUT
// ============================================================================

/**
 * Categoría de producto
 * Consumido por: productos.ts, TiendaOnline.tsx
 */
export interface CategoriaProducto {
  id: string;
  nombre: string;
  slug: string;
  descripcionOpcional?: string;
  ordenOpcional?: number;
  visible: boolean;
}

/**
 * Variante de producto (ej: talla, color, etc.)
 * Consumido por: productos.ts, TiendaOnline.tsx, CarritoCompras.tsx, CheckoutManager.tsx
 */
export interface VarianteProducto {
  id: string;
  nombre: string;
  skuOpcional?: string;
  atributos: Record<string, string>; // ej: { talla: "M", color: "Rojo" }
  precioAdicionalOpcional?: number;
  stockDisponibleOpcional?: number;
}

/**
 * Producto base del catálogo
 * Consumido por: productos.ts, TiendaOnline.tsx, CarritoCompras.tsx, CheckoutManager.tsx
 */
export interface Producto {
  id: string;
  nombre: string;
  slug: string;
  descripcionCorta: string;
  descripcionLargaOpcional?: string;
  categoriaId: string;
  tagsOpcionales?: string[];
  precioBase: number;
  activo: boolean;
  esDestacadoOpcional?: boolean;
  imagenPrincipalUrlOpcional?: string;
  imagenesSecundariasUrlsOpcionales?: string[];
  variantes: VarianteProducto[];
  stockGeneralOpcional?: number;
  tipo: "servicio" | "producto" | "bono" | "suscripcion";
  requiereReservaSesionOpcional?: boolean;
}

/**
 * Item del carrito de compras
 * Consumido por: checkout.ts, CarritoCompras.tsx, CheckoutManager.tsx
 */
export interface ItemCarrito {
  id: string;
  productoId: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  importeSubtotal: number;
  varianteSeleccionadaOpcional?: VarianteProducto;
  notasOpcionales?: string;
}

/**
 * Estado de un pedido
 * Consumido por: checkout.ts, ventas.ts, CheckoutManager.tsx, GestorVentas.tsx
 */
export type EstadoPedido = 
  | "borrador" 
  | "pendiente_pago" 
  | "pagado" 
  | "cancelado" 
  | "fallido" 
  | "reembolsado";

/**
 * Método de pago disponible
 * Consumido por: checkout.ts, CheckoutManager.tsx
 */
export type MetodoPago = 
  | "tarjeta" 
  | "transferencia" 
  | "paypal" 
  | "bizum" 
  | "efectivo" 
  | "bono" 
  | "pago_fraccionado";

/**
 * Pedido/Orden de compra
 * Consumido por: checkout.ts, ventas.ts, CheckoutManager.tsx, GestorVentas.tsx
 */
export interface Pedido {
  id: string;
  numeroPedido: string;
  clienteIdOpcional?: string;
  emailCliente: string;
  items: ItemCarrito[];
  importeProductos: number;
  impuestos: number;
  gastosEnvio: number;
  descuentosTotales: number;
  importeTotal: number;
  moneda: string;
  estado: EstadoPedido;
  metodoPago: MetodoPago;
  createdAt: Date;
  updatedAt: Date;
  notasOpcionales?: string;
}

/**
 * Bono (regalo o prepago)
 * Consumido por: bonos.ts, checkout.ts, GestorBonosClientes.tsx, CheckoutManager.tsx
 */
export interface Bono {
  id: string;
  codigo: string;
  tipo: "regalo" | "prepago";
  saldoInicial: number;
  saldoRestante: number;
  fechaCaducidadOpcional?: Date;
  esB2BOpcional?: boolean;
}

/**
 * Código promocional/descuento
 * Consumido por: codigosPromocionales.ts, checkout.ts, GestorCodigosPromocionales.tsx, CheckoutManager.tsx
 */
export interface CodigoPromocional {
  id: string;
  codigo: string;
  tipoDescuento: "porcentaje" | "importe_fijo";
  valorDescuento: number;
  minimoCompraOpcional?: number;
  maxUsosTotalesOpcional?: number;
  maxUsosPorClienteOpcional?: number;
  validoDesdeOpcional?: Date;
  validoHastaOpcional?: Date;
  soloPrimerPedidoOpcional?: boolean;
  soloCategoriasIdsOpcionales?: string[];
  soloProductosIdsOpcionales?: string[];
  activo: boolean;
}

/**
 * Oferta especial (tiempo limitado, volumen, bundle, flash)
 * Consumido por: ofertasEspeciales.ts, productos.ts, TiendaOnline.tsx, GestorOfertasEspeciales.tsx
 */
export interface OfertaEspecial {
  id: string;
  nombre: string;
  descripcionOpcional?: string;
  tipo: "tiempo_limitado" | "volumen" | "bundle" | "flash";
  fechaInicio: Date;
  fechaFin: Date;
  productosIds: string[];
  reglasDescuento: any; // Preparado para ser refinado por utils de descuentos
  activa: boolean;
}

/**
 * Valoración/Review de producto
 * Consumido por: valoraciones.ts, productos.ts, TiendaOnline.tsx, ValoracionesProducto.tsx
 */
export interface Valoracion {
  id: string;
  productoId: string;
  clienteIdOpcional?: string;
  nombreMostradoOpcional?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comentarioOpcional?: string;
  verificado: boolean;
  createdAt: Date;
}

/**
 * Enlace de pago público
 * Consumido por: enlacesPago.ts, CheckoutPublicoPage.tsx, GeneradorEnlacesPago.tsx
 */
export interface EnlacePago {
  id: string;
  slugPublico: string;
  descripcionOpcional?: string;
  importe: number;
  moneda: string;
  clienteIdOpcional?: string;
  fechaCaducidadOpcional?: Date;
  urlPublica: string;
  activo: boolean;
  metadataOpcional?: Record<string, any>;
}

// ============================================================================
// TIPOS ADICIONALES Y COMPLEMENTARIOS
// ============================================================================

export interface DescuentoPorCantidad {
  cantidadMinima: number;
  porcentajeDescuento: number;
  descripcion?: string;
}

// Opciones personalizables para servicios
export interface OpcionPersonalizable {
  id: string;
  nombre: string;
  tipo: 'duracion' | 'modalidad' | 'nivel';
  valores: OpcionValor[];
  requerida: boolean;
}

export interface OpcionValor {
  id: string;
  nombre: string;
  modificadorPrecio?: number; // Modificador de precio en euros (puede ser positivo o negativo)
  modificadorPorcentaje?: number; // Modificador de precio en porcentaje
  disponible: boolean;
}

// Información de suscripción
export interface InformacionSuscripcion {
  esSuscripcion: boolean;
  cicloFacturacion: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  cargoAutomatico: boolean;
  periodoGracia?: number; // Días de gracia antes de cancelar
  precioInicial?: number; // Precio especial para el primer período
  descuentoRenovacion?: number; // Descuento por renovación automática
}

// Tipo detallado de producto (complementario al tipo base Producto)
// Mantenido para compatibilidad con componentes existentes
export interface ProductoDetallado {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria: string;
  tipo: 'servicio' | 'producto-fisico' | 'producto-digital';
  stock?: number;
  disponible: boolean;
  rolPermitido: 'entrenador' | 'gimnasio' | 'ambos';
  metadatos?: {
    duracion?: string;
    planMensual?: boolean;
    envio?: boolean;
    accesoDigital?: boolean;
    sesiones?: number; // Número de sesiones para servicios
    esBono?: boolean; // Indica si es un bono de múltiples sesiones
    descuentosPorCantidad?: DescuentoPorCantidad[]; // Descuentos automáticos por cantidad
    suscripcion?: InformacionSuscripcion; // Información de suscripción
    opcionesPersonalizables?: OpcionPersonalizable[]; // Opciones personalizables del servicio
    permitePagoFraccionado?: boolean; // Permite pago en cuotas
    montoMinimoPagoFraccionado?: number; // Monto mínimo para pago fraccionado
    planesPagoFraccionado?: PlanPagoFraccionado[]; // Planes de pago disponibles
  };
  estadisticasValoraciones?: EstadisticasValoraciones; // Estadísticas de valoraciones (opcional, se carga dinámicamente)
}

// Opciones seleccionadas para un item del carrito
export interface OpcionesSeleccionadas {
  [opcionId: string]: string; // opcionId -> valorId seleccionado
}

export interface CarritoItem {
  producto: ProductoDetallado;
  cantidad: number;
  subtotal: number;
  descuentoAplicado?: number; // Descuento aplicado en euros
  porcentajeDescuento?: number; // Porcentaje de descuento aplicado
  precioUnitarioConDescuento?: number; // Precio unitario después del descuento
  opcionesSeleccionadas?: OpcionesSeleccionadas; // Opciones personalizables seleccionadas
  precioBase?: number; // Precio base antes de aplicar opciones
  modificadorPrecioOpciones?: number; // Modificador total de precio por opciones
}

export interface Carrito {
  items: CarritoItem[];
  subtotal: number;
  descuentoTotal: number; // Descuento total aplicado
  descuentoCodigoPromocional?: number; // Descuento del código promocional
  codigoPromocional?: CodigoPromocional; // Código promocional aplicado
  descuentoFidelidad?: number; // Descuento por fidelidad de cliente recurrente
  porcentajeDescuentoFidelidad?: number; // Porcentaje de descuento de fidelidad aplicado
  descuentoReferido?: number; // Descuento por código de referido
  codigoReferido?: string; // Código de referido aplicado
  impuestos: number;
  total: number;
}

export interface CategoriaEntrenamiento {
  id: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  color?: string;
}

// Tipo detallado de método de pago (complementario al tipo base MetodoPago)
// Mantenido para compatibilidad con componentes existentes
export interface MetodoPagoDetallado {
  id: string;
  nombre: string;
  tipo: 'tarjeta' | 'paypal' | 'transferencia';
  disponible: boolean;
  icono?: string;
}

export interface DatosCheckout {
  nombre: string;
  email: string;
  telefono: string;
  metodoPago: string;
  terminosAceptados: boolean;
  fechaVencimientoBonos?: Date; // Fecha de caducidad para bonos comprados
  aceptaCargoRecurrente?: boolean; // Aceptación de cargo recurrente para suscripciones
  fechaInicioSuscripcion?: Date; // Fecha de inicio de suscripción
  pagoFraccionado?: PagoFraccionadoSeleccionado; // Plan de pago fraccionado seleccionado
  codigoReferido?: string; // Código de referido aplicado
}

export interface Suscripcion {
  id: string;
  ventaId: string;
  productoId: string;
  clienteId: string;
  clienteEmail: string;
  fechaInicio: Date;
  fechaProximoCargo: Date;
  cicloFacturacion: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  precio: number;
  estado: 'activa' | 'pausada' | 'cancelada' | 'vencida';
  metodoPagoId: string;
  cargoAutomatico: boolean;
}

export interface Venta {
  id: string;
  fecha: Date;
  cliente: {
    nombre: string;
    email: string;
  };
  productos: CarritoItem[];
  subtotal: number;
  impuestos: number;
  total: number;
  metodoPago: string;
  estado: 'pendiente' | 'completada' | 'cancelada' | 'reembolsada';
  facturaId?: string;
  tracking?: string;
  suscripcionId?: string; // ID de suscripción si la venta creó una suscripción
  pagoFraccionadoId?: string; // ID del plan de pago fraccionado si aplica
}

export interface FiltrosProductos {
  categoria?: string;
  tipo?: 'servicio' | 'producto-fisico' | 'producto-digital';
  busqueda?: string;
  precioMin?: number;
  precioMax?: number;
  disponible?: boolean;
}

// User Story 1: Datos guardados para clientes recurrentes
export interface DatosCheckoutGuardados {
  clienteEmail: string;
  nombre: string;
  telefono: string;
  metodoPago: string;
  fechaUltimaCompra: Date;
  numeroCompras: number;
}

// User Story 1: Información de descuento de fidelidad
export interface DescuentoFidelidad {
  porcentajeDescuento: number;
  descripcion: string;
  nivelFidelidad: 'nuevo' | 'recurrente' | 'vip' | 'premium';
  numeroCompras: number;
}

// User Story 2: Valoraciones y comentarios de productos
export interface ValoracionProducto {
  id: string;
  productoId: string;
  clienteNombre: string;
  clienteEmail: string;
  rating: number; // 1-5
  comentario?: string;
  fecha: Date;
  verificada: boolean; // Si la compra fue verificada
  ventaId?: string; // ID de la venta asociada (opcional)
}

export interface EstadisticasValoraciones {
  promedio: number;
  totalValoraciones: number;
  distribucion: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// User Story 2: Enlaces de pago directo
export interface EnlacePagoDirecto {
  id: string;
  token: string; // Token único para el enlace
  entrenadorId: string;
  productoId: string;
  producto: ProductoDetallado;
  cantidad?: number; // Cantidad por defecto (opcional)
  opcionesSeleccionadas?: OpcionesSeleccionadas; // Opciones pre-seleccionadas
  descripcion?: string; // Descripción personalizada del enlace
  fechaCreacion: Date;
  fechaExpiracion?: Date; // Fecha de expiración opcional
  activo: boolean;
  vecesUsado: number;
  vecesMaximas?: number; // Límite de usos (opcional)
  url: string; // URL completa del enlace
}

// Nota: El tipo base CodigoPromocional está definido arriba en la sección de tipos base

export interface ValidacionCodigoPromocional {
  valido: boolean;
  codigo?: CodigoPromocional;
  error?: string;
}

// User Story: Códigos QR para servicios
export interface CodigoQR {
  id: string;
  servicioId: string; // ID del servicio/producto
  servicio: ProductoDetallado; // Información del servicio
  entrenadorId: string;
  token: string; // Token único para el código QR
  url: string; // URL completa para el pago
  fechaCreacion: Date;
  activo: boolean;
  vecesUsado: number;
  descripcion?: string; // Descripción opcional del código QR
  imagenQR?: string; // Base64 o URL de la imagen QR generada
}

// User Story: Pago fraccionado en cuotas
export interface PlanPagoFraccionado {
  id: string;
  numeroCuotas: number; // 2, 3, 4, 6, 12, etc.
  porcentajeInteres?: number; // Interés aplicado (opcional, puede ser 0)
  descripcion: string; // Ej: "3 cuotas sin intereses"
  disponible: boolean;
  montoMinimo?: number; // Monto mínimo para aplicar este plan
}

export interface PagoFraccionadoSeleccionado {
  planId: string;
  numeroCuotas: number;
  montoPorCuota: number;
  montoTotal: number;
  porcentajeInteres?: number;
  fechaPrimeraCuota: Date;
  fechasCuotas: Date[];
}

// User Story: Programa de Referidos
export interface ProgramaReferidos {
  id: string;
  entrenadorId: string;
  activo: boolean;
  descuentoReferido: {
    tipo: 'porcentual' | 'fijo';
    valor: number; // Porcentaje (0-100) o cantidad fija en euros
  };
  descuentoReferente: {
    tipo: 'porcentual' | 'fijo';
    valor: number; // Porcentaje (0-100) o cantidad fija en euros
  };
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Referido {
  id: string;
  codigoReferido: string;
  referenteId: string; // ID del cliente que refirió
  referenteEmail: string;
  referenteNombre: string;
  referidoId?: string; // ID del cliente referido (se asigna cuando completa la compra)
  referidoEmail?: string;
  referidoNombre?: string;
  ventaId?: string; // ID de la venta cuando el referido completa una compra
  estado: 'pendiente' | 'convertido' | 'recompensado';
  descuentoAplicadoReferido?: number; // Descuento aplicado al referido
  descuentoAplicadoReferente?: number; // Descuento aplicado al referente
  fechaCreacion: Date;
  fechaConversion?: Date;
  fechaRecompensa?: Date;
}

export interface ValidacionCodigoReferido {
  valido: boolean;
  codigo?: string;
  referenteNombre?: string;
  descuento?: {
    tipo: 'porcentual' | 'fijo';
    valor: number;
  };
  error?: string;
}

// User Story: Bonos regalo personalizados para empresas (B2B)
export interface BonoRegaloB2B {
  id: string;
  empresaId?: string; // ID de la empresa (opcional)
  empresaNombre: string;
  empresaEmail: string;
  empresaTelefono?: string;
  empresaCIF?: string; // CIF/NIF de la empresa
  entrenadorId: string;
  productoId: string;
  producto: ProductoDetallado;
  cantidadBonos: number; // Cantidad de bonos a generar
  valorPorBono: number; // Valor de cada bono
  fechaVencimiento: Date;
  personalizacion?: {
    mensajePersonalizado?: string; // Mensaje en el bono
    logoEmpresa?: string; // URL o base64 del logo
    colorPersonalizado?: string; // Color de marca
    descripcionPersonalizada?: string;
  };
  fechaCreacion: Date;
  estado: 'pendiente' | 'generado' | 'enviado' | 'utilizado' | 'vencido';
  bonosGenerados?: string[]; // IDs de los bonos generados
  codigosBonos?: string[]; // Códigos únicos de los bonos
}

export interface CrearBonoRegaloB2BRequest {
  empresaNombre: string;
  empresaEmail: string;
  empresaTelefono?: string;
  empresaCIF?: string;
  productoId: string;
  cantidadBonos: number;
  valorPorBono?: number; // Opcional, si no se especifica usa el precio del producto
  fechaVencimiento: Date;
  personalizacion?: {
    mensajePersonalizado?: string;
    logoEmpresa?: string;
    colorPersonalizado?: string;
    descripcionPersonalizada?: string;
  };
}

