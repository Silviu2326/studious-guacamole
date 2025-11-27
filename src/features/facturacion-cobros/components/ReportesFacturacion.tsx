/**
 * ReportesFacturacion - Componente principal de reportes de facturación
 * 
 * Este componente muestra reportes completos de facturación con:
 * - Resumen general de facturación (total facturado, cobrado, pendiente)
 * - Gráficos de ingresos por período (líneas de tiempo)
 * - Métricas clave (facturas pendientes, vencidas)
 * - Filtros por rango de fechas y agrupación (diaria, semanal, mensual)
 * 
 * INTEGRACIÓN:
 * - Utiliza `getResumenFacturacion()` para obtener el resumen del período
 * - Utiliza `getIngresosPorPeriodo()` para obtener datos de gráficos
 * - Permite exportar reportes a PDF (usando ExportPDF)
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Select, SelectOption } from '../../../components/componentsreutilizables';
import { 
  getResumenFacturacion, 
  getIngresosPorPeriodo,
  FiltroIngresosPorPeriodo 
} from '../api/ingresos';
import { ResumenFacturacion, IngresoPorPeriodo } from '../types';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  AlertCircle, 
  Calendar,
  Download,
  BarChart3,
  LineChart as LineChartIcon
} from 'lucide-react';
import { ExportPDF } from './ExportPDF';

interface ReportesFacturacionProps {
  onError?: (errorMessage: string) => void;
}

type AgrupacionPeriodo = 'diaria' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
type TipoGrafico = 'bar' | 'line';

export const ReportesFacturacion: React.FC<ReportesFacturacionProps> = ({
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [resumen, setResumen] = useState<ResumenFacturacion | null>(null);
  const [ingresosPorPeriodo, setIngresosPorPeriodo] = useState<IngresoPorPeriodo[]>([]);
  
  // Filtros
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const inicio = new Date();
    inicio.setMonth(inicio.getMonth() - 6);
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
    return inicio;
  });
  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);
    return fin;
  });
  const [agrupacion, setAgrupacion] = useState<AgrupacionPeriodo>('mensual');
  const [tipoGrafico, setTipoGrafico] = useState<TipoGrafico>('bar');

  const agrupacionOptions: SelectOption[] = [
    { value: 'diaria', label: 'Diaria' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensual', label: 'Mensual' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'anual', label: 'Anual' }
  ];

  const tipoGraficoOptions: SelectOption[] = [
    { value: 'bar', label: 'Barras' },
    { value: 'line', label: 'Líneas' }
  ];

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar resumen
      const resumenData = await getResumenFacturacion({
        fechaInicio,
        fechaFin
      });
      setResumen(resumenData);

      // Cargar ingresos por período
      const filtros: FiltroIngresosPorPeriodo = {
        fechaInicio,
        fechaFin,
        agrupacion
      };
      const ingresosData = await getIngresosPorPeriodo(filtros);
      setIngresosPorPeriodo(ingresosData);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      if (onError) {
        onError('Error al cargar los reportes de facturación');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin, agrupacion]);

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(fecha);
  };

  const handleExportarPDF = () => {
    if (!resumen || ingresosPorPeriodo.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    ExportPDF.exportarReporteFacturacion({
      resumen,
      ingresosPorPeriodo,
      fechaInicio,
      fechaFin,
      agrupacion
    });
  };

  const datosGrafico = ingresosPorPeriodo.map(item => ({
    periodo: typeof item.periodo === 'string' ? item.periodo : 
             `${item.periodo.mes}/${item.periodo.año}`,
    ingresos: item.totalIngresos,
    facturas: item.numeroFacturas,
    variacion: item.variacionPorcentualOpcional || 0
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Reportes de Facturación</h2>
        </div>
        <Button
          variant="primary"
          onClick={handleExportarPDF}
          disabled={loading || !resumen}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio.toISOString().split('T')[0]}
              onChange={(e) => {
                const nuevaFecha = new Date(e.target.value);
                nuevaFecha.setHours(0, 0, 0, 0);
                setFechaInicio(nuevaFecha);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin.toISOString().split('T')[0]}
              onChange={(e) => {
                const nuevaFecha = new Date(e.target.value);
                nuevaFecha.setHours(23, 59, 59, 999);
                setFechaFin(nuevaFecha);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Select
              label="Agrupación"
              options={agrupacionOptions}
              value={agrupacion}
              onChange={(e) => setAgrupacion(e.target.value as AgrupacionPeriodo)}
            />
          </div>
          <div>
            <Select
              label="Tipo de Gráfico"
              options={tipoGraficoOptions}
              value={tipoGrafico}
              onChange={(e) => setTipoGrafico(e.target.value as TipoGrafico)}
            />
          </div>
        </div>
      </Card>

      {/* Resumen de Métricas */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Facturado</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {formatearMoneda(resumen.totalFacturado)}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Total Cobrado</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {formatearMoneda(resumen.totalCobrado)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Total Pendiente</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {formatearMoneda(resumen.totalPendiente)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Facturas Pendientes</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">
                  {resumen.numeroFacturasPendientes}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Facturas Vencidas</p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {resumen.numeroFacturasVencidas}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Gráfico de Ingresos por Período */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {tipoGrafico === 'bar' ? (
              <BarChart3 className="w-5 h-5" />
            ) : (
              <LineChartIcon className="w-5 h-5" />
            )}
            Ingresos por Período
          </h3>
          <div className="text-sm text-gray-500">
            {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}
          </div>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Cargando datos...</div>
          </div>
        ) : datosGrafico.length === 0 ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No hay datos disponibles para el período seleccionado</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            {tipoGrafico === 'bar' ? (
              <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="periodo"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => formatearMoneda(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  formatter={(value: number) => formatearMoneda(value)}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#6366F1" name="Ingresos" />
                <Bar dataKey="facturas" fill="#8B5CF6" name="Número de Facturas" />
              </BarChart>
            ) : (
              <LineChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="periodo"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => formatearMoneda(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  formatter={(value: number) => formatearMoneda(value)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ fill: '#6366F1', r: 5 }}
                  name="Ingresos"
                />
                <Line
                  type="monotone"
                  dataKey="facturas"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  name="Número de Facturas"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </Card>

      {/* Tabla de Detalle */}
      {ingresosPorPeriodo.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle por Período</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Período</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ingresos</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Facturas</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Variación</th>
                </tr>
              </thead>
              <tbody>
                {ingresosPorPeriodo.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {typeof item.periodo === 'string' ? item.periodo : 
                       `${item.periodo.mes}/${item.periodo.año}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                      {formatearMoneda(item.totalIngresos)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600">
                      {item.numeroFacturas}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.variacionPorcentualOpcional !== undefined ? (
                        <span className={item.variacionPorcentualOpcional >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {item.variacionPorcentualOpcional >= 0 ? '+' : ''}
                          {item.variacionPorcentualOpcional.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

