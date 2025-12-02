import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Select } from '../../../components/componentsreutilizables';
import { getReportesRetail, exportarReporte } from '../api';
import { ReporteRetail, FiltrosReporte, VentaRetail } from '../types';
import { FileDown, Filter, Calendar } from 'lucide-react';

export const ReportesRetail: React.FC = () => {
  const [reporte, setReporte] = useState<ReporteRetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosReporte>({
    periodo: {
      inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fin: new Date().toISOString().split('T')[0]
    },
    tipoReporte: 'producto'
  });
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    setLoading(true);
    try {
      const data = await getReportesRetail(filtros);
      setReporte(data);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportar = async (formato: 'pdf' | 'excel' | 'csv') => {
    if (!reporte) return;

    setExportando(true);
    try {
      await exportarReporte(reporte, formato);
      alert(`Reporte exportado en formato ${formato.toUpperCase()}`);
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar el reporte');
    } finally {
      setExportando(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columnas = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (valor: string) => formatearFecha(valor)
    },
    {
      key: 'productoNombre',
      label: 'Producto'
    },
    {
      key: 'categoria',
      label: 'Categoría'
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
      align: 'right' as const
    },
    {
      key: 'precioUnitario',
      label: 'Precio Unitario',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'descuento',
      label: 'Descuento',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'total',
      label: 'Total',
      align: 'right' as const,
      render: (valor: number) => formatearMoneda(valor)
    },
    {
      key: 'empleadoNombre',
      label: 'Empleado'
    },
    {
      key: 'horario',
      label: 'Horario'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4 p-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filtros.periodo.inicio}
                    onChange={(e) => setFiltros({
                      ...filtros,
                      periodo: { ...filtros.periodo, inicio: e.target.value }
                    })}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filtros.periodo.fin}
                    onChange={(e) => setFiltros({
                      ...filtros,
                      periodo: { ...filtros.periodo, fin: e.target.value }
                    })}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Tipo de Reporte
                  </label>
                  <Select
                    value={filtros.tipoReporte || 'producto'}
                    onChange={(value) => setFiltros({ ...filtros, tipoReporte: value as FiltrosReporte['tipoReporte'] })}
                    options={[
                      { value: 'producto', label: 'Por Producto' },
                      { value: 'categoria', label: 'Por Categoría' },
                      { value: 'periodo', label: 'Por Período' },
                      { value: 'empleado', label: 'Por Empleado' },
                      { value: 'horario', label: 'Por Horario' },
                      { value: 'cliente', label: 'Por Cliente' },
                      { value: 'comparativa', label: 'Comparativa Anual' }
                    ]}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={cargarReporte}
                  disabled={loading}
                  variant="primary"
                  size="sm"
                >
                  <Filter size={20} className="mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Resumen */}
      {reporte && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white shadow-sm">
            <p className="text-sm text-gray-600 mb-1">
              Total Ventas
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatearMoneda(reporte.totalVentas)}
            </p>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <p className="text-sm text-gray-600 mb-1">
              Unidades Vendidas
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {reporte.totalUnidades}
            </p>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <p className="text-sm text-gray-600 mb-1">
              Ticket Promedio
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatearMoneda(reporte.ticketPromedio)}
            </p>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <p className="text-sm text-gray-600 mb-1">
              Total Transacciones
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {reporte.ventas.length}
            </p>
          </Card>
        </div>
      )}

      {/* Tabla de Ventas */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Detalle de Ventas
          </h3>
          {reporte && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleExportar('pdf')}
                disabled={exportando}
                variant="secondary"
                size="sm"
              >
                <FileDown size={20} className="mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleExportar('excel')}
                disabled={exportando}
                variant="secondary"
                size="sm"
              >
                <FileDown size={20} className="mr-2" />
                Excel
              </Button>
              <Button
                onClick={() => handleExportar('csv')}
                disabled={exportando}
                variant="secondary"
                size="sm"
              >
                <FileDown size={20} className="mr-2" />
                CSV
              </Button>
            </div>
          )}
        </div>

        <Table
          data={reporte?.ventas || []}
          columns={columnas}
          loading={loading}
          emptyMessage="No hay ventas para el período seleccionado"
        />
      </Card>
    </div>
  );
};

