// API para reportes de ventas retail

import { ReporteRetail, VentaRetail, FiltrosReporte } from '../types';

// Simulación de datos - en producción esto haría llamadas reales a la API
const ventasMock: VentaRetail[] = [
  {
    id: '1',
    productoId: 'prod-1',
    productoNombre: 'Proteína Whey 2kg',
    categoria: 'Suplementos',
    cantidad: 5,
    precioUnitario: 120000,
    descuento: 0,
    total: 600000,
    fecha: '2024-01-15',
    empleadoId: 'emp-1',
    empleadoNombre: 'Juan Pérez',
    clienteId: 'cli-1',
    clienteNombre: 'Carlos Rodríguez',
    horario: '10:30'
  },
  {
    id: '2',
    productoId: 'prod-2',
    productoNombre: 'Camiseta Gym Logo',
    categoria: 'Merchandising',
    cantidad: 3,
    precioUnitario: 45000,
    descuento: 5000,
    total: 120000,
    fecha: '2024-01-15',
    empleadoId: 'emp-2',
    empleadoNombre: 'María González',
    horario: '14:20'
  },
  {
    id: '3',
    productoId: 'prod-3',
    productoNombre: 'Creatina Monohidrato',
    categoria: 'Suplementos',
    cantidad: 8,
    precioUnitario: 85000,
    descuento: 0,
    total: 680000,
    fecha: '2024-01-16',
    empleadoId: 'emp-1',
    empleadoNombre: 'Juan Pérez',
    horario: '11:15'
  },
];

export const getReportesRetail = async (filtros: FiltrosReporte): Promise<ReporteRetail> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  // Filtrar ventas según los filtros
  let ventasFiltradas = [...ventasMock];

  if (filtros.categoria) {
    ventasFiltradas = ventasFiltradas.filter(v => v.categoria === filtros.categoria);
  }

  if (filtros.productoId) {
    ventasFiltradas = ventasFiltradas.filter(v => v.productoId === filtros.productoId);
  }

  if (filtros.empleadoId) {
    ventasFiltradas = ventasFiltradas.filter(v => v.empleadoId === filtros.empleadoId);
  }

  // Filtrar por período
  if (filtros.periodo.inicio && filtros.periodo.fin) {
    ventasFiltradas = ventasFiltradas.filter(v => {
      const fecha = new Date(v.fecha);
      const inicio = new Date(filtros.periodo.inicio);
      const fin = new Date(filtros.periodo.fin);
      return fecha >= inicio && fecha <= fin;
    });
  }

  const totalVentas = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
  const totalUnidades = ventasFiltradas.reduce((sum, v) => sum + v.cantidad, 0);
  const ticketPromedio = ventasFiltradas.length > 0 ? totalVentas / ventasFiltradas.length : 0;

  return {
    periodo: filtros.periodo,
    ventas: ventasFiltradas,
    totalVentas,
    totalUnidades,
    ticketPromedio,
    tipoReporte: filtros.tipoReporte || 'producto'
  };
};

export const exportarReporte = async (
  reporte: ReporteRetail,
  formato: 'pdf' | 'excel' | 'csv'
): Promise<Blob> => {
  // Simular exportación
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // En producción, esto generaría el archivo real
  return new Blob(['Simulated export'], { type: 'application/octet-stream' });
};

