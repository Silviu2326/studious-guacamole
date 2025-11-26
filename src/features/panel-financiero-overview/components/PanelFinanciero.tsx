import React from 'react';
import { Card, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { DollarSign, TrendingUp, TrendingDown, Loader2, Package, Calendar, Wallet, Target, ArrowUpCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { overviewApi } from '../api';
import { MetricasFinancieras } from '../types';

export const PanelFinanciero: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = React.useState<MetricasFinancieras | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const cargarOverview = async () => {
      try {
        setLoading(true);
        const data = await overviewApi.obtenerOverview(user?.role || 'entrenador');
        setOverview(data);
      } catch (error) {
        console.error('Error cargando overview:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarOverview();
  }, [user?.role]);

  const getTrendIcon = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return <TrendingUp className="w-5 h-5" />;
      case 'down':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const isEntrenador = user?.role === 'entrenador';

  const metrics: MetricCardData[] = overview ? [
    {
      id: 'total',
      title: isEntrenador ? 'Ingresos Totales' : 'Facturación Total',
      value: `€${overview.total.toLocaleString()}`,
      subtitle: overview.periodoActual,
      trend: overview.variacion ? {
        value: Math.abs(overview.variacion),
        direction: overview.tendencia,
        label: 'vs mes anterior'
      } : undefined,
      icon: getTrendIcon(overview.tendencia),
      color: overview.tendencia === 'up' ? 'success' : overview.tendencia === 'down' ? 'error' : 'info',
      loading
    },
    {
      id: 'promedio',
      title: 'Promedio Diario',
      value: isEntrenador ? `€${(overview.total / 30).toFixed(0)}` : `€${(overview.total / 30).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
      subtitle: 'Estimado mensual',
      icon: <Calendar className="w-5 h-5" />,
      color: 'info',
      loading
    },
    {
      id: 'proyeccion',
      title: 'Proyección Anual',
      value: isEntrenador ? `€${(overview.total * 12).toLocaleString('es-ES', { maximumFractionDigits: 0 })}` : `€${(overview.total * 12).toLocaleString('es-ES', { maximumFractionDigits: 0 })}`,
      subtitle: 'Basado en mes actual',
      icon: <Target className="w-5 h-5" />,
      color: 'primary',
      loading
    },
    {
      id: 'meta',
      title: 'Objetivo Mensual',
      value: overview.total >= (isEntrenador ? 5000 : 130000) ? 'Cumplido' : 'En progreso',
      subtitle: `Meta: €${isEntrenador ? '5000' : '130000'}`,
      icon: <ArrowUpCircle className="w-5 h-5" />,
      color: overview.total >= (isEntrenador ? 5000 : 130000) ? 'success' : 'warning',
      loading
    }
  ] : [];

  return (
    <div className="space-y-6">
      <MetricCards data={metrics} columns={4} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Resumen Financiero
              </h2>
            </div>
            
            {loading ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando...</p>
              </Card>
            ) : overview ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4">
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Período Actual
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {overview.periodoActual}
                    </p>
                  </div>
                  {overview.periodoAnterior && (
                    <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Período Anterior
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {overview.periodoAnterior}
                      </p>
                    </div>
                  )}
                  {overview.variacion !== undefined && (
                    <div className="rounded-xl bg-white ring-1 ring-slate-200 p-4">
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Variación
                      </p>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(overview.tendencia)}
                        <p className={`text-lg font-semibold ${
                          overview.tendencia === 'up' ? 'text-green-600' :
                          overview.tendencia === 'down' ? 'text-red-600' :
                          'text-gray-900'
                        }`}>
                          {overview.variacion > 0 ? '+' : ''}{overview.variacion}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
                <p className="text-gray-600">No hay información financiera para mostrar en este momento.</p>
              </Card>
            )}
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Análisis Rápido
              </h2>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ) : overview ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 ring-1 ring-green-200 p-6">
                  <p className="text-sm font-medium text-green-700 mb-2">Estado Financiero</p>
                  <div className="flex items-center gap-2 mb-2">
                    {overview.tendencia === 'up' && <TrendingUp className="w-6 h-6 text-green-900" />}
                    {overview.tendencia === 'down' && <TrendingDown className="w-6 h-6 text-green-900" />}
                    {overview.tendencia === 'neutral' && <Target className="w-6 h-6 text-green-900" />}
                    <p className="text-2xl font-bold text-green-900">
                      {overview.tendencia === 'up' ? 'Saludable' : overview.tendencia === 'down' ? 'En observación' : 'Estable'}
                    </p>
                  </div>
                  <p className="text-sm text-green-700">
                    {overview.tendencia === 'up' ? 
                      'Tu negocio está en crecimiento constante.' :
                      overview.tendencia === 'down' ? 
                      'Es momento de revisar estrategias de crecimiento.' :
                      'Mantienes un rendimiento estable.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-200">
                    <p className="text-xs text-blue-700 mb-1">Crecimiento</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {overview.variacion || 0 > 0 ? '+' : ''}{overview.variacion || 0}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4 ring-1 ring-purple-200">
                    <p className="text-xs text-purple-700 mb-1">Actualización</p>
                    <p className="text-sm font-bold text-purple-900">Hace 5 min</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
};

