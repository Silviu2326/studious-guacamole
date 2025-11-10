import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Users, TrendingUp, TrendingDown, Clock, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { retencionClientesApi } from '../api';
import { MetricasRetencionClientes as MetricasRetencionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export const MetricasRetencionClientes: React.FC = () => {
  const { user } = useAuth();
  const [metricas, setMetricas] = React.useState<MetricasRetencionType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarMetricas = async () => {
      try {
        setLoading(true);
        const data = await retencionClientesApi.obtenerMetricasRetencion(
          user?.role || 'entrenador',
          user?.id
        );
        setMetricas(data);
      } catch (error) {
        console.error('Error cargando métricas de retención:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarMetricas();
  }, [user?.role, user?.id]);

  const getTrendIcon = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  // Datos para el gráfico de distribución de antigüedad
  const datosDistribucion = metricas ? [
    { name: '< 3 meses', value: metricas.distribucionAntiguedad.menos3Meses, color: '#3B82F6' },
    { name: '3-6 meses', value: metricas.distribucionAntiguedad.entre3y6Meses, color: '#10B981' },
    { name: '6-12 meses', value: metricas.distribucionAntiguedad.entre6y12Meses, color: '#F59E0B' },
    { name: '> 12 meses', value: metricas.distribucionAntiguedad.mas12Meses, color: '#8B5CF6' },
  ] : [];

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </Card>
    );
  }

  if (!metricas) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
          <p className="text-gray-600">No hay información de retención de clientes para mostrar.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Métricas de Retención de Clientes
          </h2>
          <p className="text-sm text-gray-600">
            Evalúa la calidad de tu servicio mediante métricas de antigüedad y retención
          </p>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Antigüedad Promedio */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Antigüedad Promedio</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {metricas.antiguedadPromedio.texto}
            </p>
            <p className="text-xs text-gray-500">
              {metricas.antiguedadPromedio.dias} días en total
            </p>
          </div>
        </Card>

        {/* Tasa de Retención */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              {getTrendIcon(metricas.tasaRetencion.tendencia)}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Tasa de Retención</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {metricas.tasaRetencion.porcentaje.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              {metricas.tasaRetencion.clientesActivos} de {metricas.tasaRetencion.clientesTotales} clientes activos
              {metricas.tasaRetencion.variacionPeriodoAnterior !== 0 && (
                <span className={`ml-1 ${metricas.tasaRetencion.variacionPeriodoAnterior > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({metricas.tasaRetencion.variacionPeriodoAnterior > 0 ? '+' : ''}{metricas.tasaRetencion.variacionPeriodoAnterior})
                </span>
              )}
            </p>
          </div>
        </Card>

        {/* Altas/Bajas del Período */}
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                {metricas.altasBajasPeriodo.tendencia === 'up' ? (
                  <UserPlus className="w-6 h-6 text-purple-600" />
                ) : (
                  <UserMinus className="w-6 h-6 text-purple-600" />
                )}
              </div>
              {getTrendIcon(metricas.altasBajasPeriodo.tendencia)}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Altas/Bajas - {metricas.altasBajasPeriodo.periodo}</h3>
            <div className="flex items-center gap-4 mb-2">
              <div>
                <p className="text-lg font-bold text-green-600">+{metricas.altasBajasPeriodo.altas}</p>
                <p className="text-xs text-gray-500">Altas</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600">-{metricas.altasBajasPeriodo.bajas}</p>
                <p className="text-xs text-gray-500">Bajas</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Saldo neto: <span className={`font-semibold ${metricas.altasBajasPeriodo.saldoNeto >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metricas.altasBajasPeriodo.saldoNeto >= 0 ? '+' : ''}{metricas.altasBajasPeriodo.saldoNeto}
              </span>
            </p>
          </div>
        </Card>
      </div>

      {/* Gráfico de Distribución de Antigüedad */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Antigüedad de Clientes
          </h3>
          {datosDistribucion.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosDistribucion} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '8px' 
                  }}
                />
                <Legend />
                <Bar dataKey="value" name="Número de Clientes" radius={[8, 8, 0, 0]}>
                  {datosDistribucion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay datos de distribución disponibles</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

