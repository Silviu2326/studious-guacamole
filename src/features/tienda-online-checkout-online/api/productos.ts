// ============================================================================
// API MOCK DE PRODUCTOS - CATÁLOGO DE ECOMMERCE
// ============================================================================
// Este módulo implementa funciones mock para gestionar productos, categorías,
// variantes y stock del catálogo de la tienda online.
//
// FUNCIONES USADAS EN:
// - TiendaOnline.tsx: getProductos(), getCategorias(), getProductoById()
// - Flujo de detalle/selector de variantes: getProductoById()
// - Gestión administrativa: createProducto(), updateProducto(), 
//   toggleActivoProducto(), actualizarStockProducto()
// ============================================================================

import { Producto, CategoriaProducto, VarianteProducto } from '../types';

// ============================================================================
// MOCK DATA: CATEGORÍAS
// ============================================================================
// Colección en memoria de categorías de productos del dominio de fitness
const CATEGORIAS_MOCK: CategoriaProducto[] = [
  {
    id: 'cat-sesiones-individuales',
    nombre: 'Sesiones Individuales',
    slug: 'sesiones-individuales',
    descripcionOpcional: 'Entrenamiento personalizado uno a uno',
    ordenOpcional: 1,
    visible: true,
  },
  {
    id: 'cat-bonos-paquetes',
    nombre: 'Bonos y Paquetes',
    slug: 'bonos-paquetes',
    descripcionOpcional: 'Paquetes con descuento para múltiples sesiones',
    ordenOpcional: 2,
    visible: true,
  },
  {
    id: 'cat-grupos-clases',
    nombre: 'Clases Grupales',
    slug: 'clases-grupales',
    descripcionOpcional: 'Entrenamiento en grupo con horarios fijos',
    ordenOpcional: 3,
    visible: true,
  },
  {
    id: 'cat-nutricion',
    nombre: 'Nutrición',
    slug: 'nutricion',
    descripcionOpcional: 'Consultas y planes nutricionales personalizados',
    ordenOpcional: 4,
    visible: true,
  },
  {
    id: 'cat-merchandising',
    nombre: 'Merchandising',
    slug: 'merchandising',
    descripcionOpcional: 'Productos físicos con el logo del gimnasio',
    ordenOpcional: 5,
    visible: true,
  },
  {
    id: 'cat-suplementos',
    nombre: 'Suplementos',
    slug: 'suplementos',
    descripcionOpcional: 'Suplementos nutricionales y deportivos',
    ordenOpcional: 6,
    visible: true,
  },
  {
    id: 'cat-suscripciones',
    nombre: 'Suscripciones',
    slug: 'suscripciones',
    descripcionOpcional: 'Planes mensuales con cargo recurrente',
    ordenOpcional: 7,
    visible: true,
  },
  {
    id: 'cat-rehabilitacion',
    nombre: 'Rehabilitación',
    slug: 'rehabilitacion',
    descripcionOpcional: 'Sesiones de recuperación y fisioterapia',
    ordenOpcional: 8,
    visible: true,
  },
];

// ============================================================================
// MOCK DATA: PRODUCTOS CON VARIANTES
// ============================================================================
// Colección en memoria de productos con sus variantes (tallas, duraciones, modalidades, etc.)
let PRODUCTOS_MOCK: Producto[] = [
  // SESIÓN INDIVIDUAL - Con variantes de duración y modalidad
  {
    id: 'prod-sesion-individual-60',
    nombre: 'Sesión Individual de Entrenamiento Personal',
    slug: 'sesion-individual-entrenamiento-personal',
    descripcionCorta: 'Sesión personalizada adaptada a tus objetivos',
    descripcionLargaOpcional: 'Sesión de entrenamiento personal de 60 minutos completamente adaptada a tus necesidades, objetivos y nivel físico. Incluye evaluación inicial, planificación y seguimiento.',
    categoriaId: 'cat-sesiones-individuales',
    tagsOpcionales: ['entrenamiento', 'personal', '60min'],
    precioBase: 50.00,
    activo: true,
    esDestacadoOpcional: true,
    imagenPrincipalUrlOpcional: '/images/productos/sesion-individual.jpg',
    imagenesSecundariasUrlsOpcionales: [
      '/images/productos/sesion-individual-2.jpg',
      '/images/productos/sesion-individual-3.jpg',
    ],
    variantes: [
      {
        id: 'var-60-presencial',
        nombre: '60 minutos - Presencial',
        skuOpcional: 'SES-60-PRE',
        atributos: { duracion: '60 minutos', modalidad: 'Presencial' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: undefined, // Servicio, sin stock
      },
      {
        id: 'var-60-online',
        nombre: '60 minutos - Online',
        skuOpcional: 'SES-60-ONL',
        atributos: { duracion: '60 minutos', modalidad: 'Online' },
        precioAdicionalOpcional: -10,
        stockDisponibleOpcional: undefined,
      },
      {
        id: 'var-45-presencial',
        nombre: '45 minutos - Presencial',
        skuOpcional: 'SES-45-PRE',
        atributos: { duracion: '45 minutos', modalidad: 'Presencial' },
        precioAdicionalOpcional: -10,
        stockDisponibleOpcional: undefined,
      },
      {
        id: 'var-90-presencial',
        nombre: '90 minutos - Presencial',
        skuOpcional: 'SES-90-PRE',
        atributos: { duracion: '90 minutos', modalidad: 'Presencial' },
        precioAdicionalOpcional: 20,
        stockDisponibleOpcional: undefined,
      },
    ],
    stockGeneralOpcional: undefined,
    tipo: 'servicio',
    requiereReservaSesionOpcional: true,
  },

  // BONO 5 SESIONES
  {
    id: 'prod-bono-5-sesiones',
    nombre: 'Bono 5 Sesiones de Entrenamiento Personal',
    slug: 'bono-5-sesiones-entrenamiento',
    descripcionCorta: 'Paquete de 5 sesiones con 10% de descuento',
    descripcionLargaOpcional: 'Compra 5 sesiones de entrenamiento personal y ahorra un 10%. Perfecto para un mes de entrenamiento regular. Las sesiones son válidas por 3 meses desde la fecha de compra.',
    categoriaId: 'cat-bonos-paquetes',
    tagsOpcionales: ['bono', 'paquete', 'descuento'],
    precioBase: 225.00, // 50 * 5 con 10% descuento
    activo: true,
    esDestacadoOpcional: true,
    imagenPrincipalUrlOpcional: '/images/productos/bono-5-sesiones.jpg',
    variantes: [
      {
        id: 'var-bono-5-standard',
        nombre: 'Bono 5 Sesiones Standard',
        skuOpcional: 'BONO-5-STD',
        atributos: { tipo: 'Standard', validez: '3 meses' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: undefined,
      },
    ],
    stockGeneralOpcional: undefined,
    tipo: 'bono',
    requiereReservaSesionOpcional: true,
  },

  // BONO 10 SESIONES
  {
    id: 'prod-bono-10-sesiones',
    nombre: 'Bono 10 Sesiones de Entrenamiento Personal',
    slug: 'bono-10-sesiones-entrenamiento',
    descripcionCorta: 'Paquete de 10 sesiones con 15% de descuento',
    descripcionLargaOpcional: 'Compra 10 sesiones de entrenamiento personal y ahorra un 15%. Ideal para un compromiso serio con tu entrenamiento. Las sesiones son válidas por 6 meses desde la fecha de compra.',
    categoriaId: 'cat-bonos-paquetes',
    tagsOpcionales: ['bono', 'paquete', 'descuento'],
    precioBase: 425.00, // 50 * 10 con 15% descuento
    activo: true,
    esDestacadoOpcional: false,
    imagenPrincipalUrlOpcional: '/images/productos/bono-10-sesiones.jpg',
    variantes: [
      {
        id: 'var-bono-10-standard',
        nombre: 'Bono 10 Sesiones Standard',
        skuOpcional: 'BONO-10-STD',
        atributos: { tipo: 'Standard', validez: '6 meses' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: undefined,
      },
    ],
    stockGeneralOpcional: undefined,
    tipo: 'bono',
    requiereReservaSesionOpcional: true,
  },

  // CLASE GRUPAL - Con variantes de horario
  {
    id: 'prod-clase-grupal-funcional',
    nombre: 'Clase Grupal de Entrenamiento Funcional',
    slug: 'clase-grupal-entrenamiento-funcional',
    descripcionCorta: 'Clase grupal de 45 minutos de entrenamiento funcional',
    descripcionLargaOpcional: 'Clase grupal dinámica de entrenamiento funcional de 45 minutos. Máximo 12 personas por clase. Se trabaja fuerza, resistencia, coordinación y agilidad.',
    categoriaId: 'cat-grupos-clases',
    tagsOpcionales: ['grupal', 'funcional', '45min'],
    precioBase: 15.00,
    activo: true,
    esDestacadoOpcional: false,
    imagenPrincipalUrlOpcional: '/images/productos/clase-grupal.jpg',
    variantes: [
      {
        id: 'var-clase-mañana',
        nombre: 'Horario Mañana (9:00-9:45)',
        skuOpcional: 'CLASE-FUN-MAN',
        atributos: { horario: 'Mañana', hora: '9:00' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 10, // Plazas disponibles
      },
      {
        id: 'var-clase-mediodia',
        nombre: 'Horario Mediodía (13:00-13:45)',
        skuOpcional: 'CLASE-FUN-MED',
        atributos: { horario: 'Mediodía', hora: '13:00' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 8,
      },
      {
        id: 'var-clase-tarde',
        nombre: 'Horario Tarde (19:00-19:45)',
        skuOpcional: 'CLASE-FUN-TAR',
        atributos: { horario: 'Tarde', hora: '19:00' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 12,
      },
    ],
    stockGeneralOpcional: 30, // Total de plazas
    tipo: 'servicio',
    requiereReservaSesionOpcional: true,
  },

  // BONO MENSUAL CLASES GRUPALES
  {
    id: 'prod-bono-mensual-clases',
    nombre: 'Bono Mensual de Clases Grupales',
    slug: 'bono-mensual-clases-grupales',
    descripcionCorta: 'Acceso ilimitado a clases grupales durante un mes',
    descripcionLargaOpcional: 'Bono mensual que te da acceso ilimitado a todas las clases grupales del gimnasio durante 30 días. Incluye: entrenamiento funcional, yoga, pilates, spinning y más.',
    categoriaId: 'cat-grupos-clases',
    tagsOpcionales: ['bono', 'mensual', 'ilimitado'],
    precioBase: 89.99,
    activo: true,
    esDestacadoOpcional: true,
    imagenPrincipalUrlOpcional: '/images/productos/bono-mensual.jpg',
    variantes: [
      {
        id: 'var-bono-mensual-standard',
        nombre: 'Bono Mensual Standard',
        skuOpcional: 'BONO-MES-STD',
        atributos: { periodo: '1 mes', tipo: 'Standard' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: undefined,
      },
    ],
    stockGeneralOpcional: undefined,
    tipo: 'bono',
    requiereReservaSesionOpcional: false,
  },

  // CONSULTA NUTRICIONAL
  {
    id: 'prod-consulta-nutricional',
    nombre: 'Consulta Nutricional Individual',
    slug: 'consulta-nutricional-individual',
    descripcionCorta: 'Consulta nutricional personalizada con plan de alimentación',
    descripcionLargaOpcional: 'Consulta nutricional individual con un nutricionista certificado. Incluye análisis de composición corporal, evaluación de hábitos alimentarios y plan de alimentación personalizado adaptado a tus objetivos.',
    categoriaId: 'cat-nutricion',
    tagsOpcionales: ['nutricion', 'consulta', 'personalizado'],
    precioBase: 45.00,
    activo: true,
    esDestacadoOpcional: false,
    imagenPrincipalUrlOpcional: '/images/productos/consulta-nutricional.jpg',
    variantes: [
      {
        id: 'var-consulta-presencial',
        nombre: 'Consulta Presencial',
        skuOpcional: 'NUT-PRE',
        atributos: { modalidad: 'Presencial' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: undefined,
      },
      {
        id: 'var-consulta-online',
        nombre: 'Consulta Online',
        skuOpcional: 'NUT-ONL',
        atributos: { modalidad: 'Online' },
        precioAdicionalOpcional: -5,
        stockDisponibleOpcional: undefined,
      },
    ],
    stockGeneralOpcional: undefined,
    tipo: 'servicio',
    requiereReservaSesionOpcional: true,
  },

  // PLAN NUTRICIONAL DIGITAL
  {
    id: 'prod-plan-nutricional-digital',
    nombre: 'Plan Nutricional Personalizado Digital',
    slug: 'plan-nutricional-digital',
    descripcionCorta: 'Plan completo de alimentación adaptado a tus objetivos (descarga digital)',
    descripcionLargaOpcional: 'Plan nutricional completo personalizado que recibirás por email en formato PDF. Incluye menú semanal, recetas, lista de compras y guía de porciones. Sin consulta presencial.',
    categoriaId: 'cat-nutricion',
    tagsOpcionales: ['nutricion', 'digital', 'plan'],
    precioBase: 59.99,
    activo: true,
    esDestacadoOpcional: false,
    imagenPrincipalUrlOpcional: '/images/productos/plan-nutricional.jpg',
    variantes: [
      {
        id: 'var-plan-digital-standard',
        nombre: 'Plan Digital Standard',
        skuOpcional: 'PLAN-DIG-STD',
        atributos: { formato: 'PDF', idioma: 'Español' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: undefined, // Digital, stock ilimitado
      },
    ],
    stockGeneralOpcional: undefined,
    tipo: 'producto',
    requiereReservaSesionOpcional: false,
  },

  // CAMISETA MERCHANDISING - Con variantes de talla y color
  {
    id: 'prod-camiseta-gimnasio',
    nombre: 'Camiseta Oficial del Gimnasio',
    slug: 'camiseta-oficial-gimnasio',
    descripcionCorta: 'Camiseta de algodón 100% con logo bordado',
    descripcionLargaOpcional: 'Camiseta de algodón 100% orgánico, cómoda y transpirable. Logo del gimnasio bordado en el pecho. Disponible en varios colores y tallas. Perfecta para entrenar y para el día a día.',
    categoriaId: 'cat-merchandising',
    tagsOpcionales: ['merch', 'ropa', 'camiseta'],
    precioBase: 24.99,
    activo: true,
    esDestacadoOpcional: false,
    imagenPrincipalUrlOpcional: '/images/productos/camiseta.jpg',
    imagenesSecundariasUrlsOpcionales: [
      '/images/productos/camiseta-azul.jpg',
      '/images/productos/camiseta-negra.jpg',
    ],
    variantes: [
      {
        id: 'var-camiseta-s-negro',
        nombre: 'Talla S - Negro',
        skuOpcional: 'CAM-S-NEG',
        atributos: { talla: 'S', color: 'Negro' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 15,
      },
      {
        id: 'var-camiseta-m-negro',
        nombre: 'Talla M - Negro',
        skuOpcional: 'CAM-M-NEG',
        atributos: { talla: 'M', color: 'Negro' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 20,
      },
      {
        id: 'var-camiseta-l-negro',
        nombre: 'Talla L - Negro',
        skuOpcional: 'CAM-L-NEG',
        atributos: { talla: 'L', color: 'Negro' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 18,
      },
      {
        id: 'var-camiseta-xl-negro',
        nombre: 'Talla XL - Negro',
        skuOpcional: 'CAM-XL-NEG',
        atributos: { talla: 'XL', color: 'Negro' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 12,
      },
      {
        id: 'var-camiseta-s-azul',
        nombre: 'Talla S - Azul',
        skuOpcional: 'CAM-S-AZU',
        atributos: { talla: 'S', color: 'Azul' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 10,
      },
      {
        id: 'var-camiseta-m-azul',
        nombre: 'Talla M - Azul',
        skuOpcional: 'CAM-M-AZU',
        atributos: { talla: 'M', color: 'Azul' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 16,
      },
      {
        id: 'var-camiseta-l-azul',
        nombre: 'Talla L - Azul',
        skuOpcional: 'CAM-L-AZU',
        atributos: { talla: 'L', color: 'Azul' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 14,
      },
    ],
    stockGeneralOpcional: 105, // Suma total de todas las variantes
    tipo: 'producto',
    requiereReservaSesionOpcional: false,
  },

  // SUPLEMENTO PROTEÍNA - Con variantes de sabor
  {
    id: 'prod-proteina-premium',
    nombre: 'Suplemento Proteína Premium',
    slug: 'suplemento-proteina-premium',
    descripcionCorta: 'Proteína en polvo de alta calidad, 2kg',
    descripcionLargaOpcional: 'Proteína de suero de leche (whey protein) de alta calidad, 2kg. 25g de proteína por servicio. Bajo en azúcar y grasa. Perfecta para la recuperación post-entrenamiento.',
    categoriaId: 'cat-suplementos',
    tagsOpcionales: ['suplemento', 'proteina', 'whey'],
    precioBase: 39.99,
    activo: true,
    esDestacadoOpcional: true,
    imagenPrincipalUrlOpcional: '/images/productos/proteina.jpg',
    variantes: [
      {
        id: 'var-proteina-vainilla',
        nombre: 'Sabor Vainilla',
        skuOpcional: 'PROT-2KG-VAI',
        atributos: { sabor: 'Vainilla', peso: '2kg' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 15,
      },
      {
        id: 'var-proteina-chocolate',
        nombre: 'Sabor Chocolate',
        skuOpcional: 'PROT-2KG-CHO',
        atributos: { sabor: 'Chocolate', peso: '2kg' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 20,
      },
      {
        id: 'var-proteina-fresa',
        nombre: 'Sabor Fresa',
        skuOpcional: 'PROT-2KG-FRE',
        atributos: { sabor: 'Fresa', peso: '2kg' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: 8,
      },
    ],
    stockGeneralOpcional: 43,
    tipo: 'producto',
    requiereReservaSesionOpcional: false,
  },

  // SUSCRIPCIÓN MENSUAL
  {
    id: 'prod-suscripcion-mensual',
    nombre: 'Plan Mensual de Entrenamiento Personal',
    slug: 'suscripcion-mensual-entrenamiento',
    descripcionCorta: 'Suscripción mensual con 4 sesiones. Cargo automático recurrente.',
    descripcionLargaOpcional: 'Plan de suscripción mensual que incluye 4 sesiones de entrenamiento personal. El cargo se realiza automáticamente cada mes. Puedes cancelar en cualquier momento con 7 días de antelación. Precio especial para el primer mes.',
    categoriaId: 'cat-suscripciones',
    tagsOpcionales: ['suscripcion', 'mensual', 'recurrente'],
    precioBase: 180.00,
    activo: true,
    esDestacadoOpcional: true,
    imagenPrincipalUrlOpcional: '/images/productos/suscripcion-mensual.jpg',
    variantes: [
      {
        id: 'var-suscripcion-standard',
        nombre: 'Suscripción Mensual Standard',
        skuOpcional: 'SUSC-MES-STD',
        atributos: { periodo: 'Mensual', sesiones: '4' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: undefined,
      },
    ],
    stockGeneralOpcional: undefined,
    tipo: 'suscripcion',
    requiereReservaSesionOpcional: true,
  },

  // SESIÓN REHABILITACIÓN
  {
    id: 'prod-sesion-rehabilitacion',
    nombre: 'Sesión de Recuperación y Movilidad',
    slug: 'sesion-recuperacion-movilidad',
    descripcionCorta: 'Sesión enfocada en recuperación muscular y mejora de movilidad',
    descripcionLargaOpcional: 'Sesión especializada de 60 minutos enfocada en la recuperación muscular, mejora de la movilidad y prevención de lesiones. Incluye técnicas de estiramiento, foam rolling y trabajo de movilidad articular.',
    categoriaId: 'cat-rehabilitacion',
    tagsOpcionales: ['rehabilitacion', 'recuperacion', 'movilidad'],
    precioBase: 40.00,
    activo: true,
    esDestacadoOpcional: false,
    imagenPrincipalUrlOpcional: '/images/productos/rehabilitacion.jpg',
    variantes: [
      {
        id: 'var-rehab-presencial',
        nombre: 'Sesión Presencial',
        skuOpcional: 'REHAB-PRE',
        atributos: { modalidad: 'Presencial' },
        precioAdicionalOpcional: 0,
        stockDisponibleOpcional: undefined,
      },
    ],
    stockGeneralOpcional: undefined,
    tipo: 'servicio',
    requiereReservaSesionOpcional: true,
  },
];

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Obtiene una lista de productos filtrados
 * 
 * USADO EN: TiendaOnline.tsx para mostrar el catálogo
 * 
 * @param filtros - Filtros opcionales para la búsqueda
 * @returns Promise con array de productos que cumplen los filtros
 */
export async function getProductos(
  filtros?: {
    categoriaId?: string;
    texto?: string;
    soloActivos?: boolean;
    soloDestacados?: boolean;
  }
): Promise<Producto[]> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let productosFiltrados = [...PRODUCTOS_MOCK];

  if (filtros) {
    // Filtrar por categoría
    if (filtros.categoriaId) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.categoriaId === filtros.categoriaId
      );
    }

    // Filtrar por texto de búsqueda (nombre, descripción, tags)
    if (filtros.texto) {
      const textoLower = filtros.texto.toLowerCase();
      productosFiltrados = productosFiltrados.filter(
        (p) =>
          p.nombre.toLowerCase().includes(textoLower) ||
          p.descripcionCorta.toLowerCase().includes(textoLower) ||
          p.descripcionLargaOpcional?.toLowerCase().includes(textoLower) ||
          p.tagsOpcionales?.some((tag) => tag.toLowerCase().includes(textoLower))
      );
    }

    // Filtrar solo activos
    if (filtros.soloActivos === true) {
      productosFiltrados = productosFiltrados.filter((p) => p.activo === true);
    }

    // Filtrar solo destacados
    if (filtros.soloDestacados === true) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.esDestacadoOpcional === true
      );
    }
  }

  return productosFiltrados;
}

/**
 * Obtiene un producto por su ID
 * 
 * USADO EN: 
 * - TiendaOnline.tsx cuando se hace clic en un producto para ver detalles
 * - Flujo de detalle de producto y selector de variantes
 * 
 * @param id - ID del producto a buscar
 * @returns Promise con el producto encontrado o null si no existe
 */
export async function getProductoById(id: string): Promise<Producto | null> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 200));

  const producto = PRODUCTOS_MOCK.find((p) => p.id === id);
  return producto || null;
}

/**
 * Alias de getProductoById para compatibilidad con código existente
 * 
 * USADO EN: codigosQR.ts, enlacesPago.ts
 */
export const getProducto = getProductoById;

/**
 * Obtiene todas las categorías de productos
 * 
 * USADO EN: TiendaOnline.tsx para mostrar el filtro de categorías
 * 
 * @returns Promise con array de categorías visibles
 */
export async function getCategorias(): Promise<CategoriaProducto[]> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 150));

  // Retornar solo categorías visibles, ordenadas por ordenOpcional
  return CATEGORIAS_MOCK.filter((c) => c.visible)
    .sort((a, b) => (a.ordenOpcional || 0) - (b.ordenOpcional || 0));
}

/**
 * Crea un nuevo producto
 * 
 * USADO EN: Gestión administrativa para agregar productos al catálogo
 * 
 * @param data - Datos del producto (sin ID, se genera automáticamente)
 * @returns Promise con el producto creado (con ID asignado)
 */
export async function createProducto(
  data: Omit<Producto, 'id'>
): Promise<Producto> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Generar ID único
  const nuevoId = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Crear el producto con el ID generado
  const nuevoProducto: Producto = {
    ...data,
    id: nuevoId,
  };

  // Agregar a la colección en memoria
  PRODUCTOS_MOCK.push(nuevoProducto);

  return nuevoProducto;
}

/**
 * Actualiza un producto existente
 * 
 * USADO EN: Gestión administrativa para editar productos del catálogo
 * 
 * @param id - ID del producto a actualizar
 * @param data - Datos parciales a actualizar
 * @returns Promise con el producto actualizado
 * @throws Error si el producto no existe
 */
export async function updateProducto(
  id: string,
  data: Partial<Producto>
): Promise<Producto> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 350));

  const indice = PRODUCTOS_MOCK.findIndex((p) => p.id === id);

  if (indice === -1) {
    throw new Error(`Producto con ID ${id} no encontrado`);
  }

  // Actualizar el producto manteniendo el ID original
  PRODUCTOS_MOCK[indice] = {
    ...PRODUCTOS_MOCK[indice],
    ...data,
    id: PRODUCTOS_MOCK[indice].id, // Asegurar que el ID no cambie
  };

  return PRODUCTOS_MOCK[indice];
}

/**
 * Activa o desactiva un producto
 * 
 * USADO EN: Gestión administrativa para mostrar/ocultar productos
 * 
 * @param id - ID del producto a modificar
 * @param activo - Nuevo estado (true = activo, false = inactivo)
 * @returns Promise con el producto actualizado
 * @throws Error si el producto no existe
 */
export async function toggleActivoProducto(
  id: string,
  activo: boolean
): Promise<Producto> {
  return updateProducto(id, { activo });
}

/**
 * Actualiza el stock de un producto
 * 
 * USADO EN: Gestión de inventario para actualizar existencias
 * 
 * @param id - ID del producto
 * @param nuevoStock - Nuevo valor de stock general
 * @returns Promise con el producto actualizado
 * @throws Error si el producto no existe
 */
export async function actualizarStockProducto(
  id: string,
  nuevoStock: number
): Promise<Producto> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 250));

  const producto = PRODUCTOS_MOCK.find((p) => p.id === id);

  if (!producto) {
    throw new Error(`Producto con ID ${id} no encontrado`);
  }

  // Actualizar stock general
  producto.stockGeneralOpcional = nuevoStock;

  // Si el producto tiene variantes, también podemos actualizar el stock total
  // calculándolo desde las variantes (opcional, depende de la lógica de negocio)
  if (producto.variantes.length > 0) {
    const stockTotalVariantes = producto.variantes.reduce(
      (suma, variante) => suma + (variante.stockDisponibleOpcional || 0),
      0
    );
    // El stock general podría ser diferente al de variantes, dependiendo de la lógica
  }

  return producto;
}
