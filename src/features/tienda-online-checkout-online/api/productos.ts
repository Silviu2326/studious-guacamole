import { Producto, FiltrosProductos } from '../types';

// Mock data para productos
const PRODUCTOS_ENTRENADOR: Producto[] = [
  {
    id: '1',
    nombre: 'Plan Mensual de Entrenamiento',
    descripcion: 'Rutina personalizada mensual con seguimiento semanal',
    precio: 89.99,
    categoria: 'Entrenamiento',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      planMensual: true,
      duracion: '1 mes',
    },
  },
  {
    id: '2',
    nombre: 'Asesoría Nutricional Personalizada',
    descripcion: 'Consulta nutricional individual con plan personalizado',
    precio: 45.00,
    categoria: 'Nutrición',
    tipo: 'servicio',
    disponible: true,
    rolPermitido: 'entrenador',
    metadatos: {
      duracion: '1 sesión',
    },
  },
  {
    id: '3',
    nombre: 'Plan Nutricional Personalizado',
    descripcion: 'Plan completo de alimentación adaptado a tus objetivos',
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

