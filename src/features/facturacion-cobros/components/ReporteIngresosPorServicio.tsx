/**
 * ReporteIngresosPorServicio - Componente de reporte de ingresos por servicio
 * 
 * Este componente muestra un análisis detallado de ingresos desglosados por tipo de servicio:
 * - Gráfico de barras horizontal con ingresos por servicio
 * - Gráfico de pastel con distribución porcentual
 * - Tabla detallada con métricas (total, cantidad de facturas, ticket medio, porcentaje)
 * - Filtros por rango de fechas
 * - Exportación a PDF
 * 
 * INTEGRACIÓN:
 * - Utiliza `getIngresosPorServicio()` de ingresosPorServicio.ts
 * - Permite cambiar entre vista de barras y pastel
 * - Calcula porcentajes del total para cada servicio
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Select, SelectOption } from '../../../components/componentsreutilizables';
import { 
  getIngresosPorServicio,
  FiltroIngresosPorServicio 
} from '../api/ingresosPorServicio';
import { IngresoPorServicio } from '../api/ingresosPorServicio';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar
} from 'lucide-react';
import { ExportPDF } from './ExportPDF';

interface ReporteIngresosPorServicioProps {
  onError?: (errorMessage: string) => void;
}

type TipoVista = 'barras' | 'pastel' | 'tabla';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

export const ReporteIngresosPorServicio: React.FC<ReporteIngresosPorServicioProps> = ({
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [ingresosPorServicio, setIngresosPorServicio] = useState<IngresoPorServicio[]>([]);
  const [tipoVista, setTipoVista] = useState<TipoVista>('barras');
  
  // Filtros
  const [fechaInicio, setFechaInicio] = useState<Date>(() => {
    const inicio = new Date();
    inicio.setMonth(inicio.getMonth() - 1);
    inicio.setDate(1);
    inicio.setHours(0, 0, 0, 0);
    return inicio;
  });
  const [fechaFin, setFechaFin] = useState<Date>(() => {
    const fin = new Date();
    fin.setHours(23, 59, 59, 999);
    return fin;
  });

  const tipoVistaOptions: SelectOption[] = [
    { value: 'barras', label: 'Gráfico de Barras' },
    { value: 'pastel', label: 'Gráfico de Pastel' },
    { value: 'tabla', label: 'Tabla Detallada' }
  ];

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const filtros: FiltroIngresosPorServicio = {
        fechaInicio,
        fechaFin
      };
      const datos = await getIngresosPorServicio(filtros);
      setIngresosPorServicio(datos);
    } catch (error) {
      console.error('Error al cargar ingresos por servicio:', error);
      if (onError) {
        onError('Error al cargar los ingresos por servicio');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [fechaInicio, fechaFin]);

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

  const totalGeneral = ingresosPorServicio.reduce((suma, item) => suma + item.totalIngresos, 0);

  // Calcular porcentajes si no vienen en los datos
  const datosConPorcentajes = ingresosPorServicio.map(item => ({
    ...item,
    porcentajeDelTotal: totalGeneral > 0 
      ? (item.totalIngresos / totalGeneral) * 100 
      : 0
  }));

  const handleExportarPDF = () => {
    if (ingresosPorServicio.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    ExportPDF.exportarIngresosPorServicio({
      ingresosPorServicio: datosConPorcentajes,
      fechaInicio,
      fechaFin,
      totalGeneral
    });
  };

  const datosGrafico = datosConPorcentajes.map(item => ({
    nombre: item.nombreServicio,
    ingresos: item.totalIngresos,
    porcentaje: item.porcentajeDelTotal,
    facturas: item.cantidadFacturas,
    ticketMedio: item.promedioTicket
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Ingresos por Servicio</h2>
        </div>
        <Button
          variant="primary"
          onClick={handleExportarPDF}
          disabled={loading || ingresosPorServicio.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              label="Tipo de Vista"
              options={tipoVistaOptions}
              value={tipoVista}
              onChange={(e) => setTipoVista(e.target.value as TipoVista)}
            />
          </div>
        </div>
      </Card>

      {/* Resumen Total */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700 font-medium">Total General de Ingresos</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {formatearMoneda(totalGeneral)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {formatearFecha(fechaInicio)} - {formatearFecha(fechaFin)}
            </p>
          </div>
          <DollarSign className="w-10 h-10 text-blue-500" />
        </div>
      </Card>

      {/* Gráficos */}
      {loading ? (
        <Card className="p-6">
          <div className="h-80 flex items-center justify-center">
            <div className="text-gray-500">Cargando datos...</div>
          </div>
        </Card>
      ) : datosGrafico.length === 0 ? (
        <Card className="p-6">
          <div className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No hay datos disponibles para el período seleccionado</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Gráfico de Barras */}
          {tipoVista === 'barras' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Ingresos por Servicio (Barras)
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={datosGrafico}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    type="number"
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    tickFormatter={(value) => formatearMoneda(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="nombre"
                    tick={{ fill: '#64748B', fontSize: 12 }}
                    width={90}
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
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Gráfico de Pastel */}
          {tipoVista === 'pastel' && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Distribución de Ingresos (Pastel)
                </h3>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={datosGrafico}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, porcentaje }) => 
                      `${nombre}: ${porcentaje.toFixed(1)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="ingresos"
                  >
                    {datosGrafico.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    formatter={(value: number) => formatearMoneda(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Tabla Detallada */}
          {tipoVista === 'tabla' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalle por Servicio</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Servicio</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total Ingresos</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Facturas</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ticket Medio</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">% del Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosConPorcentajes.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.nombreServicio}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                          {formatearMoneda(item.totalIngresos)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {item.cantidadFacturas}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {formatearMoneda(item.promedioTicket)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <span className="font-medium text-blue-600">
                            {item.porcentajeDelTotal.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 border-t-2 border-gray-300">
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">TOTAL</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                        {formatearMoneda(totalGeneral)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                        {datosConPorcentajes.reduce((suma, item) => suma + item.cantidadFacturas, 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                        {formatearMoneda(
                          datosConPorcentajes.reduce((suma, item) => suma + item.promedioTicket, 0) / 
                          (datosConPorcentajes.length || 1)
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

