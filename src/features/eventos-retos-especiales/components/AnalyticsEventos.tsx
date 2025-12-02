import React from 'react';
import { AnalyticsEvento, EventoReto } from '../types';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Users, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

interface AnalyticsEventosProps {
  evento?: EventoReto;
  analytics?: AnalyticsEvento;
}

export const AnalyticsEventos: React.FC<AnalyticsEventosProps> = ({
  evento,
  analytics,
}) => {
  if (!evento) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un evento</h3>
        <p className="text-gray-600 mb-4">Selecciona un evento para ver sus analytics</p>
      </Card>
    );
  }

  const participantesTotales = evento.participantes.length;
  const participantesActivos = evento.participantes.filter(p => {
    if (!p.ultimoCheckIn) return false;
    const diasSinActividad = (Date.now() - new Date(p.ultimoCheckIn).getTime()) / (1000 * 60 * 60 * 24);
    return diasSinActividad <= 7;
  }).length;

  const promedioProgreso = evento.participantes.length > 0
    ? evento.participantes.reduce((sum, p) => sum + p.progreso, 0) / evento.participantes.length
    : 0;

  const puntosTotales = evento.participantes.reduce((sum, p) => sum + p.puntos, 0);

  const tasaAdherencia = participantesActivos > 0 && participantesTotales > 0
    ? (participantesActivos / participantesTotales) * 100
    : 0;

  const tasaFinalizacion = evento.estado === 'finalizado' && participantesTotales > 0
    ? (evento.participantes.filter(p => p.progreso >= 80).length / participantesTotales) * 100
    : 0;

  const engagementScore = Math.round(
    (tasaAdherencia * 0.4) + 
    (promedioProgreso * 0.3) + 
    (tasaFinalizacion * 0.3)
  );

  const metricas = [
    {
      id: 'participantes-totales',
      title: 'Participantes Totales',
      value: participantesTotales,
      subtitle: `${participantesActivos} activos`,
      icon: <Users className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'tasa-adherencia',
      title: 'Tasa de Adherencia',
      value: `${tasaAdherencia.toFixed(1)}%`,
      subtitle: `${participantesActivos} participantes activos`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'promedio-progreso',
      title: 'Progreso Promedio',
      value: `${promedioProgreso.toFixed(1)}%`,
      subtitle: 'Promedio general',
      icon: <Target className="w-5 h-5" />,
      color: 'info' as const,
    },
    {
      id: 'engagement-score',
      title: 'Engagement Score',
      value: engagementScore,
      subtitle: '0-100 puntos',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'warning' as const,
    },
    {
      id: 'puntos-totales',
      title: 'Puntos Totales',
      value: puntosTotales,
      subtitle: 'Acumulados por todos',
      icon: <Award className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'tasa-finalizacion',
      title: 'Tasa de Finalización',
      value: evento.estado === 'finalizado' ? `${tasaFinalizacion.toFixed(1)}%` : 'N/A',
      subtitle: evento.estado === 'finalizado' ? 'Evento completado' : 'En curso',
      icon: <Target className="w-5 h-5" />,
      color: 'info' as const,
    },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h3 className="text-xl font-bold text-gray-900">
            Analytics del Evento
          </h3>
        </div>

        <MetricCards data={metricas} columns={3} />
      </div>
    </Card>
  );
};

