import React from 'react';
import { Card, MetricCards, Badge, Table } from '../../../components/componentsreutilizables';
import { TrendingUp, Users, Target, BarChart3, Award, TrendingDown, Activity, CheckCircle } from 'lucide-react';
import { AnalyticsNutricion as AnalyticsNutricionType } from '../types';

interface AnalyticsNutricionProps {
  analytics: AnalyticsNutricionType;
}

export const AnalyticsNutricion: React.FC<AnalyticsNutricionProps> = ({ analytics }) => {
  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'mejora':
        return { color: 'success' as const, icon: <TrendingUp className="w-5 h-5" /> };
      case 'empeora':
        return { color: 'error' as const, icon: <TrendingUp className="w-5 h-5 rotate-180" /> };
      default:
        return { color: 'info' as const, icon: <BarChart3 className="w-5 h-5" /> };
    }
  };

  const tendencia = getTendenciaColor(analytics.tendenciaAdherencia);
  
  const datosEvolucion = [
    { semana: 'Sem 1', adherencia: 72, macros: 68 },
    { semana: 'Sem 2', adherencia: 74, macros: 71 },
    { semana: 'Sem 3', adherencia: 76, macros: 73 },
    { semana: 'Sem 4', adherencia: 78, macros: 75 },
    { semana: 'Sem 5', adherencia: 79, macros: 78 },
    { semana: 'Sem 6', adherencia: 81, macros: 80 },
    { semana: 'Sem 7', adherencia: 82, macros: 82 },
    { semana: 'Sem 8', adherencia: 84, macros: 83 },
  ];

  const metricas = [
    {
      id: 'total-dietas',
      title: 'Total Dietas',
      value: analytics.totalDietas,
      icon: <Target className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: 'dietas-activas',
      title: 'Dietas Activas',
      value: analytics.dietasActivas,
      icon: <Users className="w-6 h-6" />,
      color: 'success' as const,
    },
    {
      id: 'adherencia',
      title: 'Adherencia Promedio',
      value: `${analytics.adherenciaPromedio.toFixed(1)}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: tendencia.color,
      trend: {
        value: 0,
        direction: analytics.tendenciaAdherencia === 'mejora' ? 'up' : analytics.tendenciaAdherencia === 'empeora' ? 'down' : 'neutral',
        label: analytics.tendenciaAdherencia,
      },
    },
    {
      id: 'clientes',
      title: 'Clientes con Dieta',
      value: analytics.clientesConDieta,
      icon: <Users className="w-6 h-6" />,
      color: 'info' as const,
    },
  ];

  const renderGraficoBarras = () => {
    const maxValue = Math.max(...datosEvolucion.map(d => Math.max(d.adherencia, d.macros)));
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Evolución 8 Semanas</h4>
            <p className="text-xs text-gray-600">Adherencia y cumplimiento de macros</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Adherencia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Macros</span>
            </div>
          </div>
        </div>
        {datosEvolucion.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-700 w-16">{item.semana}</span>
              <div className="flex-1 grid grid-cols-2 gap-2 ml-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.adherencia / maxValue) * 100}%` }}
                      >
                        <span className="text-xs font-semibold text-white">{item.adherencia}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-green-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(item.macros / maxValue) * 100}%` }}
                      >
                        <span className="text-xs font-semibold text-white">{item.macros}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <MetricCards data={metricas} columns={4} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={24} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Evolución Temporal</h3>
          </div>
          {renderGraficoBarras()}
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-yellow-600" size={20} />
            Resumen de Cumplimiento
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-1">
                Cumplimiento de Macros Promedio
              </div>
              <div className="text-3xl font-bold text-blue-900">
                {analytics.cumplimientoMacrosPromedio.toFixed(1)}%
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-900 mb-1">
                Tendencia de Adherencia
              </div>
              <div className="flex items-center gap-2">
                {tendencia.icon}
                <span className="text-2xl font-bold text-green-900 capitalize">
                  {analytics.tendenciaAdherencia}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {analytics.planesMasUsados.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={24} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Planes Más Usados</h3>
          </div>
          <div className="space-y-3">
            {analytics.planesMasUsados.slice(0, 5).map((plan, index) => (
              <div key={plan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-semibold text-white shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-gray-900">
                      {plan.nombre}
                    </div>
                    <div className="text-sm text-gray-600">
                      {plan.nivel} - {plan.usoCount} asignaciones
                    </div>
                  </div>
                </div>
                {plan.efectividad && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{plan.efectividad.tasaExito}%</div>
                        <div className="text-xs text-gray-600">Éxito</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

