// API para métricas de retail

import { MetricasRetailData, MetricaRetail } from '../types';

export const getMetricasRetail = async (
  periodoInicio: string,
  periodoFin: string
): Promise<MetricasRetailData> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    conversionRate: 35.8,
    ticketPromedio: 185000,
    valorPorCliente: 420000,
    ltv: 1250000,
    rotacionInventario: 6.5,
    diasStock: 45,
    stockMuerto: 8,
    margenBruto: 42.5,
    margenNeto: 28.3,
    roiProducto: 145,
    ventasPorEmpleado: 8500000,
    ventasPorMetroCuadrado: 125000,
    ventasPorHora: [
      { hora: '08:00', ventas: 450000 },
      { hora: '09:00', ventas: 680000 },
      { hora: '10:00', ventas: 920000 },
      { hora: '11:00', ventas: 1100000 },
      { hora: '12:00', ventas: 1250000 },
      { hora: '13:00', ventas: 980000 },
      { hora: '14:00', ventas: 1150000 },
      { hora: '15:00', ventas: 1080000 },
      { hora: '16:00', ventas: 1320000 },
      { hora: '17:00', ventas: 1450000 },
      { hora: '18:00', ventas: 1380000 },
      { hora: '19:00', ventas: 1120000 },
    ],
    picosActividad: [
      { hora: '17:00', ventas: 1450000 },
      { hora: '18:00', ventas: 1380000 },
      { hora: '12:00', ventas: 1250000 },
    ]
  };
};

export const getMetricasPorTipo = async (
  tipo: MetricaRetail['tipo'],
  periodoInicio: string,
  periodoFin: string
): Promise<MetricaRetail[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  const metricasPorTipo: Record<string, MetricaRetail[]> = {
    conversion: [
      {
        id: 'conv-1',
        nombre: 'Tasa de Conversión',
        valor: 35.8,
        unidad: '%',
        tendencia: { valor: 5.2, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'conversion'
      },
      {
        id: 'conv-2',
        nombre: 'Tiempo Promedio de Decisión',
        valor: 8.5,
        unidad: 'min',
        tendencia: { valor: 2.1, direccion: 'down', periodo: 'vs mes anterior' },
        tipo: 'conversion'
      },
    ],
    valor: [
      {
        id: 'val-1',
        nombre: 'Ticket Promedio',
        valor: 185000,
        unidad: 'COP',
        tendencia: { valor: 12.5, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'valor'
      },
      {
        id: 'val-2',
        nombre: 'Valor por Cliente',
        valor: 420000,
        unidad: 'COP',
        tendencia: { valor: 8.3, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'valor'
      },
    ],
    inventario: [
      {
        id: 'inv-1',
        nombre: 'Rotación de Inventario',
        valor: 6.5,
        unidad: 'veces/año',
        tendencia: { valor: 0.8, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'inventario'
      },
      {
        id: 'inv-2',
        nombre: 'Días de Stock',
        valor: 45,
        unidad: 'días',
        tendencia: { valor: 5, direccion: 'down', periodo: 'vs mes anterior' },
        tipo: 'inventario'
      },
    ],
    rentabilidad: [
      {
        id: 'rent-1',
        nombre: 'Margen Bruto',
        valor: 42.5,
        unidad: '%',
        tendencia: { valor: 3.2, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'rentabilidad'
      },
      {
        id: 'rent-2',
        nombre: 'ROI por Producto',
        valor: 145,
        unidad: '%',
        tendencia: { valor: 15, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'rentabilidad'
      },
    ],
    rendimiento: [
      {
        id: 'rend-1',
        nombre: 'Ventas por Empleado',
        valor: 8500000,
        unidad: 'COP',
        tendencia: { valor: 12.5, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'rendimiento'
      },
      {
        id: 'rend-2',
        nombre: 'Ventas por Metro Cuadrado',
        valor: 125000,
        unidad: 'COP/m²',
        tendencia: { valor: 8.3, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'rendimiento'
      },
    ],
    tiempo: [
      {
        id: 'tiempo-1',
        nombre: 'Ventas por Hora - Pico',
        valor: 1450000,
        unidad: 'COP',
        tendencia: { valor: 15.2, direccion: 'up', periodo: 'vs mes anterior' },
        tipo: 'tiempo'
      },
      {
        id: 'tiempo-2',
        nombre: 'Hora de Mayor Actividad',
        valor: 17,
        unidad: 'hora',
        tendencia: { valor: 0, direccion: 'neutral', periodo: 'sin cambios' },
        tipo: 'tiempo'
      },
    ]
  };

  return metricasPorTipo[tipo] || [];
};

