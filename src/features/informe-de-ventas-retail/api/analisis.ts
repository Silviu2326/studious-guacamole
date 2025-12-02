// API para análisis de ventas

import { AnalisisVentas } from '../types';

export const getAnalisisVentas = async (
  periodoInicio: string,
  periodoFin: string
): Promise<AnalisisVentas> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    productosMasVendidos: [
      {
        productoId: 'prod-1',
        productoNombre: 'Proteína Whey 2kg',
        cantidadVendida: 45,
        ingresos: 5400000,
        tendencia: 'up'
      },
      {
        productoId: 'prod-3',
        productoNombre: 'Creatina Monohidrato',
        cantidadVendida: 32,
        ingresos: 2720000,
        tendencia: 'up'
      },
      {
        productoId: 'prod-2',
        productoNombre: 'Camiseta Gym Logo',
        cantidadVendida: 28,
        ingresos: 1120000,
        tendencia: 'neutral'
      },
      {
        productoId: 'prod-4',
        productoNombre: 'Bebida Isotónica',
        cantidadVendida: 60,
        ingresos: 1800000,
        tendencia: 'down'
      },
    ],
    tendencias: [
      { fecha: '2024-01-01', ventas: 1200000, unidades: 15 },
      { fecha: '2024-01-02', ventas: 1850000, unidades: 22 },
      { fecha: '2024-01-03', ventas: 2100000, unidades: 28 },
      { fecha: '2024-01-04', ventas: 1750000, unidades: 20 },
      { fecha: '2024-01-05', ventas: 2400000, unidades: 32 },
    ],
    patronesEstacionales: [
      { mes: 'Enero', ventas: 4500000, porcentajeVariacion: 12.5 },
      { mes: 'Febrero', ventas: 5200000, porcentajeVariacion: 15.6 },
      { mes: 'Marzo', ventas: 4800000, porcentajeVariacion: -7.7 },
      { mes: 'Abril', ventas: 5100000, porcentajeVariacion: 6.3 },
    ],
    comparativaProductos: [
      {
        productoId: 'prod-1',
        productoNombre: 'Proteína Whey 2kg',
        ventasActual: 5400000,
        ventasAnterior: 4800000,
        variacion: 12.5
      },
      {
        productoId: 'prod-3',
        productoNombre: 'Creatina Monohidrato',
        ventasActual: 2720000,
        ventasAnterior: 2600000,
        variacion: 4.6
      },
      {
        productoId: 'prod-2',
        productoNombre: 'Camiseta Gym Logo',
        ventasActual: 1120000,
        ventasAnterior: 1150000,
        variacion: -2.6
      },
    ]
  };
};

