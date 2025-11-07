import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { AnalyticsOcupacion as AnalyticsType } from '../types';
import { getAnalyticsOcupacion } from '../api/analytics';
import { useAuth } from '../../../context/AuthContext';

export const AnalyticsOcupacion: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarAnalytics();
  }, []);

  const cargarAnalytics = async () => {
    setLoading(true);
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    const fechaFin = new Date();
    const role = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';
    const data = await getAnalyticsOcupacion(fechaInicio, fechaFin, role);
    setAnalytics(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600">
          Cargando analytics...
        </div>
      </div>
    );
  }

  const ultimosAnalytics = analytics[analytics.length - 1];
  if (!ultimosAnalytics) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No hay datos de analytics disponibles
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const metricas = [
    {
      id: '1',
      title: 'Total Citas',
      value: ultimosAnalytics.totalCitas.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: '2',
      title: 'Ocupación',
      value: `${ultimosAnalytics.ocupacionPromedio}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const,
    },
    {
      id: '3',
      title: 'Completadas',
      value: ultimosAnalytics.citasCompletadas.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'info' as const,
    },
    {
      id: '4',
      title: 'Ingresos',
      value: `€${ultimosAnalytics.ingresosEstimados}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metricas} columns={4} />
      {ultimosAnalytics.claseMasPopular && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Clase Más Popular
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {ultimosAnalytics.claseMasPopular.nombre}
                </div>
                <div className="text-sm text-gray-600">
                  {ultimosAnalytics.claseMasPopular.ocupacion}% de ocupación
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
