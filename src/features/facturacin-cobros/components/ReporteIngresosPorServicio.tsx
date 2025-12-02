import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Input, Select, SelectOption } from '../../../components/componentsreutilizables';
import { Factura } from '../types';
import { ingresosPorServicioAPI, IngresoPorServicio, FiltroIngresosPorServicio } from '../api/ingresosPorServicio';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ReporteIngresosPorServicioProps {
  facturas: Factura[];
}

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#14B8A6'];

export const ReporteIngresosPorServicio: React.FC<ReporteIngresosPorServicioProps> = ({ facturas }) => {
  const [fechaInicio, setFechaInicio] = useState(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 1); // Último mes
    fecha.setDate(1);
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [tipoGrafico, setTipoGrafico] = useState<'bar' | 'pie'>('bar');
  const [ingresos, setIngresos] = useState<IngresoPorServicio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarIngresos();
  }, [facturas, fechaInicio, fechaFin]);

  const cargarIngresos = async () => {
    setLoading(true);
    try {
      const filtros: FiltroIngresosPorServicio = {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin)
      };
      const datos = await ingresosPorServicioAPI.obtenerIngresosPorServicio(facturas, filtros);
      setIngresos(datos);
    } catch (error) {
      console.error('Error al cargar ingresos por servicio:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const rangosPredefinidos: SelectOption[] = [
    { value: 'mes-actual', label: 'Mes Actual' },
    { value: 'mes-anterior', label: 'Mes Anterior' },
    { value: 'trimestre', label: 'Último Trimestre' },
    { value: 'semestre', label: 'Último Semestre' },
    { value: 'anio', label: 'Año Actual' }
  ];

  const handleRangoChange = (valor: string) => {
    const hoy = new Date();
    let inicio: Date;
    let fin: Date = new Date();

    switch (valor) {
      case 'mes-actual':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        break;
      case 'mes-anterior':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        fin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        break;
      case 'trimestre':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1);
        break;
      case 'semestre':
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 6, 1);
        break;
      case 'anio':
        inicio = new Date(hoy.getFullYear(), 0, 1);
        break;
      default:
        inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    }

    setFechaInicio(inicio.toISOString().split('T')[0]);
    setFechaFin(fin.toISOString().split('T')[0]);
  };

  const totalIngresos = useMemo(() => {
    return ingresos.reduce((sum, ingreso) => sum + ingreso.totalIngresos, 0);
  }, [ingresos]);

  const datosGrafico = useMemo(() => {
    return ingresos.map(ingreso => ({
      name: ingreso.nombre,
      ingresos: ingreso.totalIngresos,
      cantidad: ingreso.cantidadFacturas,
      porcentaje: ingreso.porcentajeDelTotal
    }));
  }, [ingresos]);

  const handleExportar = () => {
    const datosExportacion = ingresos.map(ingreso => ({
      'Tipo de Servicio': ingreso.nombre,
      'Total Ingresos': ingreso.totalIngresos,
      'Cantidad de Facturas': ingreso.cantidadFacturas,
      'Promedio por Factura': ingreso.promedioTicket,
      'Porcentaje del Total': `${ingreso.porcentajeDelTotal.toFixed(2)}%`
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datosExportacion);

    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 25 }, // Tipo de Servicio
      { wch: 18 }, // Total Ingresos
      { wch: 20 }, // Cantidad de Facturas
      { wch: 22 }, // Promedio por Factura
      { wch: 20 }  // Porcentaje del Total
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Ingresos por Servicio');
    
    const nombreArchivo = `Ingresos_Por_Servicio_${fechaInicio}_${fechaFin}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <p className="text-sm text-blue-600">
            Ingresos: {formatearMoneda(data.ingresos)}
          </p>
          <p className="text-sm text-gray-600">
            Facturas: {data.cantidad}
          </p>
          <p className="text-sm text-gray-600">
            Porcentaje: {data.porcentaje.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header con título y descripción */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Ingresos por Tipo de Servicio
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Visualiza qué servicios generan más ingresos para enfocar tu estrategia
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Select
                label="Rango Predefinido"
                options={rangosPredefinidos}
                value=""
                onChange={(e) => handleRangoChange(e.target.value)}
                placeholder="Seleccionar rango"
              />
            </div>
            <Input
              label="Fecha Inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <Input
              label="Fecha Fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <div className="flex items-end gap-2">
              <Select
                label="Tipo de Gráfico"
                options={[
                  { value: 'bar', label: 'Barras' },
                  { value: 'pie', label: 'Circular' }
                ]}
                value={tipoGrafico}
                onChange={(e) => setTipoGrafico(e.target.value as 'bar' | 'pie')}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Resumen de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-2">Total Ingresos</div>
                <div className="text-3xl font-bold text-blue-600">
                  {formatearMoneda(totalIngresos)}
                </div>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-2">Tipos de Servicio</div>
                <div className="text-3xl font-bold text-purple-600">
                  {ingresos.length}
                </div>
              </div>
              <BarChart3 className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-2">Servicio Top</div>
                <div className="text-lg font-bold text-green-600">
                  {ingresos.length > 0 ? ingresos[0].nombre : 'N/A'}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {ingresos.length > 0 ? formatearMoneda(ingresos[0].totalIngresos) : ''}
                </div>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Comparativa de Ingresos por Servicio
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportar}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar a Excel
            </Button>
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando datos...</p>
              </div>
            </div>
          ) : ingresos.length === 0 ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay datos disponibles para el período seleccionado</p>
              </div>
            </div>
          ) : tipoGrafico === 'bar' ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={datosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                    return `$${value}`;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="ingresos" fill="#3B82F6" name="Ingresos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={datosGrafico}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, porcentaje }) => `${name}: ${porcentaje.toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="ingresos"
                  >
                    {datosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>

      {/* Tabla Detallada */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Desglose Detallado
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad Facturas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio por Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Porcentaje del Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ingresos.map((ingreso, index) => (
                  <tr key={ingreso.tipoServicio} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {ingreso.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatearMoneda(ingreso.totalIngresos)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {ingreso.cantidadFacturas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatearMoneda(ingreso.promedioTicket)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${ingreso.porcentajeDelTotal}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {ingreso.porcentajeDelTotal.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};


