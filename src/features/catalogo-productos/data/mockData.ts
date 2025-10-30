import { Producto, Categoria, MovimientoStock, AlertaStock } from '../types';

export const categoriasMock: Categoria[] = [
  {
    id: '1',
    nombre: 'Suplementos',
    descripcion: 'Suplementos deportivos y nutricionales',
    icono: 'Pill',
    color: '#10B981',
    orden: 1,
    activa: true,
    cantidadProductos: 15,
    subcategorias: [
      {
        id: '1-1',
        nombre: 'Proteínas',
        descripcion: 'Proteínas en polvo y barras',
        icono: 'Zap',
        color: '#10B981',
        orden: 1,
        activa: true,
        padre: '1',
        cantidadProductos: 8
      },
      {
        id: '1-2',
        nombre: 'Pre-entrenos',
        descripcion: 'Suplementos pre-entreno',
        icono: 'Zap',
        color: '#F59E0B',
        orden: 2,
        activa: true,
        padre: '1',
        cantidadProductos: 4
      },
      {
        id: '1-3',
        nombre: 'Vitaminas',
        descripcion: 'Vitaminas y minerales',
        icono: 'Heart',
        color: '#EF4444',
        orden: 3,
        activa: true,
        padre: '1',
        cantidadProductos: 3
      }
    ]
  },
  {
    id: '2',
    nombre: 'Ropa Deportiva',
    descripcion: 'Indumentaria deportiva y casual',
    icono: 'Shirt',
    color: '#6366F1',
    orden: 2,
    activa: true,
    cantidadProductos: 12,
    subcategorias: [
      {
        id: '2-1',
        nombre: 'Camisetas',
        descripcion: 'Camisetas deportivas',
        icono: 'Shirt',
        color: '#6366F1',
        orden: 1,
        activa: true,
        padre: '2',
        cantidadProductos: 6
      },
      {
        id: '2-2',
        nombre: 'Pantalones',
        descripcion: 'Pantalones y shorts deportivos',
        icono: 'Shirt',
        color: '#8B5CF6',
        orden: 2,
        activa: true,
        padre: '2',
        cantidadProductos: 6
      }
    ]
  },
  {
    id: '3',
    nombre: 'Accesorios',
    descripción: 'Accesorios para entrenamiento',
    icono: 'Dumbbell',
    color: '#F59E0B',
    orden: 3,
    activa: true,
    cantidadProductos: 8
  },
  {
    id: '4',
    nombre: 'Merchandising',
    descripcion: 'Productos con logo del gimnasio',
    icono: 'Award',
    color: '#EF4444',
    orden: 4,
    activa: true,
    cantidadProductos: 6
  },
  {
    id: '5',
    nombre: 'Bebidas',
    descripcion: 'Bebidas deportivas e isotónicas',
    icono: 'Coffee',
    color: '#3B82F6',
    orden: 5,
    activa: true,
    cantidadProductos: 5
  }
];

export const productosMock: Producto[] = [
  // Suplementos - Proteínas
  {
    id: '1',
    nombre: 'Whey Protein Isolate',
    descripcion: 'Proteína de suero aislada de alta calidad, 25g de proteína por porción',
    precio: 45.99,
    categoria: '1',
    subcategoria: '1-1',
    stock: 25,
    stockMinimo: 5,
    sku: 'SUP-WPI-001',
    imagenes: ['/images/whey-protein.jpg'],
    activo: true,
    destacado: true,
    fechaCreacion: new Date('2024-01-15'),
    fechaActualizacion: new Date('2024-01-20'),
    proveedor: 'NutriSport',
    marca: 'ProFit',
    unidadMedida: 'kg',
    tags: ['proteína', 'suero', 'músculo', 'recuperación'],
    especificaciones: {
      'Sabor': 'Vainilla',
      'Peso': '1kg',
      'Porciones': '33',
      'Proteína por porción': '25g'
    }
  },
  {
    id: '2',
    nombre: 'Creatina Monohidrato',
    descripcion: 'Creatina pura micronizada para aumentar fuerza y potencia',
    precio: 19.99,
    categoria: '1',
    subcategoria: '1-2',
    stock: 40,
    stockMinimo: 10,
    sku: 'SUP-CRE-001',
    imagenes: ['/images/creatina.jpg'],
    activo: true,
    destacado: false,
    fechaCreacion: new Date('2024-01-10'),
    fechaActualizacion: new Date('2024-01-18'),
    proveedor: 'SupplementMax',
    marca: 'PowerLift',
    unidadMedida: 'gramo',
    tags: ['creatina', 'fuerza', 'potencia', 'rendimiento'],
    especificaciones: {
      'Peso': '300g',
      'Porciones': '60',
      'Creatina por porción': '5g'
    }
  },
  // Ropa Deportiva
  {
    id: '3',
    nombre: 'Camiseta Técnica FitGym',
    descripcion: 'Camiseta técnica con tecnología Dri-FIT, logo del gimnasio bordado',
    precio: 24.99,
    categoria: '2',
    subcategoria: '2-1',
    stock: 15,
    stockMinimo: 5,
    sku: 'ROD-CAM-001',
    imagenes: ['/images/camiseta-fitgym.jpg'],
    activo: true,
    destacado: true,
    fechaCreacion: new Date('2024-01-12'),
    fechaActualizacion: new Date('2024-01-19'),
    marca: 'FitGym',
    unidadMedida: 'unidad',
    tags: ['camiseta', 'técnica', 'logo', 'gimnasio'],
    especificaciones: {
      'Talla': 'M',
      'Color': 'Negro',
      'Material': '100% Poliéster',
      'Tecnología': 'Dri-FIT'
    }
  },
  {
    id: '4',
    nombre: 'Shorts de Entrenamiento',
    descripcion: 'Shorts cómodos para entrenamiento con bolsillos laterales',
    precio: 29.99,
    categoria: '2',
    subcategoria: '2-2',
    stock: 8,
    stockMinimo: 5,
    sku: 'ROD-SHO-001',
    imagenes: ['/images/shorts-entrenamiento.jpg'],
    activo: true,
    destacado: false,
    fechaCreacion: new Date('2024-01-14'),
    fechaActualizacion: new Date('2024-01-21'),
    marca: 'SportWear',
    unidadMedida: 'unidad',
    tags: ['shorts', 'entrenamiento', 'cómodo', 'bolsillos'],
    especificaciones: {
      'Talla': 'L',
      'Color': 'Azul marino',
      'Material': '90% Poliéster, 10% Elastano'
    }
  },
  // Accesorios
  {
    id: '5',
    nombre: 'Guantes de Entrenamiento',
    descripcion: 'Guantes acolchados para levantamiento de pesas',
    precio: 15.99,
    categoria: '3',
    stock: 20,
    stockMinimo: 8,
    sku: 'ACC-GUA-001',
    imagenes: ['/images/guantes-entrenamiento.jpg'],
    activo: true,
    destacado: false,
    fechaCreacion: new Date('2024-01-16'),
    fechaActualizacion: new Date('2024-01-22'),
    marca: 'GripMax',
    unidadMedida: 'unidad',
    tags: ['guantes', 'pesas', 'protección', 'agarre'],
    especificaciones: {
      'Talla': 'M',
      'Material': 'Cuero sintético',
      'Acolchado': 'Gel'
    }
  },
  // Merchandising
  {
    id: '6',
    nombre: 'Botella de Agua FitGym',
    descripcion: 'Botella de agua deportiva con logo del gimnasio, 750ml',
    precio: 12.99,
    categoria: '4',
    stock: 30,
    stockMinimo: 10,
    sku: 'MER-BOT-001',
    imagenes: ['/images/botella-fitgym.jpg'],
    activo: true,
    destacado: true,
    fechaCreacion: new Date('2024-01-11'),
    fechaActualizacion: new Date('2024-01-17'),
    marca: 'FitGym',
    unidadMedida: 'unidad',
    tags: ['botella', 'agua', 'logo', 'deportiva'],
    especificaciones: {
      'Capacidad': '750ml',
      'Material': 'Tritan libre de BPA',
      'Color': 'Negro con logo blanco'
    }
  },
  // Bebidas
  {
    id: '7',
    nombre: 'Bebida Isotónica',
    descripcion: 'Bebida isotónica sabor naranja, rica en electrolitos',
    precio: 2.50,
    categoria: '5',
    stock: 50,
    stockMinimo: 20,
    sku: 'BEB-ISO-001',
    imagenes: ['/images/isotonica-naranja.jpg'],
    activo: true,
    destacado: false,
    fechaCreacion: new Date('2024-01-13'),
    fechaActualizacion: new Date('2024-01-20'),
    marca: 'HydroSport',
    unidadMedida: 'litro',
    tags: ['isotónica', 'electrolitos', 'naranja', 'hidratación'],
    especificaciones: {
      'Sabor': 'Naranja',
      'Volumen': '500ml',
      'Calorías': '25 kcal'
    }
  },
  // Producto con stock bajo para alertas
  {
    id: '8',
    nombre: 'Cinturón de Levantamiento',
    descripcion: 'Cinturón de cuero para levantamiento de pesas pesadas',
    precio: 39.99,
    categoria: '3',
    stock: 2,
    stockMinimo: 5,
    sku: 'ACC-CIN-001',
    imagenes: ['/images/cinturon-levantamiento.jpg'],
    activo: true,
    destacado: false,
    fechaCreacion: new Date('2024-01-09'),
    fechaActualizacion: new Date('2024-01-23'),
    marca: 'PowerBelt',
    unidadMedida: 'unidad',
    tags: ['cinturón', 'levantamiento', 'cuero', 'soporte'],
    especificaciones: {
      'Talla': 'L',
      'Material': 'Cuero genuino',
      'Ancho': '10cm'
    }
  }
];

export const movimientosStockMock: MovimientoStock[] = [
  {
    id: '1',
    productoId: '1',
    tipo: 'entrada',
    cantidad: 10,
    cantidadAnterior: 15,
    cantidadNueva: 25,
    motivo: 'Reposición de stock',
    fecha: new Date('2024-01-20'),
    usuario: 'admin',
    referencia: 'COMP-001'
  },
  {
    id: '2',
    productoId: '3',
    tipo: 'venta',
    cantidad: 2,
    cantidadAnterior: 17,
    cantidadNueva: 15,
    motivo: 'Venta en mostrador',
    fecha: new Date('2024-01-19'),
    usuario: 'vendedor1',
    referencia: 'VENTA-045'
  },
  {
    id: '3',
    productoId: '8',
    tipo: 'salida',
    cantidad: 3,
    cantidadAnterior: 5,
    cantidadNueva: 2,
    motivo: 'Producto defectuoso',
    fecha: new Date('2024-01-18'),
    usuario: 'admin',
    referencia: 'DEV-002'
  }
];

export const alertasStockMock: AlertaStock[] = [
  {
    id: '1',
    productoId: '8',
    tipo: 'stock_bajo',
    mensaje: 'El producto "Cinturón de Levantamiento" tiene stock bajo (2 unidades)',
    fecha: new Date('2024-01-23'),
    leida: false,
    accionRequerida: true
  },
  {
    id: '2',
    productoId: '4',
    tipo: 'stock_bajo',
    mensaje: 'El producto "Shorts de Entrenamiento" tiene stock bajo (8 unidades)',
    fecha: new Date('2024-01-22'),
    leida: false,
    accionRequerida: true
  }
];