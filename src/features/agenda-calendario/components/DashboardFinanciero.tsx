import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Filter,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  X,
  TrendingDown,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Card, MetricCards, Table, Button, Input, Select, Badge, Modal } from '../../../components/componentsreutilizables';
import {
  DashboardFinancieroAgenda,
  RangoFechas,
  ContextoMetricas,
  TipoCita,
} from '../types';
import { getDashboardFinancieroAgenda } from '../api/analytics';
import { useAuth } from '../../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardFinancieroProps {
  rangoFechas?: RangoFechas;
  contexto?: ContextoMetricas;
}

export const DashboardFinanciero: React.FC<DashboardFinancieroProps> = ({ 
  rangoFechas: rangoFechasProp, 
  contexto: contextoProp 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardFinancieroAgenda | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [rangoFechasProp, contextoProp, user?.id]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Determinar rango de fechas
      let fechaInicio: Date;
      let fechaFin: Date;
      
      if (rangoFechasProp) {
        fechaInicio = rangoFechasProp.fechaInicio;
        fechaFin = rangoFechasProp.fechaFin;
      } else {
        // Por defecto: mes actual
        const fechaActual = new Date();
        fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
        fechaFin.setHours(23, 59, 59, 999);
      }
      
      const contexto: ContextoMetricas = contextoProp || {
        userId: user?.id,
        role: user?.role as 'entrenador' | 'gimnasio',
      };
      
      const dashboardData = await getDashboardFinancieroAgenda(
        { fechaInicio, fechaFin },
        contexto
      );

      setDashboard(dashboardData);
    } catch (error) {
      console.error('Error cargando dashboard financiero:', error);
      setError('No se pudieron cargar los datos financieros. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Manejo de errores parciales - no rompe toda la página
  if (error && !dashboard) {
    return (
      <Card className="bg-white shadow-sm border-red-200">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Error al cargar datos financieros
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {error}
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={cargarDatos}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (loading && !dashboard && !error) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-gray-600">Cargando dashboard financiero...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!dashboard && !loading && !error) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-600 mb-1">No hay datos financieros disponibles</p>
            <p className="text-xs text-gray-500">Los datos aparecerán aquí cuando haya sesiones registradas.</p>
          </div>
        </div>
      </Card>
    );
  }

  // Calcular impacto económico de cancelaciones y no-shows
  const impactoCancelaciones = dashboard.sesionesCanceladas * dashboard.ticketMedio;
  const impactoNoShows = dashboard.noShows * dashboard.ticketMedio;
  const impactoTotal = impactoCancelaciones + impactoNoShows;

  const metricasData = [
    {
      id: 'ingresos',
      title: 'Ingresos Totales',
      value: `€${dashboard.ingresosTotales.toFixed(2)}`,
      subtitle: `€${dashboard.ingresosPendientes.toFixed(2)} pendientes`,
      trend: dashboard.crecimientoIngresos ? {
        value: Math.abs(dashboard.crecimientoIngresos),
        direction: dashboard.crecimientoIngresos > 0 ? 'up' : 'down',
        label: `vs período anterior`,
      } : undefined,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'success' as const,
      loading,
    },
    {
      id: 'ticket-medio',
      title: 'Ticket Medio',
      value: `€${dashboard.ticketMedio.toFixed(2)}`,
      subtitle: `${dashboard.sesionesCompletadas} sesiones completadas`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'info' as const,
      loading,
    },
    {
      id: 'cancelaciones',
      title: 'Cancelaciones',
      value: dashboard.sesionesCanceladas,
      subtitle: `Impacto: €${impactoCancelaciones.toFixed(2)}`,
      icon: <XCircle className="w-6 h-6" />,
      color: dashboard.tasaCancelacion > 10 ? 'error' as const : 'warning' as const,
      loading,
    },
    {
      id: 'no-shows',
      title: 'No Shows',
      value: dashboard.noShows,
      subtitle: `Impacto: €${impactoNoShows.toFixed(2)}`,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: dashboard.tasaNoShow > 5 ? 'error' as const : 'warning' as const,
      loading,
    },
  ];

  // Preparar datos para gráficos
  const datosIngresosPorTipo = dashboard.ingresosPorTipoSesion.map(item => ({
    tipo: item.tipo,
    ingresos: item.ingresos,
    cantidad: item.cantidad,
    porcentaje: item.porcentaje,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <MetricCards data={metricasData} columns={4} />

      {/* Resumen de Impacto Económico */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Impacto Económico de Cancelaciones y No-Shows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-sm text-gray-600 mb-1">Cancelaciones</div>
              <div className="text-2xl font-bold text-red-600">{dashboard.sesionesCanceladas}</div>
              <div className="text-sm text-red-700 mt-1">
                Tasa: {dashboard.tasaCancelacion}% | Impacto: €{impactoCancelaciones.toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-sm text-gray-600 mb-1">No Shows</div>
              <div className="text-2xl font-bold text-orange-600">{dashboard.noShows}</div>
              <div className="text-sm text-orange-700 mt-1">
                Tasa: {dashboard.tasaNoShow}% | Impacto: €{impactoNoShows.toFixed(2)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Impacto Total</div>
              <div className="text-2xl font-bold text-gray-900">€{impactoTotal.toFixed(2)}</div>
              <div className="text-sm text-gray-700 mt-1">
                Pérdida potencial de ingresos
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Ingresos por Tipo de Sesión */}
      {datosIngresosPorTipo.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ingresos por Tipo de Sesión</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosIngresosPorTipo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="tipo" 
                    tick={{ fill: '#64748B', fontSize: 12 }} 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                    formatter={(value: number) => [`€${value.toFixed(2)}`, 'Ingresos']}
                  />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#3B82F6" name="Ingresos (€)" />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosIngresosPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tipo, porcentaje }) => `${tipo}: ${porcentaje}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="ingresos"
                  >
                    {datosIngresosPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                    formatter={(value: number) => [`€${value.toFixed(2)}`, 'Ingresos']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}

      {/* Métricas de Rendimiento */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Métricas de Rendimiento</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Ocupación Promedio</div>
              <div className="text-2xl font-bold text-blue-600">{dashboard.ocupacionPromedio}%</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Horas Trabajadas</div>
              <div className="text-2xl font-bold text-green-600">{Math.round(dashboard.horasTrabajadas * 10) / 10}h</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Horas Disponibles</div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(dashboard.horasDisponibles * 10) / 10}h</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Ingresos por Sesión</div>
              <div className="text-2xl font-bold text-purple-600">€{dashboard.ingresosPorSesion.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Comparativa con Período Anterior */}
      {dashboard.crecimientoIngresos !== undefined && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Comparativa con Período Anterior</h2>
              <div className="flex items-center gap-2">
                {dashboard.tendencia === 'subiendo' && (
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                )}
                {dashboard.tendencia === 'bajando' && (
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                )}
                {dashboard.tendencia === 'estable' && (
                  <TrendingDown className="w-5 h-5 text-gray-600" />
                )}
                <span className={`text-sm font-medium ${
                  dashboard.tendencia === 'subiendo' ? 'text-green-600' : 
                  dashboard.tendencia === 'bajando' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {dashboard.tendencia}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Crecimiento de Ingresos</div>
                <div className={`text-2xl font-bold ${
                  dashboard.crecimientoIngresos > 0 ? 'text-green-600' : 
                  dashboard.crecimientoIngresos < 0 ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {dashboard.crecimientoIngresos > 0 ? '+' : ''}{dashboard.crecimientoIngresos}%
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Crecimiento de Sesiones</div>
                <div className={`text-2xl font-bold ${
                  dashboard.crecimientoSesiones && dashboard.crecimientoSesiones > 0 ? 'text-green-600' : 
                  dashboard.crecimientoSesiones && dashboard.crecimientoSesiones < 0 ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {dashboard.crecimientoSesiones && dashboard.crecimientoSesiones > 0 ? '+' : ''}{dashboard.crecimientoSesiones || 0}%
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};


