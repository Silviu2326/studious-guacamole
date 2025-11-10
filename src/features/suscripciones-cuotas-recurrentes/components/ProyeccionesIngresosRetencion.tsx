import React, { useState, useEffect } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import {
  ProyeccionesYRetencionRequest,
  ProyeccionesYRetencionResponse,
} from '../types';
import { getProyeccionesYRetencion } from '../api/proyeccionesRetencion';
import {
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  BarChart3,
  Calendar,
  Loader2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface ProyeccionesIngresosRetencionProps {
  entrenadorId?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const ProyeccionesIngresosRetencion: React.FC<ProyeccionesIngresosRetencionProps> = ({
  entrenadorId,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProyeccionesYRetencionResponse | null>(null);
  const [mesesProyeccion, setMesesProyeccion] = useState(12);
  const [mesesAnalisis, setMesesAnalisis] = useState(6);
  const [vistaGrafico, setVistaGrafico] = useState<'ingresos' | 'retencion'>('ingresos');

  useEffect(() => {
    loadData();
  }, [entrenadorId, mesesProyeccion, mesesAnalisis]);

  const loadData = async () => {
    setLoading(true);
    try {
      const request: ProyeccionesYRetencionRequest = {
        entrenadorId,
        mesesProyeccion,
        mesesAnalisis,
      };
      const result = await getProyeccionesYRetencion(request);
      setData(result);
    } catch (error) {
      console.error('Error cargando proyecciones y retención:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Cargando proyecciones...</span>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">No se pudieron cargar las proyecciones</p>
        </div>
      </Card>
    );
  }

  // Preparar datos para gráficos
  const datosGraficoIngresos = data.proyecciones.map(p => ({
    mes: p.periodo.split(' ')[0].substring(0, 3), // Primeras 3 letras del mes
    proyectados: Math.round(p.ingresosProyectados),
    confirmados: Math.round(p.ingresosConfirmados),
    potenciales: Math.round(p.ingresosPotenciales),
  }));

  const datosGraficoRetencion = data.analisisRetencion.tendenciaRetencion.map(t => ({
    mes: t.mes.split(' ')[0].substring(0, 3),
    retencion: Math.round(t.tasaRetencion * 10) / 10,
    clientes: t.numeroClientes,
  }));

  const datosRetencionPorPlan = data.analisisRetencion.tasaRetencionPorPlan.map(p => ({
    name: p.planNombre.length > 20 ? p.planNombre.substring(0, 20) + '...' : p.planNombre,
    retencion: Math.round(p.tasaRetencion * 10) / 10,
    clientes: p.numeroClientes,
  }));

  const datosRetencionPorAntiguedad = data.analisisRetencion.tasaRetencionPorAntiguedad.map(a => ({
    name: a.rango,
    retencion: Math.round(a.tasaRetencion * 10) / 10,
    clientes: a.numeroClientes,
  }));

  return (
    <div className="space-y-6">
      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ingresos Proyectados</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.resumen.ingresosTotalesProyectados.toFixed(0)}€
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {mesesProyeccion} meses
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </Card>

        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tasa de Retención</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.resumen.tasaRetencionPromedio.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Promedio proyectado
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Clientes Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.resumen.clientesTotales}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Suscripciones activas
              </p>
            </div>
            <Users className="w-10 h-10 text-purple-600" />
          </div>
        </Card>

        <Card className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Valor Vida Cliente</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.resumen.valorVidaClientePromedio.toFixed(0)}€
              </p>
              <p className="text-xs text-gray-500 mt-1">
                CLV promedio
              </p>
            </div>
            <BarChart3 className="w-10 h-10 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Controles */}
      <Card className="bg-white shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Meses de Proyección:</label>
            <Select
              value={mesesProyeccion.toString()}
              onChange={(e) => setMesesProyeccion(Number(e.target.value))}
              className="w-24"
            >
              <option value="6">6 meses</option>
              <option value="12">12 meses</option>
              <option value="18">18 meses</option>
              <option value="24">24 meses</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Análisis de Retención:</label>
            <Select
              value={mesesAnalisis.toString()}
              onChange={(e) => setMesesAnalisis(Number(e.target.value))}
              className="w-24"
            >
              <option value="3">3 meses</option>
              <option value="6">6 meses</option>
              <option value="12">12 meses</option>
            </Select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={vistaGrafico === 'ingresos' ? 'primary' : 'secondary'}
              onClick={() => setVistaGrafico('ingresos')}
              size="sm"
            >
              Ingresos
            </Button>
            <Button
              variant={vistaGrafico === 'retencion' ? 'primary' : 'secondary'}
              onClick={() => setVistaGrafico('retencion')}
              size="sm"
            >
              Retención
            </Button>
          </div>
        </div>
      </Card>

      {/* Gráfico de Proyecciones de Ingresos */}
      {vistaGrafico === 'ingresos' && (
        <Card className="bg-white shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Proyección de Ingresos Recurrentes
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={datosGraficoIngresos} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProyectados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConfirmados" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="mes" stroke="#64748B" />
              <YAxis 
                stroke="#64748B"
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `${value.toFixed(0)}€`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="proyectados"
                name="Ingresos Proyectados"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorProyectados)"
              />
              <Area
                type="monotone"
                dataKey="confirmados"
                name="Ingresos Confirmados"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorConfirmados)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Gráfico de Análisis de Retención */}
      {vistaGrafico === 'retencion' && (
        <>
          <Card className="bg-white shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Tendencia de Retención
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosGraficoRetencion} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" stroke="#64748B" />
                <YAxis 
                  stroke="#64748B"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="retencion"
                  name="Tasa de Retención"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Retención por Plan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosRetencionPorPlan} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    stroke="#64748B"
                  />
                  <YAxis
                    stroke="#64748B"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Bar dataKey="retencion" name="Tasa de Retención" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="bg-white shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Retención por Antigüedad
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosRetencionPorAntiguedad} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" />
                  <YAxis
                    stroke="#64748B"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Bar dataKey="retencion" name="Tasa de Retención" fill="#EC4899" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen de Análisis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de Retención General:</span>
              <span className="font-semibold text-gray-900">
                {data.analisisRetencion.tasaRetencionGeneral.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clientes en Riesgo:</span>
              <span className="font-semibold text-orange-600">
                {data.analisisRetencion.clientesEnRiesgo}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tiempo Promedio Retención:</span>
              <span className="font-semibold text-gray-900">
                {data.analisisRetencion.tiempoPromedioRetencion.toFixed(1)} meses
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Vida Cliente:</span>
              <span className="font-semibold text-green-600">
                {data.analisisRetencion.valorVidaCliente.toFixed(0)}€
              </span>
            </div>
          </div>
        </Card>

        {data.analisisRetencion.razonesCancelacion.length > 0 && (
          <Card className="bg-white shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Razones de Cancelación
            </h3>
            <div className="space-y-2">
              {data.analisisRetencion.razonesCancelacion.slice(0, 5).map((razon, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{razon.motivo}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${razon.porcentaje}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {razon.porcentaje.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

