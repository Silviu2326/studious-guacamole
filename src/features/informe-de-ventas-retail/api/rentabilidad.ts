// API para análisis de rentabilidad

import { ProductoRentabilidad } from '../types';

export const getRentabilidadProductos = async (
  periodoInicio: string,
  periodoFin: string
): Promise<ProductoRentabilidad[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  return [
    {
      productoId: 'prod-1',
      productoNombre: 'Proteína Whey 2kg',
      categoria: 'Suplementos',
      ingresos: 5400000,
      costos: 2800000,
      margenBruto: 48.1,
      margenNeto: 32.5,
      roi: 192.9,
      costoAlmacenamiento: 45000,
      rotacion: 8.5,
      recomendacion: 'mantener'
    },
    {
      productoId: 'prod-2',
      productoNombre: 'Camiseta Gym Logo',
      categoria: 'Merchandising',
      ingresos: 1120000,
      costos: 680000,
      margenBruto: 39.3,
      margenNeto: 25.2,
      roi: 64.7,
      costoAlmacenamiento: 15000,
      rotacion: 5.2,
      recomendacion: 'promocionar'
    },
    {
      productoId: 'prod-3',
      productoNombre: 'Creatina Monohidrato',
      categoria: 'Suplementos',
      ingresos: 2720000,
      costos: 1200000,
      margenBruto: 55.9,
      margenNeto: 42.3,
      roi: 126.7,
      costoAlmacenamiento: 28000,
      rotacion: 7.8,
      recomendacion: 'mantener'
    },
    {
      productoId: 'prod-4',
      productoNombre: 'Bebida Isotónica',
      categoria: 'Bebidas',
      ingresos: 1800000,
      costos: 1350000,
      margenBruto: 25.0,
      margenNeto: 12.5,
      roi: 33.3,
      costoAlmacenamiento: 38000,
      rotacion: 12.5,
      recomendacion: 'aumentar-precio'
    },
    {
      productoId: 'prod-5',
      productoNombre: 'Equipo de Entrenamiento Antiguo',
      categoria: 'Equipamiento',
      ingresos: 450000,
      costos: 420000,
      margenBruto: 6.7,
      margenNeto: -5.2,
      roi: 7.1,
      costoAlmacenamiento: 125000,
      rotacion: 0.8,
      recomendacion: 'eliminar'
    },
  ];
};

export const getProductoRentabilidad = async (
  productoId: string,
  periodoInicio: string,
  periodoFin: string
): Promise<ProductoRentabilidad | null> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const productos = await getRentabilidadProductos(periodoInicio, periodoFin);
  return productos.find(p => p.productoId === productoId) || null;
};

