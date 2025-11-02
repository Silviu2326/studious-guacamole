import React, { useState } from 'react';
import { Card, Button, Table } from '../../../components/componentsreutilizables';
import { reportesApi } from '../api/reportes';
import { ReportePedidos } from '../types';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';

export const ReportesPedidos: React.FC = () => {
  const [reporte, setReporte] = useState<ReportePedidos | null>(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 1);
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const generarReporte = async () => {
    setLoading(true);
    try {
      const datos = await reportesApi.generarReporte(
        new Date(fechaInicio),
        new Date(fechaFin)
      );
      setReporte(datos);
    } catch (error) {
      console.error('Error al generar reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = async () => {
    try {
      const blob = await reportesApi.exportarPDF(
        new Date(fechaInicio),
        new Date(fechaFin)
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-pedidos-${new Date().toISOString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    }
  };

  const exportarExcel = async () => {
    try {
      const blob = await reportesApi.exportarExcel(
        new Date(fechaInicio),
        new Date(fechaFin)
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-pedidos-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar Excel:', error);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  const columnasProductos = [
    {
      key: 'productoNombre',
      label: 'Producto',
    },
    {
      key: 'cantidadVendida',
      label: 'Cantidad Vendida',
      align: 'right' as const,
    },
    {
      key: 'ingresos',
      label: 'Ingresos',
      align: 'right' as const,
      render: (value: number) => formatearMoneda(value),
    },
  ];

  const columnasCategorias = [
    {
      key: 'categoria',
      label: 'Categoría',
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      align: 'right' as const,
    },
    {
      key: 'ingresos',
      label: 'Ingresos',
      align: 'right' as const,
      render: (value: number) => formatearMoneda(value),
    },
    {
      key: 'porcentaje',
      label: 'Porcentaje',
      align: 'right' as const,
      render: (value: number) => `${value.toFixed(1)}%`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportarPDF} disabled={!reporte}>
            <FileText size={20} className="mr-2" />
            Exportar PDF
          </Button>
          <Button variant="secondary" onClick={exportarExcel} disabled={!reporte}>
            <FileSpreadsheet size={20} className="mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtros de fecha */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
              />
            </div>
            <Button onClick={generarReporte} loading={loading} fullWidth>
              <FileText size={20} className="mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>
      </Card>

      {/* Resumen del reporte */}
      {reporte && (
        <div className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white shadow-sm">
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">
                  Total de Ventas
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatearMoneda(reporte.totalVentas)}
                </p>
              </div>
            </Card>
            <Card className="bg-white shadow-sm">
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">
                  Total de Pedidos
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reporte.totalPedidos}
                </p>
              </div>
            </Card>
            <Card className="bg-white shadow-sm">
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">
                  Promedio por Ticket
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatearMoneda(reporte.promedioTicket)}
                </p>
              </div>
            </Card>
            <Card className="bg-white shadow-sm">
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-1">
                  Devoluciones
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {reporte.devoluciones.total} ({reporte.devoluciones.porcentaje}%)
                </p>
              </div>
            </Card>
          </div>

          {/* Productos más vendidos */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Productos Más Vendidos
              </h3>
              <Table
                data={reporte.productosMasVendidos}
                columns={columnasProductos}
                emptyMessage="No hay productos vendidos en el período"
              />
            </div>
          </Card>

          {/* Ventas por categoría */}
          <Card className="bg-white shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ventas por Categoría
              </h3>
              <Table
                data={reporte.categoriaVentas}
                columns={columnasCategorias}
                emptyMessage="No hay categorías en el período"
              />
            </div>
          </Card>
        </div>
      )}

      {!reporte && !loading && (
        <Card className="bg-white shadow-sm">
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">
              Seleccione un rango de fechas y genere un reporte
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

