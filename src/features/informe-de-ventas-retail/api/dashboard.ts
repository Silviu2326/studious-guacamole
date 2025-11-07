// API para dashboard de ventas

import { DashboardVentasData } from '../types';

export const getDashboardVentas = async (
  periodoInicio: string,
  periodoFin: string
): Promise<DashboardVentasData> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    kpis: {
      ventasTotales: 15200000,
      ticketPromedio: 185000,
      conversionRate: 35.8,
      unidadesVendidas: 165,
      margenBruto: 42.5,
      ventasPorEmpleado: 8500000
    },
    alertas: [
      {
        id: 'alert-1',
        tipo: 'bajo-stock',
        mensaje: 'Proteína Whey 2kg tiene stock bajo (menos de 10 unidades)',
        severidad: 'alta'
      },
      {
        id: 'alert-2',
        tipo: 'baja-rotacion',
        mensaje: 'Equipo de Entrenamiento Antiguo tiene rotación menor a 1 vez/año',
        severidad: 'media'
      },
      {
        id: 'alert-3',
        tipo: 'bajo-margen',
        mensaje: 'Bebida Isotónica tiene margen bruto menor al 30%',
        severidad: 'media'
      },
      {
        id: 'alert-4',
        tipo: 'stock-muerto',
        mensaje: '5 productos llevan más de 180 días sin ventas',
        severidad: 'baja'
      },
    ],
    recomendaciones: [
      {
        id: 'rec-1',
        tipo: 'precio',
        mensaje: 'Considera aumentar el precio de Bebida Isotónica en 5-10% para mejorar margen',
        accion: 'Ajustar precio'
      },
      {
        id: 'rec-2',
        tipo: 'promocion',
        mensaje: 'Camiseta Gym Logo tiene buena rotación pero margen mejorable - crear promoción',
        accion: 'Crear promoción'
      },
      {
        id: 'rec-3',
        tipo: 'eliminacion',
        mensaje: 'Equipo de Entrenamiento Antiguo genera pérdidas - considerar eliminación',
        accion: 'Evaluar eliminación'
      },
      {
        id: 'rec-4',
        tipo: 'stock',
        mensaje: 'Aumentar stock de Proteína Whey 2kg por alta demanda',
        accion: 'Reponer stock'
      },
    ],
    tendencias: [
      { fecha: '2024-01-01', ventas: 1200000, unidades: 15 },
      { fecha: '2024-01-02', ventas: 1850000, unidades: 22 },
      { fecha: '2024-01-03', ventas: 2100000, unidades: 28 },
      { fecha: '2024-01-04', ventas: 1750000, unidades: 20 },
      { fecha: '2024-01-05', ventas: 2400000, unidades: 32 },
      { fecha: '2024-01-06', ventas: 2650000, unidades: 35 },
      { fecha: '2024-01-07', ventas: 2250000, unidades: 28 },
    ]
  };
};

