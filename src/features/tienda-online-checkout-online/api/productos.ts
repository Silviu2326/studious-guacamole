import { Producto, FiltrosProductos } from '../types';

// Mock data para productos con categorías específicas de entrenamiento
const PRODUCTOS_ENTRENADOR: Producto[] = [
  // Categoría: Entrenamiento Personal
  {
    id: '1',
    nombre: 'Sesión Individual de Entrenamiento Personal',
    descripcion: 'Sesión personalizada de 60 minutos adaptada a tus objetivos',
    precio: 50.00,
    categoria: 'Entrenamiento Personal',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '60 minutos',
      sesiones: 1,
      descuentosPorCantidad: [
        { cantidadMinima: 5, porcentajeDescuento: 10, descripcion: '10% descuento en paquetes de 5 sesiones' },
        { cantidadMinima: 10, porcentajeDescuento: 15, descripcion: '15% descuento en paquetes de 10 sesiones' },
        { cantidadMinima: 20, porcentajeDescuento: 20, descripcion: '20% descuento en paquetes de 20 sesiones' },
      ],
    },
  },
  {
    id: '2',
    nombre: 'Bono 5 Sesiones de Entrenamiento Personal',
    descripcion: 'Paquete de 5 sesiones de entrenamiento personal con descuento',
    precio: 225.00, // 50 * 5 con 10% descuento
    categoria: 'Entrenamiento Personal',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '5 sesiones',
      sesiones: 5,
      esBono: true,
      descuentosPorCantidad: [
        { cantidadMinima: 2, porcentajeDescuento: 5, descripcion: '5% descuento adicional en múltiples bonos' },
      ],
    },
  },
  {
    id: '3',
    nombre: 'Bono 10 Sesiones de Entrenamiento Personal',
    descripcion: 'Paquete de 10 sesiones de entrenamiento personal con descuento',
    precio: 425.00, // 50 * 10 con 15% descuento
    categoria: 'Entrenamiento Personal',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '10 sesiones',
      sesiones: 10,
      esBono: true,
    },
  },
  // Categoría: Entrenamiento en Grupo
  {
    id: '4',
    nombre: 'Clase Grupal de Entrenamiento Funcional',
    descripcion: 'Clase grupal de entrenamiento funcional de 45 minutos',
    precio: 15.00,
    categoria: 'Entrenamiento en Grupo',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '45 minutos',
      sesiones: 1,
      descuentosPorCantidad: [
        { cantidadMinima: 8, porcentajeDescuento: 10, descripcion: '10% descuento en paquetes de 8 clases' },
        { cantidadMinima: 16, porcentajeDescuento: 15, descripcion: '15% descuento en paquetes de 16 clases' },
      ],
    },
  },
  {
    id: '5',
    nombre: 'Bono Mensual de Clases Grupales',
    descripcion: 'Acceso ilimitado a clases grupales durante un mes',
    precio: 89.99,
    categoria: 'Entrenamiento en Grupo',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '1 mes',
      planMensual: true,
      esBono: true,
    },
  },
  // Plan de suscripción mensual con cargo recurrente
  {
    id: '11',
    nombre: 'Plan Mensual de Entrenamiento Personal',
    descripcion: 'Suscripción mensual con 4 sesiones de entrenamiento personal. Cargo automático recurrente.',
    precio: 180.00,
    categoria: 'Entrenamiento Personal',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '1 mes',
      sesiones: 4,
      suscripcion: {
        esSuscripcion: true,
        cicloFacturacion: 'mensual',
        cargoAutomatico: true,
        periodoGracia: 7,
        precioInicial: 160.00, // Precio especial primer mes
        descuentoRenovacion: 5, // 5% descuento en renovaciones
      },
      opcionesPersonalizables: [
        {
          id: 'duracion-sesion',
          nombre: 'Duración de sesión',
          tipo: 'duracion',
          requerida: true,
          valores: [
            {
              id: '45min',
              nombre: '45 minutos',
              modificadorPrecio: -20.00,
              disponible: true,
            },
            {
              id: '60min',
              nombre: '60 minutos',
              modificadorPrecio: 0,
              disponible: true,
            },
            {
              id: '90min',
              nombre: '90 minutos',
              modificadorPrecio: 30.00,
              disponible: true,
            },
          ],
        },
        {
          id: 'modalidad',
          nombre: 'Modalidad',
          tipo: 'modalidad',
          requerida: true,
          valores: [
            {
              id: 'presencial',
              nombre: 'Presencial',
              modificadorPrecio: 0,
              disponible: true,
            },
            {
              id: 'online',
              nombre: 'Online',
              modificadorPrecio: -15.00,
              disponible: true,
            },
            {
              id: 'hibrida',
              nombre: 'Híbrida (Presencial + Online)',
              modificadorPrecio: 10.00,
              disponible: true,
            },
          ],
        },
        {
          id: 'nivel',
          nombre: 'Nivel',
          tipo: 'nivel',
          requerida: false,
          valores: [
            {
              id: 'principiante',
              nombre: 'Principiante',
              modificadorPrecio: 0,
              disponible: true,
            },
            {
              id: 'intermedio',
              nombre: 'Intermedio',
              modificadorPrecio: 0,
              disponible: true,
            },
            {
              id: 'avanzado',
              nombre: 'Avanzado',
              modificadorPrecio: 15.00,
              disponible: true,
            },
          ],
        },
      ],
    },
  },
  // Servicio con opciones personalizables (sin suscripción)
  {
    id: '12',
    nombre: 'Sesión Individual Personalizada',
    descripcion: 'Sesión de entrenamiento personal con opciones de duración, modalidad y nivel',
    precio: 50.00,
    categoria: 'Entrenamiento Personal',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: 'Variable',
      sesiones: 1,
      opcionesPersonalizables: [
        {
          id: 'duracion-sesion',
          nombre: 'Duración',
          tipo: 'duracion',
          requerida: true,
          valores: [
            {
              id: '30min',
              nombre: '30 minutos',
              modificadorPrecio: -15.00,
              disponible: true,
            },
            {
              id: '45min',
              nombre: '45 minutos',
              modificadorPrecio: -5.00,
              disponible: true,
            },
            {
              id: '60min',
              nombre: '60 minutos',
              modificadorPrecio: 0,
              disponible: true,
            },
            {
              id: '90min',
              nombre: '90 minutos',
              modificadorPrecio: 25.00,
              disponible: true,
            },
          ],
        },
        {
          id: 'modalidad',
          nombre: 'Modalidad',
          tipo: 'modalidad',
          requerida: true,
          valores: [
            {
              id: 'presencial',
              nombre: 'Presencial',
              modificadorPrecio: 0,
              disponible: true,
            },
            {
              id: 'online',
              nombre: 'Online',
              modificadorPrecio: -10.00,
              disponible: true,
            },
          ],
        },
        {
          id: 'nivel',
          nombre: 'Nivel',
          tipo: 'nivel',
          requerida: false,
          valores: [
            {
              id: 'principiante',
              nombre: 'Principiante',
              modificadorPrecio: 0,
              disponible: true,
            },
            {
              id: 'intermedio',
              nombre: 'Intermedio',
              modificadorPrecio: 0,
              disponible: true,
            },
            {
              id: 'avanzado',
              nombre: 'Avanzado',
              modificadorPrecio: 10.00,
              disponible: true,
            },
          ],
        },
      ],
    },
  },
  // Categoría: Nutrición
  {
    id: '6',
    nombre: 'Consulta Nutricional Individual',
    descripcion: 'Consulta nutricional personalizada con plan de alimentación',
    precio: 45.00,
    categoria: 'Nutrición',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '1 sesión',
      sesiones: 1,
      descuentosPorCantidad: [
        { cantidadMinima: 3, porcentajeDescuento: 10, descripcion: '10% descuento en paquetes de 3 consultas' },
        { cantidadMinima: 6, porcentajeDescuento: 15, descripcion: '15% descuento en paquetes de 6 consultas' },
      ],
    },
  },
  {
    id: '7',
    nombre: 'Plan Nutricional Personalizado Digital',
    descripcion: 'Plan completo de alimentación adaptado a tus objetivos (digital)',
    precio: 59.99,
    categoria: 'Nutrición',
    tipo: 'producto-digital',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      accesoDigital: true,
      duracion: '1 mes',
    },
  },
  // Categoría: Preparación Física
  {
    id: '8',
    nombre: 'Programa de Preparación Física Deportiva',
    descripcion: 'Programa completo de 12 semanas para mejora del rendimiento',
    precio: 299.99,
    categoria: 'Preparación Física',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '12 semanas',
      sesiones: 24,
      esBono: true,
    },
  },
  {
    id: '9',
    nombre: 'Evaluación y Test de Condición Física',
    descripcion: 'Evaluación completa de condición física con informe detallado',
    precio: 75.00,
    categoria: 'Preparación Física',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '1 sesión',
      sesiones: 1,
    },
  },
  // Categoría: Rehabilitación y Recuperación
  {
    id: '10',
    nombre: 'Sesión de Recuperación y Movilidad',
    descripcion: 'Sesión enfocada en recuperación muscular y mejora de movilidad',
    precio: 40.00,
    categoria: 'Rehabilitación y Recuperación',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '60 minutos',
      sesiones: 1,
      descuentosPorCantidad: [
        { cantidadMinima: 4, porcentajeDescuento: 12, descripcion: '12% descuento en paquetes de 4 sesiones' },
      ],
    },
  },
];

const PRODUCTOS_GIMNASIO: Producto[] = [
  {
    id: '4',
    nombre: 'Camiseta Oficial del Gimnasio',
    descripcion: 'Camiseta de algodón 100% con logo bordado',
    precio: 24.99,
    categoria: 'Merchandising',
    tipo: 'producto-fisico',
    disponible: true,
    stock: 50,
    rolPermitido: 'gimnasio',
    metadatos: {
      envio: true,
    },
  },
  {
    id: '5',
    nombre: 'Suplemento Proteína Premium',
    descripcion: 'Proteína en polvo de alta calidad, 2kg',
    precio: 39.99,
    categoria: 'Suplementos',
    tipo: 'producto-fisico',
    disponible: true,
    stock: 30,
    rolPermitido: 'gimnasio',
    metadatos: {
      envio: true,
    },
  },
  {
    id: '6',
    nombre: 'Bono Regalo Membresía',
    descripcion: 'Bono regalo válido para 1 mes de membresía',
    precio: 49.99,
    categoria: 'Bonos',
    tipo: 'producto-digital',
    disponible: true,
    rolPermitido: 'gimnasio',
    metadatos: {
      accesoDigital: true,
    },
  },
  {
    id: '7',
    nombre: 'Pase de Día',
    descripcion: 'Acceso de un día al gimnasio',
    precio: 12.99,
    categoria: 'Acceso',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'gimnasio',
    metadatos: {
      duracion: '1 día',
    },
  },
];

export async function getProductos(
  rol: 'entrenador' | 'gimnasio',
  filtros?: FiltrosProductos
): Promise<Producto[]> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  const productos = rol === 'entrenador' ? PRODUCTOS_ENTRENADOR : PRODUCTOS_GIMNASIO;

  let productosFiltrados = [...productos];

  if (filtros) {
    if (filtros.categoria) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.categoria === filtros.categoria
      );
    }

    if (filtros.tipo) {
      productosFiltrados = productosFiltrados.filter((p) => p.tipo === filtros.tipo);
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      productosFiltrados = productosFiltrados.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda) ||
          p.descripcion.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.precioMin !== undefined) {
      productosFiltrados = productosFiltrados.filter((p) => p.precio >= filtros.precioMin!);
    }

    if (filtros.precioMax !== undefined) {
      productosFiltrados = productosFiltrados.filter((p) => p.precio <= filtros.precioMax!);
    }

    if (filtros.disponible !== undefined) {
      productosFiltrados = productosFiltrados.filter((p) => p.disponible === filtros.disponible);
    }
  }

  return productosFiltrados;
}

export async function getProducto(id: string): Promise<Producto | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const todosProductos = [...PRODUCTOS_ENTRENADOR, ...PRODUCTOS_GIMNASIO];
  return todosProductos.find((p) => p.id === id) || null;
}

